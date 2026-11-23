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

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    let detail = 'An unexpected error occurred. Please try again.';

    if (error.response?.data?.detail) {
      detail = error.response.data.detail;
    } else if (error.message) {
      detail = error.message;
    }

    if (status === 400) {
      toast.error(detail || 'Bad request. Please check submitted data.');
    } else if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (!window.location.pathname.startsWith('/login')) {
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
      }
    } else if (status === 403) {
      toast.error(detail || 'Access denied. You do not have permission.');
    } else if (status >= 500) {
      toast.error('Server error. Please contact administrator.');
    }

    return Promise.reject(error);
  }
);

export default api;
