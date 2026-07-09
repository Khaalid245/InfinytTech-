import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMediaFiles,
  getMediaStats,
  getMediaUsage,
  uploadMediaFile,
  updateMediaFile,
  deleteMediaFile,
  getMediaFolders,
  createMediaFolder,
  updateMediaFolder,
  deleteMediaFolder,
  type MediaFilters,
  type MediaFile,
  type MediaFolder
} from '../services/media.service';

export const mediaKeys = {
  all: ['media'] as const,
  lists: () => ['media', 'list'] as const,
  list: (filters: MediaFilters) => ['media', 'list', filters] as const,
  stats: () => ['media', 'stats'] as const,
  usage: (id: string) => ['media', 'usage', id] as const,
  folders: () => ['media', 'folders'] as const,
};

// ==========================================
// MEDIA FILES
// ==========================================

export function useMediaFiles(filters: MediaFilters = {}) {
  return useQuery({
    queryKey: mediaKeys.list(filters),
    queryFn: () => getMediaFiles(filters),
    staleTime: 1000 * 60,
  });
}

export function useMediaStats() {
  return useQuery({
    queryKey: mediaKeys.stats(),
    queryFn: getMediaStats,
    staleTime: 1000 * 60 * 5,
  });
}

export function useMediaUsage(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: mediaKeys.usage(id),
    queryFn: () => getMediaUsage(id),
    enabled: options?.enabled,
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, onProgress, folderId }: { file: File, onProgress?: (p: number) => void, folderId?: string }) => 
      uploadMediaFile(file, onProgress, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
}

export function useUpdateMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MediaFile> }) => updateMediaFile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMediaFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
}

// ==========================================
// MEDIA FOLDERS
// ==========================================

export function useMediaFolders() {
  return useQuery({
    queryKey: mediaKeys.folders(),
    queryFn: getMediaFolders,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateMediaFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; slug?: string; parentId?: string }) => createMediaFolder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.folders() });
    },
  });
}

export function useUpdateMediaFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MediaFolder> }) => updateMediaFolder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.folders() });
    },
  });
}

export function useDeleteMediaFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMediaFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.folders() });
    },
  });
}
