import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '../services/dashboard.service';
import type { DashboardData } from '../types/dashboard.types';

export const DASHBOARD_QUERY_KEY = ['dashboard'];

export function useDashboard() {
  return useQuery<DashboardData, Error>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: getDashboard,
    staleTime: 15 * 1000, // 15 seconds freshness
    refetchInterval: 30 * 1000, // Background smart sync every 30 seconds
    refetchIntervalInBackground: false, // Pause background polling when tab is inactive
    retry: 1,
  });
}
