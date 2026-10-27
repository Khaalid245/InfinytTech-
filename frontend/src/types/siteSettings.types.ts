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

export interface CoreValueItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface DifferentiatorItem {
  icon: string;
  stat?: string;
  title: string;
  description: string;
}

export interface AboutHeroMetric {
  val: string;
  label: string;
}

export interface ManifestoItem {
  title: string;
  desc: string;
}

export interface CtaTimelineStep {
  num: string;
  title: string;
  desc: string;
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
  lockout_duration: number;
  two_factor_auth_enabled: boolean;
  allowed_origins: string;
  api_token_expiration: number;
  rate_limiting_enabled: boolean;
  login_rate_limit: number;
  api_rate_limit: number;
  
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

  // Mission, Vision & Values
  mission_title?: string;
  mission_statement?: string;
  vision_title?: string;
  vision_statement?: string;
  core_values?: CoreValueItem[];

  // Why Choose Us / Differentiators
  why_choose_us_title?: string;
  why_choose_us_subtitle?: string;
  differentiators?: DifferentiatorItem[];
  
  // About Page Hero & Manifesto
  about_hero_badge?: string;
  about_hero_title?: string;
  about_hero_description?: string;
  about_hero_metrics?: AboutHeroMetric[];
  about_manifesto?: ManifestoItem[];

  // About Page Story
  about_story_badge?: string;
  about_story_title?: string;
  about_story_lead?: string;
  about_story_paragraph_1?: string;
  about_story_paragraph_2?: string;
  about_story_symbol?: string;

  // Interactive CTA & Partnership Section
  cta_badge?: string;
  cta_title?: string;
  cta_description?: string;
  cta_primary_btn_text?: string;
  cta_primary_btn_note?: string;
  cta_secondary_btn_text?: string;
  cta_secondary_btn_url?: string;
  cta_timeline_title?: string;
  cta_timeline_subtitle?: string;
  cta_timeline_steps?: CtaTimelineStep[];
  cta_trust_points?: string[];

  // Portfolio Page Hero & Featured Section
  portfolio_hero_badge?: string;
  portfolio_hero_title?: string;
  portfolio_hero_subtitle?: string;
  portfolio_hero_primary_btn_text?: string;
  portfolio_hero_secondary_btn_text?: string;
  portfolio_hero_secondary_btn_url?: string;
  portfolio_hero_trust_items?: string[];
  portfolio_featured_badge?: string;
  portfolio_featured_title?: string;
  portfolio_featured_subtitle?: string;

  // Services / Capabilities Explorer Section Header
  services_badge?: string;
  services_title?: string;
  services_subtitle?: string;

  // Technology Stack Section Header
  tech_stack_badge?: string;
  tech_stack_title?: string;
  tech_stack_subtitle?: string;

  // Industries We Serve Section Header & Banner
  industries_badge?: string;
  industries_title?: string;
  industries_subtitle?: string;
  industries_quote?: string;
  industries_cta_title?: string;
  industries_cta_subtitle?: string;
  industries_cta_btn_text?: string;

  // Delivery Process Section Header
  process_badge?: string;
  process_title?: string;
  process_subtitle?: string;

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
