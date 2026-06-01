const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8001/api';

// ─── Response Types ───────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors: Record<string, string[]>;
}

export type ApiResult<T> = ApiSuccess<T> | ApiError;

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  is_active: boolean;
  order: number;
  created_at: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  tag: string;
  description: string;
  key_metric: string;
  thumbnail: string | null;
  service: Service | null;
  client_name: string;
  project_url: string;
  is_featured: boolean;
  order: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string | null;
  category: Category | null;
  thumbnail: string | null;
  read_time: number;
  published_at: string | null;
  content?: string;
  status?: string;
  created_at?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string | null;
  order: number;
}

export interface PaginatedData<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ContactPayload {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

// ─── Fetch Wrapper ────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    const json = await res.json();
    return json as ApiResult<T>;
  } catch {
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      errors: {},
    };
  }
}

// ─── API Methods ──────────────────────────────────────────────────────────────

export const api = {
  services: {
    list: () => request<Service[]>('/services/'),
  },
  portfolio: {
    list: (params?: { featured?: boolean; tag?: string }) => {
      const qs = new URLSearchParams();
      if (params?.featured) qs.set('featured', 'true');
      if (params?.tag) qs.set('tag', params.tag);
      const query = qs.toString() ? `?${qs.toString()}` : '';
      return request<Project[]>(`/portfolio/${query}`);
    },
  },
  blog: {
    posts: (params?: { category?: string; page?: number; page_size?: number }) => {
      const qs = new URLSearchParams();
      if (params?.category) qs.set('category', params.category);
      if (params?.page) qs.set('page', String(params.page));
      if (params?.page_size) qs.set('page_size', String(params.page_size));
      const query = qs.toString() ? `?${qs.toString()}` : '';
      return request<PaginatedData<Post>>(`/blog/posts/${query}`);
    },
    post: (slug: string) => request<Post>(`/blog/posts/${slug}/`),
    categories: () => request<Category[]>('/blog/categories/'),
  },
  testimonials: {
    list: () => request<Testimonial[]>('/testimonials/'),
  },
  contacts: {
    submit: (payload: ContactPayload) =>
      request<null>('/contacts/inquiries/', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function formatReadTime(minutes: number): string {
  return minutes > 0 ? `${minutes} min` : '';
}
