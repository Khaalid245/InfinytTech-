import axios from 'axios';
import type { PaginatedResponse } from '../types/portfolio';

export interface MediaFolder {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent: string | null;
  order: number;
  is_active: boolean;
  file_count?: number;
  created_at: string;
  updated_at: string;
}

export interface MediaFile {
  id: string;
  title: string;
  file: string; // url
  file_name?: string;
  original_filename?: string;
  alt_text: string;
  caption: string;
  description: string;
  folder: string | null;
  folder_details?: MediaFolder | null;
  file_size: number;
  width: number | null;
  height: number | null;
  mime_type: string;
  extension: string;
  checksum: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaFilters {
  page?: number;
  page_size?: number;
  search?: string;
  folder?: string;
  type?: string;
  visibility?: string;
  ordering?: string;
}

export interface MediaStats {
  total_files: number;
  total_storage: number;
  folders: number;
  images: number;
  videos: number;
  documents: number;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 60_000, // Uploads might take longer
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

export async function getMediaFiles(filters: MediaFilters = {}): Promise<PaginatedResponse<MediaFile>> {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.page_size) params.append('page_size', filters.page_size.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.folder) params.append('folder', filters.folder);
  if (filters.type) params.append('type', filters.type);
  if (filters.ordering) params.append('ordering', filters.ordering);
  
  const { data } = await api.get<PaginatedResponse<MediaFile>>('/media/', { params });
  if ('data' in data && (data as any).data?.results) {
    return (data as any).data;
  }
  return data;
}

export async function getMediaStats(): Promise<MediaStats> {
  const { data } = await api.get('/media/stats/');
  return data.data;
}

export async function getMediaUsage(id: string): Promise<Record<string, number>> {
  const { data } = await api.get(`/media/${id}/usage/`);
  return data.data;
}

export async function uploadMediaFile(
  file: File, 
  onProgress?: (progress: number) => void,
  folderId?: string
): Promise<MediaFile> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', file.name);
  if (folderId) {
    formData.append('folder', folderId);
  }
  
  const { data } = await api.post('/media/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });
  return data.data || data;
}

export async function updateMediaFile(id: string, updateData: Partial<MediaFile>): Promise<MediaFile> {
  const { data } = await api.patch(`/media/${id}/`, updateData);
  return data.data || data;
}

export async function deleteMediaFile(id: string): Promise<void> {
  await api.delete(`/media/${id}/`);
}

// Folders
export async function getMediaFolders(): Promise<MediaFolder[]> {
  const { data } = await api.get('/media/folders/');
  const payload = data.data || data;
  if (payload && payload.results) {
    return payload.results;
  }
  return payload || [];
}

export async function createMediaFolder(data: { name: string; slug?: string; parentId?: string }): Promise<MediaFolder> {
  const payload: any = { name: data.name };
  if (data.slug) payload.slug = data.slug;
  if (data.parentId) payload.parent = data.parentId;
  const response = await api.post('/media/folders/', payload);
  return response.data.data || response.data;
}

export async function updateMediaFolder(id: string, updateData: Partial<MediaFolder>): Promise<MediaFolder> {
  const { data } = await api.patch(`/media/folders/${id}/`, updateData);
  return data.data || data;
}

export async function deleteMediaFolder(id: string): Promise<void> {
  await api.delete(`/media/folders/${id}/`);
}
