export interface MediaImage {
  id: string;
  url: string;
  alt_text: string;
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
  platform: string; // 'linkedin' | 'github' | 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'behance' | 'dribbble'
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
  
  // Company Info
  company_name: string;
  company_tagline: string;
  company_description: string;
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
  
  // Contact
  support_email: string;
  sales_email: string;
  phone: string;
  whatsapp: string;
  office_address: string;
  google_maps_url: string;
  
  // SEO
  default_meta_title: string;
  default_meta_description: string;
  default_keywords: string;
  canonical_url: string;
  robots_index: boolean;
  robots_follow: boolean;
  
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
