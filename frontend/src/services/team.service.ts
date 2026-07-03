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
