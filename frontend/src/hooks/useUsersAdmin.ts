import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as usersService from '../services/users.service';

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
      // alert('User created successfully');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create user');
    }
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => usersService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      // alert('User updated successfully');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update user');
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      // alert('User deleted successfully');
    },
    onError: (error: any) => {
      alert(
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      // alert(data.is_active ? 'User activated' : 'User deactivated');
    },
    onError: (error: any) => {
      alert(
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
      // alert('Password reset successfully');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to reset password');
    }
  });
}
