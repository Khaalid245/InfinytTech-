// ─── blog.service.ts ──────────────────────────────────────────────────────────
// Reusable API methods for the Blog CMS endpoints.
// Base URL is read from VITE_API_BASE_URL environment variable.
// ─────────────────────────────────────────────────────────────────────────────
import axios from 'axios';
import type { ApiResponse, PaginatedResponse } from '../types/portfolio';
import type { BlogCategory, BlogTag, BlogPost, AdminBlogFilters, BlogFormData, BlogCategoryFormData, BlogTagFormData } from '../types/blog';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api/blog`,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
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

export interface BlogFilters {
  category?: string;
  tag?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

/**
 * GET /api/blog/categories/
 * Returns all active blog categories.
 */
export async function getBlogCategories(): Promise<BlogCategory[]> {
  const { data } = await api.get<ApiResponse<BlogCategory[]>>('/categories/');
  return data.data;
}

/**
 * GET /api/blog/tags/
 * Returns all active tags.
 */
export async function getBlogTags(): Promise<BlogTag[]> {
  const { data } = await api.get<ApiResponse<BlogTag[]>>('/tags/');
  return data.data;
}

/**
 * GET /api/blog/posts/
 * Returns paginated list of published blog posts.
 */
export async function getBlogPosts(
  filters: BlogFilters = {}
): Promise<PaginatedResponse<BlogPost>> {
  const params: Record<string, string | number | boolean> = {};
  if (filters.category)   params.category = filters.category;
  if (filters.tag)        params.tag = filters.tag;
  if (filters.featured !== undefined) params.featured = filters.featured;
  if (filters.search)     params.search = filters.search;
  if (filters.page)       params.page = filters.page;
  if (filters.page_size)  params.page_size = filters.page_size;

  const { data } = await api.get<ApiResponse<PaginatedResponse<BlogPost>>>('/posts/', { params });
  return data.data;
}

/**
 * GET /api/blog/posts/{slug}/
 * Returns a single blog post detailed view.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  const { data } = await api.get<ApiResponse<BlogPost>>(`/posts/${slug}/`);
  return data.data;
}

/**
 * GET /api/blog/admin/posts/
 * Admin list with filters
 */
export async function getAdminBlogPosts(filters: AdminBlogFilters = {}): Promise<PaginatedResponse<BlogPost>> {
  const params: Record<string, string | number | boolean> = {};
  if (filters.search) params.search = filters.search;
  if (filters.category) params.category = filters.category;
  if (filters.status) params.status = filters.status;
  if (filters.featured !== undefined) params.featured = filters.featured;
  if (filters.page) params.page = filters.page;
  if (filters.page_size) params.page_size = filters.page_size;

  const { data } = await api.get<ApiResponse<PaginatedResponse<BlogPost>>>('/admin/posts/', { params });
  return data.data;
}

/**
 * GET /api/blog/admin/posts/{id}/
 */
export async function getAdminBlogPostDetail(id: string): Promise<BlogPost> {
  const { data } = await api.get<ApiResponse<BlogPost>>(`/admin/posts/${id}/`);
  return data.data;
}

/**
 * POST /api/blog/admin/posts/
 */
export async function createBlogPost(formData: BlogFormData): Promise<BlogPost> {
  // Map formData tags to tags
  const payload = {
    ...formData,
    category: formData.category_id,
    tags: formData.tag_ids,
    featured_media: formData.featured_media_id,
    seo_title: formData.seo_title,
    seo_description: formData.seo_description,
  };
  const { data } = await api.post<ApiResponse<BlogPost>>('/admin/posts/', payload);
  return data.data;
}

/**
 * PATCH /api/blog/admin/posts/{id}/
 */
export async function updateBlogPost(id: string, formData: Partial<BlogFormData>): Promise<BlogPost> {
  const payload: any = { ...formData };
  if (formData.category_id !== undefined) payload.category = formData.category_id;
  if (formData.tag_ids !== undefined) payload.tags = formData.tag_ids;
  if (formData.featured_media_id !== undefined) payload.featured_media = formData.featured_media_id;
  if (formData.seo_title !== undefined) payload.seo_title = formData.seo_title;
  if (formData.seo_description !== undefined) payload.seo_description = formData.seo_description;
  
  const { data } = await api.patch<ApiResponse<BlogPost>>(`/admin/posts/${id}/`, payload);
  return data.data;
}

/**
 * DELETE /api/blog/admin/posts/{id}/
 */
export async function deleteBlogPost(id: string): Promise<void> {
  await api.delete(`/admin/posts/${id}/`);
}

/**
 * GET /api/blog/admin/categories/
 */
export async function getAdminBlogCategories(filters: AdminBlogFilters = {}): Promise<PaginatedResponse<BlogCategory>> {
  const params: Record<string, string | number | boolean> = {};
  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  if (filters.page) params.page = filters.page;
  if (filters.page_size) params.page_size = filters.page_size;

  const { data } = await api.get<ApiResponse<PaginatedResponse<BlogCategory>>>('/admin/categories/', { params });
  return data.data;
}

export async function createBlogCategory(formData: BlogCategoryFormData): Promise<BlogCategory> {
  const { data } = await api.post<ApiResponse<BlogCategory>>('/admin/categories/', formData);
  return data.data;
}

export async function updateBlogCategory(id: string, formData: Partial<BlogCategoryFormData>): Promise<BlogCategory> {
  const { data } = await api.patch<ApiResponse<BlogCategory>>(`/admin/categories/${id}/`, formData);
  return data.data;
}

export async function deleteBlogCategory(id: string): Promise<void> {
  await api.delete(`/admin/categories/${id}/`);
}

/**
 * GET /api/blog/admin/tags/
 */
export async function getAdminBlogTags(filters: AdminBlogFilters = {}): Promise<PaginatedResponse<BlogTag>> {
  const params: Record<string, string | number | boolean> = {};
  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  if (filters.page) params.page = filters.page;
  if (filters.page_size) params.page_size = filters.page_size;

  const { data } = await api.get<ApiResponse<PaginatedResponse<BlogTag>>>('/admin/tags/', { params });
  return data.data;
}

export async function createBlogTag(formData: BlogTagFormData): Promise<BlogTag> {
  const { data } = await api.post<ApiResponse<BlogTag>>('/admin/tags/', formData);
  return data.data;
}

export async function updateBlogTag(id: string, formData: Partial<BlogTagFormData>): Promise<BlogTag> {
  const { data } = await api.patch<ApiResponse<BlogTag>>(`/admin/tags/${id}/`, formData);
  return data.data;
}

export async function deleteBlogTag(id: string): Promise<void> {
  await api.delete(`/admin/tags/${id}/`);
}
