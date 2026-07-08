import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBlogCategories,
  getBlogTags,
  getBlogPosts,
  getBlogPostBySlug,
  getAdminBlogPosts,
  getAdminBlogPostDetail,
  createBlogPost,
  updateBlogPost,
  getAdminBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getAdminBlogTags,
  createBlogTag,
  updateBlogTag,
  deleteBlogTag,
  deleteBlogPost,
} from '../services/blog.service';
import type { BlogFilters } from '../services/blog.service';
import type { AdminBlogFilters, BlogFormData, BlogCategoryFormData, BlogTagFormData } from '../types/blog';

export const blogKeys = {
  all: ['blog'] as const,
  categories: () => ['blog', 'categories'] as const,
  adminCategories: (filters: AdminBlogFilters) => ['blog', 'adminCategories', filters] as const,
  tags: () => ['blog', 'tags'] as const,
  adminTags: (filters: AdminBlogFilters) => ['blog', 'adminTags', filters] as const,
  publicList: (filters: BlogFilters) => ['blog', 'publicList', filters] as const,
  publicDetail: (slug: string) => ['blog', 'publicDetail', slug] as const,
  adminList: (filters: AdminBlogFilters) => ['blog', 'adminList', filters] as const,
  adminDetail: (id: string) => ['blog', 'adminDetail', id] as const,
};

export function useBlogCategories() {
  return useQuery({
    queryKey: blogKeys.categories(),
    queryFn: getBlogCategories,
    staleTime: 1000 * 60 * 10,
  });
}

export function useBlogTags() {
  return useQuery({
    queryKey: blogKeys.tags(),
    queryFn: getBlogTags,
    staleTime: 1000 * 60 * 10,
  });
}

export function useBlogPosts(filters: BlogFilters = {}) {
  return useQuery({
    queryKey: blogKeys.publicList(filters),
    queryFn: () => getBlogPosts(filters),
    staleTime: 1000 * 60 * 2,
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: blogKeys.publicDetail(slug),
    queryFn: () => getBlogPostBySlug(slug),
    enabled: !!slug,
  });
}

export function useAdminBlogPosts(filters: AdminBlogFilters = {}) {
  return useQuery({
    queryKey: blogKeys.adminList(filters),
    queryFn: () => getAdminBlogPosts(filters),
    staleTime: 1000 * 60 * 2,
  });
}

export function useAdminBlogPostDetail(id: string) {
  return useQuery({
    queryKey: blogKeys.adminDetail(id),
    queryFn: () => getAdminBlogPostDetail(id),
    enabled: !!id,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BlogFormData) => createBlogPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogFormData> }) => updateBlogPost(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: blogKeys.all });
      const previousBlogPosts = queryClient.getQueryData(blogKeys.all);

      queryClient.setQueriesData(
        { queryKey: ['blog', 'adminList'] },
        (old: any) => {
          if (!old?.results) return old;
          return {
            ...old,
            results: old.results.map((post: any) =>
              post.id === id ? { ...post, ...data } : post
            ),
          };
        }
      );
      return { previousBlogPosts };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previousBlogPosts) {
        queryClient.setQueriesData({ queryKey: blogKeys.all }, context.previousBlogPosts);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      queryClient.invalidateQueries({ queryKey: blogKeys.adminDetail(variables.id) });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

// ==========================================
// CATEGORY HOOKS
// ==========================================

export function useAdminBlogCategories(filters: AdminBlogFilters = {}) {
  return useQuery({
    queryKey: blogKeys.adminCategories(filters),
    queryFn: () => getAdminBlogCategories(filters),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BlogCategoryFormData) => createBlogCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.categories() });
      queryClient.invalidateQueries({ queryKey: ['blog', 'adminCategories'] });
    },
  });
}

export function useUpdateBlogCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogCategoryFormData> }) => updateBlogCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.categories() });
      queryClient.invalidateQueries({ queryKey: ['blog', 'adminCategories'] });
    },
  });
}

export function useDeleteBlogCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBlogCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.categories() });
      queryClient.invalidateQueries({ queryKey: ['blog', 'adminCategories'] });
    },
  });
}

// ==========================================
// TAG HOOKS
// ==========================================

export function useAdminBlogTags(filters: AdminBlogFilters = {}) {
  return useQuery({
    queryKey: blogKeys.adminTags(filters),
    queryFn: () => getAdminBlogTags(filters),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateBlogTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BlogTagFormData) => createBlogTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.tags() });
      queryClient.invalidateQueries({ queryKey: ['blog', 'adminTags'] });
    },
  });
}

export function useUpdateBlogTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogTagFormData> }) => updateBlogTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.tags() });
      queryClient.invalidateQueries({ queryKey: ['blog', 'adminTags'] });
    },
  });
}

export function useDeleteBlogTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBlogTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.tags() });
      queryClient.invalidateQueries({ queryKey: ['blog', 'adminTags'] });
    },
  });
}
