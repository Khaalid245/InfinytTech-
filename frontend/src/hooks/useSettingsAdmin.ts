import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { siteSettingsService } from '../services/siteSettings.service';
import type { SiteSettings } from '../types/siteSettings.types';
import toast from 'react-hot-toast';

export function useSettingsAdmin() {
  const queryClient = useQueryClient();

  // Settings CRUD
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => siteSettingsService.getAdminSettings(),
  });

  const updateSettings = useMutation({
    mutationFn: (payload: { id: string; data: Partial<SiteSettings> }) =>
      siteSettingsService.updateSettings(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      queryClient.invalidateQueries({ queryKey: ['email-status'] });
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to update settings';
      toast.error(message);
    },
  });

  // Test Email
  const testEmail = useMutation({
    mutationFn: (email: string) => siteSettingsService.testEmail(email),
    onSuccess: () => {
      toast.success('Test email sent successfully');
      queryClient.invalidateQueries({ queryKey: ['email-status'] });
    },
    onError: (error: any) => {
      queryClient.invalidateQueries({ queryKey: ['email-status'] });
      const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to send test email';
      toast.error(message);
    },
  });

  // Email Service Status (persistent, from DB)
  const { data: emailStatus, isLoading: isLoadingEmailStatus } = useQuery({
    queryKey: ['email-status'],
    queryFn: () => siteSettingsService.getEmailStatus(),
    refetchInterval: 60_000, // refresh every 60s
  });

  // System Health
  const { data: healthData, isLoading: isLoadingHealth } = useQuery({
    queryKey: ['system-health'],
    queryFn: () => siteSettingsService.getHealth(),
    refetchInterval: 30000, // Refresh every 30s
  });

  // Audit Logs
  const { data: auditLogs, isLoading: isLoadingAuditLogs } = useQuery({
    queryKey: ['system-audit-logs'],
    queryFn: () => siteSettingsService.getAuditLogs(),
  });

  // Backups
  const { data: backups, isLoading: isLoadingBackups } = useQuery({
    queryKey: ['system-backups'],
    queryFn: () => siteSettingsService.getBackups(),
  });

  const createBackup = useMutation({
    mutationFn: () => siteSettingsService.createBackup(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-backups'] });
      toast.success('Backup created successfully');
    },
    onError: () => {
      toast.error('Failed to create backup');
    },
  });

  const restoreBackup = useMutation({
    mutationFn: (id: string) => siteSettingsService.restoreBackup(id),
    onSuccess: () => {
      toast.success('Restore initiated');
    },
    onError: () => {
      toast.error('Failed to restore backup');
    },
  });

  // Notifications
  const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ['system-notifications'],
    queryFn: () => siteSettingsService.getNotifications(),
  });

  const markNotificationRead = useMutation({
    mutationFn: (id: string) => siteSettingsService.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-notifications'] });
    },
  });

  return {
    settings,
    isLoadingSettings,
    updateSettings,
    
    testEmail,
    emailStatus,
    isLoadingEmailStatus,
    
    healthData,
    isLoadingHealth,
    
    auditLogs,
    isLoadingAuditLogs,
    
    backups,
    isLoadingBackups,
    createBackup,
    restoreBackup,
    
    notifications,
    isLoadingNotifications,
    markNotificationRead,
  };
}
