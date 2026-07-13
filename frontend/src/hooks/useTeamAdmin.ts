import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminDepartments,
  createAdminDepartment,
  updateAdminDepartment,
  deleteAdminDepartment,
  getAdminTeamMembers,
  createAdminTeamMember,
  updateAdminTeamMember,
  deleteAdminTeamMember,
  type TeamMemberPayload,
} from '../services/team.service';
import type { Department } from '../types/team';

export const teamAdminKeys = {
  all: ['adminTeam'] as const,
  departments: () => ['adminTeam', 'departments'] as const,
  members: () => ['adminTeam', 'members'] as const,
};

// ============================================================================
// DEPARTMENTS
// ============================================================================

export function useAdminDepartments() {
  return useQuery({
    queryKey: teamAdminKeys.departments(),
    queryFn: getAdminDepartments,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Department>) => createAdminDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamAdminKeys.departments() });
      queryClient.invalidateQueries({ queryKey: ['team', 'departments'] }); // Public query cache invalidation if needed
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Department> }) => updateAdminDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamAdminKeys.departments() });
      queryClient.invalidateQueries({ queryKey: ['team', 'departments'] });
      queryClient.invalidateQueries({ queryKey: teamAdminKeys.members() });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamAdminKeys.departments() });
      queryClient.invalidateQueries({ queryKey: ['team', 'departments'] });
    },
  });
}

// ============================================================================
// TEAM MEMBERS
// ============================================================================

export function useAdminTeamMembers() {
  return useQuery({
    queryKey: teamAdminKeys.members(),
    queryFn: getAdminTeamMembers,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TeamMemberPayload) => createAdminTeamMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamAdminKeys.members() });
      queryClient.invalidateQueries({ queryKey: teamAdminKeys.departments() }); // to update member counts
      // Also invalidate public team queries so About page reflects instantly
      queryClient.invalidateQueries({ queryKey: ['team'] });
    },
  });
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TeamMemberPayload }) => updateAdminTeamMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamAdminKeys.members() });
      queryClient.invalidateQueries({ queryKey: teamAdminKeys.departments() });
      queryClient.invalidateQueries({ queryKey: ['team'] });
    },
  });
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminTeamMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamAdminKeys.members() });
      queryClient.invalidateQueries({ queryKey: teamAdminKeys.departments() });
      queryClient.invalidateQueries({ queryKey: ['team'] });
    },
  });
}
