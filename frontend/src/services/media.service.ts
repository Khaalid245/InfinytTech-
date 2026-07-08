import axios from 'axios';
import type { PaginatedResponse } from '../types/portfolio';

// Local types for Media File until full types are extracted
export interface MediaFile {
  id: string;
  title: string;
  file: string; // url
  file_name?: string;
  original_filename?: string;
  alt_text: string;
  file_size: number;
  width: number | null;
  height: number | null;
  mime_type: string;
  created_at: string;
}

export interface MediaFilters {
  page?: number;
  page_size?: number;
  search?: string;
  folder?: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
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

export async function getMediaFiles(
  filters: MediaFilters = {}
): Promise<PaginatedResponse<MediaFile>> {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.page_size) params.append('page_size', filters.page_size.toString());
  if (filters.search) params.append('search', filters.search);
  
  const { data } = await api.get<PaginatedResponse<MediaFile>>('/media/', { params });
  
  // DRF returns `{ count, next, previous, results }` directly if paginator used properly, 
  // or it might be wrapped in ApiResponse. Let's check format gracefully.
  if ('data' in data && (data as any).data?.results) {
    return (data as any).data;
  }
  return data;
}
