export interface MediaImage {
  id: string;
  url: string;
  alt_text: string;
}

export interface SystemBackup {
  id: string;
  file_name: string;
  file_size: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'security' | 'storage' | 'backup' | 'crm';
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface OfficeLocation {
  id: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  map_url: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string; // 'linkedin' | 'github' | 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'behance' | 'dribbble' | 'tiktok' | 'medium'
  url: string;
  icon: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  is_active: boolean;
  
  // General Info
  company_name: string;
  company_tagline: string;
  company_description: string;
  company_timezone: string;
  default_language: string;
  default_currency: string;
  founded_year: number | null;
  
  // Branding
  primary_logo: string | null;
  primary_logo_details: MediaImage | null;
  secondary_logo: string | null;
  secondary_logo_details: MediaImage | null;
  dark_logo: string | null;
  dark_logo_details: MediaImage | null;
  light_logo: string | null;
  light_logo_details: MediaImage | null;
  favicon: string | null;
  favicon_details: MediaImage | null;
  open_graph_image: string | null;
  open_graph_image_details: MediaImage | null;
  apple_touch_icon: string | null;
  apple_touch_icon_details: MediaImage | null;
  loading_logo: string | null;
  loading_logo_details: MediaImage | null;
  brand_colors: Record<string, string>;
  
  // Contact
  primary_email: string;
  support_email: string;
  sales_email: string;
  phone: string;
  whatsapp: string;
  office_address: string;
  google_maps_url: string;
  business_hours: string;
  
  // SEO
  default_meta_title: string;
  default_meta_description: string;
  default_keywords: string;
  canonical_url: string;
  robots_index: boolean;
  robots_follow: boolean;
  open_graph_title: string;
  open_graph_description: string;
  twitter_card_type: string;

  // Email / SMTP
  smtp_provider: string;
  smtp_host: string;
  smtp_port: number | null;
  smtp_username: string;
  smtp_password?: string;
  smtp_encryption: string;
  smtp_sender_name: string;
  smtp_sender_email: string;

  // Security
  password_policy: string;
  session_timeout: number;
  max_login_attempts: number;
  two_factor_auth_enabled: boolean;
  allowed_origins: string;
  api_token_expiration: number;
  
  // Hero
  hero_title: string;
  hero_subtitle: string;
  hero_primary_button_text: string;
  hero_primary_button_url: string;
  hero_secondary_button_text: string;
  hero_secondary_button_url: string;
  
  // Stats
  completed_projects: number;
  happy_clients: number;
  countries_served: number;
  years_experience: number;
  
  // Footer
  footer_description: string;
  copyright_text: string;
  newsletter_title: string;
  newsletter_description: string;
  
  // System
  maintenance_mode: boolean;
  analytics_enabled: boolean;
  
  // Relationships
  office_locations: OfficeLocation[];
  social_links: SocialLink[];
  
  created_at: string;
  updated_at: string;
}
