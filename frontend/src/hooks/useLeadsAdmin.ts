import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getLeads, getLeadById, updateLead, deleteLead, 
  bulkUpdateLeads, bulkDeleteLeads, getAnalytics 
} from '../services/leads.service';
import type { Lead } from '../types/leads';

export const leadsKeys = {
  all: ['leads'] as const,
  lists: () => [...leadsKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...leadsKeys.lists(), { filters }] as const,
  details: () => [...leadsKeys.all, 'detail'] as const,
  detail: (id: string) => [...leadsKeys.details(), id] as const,
  analytics: () => [...leadsKeys.all, 'analytics'] as const,
};

export function useAdminLeads(params?: Record<string, any>) {
  return useQuery({
    queryKey: leadsKeys.list(params || {}),
    queryFn: () => getLeads(params),
  });
}

export function useAdminLead(id: string) {
  return useQuery({
    queryKey: leadsKeys.detail(id),
    queryFn: () => getLeadById(id),
    enabled: !!id,
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
      updateLead(id, data),
    onSuccess: () => {
      // toast.success('Lead updated successfully');
      queryClient.invalidateQueries({ queryKey: leadsKeys.all });
    },
    onError: (error: any) => {
      // toast.error(error.response?.data?.message || 'Failed to update lead');
      console.error(error);
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onSuccess: () => {
      // toast.success('Lead deleted successfully');
      queryClient.invalidateQueries({ queryKey: leadsKeys.all });
    },
    onError: (error: any) => {
      // toast.error(error.response?.data?.message || 'Failed to delete lead');
      console.error(error);
    },
  });
}

export function useBulkUpdateLeads() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { lead_ids: string[]; status?: string; assigned_to?: string | null }) =>
      bulkUpdateLeads(data),
    onSuccess: () => {
      // toast.success('Leads updated successfully');
      queryClient.invalidateQueries({ queryKey: leadsKeys.all });
    },
    onError: (error: any) => {
      // toast.error(error.response?.data?.message || 'Failed to update leads');
      console.error(error);
    },
  });
}

export function useBulkDeleteLeads() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { lead_ids: string[] }) => bulkDeleteLeads(data),
    onSuccess: () => {
      // toast.success('Leads deleted successfully');
      queryClient.invalidateQueries({ queryKey: leadsKeys.all });
    },
    onError: (error: any) => {
      // toast.error(error.response?.data?.message || 'Failed to delete leads');
      console.error(error);
    },
  });
}

export function useLeadAnalytics() {
  return useQuery({
    queryKey: leadsKeys.analytics(),
    queryFn: () => getAnalytics(),
  });
}
