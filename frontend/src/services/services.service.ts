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
} from '../types/services';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api/services`,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

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
