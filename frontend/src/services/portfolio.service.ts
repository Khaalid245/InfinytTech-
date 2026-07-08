// ─── portfolio.service.ts ─────────────────────────────────────────────────────
// Reusable API methods for the Portfolio CMS endpoints.
// Base URL is read from VITE_API_BASE_URL environment variable.
// ─────────────────────────────────────────────────────────────────────────────
import axios from 'axios';
import type {
  ApiResponse,
  PaginatedResponse,
  ProjectCategory,
  Technology,
  ProjectTag,
  ProjectListItem,
  ProjectDetail,
  ProjectFormData,
} from '../types/portfolio';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api/portfolio`,
  timeout: 10_000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Project Filters ──────────────────────────────────────────────────────────
export interface ProjectFilters {
  category?: string;   // category slug
  technology?: string; // technology slug
  tag?: string;        // tag slug
  featured?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
  status?: string;     // draft, published, archived
}

// ─── Public endpoints ─────────────────────────────────────────────────────────

/**
 * GET /api/portfolio/projects/
 * Returns paginated PUBLISHED projects.
 * Filters: category, technology, tag, featured, search, page, page_size.
 */
export async function getProjects(
  filters: ProjectFilters = {}
): Promise<PaginatedResponse<ProjectListItem>> {
  const params: Record<string, string | number> = {};
  if (filters.category)   params.category   = filters.category;
  if (filters.technology) params.technology  = filters.technology;
  if (filters.tag)        params.tag         = filters.tag;
  if (filters.featured)   params.featured    = 1;
  if (filters.search)     params.search      = filters.search;
  if (filters.page)       params.page        = filters.page;
  if (filters.page_size)  params.page_size   = filters.page_size;

  const { data } = await api.get<ApiResponse<PaginatedResponse<ProjectListItem>>>(
    '/projects/',
    { params }
  );
  return data.data;
}

/**
 * GET /api/portfolio/projects/:slug/
 * Returns full project detail (PUBLISHED only).
 */
export async function getProjectBySlug(slug: string): Promise<ProjectDetail> {
  const { data } = await api.get<ApiResponse<ProjectDetail>>(`/projects/${slug}/`);
  return data.data;
}

/**
 * GET /api/portfolio/project-categories/
 * Returns all active categories.
 */
export async function getCategories(): Promise<ProjectCategory[]> {
  const { data } = await api.get<ApiResponse<ProjectCategory[]>>('/project-categories/');
  return data.data;
}

/**
 * GET /api/portfolio/technologies/
 * Returns all active technologies.
 */
export async function getTechnologies(): Promise<Technology[]> {
  const { data } = await api.get<ApiResponse<Technology[]>>('/technologies/');
  return data.data;
}

/**
 * GET /api/portfolio/tags/
 * Returns all active project tags.
 */
export async function getTags(): Promise<ProjectTag[]> {
  const { data } = await api.get<ApiResponse<ProjectTag[]>>('/tags/');
  return data.data;
}

// ─── Admin endpoints ──────────────────────────────────────────────────────────

/**
 * GET /api/portfolio/admin/projects/
 * Returns paginated projects (including drafts/archived) for Admin.
 */
export async function getAdminProjects(
  filters: ProjectFilters = {}
): Promise<PaginatedResponse<ProjectListItem>> {
  const params: Record<string, string | number> = {};
  if (filters.category)   params.category   = filters.category;
  if (filters.technology) params.technology = filters.technology;
  if (filters.tag)        params.tag        = filters.tag;
  if (filters.featured)   params.featured   = 1;
  if (filters.search)     params.search     = filters.search;
  if (filters.page)       params.page       = filters.page;
  if (filters.page_size)  params.page_size  = filters.page_size;
  if (filters.status)     params.status     = filters.status; // Optional status filter for admin

  const { data } = await api.get<ApiResponse<PaginatedResponse<ProjectListItem>>>(
    '/admin/projects/',
    { params }
  );
  return data.data;
}

/**
 * GET /api/portfolio/admin/projects/:slug/
 */
export async function getAdminProjectDetail(slug: string): Promise<ProjectDetail> {
  const { data } = await api.get<ApiResponse<ProjectDetail>>(`/admin/projects/${slug}/`);
  return data.data;
}

/**
 * POST /api/portfolio/admin/projects/
 */
export async function createProject(formData: ProjectFormData): Promise<ProjectDetail> {
  const { data } = await api.post<ApiResponse<ProjectDetail>>('/admin/projects/', formData);
  return data.data;
}

/**
 * PUT/PATCH /api/portfolio/admin/projects/:slug/
 */
export async function updateProject(slug: string, formData: Partial<ProjectFormData>): Promise<ProjectDetail> {
  const { data } = await api.patch<ApiResponse<ProjectDetail>>(`/admin/projects/${slug}/`, formData);
  return data.data;
}

/**
 * DELETE /api/portfolio/admin/projects/:slug/
 */
export async function deleteProject(slug: string): Promise<void> {
  await api.delete(`/admin/projects/${slug}/`);
}

// ─── Gallery Endpoints ────────────────────────────────────────────────────────

export async function addProjectGalleryImage(slug: string, media_file_id: string, display_order: number): Promise<void> {
  await api.post(`/admin/projects/${slug}/images/`, {
    media_file_id,
    display_order
  });
}

export async function updateProjectGalleryImage(slug: string, imageId: string, display_order: number): Promise<void> {
  await api.patch(`/admin/projects/${slug}/images/${imageId}/`, {
    display_order
  });
}

export async function removeProjectGalleryImage(slug: string, imageId: string): Promise<void> {
  await api.delete(`/admin/projects/${slug}/images/${imageId}/`);
}
