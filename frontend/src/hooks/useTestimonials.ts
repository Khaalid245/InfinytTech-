import { useQuery } from '@tanstack/react-query';
import { getClients, getTestimonials, getFeaturedTestimonials } from '../services/testimonials.service';
import type { TestimonialFilters } from '../types/testimonials';

export function useClients(params?: { industry?: string; country?: string; search?: string }) {
  return useQuery({
    queryKey: ['testimonials', 'clients', params],
    queryFn: () => getClients(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTestimonials(filters: TestimonialFilters = {}) {
  return useQuery({
    queryKey: ['testimonials', 'list', filters],
    queryFn: () => getTestimonials(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFeaturedTestimonials() {
  return useQuery({
    queryKey: ['testimonials', 'featured'],
    queryFn: getFeaturedTestimonials,
    staleTime: 10 * 60 * 1000, // 10 minutes (featured rarely changes)
  });
}
