// ─── services.service.ts ──────────────────────────────────────────────────────
// Reusable API methods for the Services CMS endpoints.
// Base URL is read from VITE_API_BASE_URL environment variable.
// ─────────────────────────────────────────────────────────────────────────────
import axios from 'axios';
import type { ApiResponse, PaginatedResponse } from '../types/portfolio';
import type {
  ServiceCategory,
  Service,
  Industry,
  ProcessStep,
  FAQ,
  ServiceFormData
} from '../types/services';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api/services`,
  timeout: 10_000,
});

import { setupInterceptors } from './api';
setupInterceptors(api);

export interface ServiceFilters {
  category?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

/**
 * GET /api/services/categories/
 * Returns all active service categories.
 */
export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const { data } = await api.get<ApiResponse<ServiceCategory[]>>('/categories/');
  return data.data;
}

/**
 * GET /api/services/
 * Returns paginated active services.
 */
export async function getServices(
  filters: ServiceFilters = {}
): Promise<PaginatedResponse<Service>> {
  const params: Record<string, string | number> = {};
  if (filters.category)  params.category = filters.category;
  if (filters.search)    params.search = filters.search;
  if (filters.page)      params.page = filters.page;
  if (filters.page_size) params.page_size = filters.page_size;

  const { data } = await api.get<ApiResponse<PaginatedResponse<Service>>>('/', { params });
  return data.data;
}

/**
 * GET /api/services/industries/
 * Returns all active industries we serve.
 */
export async function getIndustries(): Promise<Industry[]> {
  const { data } = await api.get<ApiResponse<Industry[]>>('/industries/');
  return data.data;
}

/**
 * GET /api/services/process/
 * Returns all active process steps.
 */
export async function getProcessSteps(): Promise<ProcessStep[]> {
  const { data } = await api.get<ApiResponse<ProcessStep[]>>('/process/');
  return data.data;
}

/**
 * GET /api/services/faqs/
 * Returns all active FAQs.
 */
export async function getFaqs(): Promise<FAQ[]> {
  const { data } = await api.get<ApiResponse<FAQ[]>>('/faqs/');
  return data.data;
}

// ─── Admin endpoints ──────────────────────────────────────────────────────────

export interface AdminServiceFilters extends ServiceFilters {
  status?: string;
}

export async function getAdminServices(
  filters: AdminServiceFilters = {}
): Promise<PaginatedResponse<Service>> {
  const params: Record<string, string | number> = {};
  if (filters.category) params.category = filters.category;
  if (filters.search)   params.search = filters.search;
  if (filters.page)     params.page = filters.page;
  if (filters.page_size)params.page_size = filters.page_size;
  if (filters.status)   params.status = filters.status;

  const { data } = await api.get<ApiResponse<PaginatedResponse<Service>>>(
    '/admin/services/',
    { params }
  );
  return data.data;
}

export async function getAdminServiceDetail(slug: string): Promise<Service> {
  const { data } = await api.get<ApiResponse<Service>>(`/admin/services/${slug}/`);
  return data.data;
}

export async function createService(formData: ServiceFormData): Promise<Service> {
  const { data } = await api.post<ApiResponse<Service>>('/admin/services/', formData);
  return data.data;
}

export async function updateService(slug: string, formData: Partial<ServiceFormData>): Promise<Service> {
  const { data } = await api.patch<ApiResponse<Service>>(`/admin/services/${slug}/`, formData);
  return data.data;
}

export async function deleteService(slug: string): Promise<void> {
  await api.delete(`/admin/services/${slug}/`);
}
