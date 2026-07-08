import axios from 'axios';
import type { SiteSettings } from '../types/siteSettings.types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export const siteSettingsService = {
  /**
   * Fetch the global active site settings configuration.
   * Calls GET /api/site-settings/
   */
  async getSiteSettings(): Promise<SiteSettings> {
    const response = await axios.get<SiteSettings>(`${BASE_URL}/api/site-settings/`);
    return response.data;
  },
};
