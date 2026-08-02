import axios from 'axios';
import type { ApiResponse, PaginatedResponse } from '../types/portfolio'; // Assuming these exist here based on team.service.ts

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

import { setupInterceptors } from './api';
setupInterceptors(api);

import type { Client, Testimonial, TestimonialFilters, AdminClientPayload, AdminTestimonialPayload } from '../types/testimonials';

export const getClients = async (params?: { industry?: string; country?: string; search?: string }): Promise<PaginatedResponse<Client>> => {
  const response = await api.get<ApiResponse<PaginatedResponse<Client>>>('/testimonials/clients/', { params });
  return response.data.data;
};

export const getTestimonials = async (filters?: TestimonialFilters): Promise<PaginatedResponse<Testimonial>> => {
  const params: Record<string, string | number | boolean> = {};
  
  if (filters?.industry) params.client__industry = filters.industry;
  if (filters?.rating) params.rating = filters.rating;
  if (filters?.featured !== undefined) params.featured = filters.featured;
  if (filters?.search) params.search = filters.search;
  if (filters?.ordering) params.ordering = filters.ordering;

  const response = await api.get<ApiResponse<PaginatedResponse<Testimonial>>>('/testimonials/', { params });
  return response.data.data;
};

export const getFeaturedTestimonials = async (): Promise<PaginatedResponse<Testimonial>> => {
  const response = await api.get<ApiResponse<PaginatedResponse<Testimonial>>>('/testimonials/featured/');
  return response.data.data;
};

// -----------------------------------------------------------------------------
// Admin APIs (Require JWT)
// -----------------------------------------------------------------------------

export async function getAdminClients(): Promise<Client[]> {
  const { data } = await api.get<ApiResponse<Client[]>>('/testimonials/admin/clients/');
  return data.data;
}

export async function createAdminClient(payload: AdminClientPayload): Promise<Client> {
  const { data } = await api.post<ApiResponse<Client>>('/testimonials/admin/clients/', payload);
  return data.data;
}

export async function updateAdminClient(id: string, payload: AdminClientPayload): Promise<Client> {
  const { data } = await api.patch<ApiResponse<Client>>(`/testimonials/admin/clients/${id}/`, payload);
  return data.data;
}

export async function deleteAdminClient(id: string): Promise<void> {
  await api.delete(`/testimonials/admin/clients/${id}/`);
}

export async function getAdminTestimonials(): Promise<Testimonial[]> {
  const { data } = await api.get<ApiResponse<Testimonial[]>>('/testimonials/admin/');
  return data.data;
}

export async function createAdminTestimonial(payload: AdminTestimonialPayload): Promise<Testimonial> {
  const { data } = await api.post<ApiResponse<Testimonial>>('/testimonials/admin/', payload);
  return data.data;
}

export async function updateAdminTestimonial(id: string, payload: AdminTestimonialPayload): Promise<Testimonial> {
  const { data } = await api.patch<ApiResponse<Testimonial>>(`/testimonials/admin/${id}/`, payload);
  return data.data;
}

export async function deleteAdminTestimonial(id: string): Promise<void> {
  await api.delete(`/testimonials/admin/${id}/`);
}
