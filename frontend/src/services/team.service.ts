// ─── src/services/team.service.ts ─────────────────────────────────────────────
import axios from 'axios';
import type { ApiResponse, PaginatedResponse } from '../types/portfolio';
import type { Department, TeamMember } from '../types/team';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api/team`,
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

export interface TeamFilters {
  department?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

/**
 * GET /api/team/departments/
 * Returns all active departments.
 */
export async function getTeamDepartments(): Promise<Department[]> {
  const { data } = await api.get<ApiResponse<Department[]>>('/departments/');
  return data.data;
}

/**
 * GET /api/team/
 * Returns paginated list of active team members.
 */
export async function getTeamMembers(
  filters: TeamFilters = {}
): Promise<PaginatedResponse<TeamMember>> {
  const params: Record<string, string | number | boolean> = {};
  if (filters.department) params.department = filters.department;
  if (filters.featured !== undefined) params.featured = filters.featured;
  if (filters.search) params.search = filters.search;
  if (filters.page) params.page = filters.page;
  if (filters.page_size) params.page_size = filters.page_size;

  const { data } = await api.get<ApiResponse<PaginatedResponse<TeamMember>>>('/', { params });
  return data.data;
}

/**
 * GET /api/team/{slug}/
 * Returns a single team member detailed view.
 */
export async function getTeamMemberBySlug(slug: string): Promise<TeamMember> {
  const { data } = await api.get<ApiResponse<TeamMember>>(`/${slug}/`);
  return data.data;
}

// -----------------------------------------------------------------------------
// Admin APIs (Require JWT)
// -----------------------------------------------------------------------------

export async function getAdminDepartments(): Promise<Department[]> {
  const { data } = await api.get<ApiResponse<Department[]>>('/admin/departments/');
  return data.data;
}

export async function createAdminDepartment(payload: Partial<Department>): Promise<Department> {
  const { data } = await api.post<ApiResponse<Department>>('/admin/departments/', payload);
  return data.data;
}

export async function updateAdminDepartment(id: string, payload: Partial<Department>): Promise<Department> {
  const { data } = await api.patch<ApiResponse<Department>>(`/admin/departments/${id}/`, payload);
  return data.data;
}

export async function deleteAdminDepartment(id: string): Promise<void> {
  await api.delete(`/admin/departments/${id}/`);
}

// Team Members Admin

export async function getAdminTeamMembers(): Promise<TeamMember[]> {
  const { data } = await api.get<ApiResponse<TeamMember[]>>('/admin/members/');
  return data.data;
}

export type TeamMemberPayload = Omit<Partial<TeamMember>, 'department' | 'photo'> & {
  department?: string;
  photo?: string | null;
};

export async function createAdminTeamMember(payload: TeamMemberPayload): Promise<TeamMember> {
  const { data } = await api.post<ApiResponse<TeamMember>>('/admin/members/', payload);
  return data.data;
}

export async function updateAdminTeamMember(id: string, payload: TeamMemberPayload): Promise<TeamMember> {
  const { data } = await api.patch<ApiResponse<TeamMember>>(`/admin/members/${id}/`, payload);
  return data.data;
}

export async function deleteAdminTeamMember(id: string): Promise<void> {
  await api.delete(`/admin/members/${id}/`);
}
