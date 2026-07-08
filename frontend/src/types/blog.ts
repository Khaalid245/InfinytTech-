// ─── blog.ts ──────────────────────────────────────────────────────────────────
// Strict TypeScript interfaces matching the Django Blog CMS API responses.
// Mirrors: apps/blog/serializers.py
// ─────────────────────────────────────────────────────────────────────────────

import type { MediaFile } from '../services/media.service';

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
  post_count?: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active?: boolean;
  usage_count?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  featured_media: MediaFile | null;
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

export interface AdminBlogFilters {
  search?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  page?: number;
  page_size?: number;
}

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string;
  tag_ids: string[];
  featured_media_id?: string | null;
  author_id?: string | null;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  seo_title?: string;
  seo_description?: string;
}

export interface BlogCategoryFormData {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  order: number;
}

export interface BlogTagFormData {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}
