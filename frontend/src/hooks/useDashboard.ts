import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '../services/dashboard.service';
import type { DashboardData } from '../types/dashboard.types';

export const DASHBOARD_QUERY_KEY = ['dashboard'];

export function useDashboard() {
  return useQuery<DashboardData, Error>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: getDashboard,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 1, // Only retry once for dashboard to avoid spamming the backend if auth fails
  });
}
