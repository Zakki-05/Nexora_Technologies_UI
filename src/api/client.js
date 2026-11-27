import axios from 'axios';
import toast from 'react-hot-toast';

const rawURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://nexora-technologies-server.onrender.com'
    : 'https://nexora-technologies-server.onrender.com');

const baseURL = rawURL ? rawURL.replace(/\/+$/, '') : '';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Envelope Unwrapping, Global Error Handling & Refresh Token Rotation
api.interceptors.response.use(
  (response) => {
    const payload = response?.data;
    if (
      payload &&
      typeof payload === 'object' &&
      !(payload instanceof Blob) &&
      !(payload instanceof ArrayBuffer) &&
      'success' in payload &&
      'status_code' in payload &&
      'data' in payload
    ) {
      response.envelope = {
        success: payload.success,
        message: payload.message,
        status_code: payload.status_code,
      };
      response.data = payload.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;
    let detail = 'An unexpected error occurred. Please try again.';

    if (error.response?.data?.message) {
      detail = error.response.data.message;
      // Preserve backward compatibility for components reading error.response.data.detail
      if (!error.response.data.detail) {
        error.response.data.detail = detail;
      }
    } else if (error.response?.data?.detail) {
      detail = error.response.data.detail;
    } else if (error.message) {
      detail = error.message;
    }

    // Handle 401 Unauthorized with Refresh Token rotation
    if (status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login') && !originalRequest.url.includes('/auth/refresh')) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshRes = await axios.post(`${baseURL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const refreshPayload = refreshRes.data?.data ?? refreshRes.data;
          const { access_token, refresh_token: newRefreshToken } = refreshPayload;
          localStorage.setItem('token', access_token);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
          originalRequest.headers.Authorization = `Bearer ${access_token}`;

          processQueue(null, access_token);
          isRefreshing = false;
          return api(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          isRefreshing = false;
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          if (!window.location.pathname.startsWith('/login')) {
            toast.error('Session expired. Please log in again.');
            window.location.href = '/login';
          }
          return Promise.reject(refreshErr);
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        if (!window.location.pathname.startsWith('/login')) {
          toast.error('Session expired. Please log in again.');
          window.location.href = '/login';
        }
      }
    } else if (status === 429) {
      toast.error(detail || 'Too many requests. Please wait a moment.');
    } else if (status === 400) {
      toast.error(detail || 'Bad request. Please check submitted data.');
    } else if (status === 403) {
      toast.error(detail || 'Access denied. You do not have permission.');
    } else if (status >= 500) {
      toast.error('Server error. Please contact administrator.');
    }

    return Promise.reject(error);
  }
);

export default api;
