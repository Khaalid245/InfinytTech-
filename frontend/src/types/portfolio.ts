// ─── portfolio.ts ────────────────────────────────────────────────────────────
// Strict TypeScript interfaces matching the Django Portfolio CMS API responses.
// Mirrors: apps/portfolio/serializers.py
// ─────────────────────────────────────────────────────────────────────────────

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Technology {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectTag {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  /** Absolute URL returned by the API */
  image: string;
  caption: string;
  display_order: number;
  created_at: string;
}

export interface ProjectMetric {
  id: string;
  metric_label: string;
  metric_value: string;
  display_order: number;
  created_at: string;
}

/** Lightweight shape returned by GET /api/portfolio/projects/ (list endpoint) */
export interface ProjectListItem {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  /** Absolute URL or null */
  featured_image: string | null;
  client_name: string;
  project_url: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  category: ProjectCategory | null;
  technologies: Technology[];
  tags: ProjectTag[];
  metrics: ProjectMetric[];
  created_at: string;
}

/** Full shape returned by GET /api/portfolio/projects/{slug}/ (detail endpoint) */
export interface ProjectDetail extends ProjectListItem {
  full_description: string;
  meta_title: string;
  meta_description: string;
  images: ProjectImage[];
  metrics: ProjectMetric[];
  updated_at: string;
}

export interface ProjectFormData {
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  client_name: string;
  project_url: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  category_id?: string;
  technology_ids?: string[];
  tag_ids?: string[];
  featured_image?: File | string | null;
  featured_media_id?: string | null;
}

// ─── Paginated list wrapper ───────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ─── API envelope ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
