import axios from 'axios';
import type { AxiosInstance } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export function setupInterceptors(api: AxiosInstance) {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 429 Too Many Requests — reject immediately.
      // Do NOT retry: the retry callback in QueryClient handles this.
      if (error.response && error.response.status === 429) {
        return Promise.reject(error);
      }

      // Only attempt token refresh on 401 errors that aren't from the refresh/login endpoints themselves
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url &&
        !originalRequest.url.includes('/refresh/') &&
        !originalRequest.url.includes('/login/')
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const { data } = await axios.post(`${BASE_URL}/api/auth/refresh/`, {
              refresh: refreshToken,
            });

            if (data.access) {
              localStorage.setItem('token', data.access);
              isRefreshing = false;
              processQueue(null, data.access);
              originalRequest.headers.Authorization = `Bearer ${data.access}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh token is expired or invalid — force logout
            isRefreshing = false;
            processQueue(refreshError, null);
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token available — force logout
          isRefreshing = false;
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          window.location.href = '/login';
        }
      }

      // For 401 after a retry (refresh failed to fix it) — clear session and redirect
      if (
        error.response &&
        error.response.status === 401 &&
        originalRequest._retry
      ) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }

      // Note: 403 Forbidden is NOT treated as a logout — it is a permissions error.
      // The component/hook that made the request should handle it.

      return Promise.reject(error);
    }
  );
}

