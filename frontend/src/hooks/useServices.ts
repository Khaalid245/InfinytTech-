// ─── useServices.ts ───────────────────────────────────────────────────────────
// TanStack Query hooks for all Services CMS endpoints.
// Provides caching, deduplication, loading/error states, and background refetch.
// ─────────────────────────────────────────────────────────────────────────────
import { useQuery } from '@tanstack/react-query';
import {
  getServiceCategories,
  getServices,
  getIndustries,
  getProcessSteps,
  getFaqs,
} from '../services/services.service';
import type { ServiceFilters } from '../services/services.service';

// ─── Cache key factory ────────────────────────────────────────────────────────
export const servicesKeys = {
  all:        ['services'] as const,
  categories: () => ['services', 'categories'] as const,
  list:       (filters: ServiceFilters) => ['services', 'list', filters] as const,
  industries: () => ['services', 'industries'] as const,
  process:    () => ['services', 'process'] as const,
  faqs:       () => ['services', 'faqs'] as const,
};

// ─── Service Categories Hook ─────────────────────────────────────────────────
export function useServiceCategories() {
  return useQuery({
    queryKey: servicesKeys.categories(),
    queryFn: getServiceCategories,
    staleTime: 1000 * 60 * 10, // 10 min
    retry: 2,
  });
}

// ─── Services List Hook ──────────────────────────────────────────────────────
export function useServices(filters: ServiceFilters = {}) {
  return useQuery({
    queryKey: servicesKeys.list(filters),
    queryFn: () => getServices(filters),
    staleTime: 1000 * 60 * 2, // 2 min
    retry: 2,
  });
}

// ─── Industries List Hook ────────────────────────────────────────────────────
export function useIndustries() {
  return useQuery({
    queryKey: servicesKeys.industries(),
    queryFn: getIndustries,
    staleTime: 1000 * 60 * 10, // 10 min
    retry: 2,
  });
}

// ─── Process Steps Hook ──────────────────────────────────────────────────────
export function useProcessSteps() {
  return useQuery({
    queryKey: servicesKeys.process(),
    queryFn: getProcessSteps,
    staleTime: 1000 * 60 * 10, // 10 min
    retry: 2,
  });
}

// ─── FAQs Hook ───────────────────────────────────────────────────────────────
export function useFaqs() {
  return useQuery({
    queryKey: servicesKeys.faqs(),
    queryFn: getFaqs,
    staleTime: 1000 * 60 * 10, // 10 min
    retry: 2,
  });
}
