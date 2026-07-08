// ─── dashboard.types.ts ────────────────────────────────────────────────────────
// Interfaces for the Enterprise Analytics Dashboard API
// ─────────────────────────────────────────────────────────────────────────────

export interface DashboardOverview {
  portfolio: {
    total_projects: number;
    published: number;
    drafts: number;
    featured: number;
  };
  services: {
    total_services: number;
    categories: number;
  };
  blog: {
    total_posts: number;
    published: number;
    drafts: number;
    categories: number;
    tags: number;
  };
  team: {
    total_members: number;
    departments: number;
  };
  testimonials: {
    total_testimonials: number;
    featured: number;
  };
  media: {
    total_files: number;
    images: number;
    svgs: number;
    storage_used: number;
  };
  leads: {
    total_leads: number;
    new: number;
    contacted: number;
    qualified: number;
    proposal_sent: number;
    negotiation: number;
    won: number;
    lost: number;
  };
  site_settings: {
    active_config: number;
    office_locations: number;
    social_links: number;
  };
}

export interface RecentActivity {
  recent_leads: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    status: string;
    created_at: string;
  }>;
  recent_posts: Array<{
    id: string;
    title: string;
    status: string;
    created_at: string;
  }>;
  recent_projects: Array<{
    id: string;
    title: string;
    status: string;
    created_at: string;
  }>;
  recent_media: Array<{
    id: string;
    title: string;
    mime_type: string;
    created_at: string;
  }>;
  recent_team: Array<{
    id: string;
    first_name: string;
    last_name: string;
    created_at: string;
  }>;
}

export interface LeadAnalytics {
  leads_today: number;
  leads_this_week: number;
  leads_this_month: number;
  status_distribution: Record<string, number>;
  source_distribution: Record<string, number>;
}

export interface ContentHealth {
  projects_without_image: number;
  blog_posts_missing_seo: number;
  services_without_features: number;
  testimonials_without_logo: number;
  inactive_social_links: number;
  missing_office_locations: number;
}

export interface MediaHealth {
  unused_media_count: number;
  missing_alt_text: number;
  public_assets: number;
  private_assets: number;
  largest_files: Array<{
    id: string;
    title: string;
    file_size: number;
    mime_type: string;
  }>;
}

export interface SystemHealth {
  database_connection: string;
  migration_status: string;
  python_version: string;
  django_version: string;
  application_version: string;
}

export interface DashboardData {
  overview: DashboardOverview;
  recent_activity: RecentActivity;
  lead_analytics: LeadAnalytics;
  content_health: ContentHealth;
  media_health: MediaHealth;
  system_health: SystemHealth;
}
