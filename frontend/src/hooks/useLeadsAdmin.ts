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
    staleTime: 10 * 1000, // 10s freshness
    refetchInterval: 20 * 1000, // Real-time background sync every 20s for new client leads
    refetchIntervalInBackground: false,
  });
}

export function useAdminLead(id: string) {
  return useQuery({
    queryKey: leadsKeys.detail(id),
    queryFn: () => getLeadById(id),
    enabled: !!id,
    staleTime: 10 * 1000,
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
      updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadsKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadsKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
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
      queryClient.invalidateQueries({ queryKey: leadsKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
}

export function useBulkDeleteLeads() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { lead_ids: string[] }) => bulkDeleteLeads(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadsKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
}

export function useLeadAnalytics() {
  return useQuery({
    queryKey: leadsKeys.analytics(),
    queryFn: () => getAnalytics(),
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
    refetchIntervalInBackground: false,
  });
}
