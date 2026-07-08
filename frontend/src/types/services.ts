// ─── services.ts ──────────────────────────────────────────────────────────────
// TypeScript interfaces matching the Django Services CMS API responses.
// ─────────────────────────────────────────────────────────────────────────────

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceFeature {
  id: string;
  service_id: string;
  title: string;
  description: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  category: ServiceCategory | null;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  icon: string;
  featured_image: string | null;
  is_featured: boolean;
  benefits: string[];
  is_active: boolean;
  order: number;
  features: ServiceFeature[];
  industries: Industry[];
  faqs: FAQ[];
  created_at: string;
  updated_at: string;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ProcessStep {
  id: string;
  step_number: string;
  short_title: string;
  full_title: string;
  description: string;
  icon: string;
  duration: string;
  deliverables: string[];
  outcomes: string[];
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer_intro: string;
  answer_bullets: string[];
  answer_outro: string | null;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceFormData {
  category_id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  icon: string;
  featured_media_id: string | null;
  is_featured: boolean;
  benefits: string[];
  industry_ids: string[];
  faq_ids: string[];
  is_active: boolean;
  order: number;
}
