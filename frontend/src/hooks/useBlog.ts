// ─── useBlog.ts ───────────────────────────────────────────────────────────────
// TanStack Query hooks for all Blog CMS endpoints.
// Provides caching, deduplication, loading/error states, and background refetch.
// ─────────────────────────────────────────────────────────────────────────────
import { useQuery } from '@tanstack/react-query';
import {
  getBlogCategories,
  getBlogTags,
  getBlogPosts,
  getBlogPostBySlug,
} from '../services/blog.service';
import type { BlogFilters } from '../services/blog.service';

// ─── Cache key factory ────────────────────────────────────────────────────────
export const blogKeys = {
  all:        ['blog'] as const,
  categories: () => ['blog', 'categories'] as const,
  tags:       () => ['blog', 'tags'] as const,
  posts:      (filters: BlogFilters) => ['blog', 'posts', filters] as const,
  post:       (slug: string) => ['blog', 'post', slug] as const,
};

// ─── Blog Categories Hook ────────────────────────────────────────────────────
export function useBlogCategories() {
  return useQuery({
    queryKey: blogKeys.categories(),
    queryFn: getBlogCategories,
    staleTime: 1000 * 60 * 10, // 10 min
    retry: 2,
  });
}

// ─── Blog Tags Hook ──────────────────────────────────────────────────────────
export function useBlogTags() {
  return useQuery({
    queryKey: blogKeys.tags(),
    queryFn: getBlogTags,
    staleTime: 1000 * 60 * 10, // 10 min
    retry: 2,
  });
}

// ─── Blog Posts List Hook ─────────────────────────────────────────────────────
export function useBlogPosts(filters: BlogFilters = {}) {
  return useQuery({
    queryKey: blogKeys.posts(filters),
    queryFn: () => getBlogPosts(filters),
    staleTime: 1000 * 60 * 2, // 2 min
    retry: 2,
  });
}

// ─── Single Blog Post Hook ────────────────────────────────────────────────────
export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: blogKeys.post(slug),
    queryFn: () => getBlogPostBySlug(slug),
    staleTime: 1000 * 60 * 2, // 2 min
    retry: 2,
    enabled: !!slug,
  });
}
