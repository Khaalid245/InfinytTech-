// ─── blog.ts ──────────────────────────────────────────────────────────────────
// Strict TypeScript interfaces matching the Django Blog CMS API responses.
// Mirrors: apps/blog/serializers.py
// ─────────────────────────────────────────────────────────────────────────────

export interface BlogAuthor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  order: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  author: BlogAuthor | null;
  category: BlogCategory | null;
  tags: BlogTag[];
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  published_at: string | null;
  seo_title: string;
  seo_description: string;
  reading_time: number;
  created_at: string;
  updated_at: string;
}
