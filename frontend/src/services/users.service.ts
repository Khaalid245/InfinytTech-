import axios from 'axios';
import type { PaginatedResponse } from '../types/portfolio';
import type { User, UserListResponse, UserActivity } from '../types/users';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api/accounts`,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

import { setupInterceptors } from './api';
setupInterceptors(api);

interface UsersParams {
  page?: number;
  search?: string;
  role?: string;
  department?: string;
  status?: string;
}

export async function getUsers(params?: UsersParams): Promise<PaginatedResponse<UserListResponse>> {
  const { data } = await api.get('/users/', { params });
  return data.data || data; // Handle ApiResponseMixin or direct Generic Response
}

export async function getUser(id: string): Promise<User> {
  const { data } = await api.get(`/users/${id}/`);
  return data.data || data;
}

export async function createUser(userData: Partial<User>): Promise<User> {
  const { data } = await api.post('/users/', userData);
  return data.data || data;
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
  const { data } = await api.patch(`/users/${id}/`, userData);
  return data.data || data;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}/`);
}

export async function toggleUserStatus(id: string): Promise<{ is_active: boolean }> {
  const { data } = await api.post(`/users/${id}/toggle_status/`);
  return data.data || data;
}

export async function resetUserPassword(id: string, password: string): Promise<void> {
  await api.post(`/users/${id}/reset_password/`, { password });
}

export async function getUserActivity(id: string): Promise<UserActivity[]> {
  const { data } = await api.get(`/users/${id}/activity/`);
  return data.data || data;
}

export async function unlockUser(id: string): Promise<void> {
  await api.post(`/users/${id}/unlock/`);
}
