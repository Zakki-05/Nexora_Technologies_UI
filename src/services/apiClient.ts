import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import type { ApiEnvelope, ApiErrorShape } from '@/types/api';
import type { AuthTokenPayload } from '@/types/hr';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface EnvelopeAxiosResponse<T = unknown> extends AxiosResponse<T> {
  envelope?: {
    success: boolean;
    message: string;
    status_code: number;
  };
}

const rawURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://nexora-technologies-server.onrender.com';

export const API_BASE_URL = rawURL.replace(/\/+$/, '');

export function isApiEnvelope(payload: unknown): payload is ApiEnvelope<unknown> {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    !(typeof Blob !== 'undefined' && payload instanceof Blob) &&
    !(typeof ArrayBuffer !== 'undefined' && payload instanceof ArrayBuffer) &&
    'success' in payload &&
    'status_code' in payload &&
    'data' in payload
  );
}

export function extractErrorMessage(error: AxiosError<ApiErrorShape>): string {
  const data = error.response?.data;
  if (data?.message) return data.message;
  if (data?.detail) return data.detail;
  if (error.message) return error.message;
  return 'An unexpected error occurred. Please try again.';
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: EnvelopeAxiosResponse) => {
    const payload: unknown = response.data;
    if (isApiEnvelope(payload)) {
      response.envelope = {
        success: payload.success,
        message: payload.message,
        status_code: payload.status_code,
      };
      response.data = payload.data;
    }
    return response;
  },
  async (error: AxiosError<ApiErrorShape>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response ? error.response.status : null;
    const detail = extractErrorMessage(error);

    if (error.response?.data && !error.response.data.detail && error.response.data.message) {
      error.response.data.detail = error.response.data.message;
    }

    const reqUrl = originalRequest?.url ?? '';
    const isAuthCall = reqUrl.includes('/auth/login') || reqUrl.includes('/auth/refresh');

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthCall && typeof window !== 'undefined') {
      const refreshToken = window.localStorage.getItem('refreshToken');

      if (refreshToken) {
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshRes = await axios.post<ApiEnvelope<AuthTokenPayload> | AuthTokenPayload>(
            `${API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const rawRefresh: unknown = refreshRes.data;
          const payload = isApiEnvelope(rawRefresh)
            ? (rawRefresh.data as AuthTokenPayload)
            : (rawRefresh as AuthTokenPayload);

          window.localStorage.setItem('token', payload.access_token);
          if (payload.refresh_token) {
            window.localStorage.setItem('refreshToken', payload.refresh_token);
          }

          apiClient.defaults.headers.common.Authorization = `Bearer ${payload.access_token}`;
          originalRequest.headers.Authorization = `Bearer ${payload.access_token}`;

          processQueue(null, payload.access_token);
          isRefreshing = false;
          return apiClient(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          isRefreshing = false;
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('refreshToken');
          window.localStorage.removeItem('user');
          if (!window.location.pathname.startsWith('/login')) {
            toast.error('Session expired. Please log in again.');
            window.location.href = '/login';
          }
          return Promise.reject(refreshErr);
        }
      }
    } else if (typeof window !== 'undefined') {
      if (status === 429) {
        toast.error(detail || 'Too many requests. Please wait a moment.');
      } else if (status === 400) {
        toast.error(detail || 'Bad request. Please check submitted data.');
      } else if (status === 403) {
        toast.error(detail || 'Access denied. You do not have permission.');
      } else if (status !== null && status >= 500) {
        toast.error('Server error. Please contact administrator.');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
