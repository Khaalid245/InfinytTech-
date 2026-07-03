import axios from 'axios';
import type { ApiResponse, PaginatedResponse } from '../types/portfolio'; // Assuming these exist here based on team.service.ts

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});
import type { Client, Testimonial, TestimonialFilters } from '../types/testimonials';

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
