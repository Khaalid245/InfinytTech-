// ─── useServices.ts ───────────────────────────────────────────────────────────
// TanStack Query hooks for all Services CMS endpoints.
// Provides caching, deduplication, loading/error states, and background refetch.
// ─────────────────────────────────────────────────────────────────────────────
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getServiceCategories,
  getServices,
  getIndustries,
  getProcessSteps,
  getFaqs,
  getAdminServices,
  getAdminServiceDetail,
  createService,
  updateService,
  deleteService,
} from '../services/services.service';
import type { ServiceFilters, AdminServiceFilters } from '../services/services.service';
import type { ServiceFormData } from '../types/services';

// ─── Cache key factory ────────────────────────────────────────────────────────
export const servicesKeys = {
  all:        ['services'] as const,
  categories: () => ['services', 'categories'] as const,
  list:       (filters: ServiceFilters) => ['services', 'list', filters] as const,
  adminList:  (filters: AdminServiceFilters) => ['services', 'adminList', filters] as const,
  adminDetail: (slug: string) => ['services', 'adminDetail', slug] as const,
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

// ─── Admin Services Hooks ────────────────────────────────────────────────────
export function useAdminServices(filters: AdminServiceFilters = {}) {
  return useQuery({
    queryKey: servicesKeys.adminList(filters),
    queryFn: () => getAdminServices(filters),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

export function useAdminServiceDetail(slug: string) {
  return useQuery({
    queryKey: servicesKeys.adminDetail(slug),
    queryFn: () => getAdminServiceDetail(slug),
    enabled: !!slug,
    retry: 1,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ServiceFormData) => createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: servicesKeys.all });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<ServiceFormData> }) =>
      updateService(slug, data),
    onMutate: async ({ slug, data }) => {
      await queryClient.cancelQueries({ queryKey: servicesKeys.all });
      const previousServices = queryClient.getQueryData(servicesKeys.all);

      queryClient.setQueriesData(
        { queryKey: ['services', 'adminList'] },
        (old: any) => {
          if (!old?.results) return old;
          return {
            ...old,
            results: old.results.map((service: any) =>
              service.slug === slug ? { ...service, ...data } : service
            ),
          };
        }
      );

      return { previousServices };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previousServices) {
        queryClient.setQueriesData({ queryKey: servicesKeys.all }, context.previousServices);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: servicesKeys.all });
      queryClient.invalidateQueries({ queryKey: servicesKeys.adminDetail(variables.slug) });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => deleteService(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: servicesKeys.all });
    },
  });
}
