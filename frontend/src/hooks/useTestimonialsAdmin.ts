import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminClients,
  createAdminClient,
  updateAdminClient,
  deleteAdminClient,
  getAdminTestimonials,
  createAdminTestimonial,
  updateAdminTestimonial,
  deleteAdminTestimonial
} from '../services/testimonials.service';
import type { AdminClientPayload, AdminTestimonialPayload } from '../types/testimonials';

// Query Keys
export const testimonialsAdminKeys = {
  all: ['adminTestimonials'] as const,
  clients: () => [...testimonialsAdminKeys.all, 'clients'] as const,
  testimonials: () => [...testimonialsAdminKeys.all, 'testimonials'] as const,
};

// ============================================================================
// Clients
// ============================================================================

export function useAdminClients() {
  return useQuery({
    queryKey: testimonialsAdminKeys.clients(),
    queryFn: getAdminClients,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminClientPayload) => createAdminClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialsAdminKeys.clients() });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] }); // Invalidate public
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminClientPayload }) => updateAdminClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialsAdminKeys.clients() });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] }); // Invalidate public
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialsAdminKeys.clients() });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] }); // Invalidate public
    },
  });
}

// ============================================================================
// Testimonials
// ============================================================================

export function useAdminTestimonials() {
  return useQuery({
    queryKey: testimonialsAdminKeys.testimonials(),
    queryFn: getAdminTestimonials,
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminTestimonialPayload) => createAdminTestimonial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialsAdminKeys.testimonials() });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] }); // Invalidate public
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminTestimonialPayload }) => updateAdminTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialsAdminKeys.testimonials() });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] }); // Invalidate public
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialsAdminKeys.testimonials() });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] }); // Invalidate public
    },
  });
}
