// ─── dashboard.service.ts ───────────────────────────────────────────────────────
// Service for fetching Enterprise Analytics Dashboard data.
// Requires authentication (JWT token).
// ─────────────────────────────────────────────────────────────────────────────
import axios from 'axios';
import type { DashboardData } from '../types/dashboard.types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to attach JWT token to every request from this service
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * GET /api/dashboard/
 * Retrieves full dashboard analytics.
 */
export async function getDashboard(): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>('/dashboard/');
  return data;
}
