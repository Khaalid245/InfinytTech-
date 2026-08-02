import axios from 'axios';
import type { Lead, LeadListResponse, LeadAnalyticsResponse } from '../types/leads';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

import { setupInterceptors } from './api';
setupInterceptors(api);

// Public Endpoint
export const submitLead = async (data: Partial<Lead>): Promise<Lead> => {
  const response = await api.post<{ success: boolean; data: Lead }>('/leads/contact/', data);
  return response.data.data;
};

// Admin Endpoints
export const getLeads = async (params?: Record<string, any>): Promise<LeadListResponse['data']> => {
  const response = await api.get<LeadListResponse>('/leads/', { params });
  return response.data.data;
};

export const getLeadById = async (id: string): Promise<Lead> => {
  const response = await api.get<{ success: boolean; data: Lead }>(`/leads/${id}/`);
  return response.data.data;
};

export const updateLead = async (id: string, data: Partial<Lead>): Promise<Lead> => {
  const response = await api.patch<{ success: boolean; data: Lead }>(`/leads/${id}/`, data);
  return response.data.data;
};

export const deleteLead = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}/`);
};

// Bulk Actions
export const bulkUpdateLeads = async (data: { lead_ids: string[]; status?: string; assigned_to?: string | null }): Promise<void> => {
  await api.post('/leads/bulk-update/', data);
};

export const bulkDeleteLeads = async (data: { lead_ids: string[] }): Promise<void> => {
  await api.post('/leads/bulk-delete/', data);
};

// Analytics
export const getAnalytics = async (): Promise<LeadAnalyticsResponse['data']> => {
  const response = await api.get<LeadAnalyticsResponse>('/leads/analytics/');
  return response.data.data;
};
