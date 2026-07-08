import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/users.service';

export function useUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => data.results,
  });
}
