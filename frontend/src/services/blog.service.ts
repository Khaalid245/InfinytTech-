// ─── blog.service.ts ──────────────────────────────────────────────────────────
// Reusable API methods for the Blog CMS endpoints.
// Base URL is read from VITE_API_BASE_URL environment variable.
// ─────────────────────────────────────────────────────────────────────────────
import axios from 'axios';
import type { ApiResponse, PaginatedResponse } from '../types/portfolio';
import type { BlogCategory, BlogTag, BlogPost } from '../types/blog';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api/blog`,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

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
