import { useQuery } from '@tanstack/react-query';
import { siteSettingsService } from '../services/siteSettings.service';
import type { SiteSettings } from '../types/siteSettings.types';

export const SITE_SETTINGS_QUERY_KEY = ['siteSettings'];

export const useSiteSettings = () => {
  return useQuery<SiteSettings, Error>({
    queryKey: SITE_SETTINGS_QUERY_KEY,
    queryFn: siteSettingsService.getSiteSettings,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });
};
