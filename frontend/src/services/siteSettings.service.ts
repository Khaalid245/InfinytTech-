import axios from 'axios';
import type { SiteSettings, SystemBackup, Notification } from '../types/siteSettings.types';
import type { UserActivity } from '../types/users';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api/site-settings`,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const siteSettingsService = {
  // Public
  async getSiteSettings(): Promise<SiteSettings> {
    const { data } = await axios.get<SiteSettings>(`${BASE_URL}/api/site-settings/`);
    return data;
  },

  // Admin CRUD for Settings
  async getAdminSettings(): Promise<SiteSettings> {
    const { data } = await api.get('/admin/');
    return data.data?.[0] || data[0] || data; // Assuming it returns a list of settings or the active one
  },

  async updateSettings(id: string, payload: Partial<SiteSettings>): Promise<SiteSettings> {
    const { data } = await api.patch(`/admin/${id}/`, payload);
    return data;
  },

  // Admin Actions
  async testEmail(email: string): Promise<void> {
    await api.post('/admin/test_email/', { email });
  },

  async getHealth(): Promise<any> {
    const { data } = await api.get('/admin/health/');
    return data;
  },

  async getAuditLogs(): Promise<UserActivity[]> {
    const { data } = await api.get('/admin/audit_logs/');
    return data;
  },

  // Backups
  async getBackups(): Promise<SystemBackup[]> {
    const { data } = await api.get('/backups/');
    return data;
  },
  
  async createBackup(): Promise<SystemBackup> {
    const { data } = await api.post('/backups/trigger/');
    return data;
  },
  
  async restoreBackup(id: string): Promise<void> {
    await api.post(`/backups/${id}/restore/`);
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    const { data } = await api.get('/notifications/');
    return data;
  },

  async markNotificationRead(id: string): Promise<Notification> {
    const { data } = await api.post(`/notifications/${id}/mark_read/`);
    return data;
  }
};
