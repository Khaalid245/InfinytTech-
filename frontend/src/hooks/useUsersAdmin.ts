import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as usersService from '../services/users.service';
import toast from 'react-hot-toast';

export function useAdminUsers(filters: any = {}) {
  return useQuery({
    queryKey: ['users', 'list', filters],
    queryFn: () => usersService.getUsers(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useAdminUser(id: string | null) {
  return useQuery({
    queryKey: ['users', 'detail', id],
    queryFn: () => (id ? usersService.getUser(id) : Promise.reject('No ID')),
    enabled: !!id,
  });
}

export function useAdminUserActivity(id: string | null) {
  return useQuery({
    queryKey: ['users', 'activity', id],
    queryFn: () => (id ? usersService.getUserActivity(id) : Promise.reject('No ID')),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error: any) => {
      if (error.response?.status !== 400) {
        toast.error(error.response?.data?.message || 'Unable to create user. Please try again.');
      }
    }
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => usersService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      if (error.response?.status !== 400) {
        toast.error(error.response?.data?.message || 'Unable to update user. Please try again.');
      }
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.detail ||
        (Array.isArray(error.response?.data) && error.response?.data[0]) ||
        'Failed to delete user'
      );
    }
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersService.toggleUserStatus,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(data?.is_active ? 'User activated' : 'User deactivated');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.detail ||
        (Array.isArray(error.response?.data) && error.response?.data[0]) ||
        'Failed to update status'
      );
    }
  });
}

export function useResetUserPassword() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) => usersService.resetUserPassword(id, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Password reset successfully');
    },
    onError: (error: any) => {
      if (error.response?.status !== 400) {
        toast.error(error.response?.data?.message || 'Unable to reset password. Please try again.');
      }
    }
  });
}

export function useUnlockUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersService.unlockUser,
    onSuccess: () => {
      // Invalidate both user list and details query for the specific user
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Account unlocked successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to unlock user account.');
    }
  });
}
