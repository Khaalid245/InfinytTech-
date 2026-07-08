import { useQuery } from '@tanstack/react-query';
import { getMediaFiles, type MediaFilters } from '../services/media.service';

export function useMediaFiles(filters: MediaFilters = {}) {
  return useQuery({
    queryKey: ['media', filters],
    queryFn: () => getMediaFiles(filters),
    staleTime: 60 * 1000, // 1 minute
  });
}
