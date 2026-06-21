// ─── usePortfolio.ts ──────────────────────────────────────────────────────────
// TanStack Query hooks for all Portfolio CMS endpoints.
// Provides caching, deduplication, loading/error states, and background refetch.
// ─────────────────────────────────────────────────────────────────────────────
import { useQuery } from '@tanstack/react-query';
import {
  getProjects,
  getProjectBySlug,
  getCategories,
  getTechnologies,
  getTags,
} from '../services/portfolio.service';
import type { ProjectFilters } from '../services/portfolio.service';

// ─── Cache key factory (keeps keys co-located and type-safe) ─────────────────
export const portfolioKeys = {
  all:          ['portfolio']                                      as const,
  projects:     (filters: ProjectFilters) => ['portfolio', 'projects', filters] as const,
  project:      (slug: string)  => ['portfolio', 'project', slug]  as const,
  categories:   ()              => ['portfolio', 'categories']       as const,
  technologies: ()              => ['portfolio', 'technologies']     as const,
  tags:         ()              => ['portfolio', 'tags']             as const,
};

// ─── Published project list (paginated + filterable) ─────────────────────────
export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey:  portfolioKeys.projects(filters),
    queryFn:   () => getProjects(filters),
    staleTime: 1000 * 60 * 2,  // 2 min — portfolio changes infrequently
    retry:     2,
  });
}

// ─── Full project detail (loads on modal open) ────────────────────────────────
export function useProjectDetail(slug: string | null) {
  return useQuery({
    queryKey:  portfolioKeys.project(slug ?? ''),
    queryFn:   () => getProjectBySlug(slug!),
    enabled:   !!slug,           // only fetches when a slug is provided
    staleTime: 1000 * 60 * 5,   // 5 min
    retry:     2,
  });
}

// ─── Categories ───────────────────────────────────────────────────────────────
export function useCategories() {
  return useQuery({
    queryKey:  portfolioKeys.categories(),
    queryFn:   getCategories,
    staleTime: 1000 * 60 * 10,  // 10 min — categories are stable
    retry:     2,
  });
}

// ─── Technologies ─────────────────────────────────────────────────────────────
export function useTechnologies() {
  return useQuery({
    queryKey:  portfolioKeys.technologies(),
    queryFn:   getTechnologies,
    staleTime: 1000 * 60 * 10,
    retry:     2,
  });
}

// ─── Tags ─────────────────────────────────────────────────────────────────────
export function useTags() {
  return useQuery({
    queryKey:  portfolioKeys.tags(),
    queryFn:   getTags,
    staleTime: 1000 * 60 * 10,
    retry:     2,
  });
}
