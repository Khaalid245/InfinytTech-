import axios from 'axios';
import type { PaginatedResponse } from '../types/portfolio';
import type { BlogAuthor } from '../types/blog';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api/accounts`,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export async function getUsers(): Promise<PaginatedResponse<BlogAuthor>> {
  const { data } = await api.get<PaginatedResponse<BlogAuthor>>('/users/');
  
  if ('data' in data && (data as any).data?.results) {
    return (data as any).data;
  }
  if ('results' in data) {
    return data as any;
  }
  // DRF generic fallback
  const isArray = Array.isArray(data);
  return {
    count: isArray ? (data as any).length : 0,
    next: null,
    previous: null,
    results: isArray ? (data as any) : [],
  };
}
