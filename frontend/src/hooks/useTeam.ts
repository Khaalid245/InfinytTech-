// ─── src/hooks/useTeam.ts ───────────────────────────────────────────────────
import { useQuery } from '@tanstack/react-query';
import {
  getTeamDepartments,
  getTeamMembers,
  getTeamMemberBySlug,
} from '../services/team.service';
import type { TeamFilters } from '../services/team.service';

export function useDepartments() {
  return useQuery({
    queryKey: ['team', 'departments'],
    queryFn: getTeamDepartments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTeamMembers(filters: TeamFilters = {}) {
  return useQuery({
    queryKey: ['team', 'members', filters],
    queryFn: () => getTeamMembers(filters),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useTeamMemberDetail(slug: string, enabled = true) {
  return useQuery({
    queryKey: ['team', 'members', slug],
    queryFn: () => getTeamMemberBySlug(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!slug && enabled,
  });
}
