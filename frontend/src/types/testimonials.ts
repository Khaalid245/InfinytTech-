export interface MediaFile {
  id: string;
  file: string;
  file_name: string;
  alt_text: string;
}

export interface Client {
  id: string;
  company_name: string;
  slug: string;
  industry: string;
  website?: string;
  company_logo?: MediaFile | null;
  country?: string;
  company_size?: string;
}

export interface Testimonial {
  id: string;
  client: Client;
  author_name: string;
  author_position: string;
  author_photo?: MediaFile | null;
  testimonial: string;
  rating: number;
  featured: boolean;
  published_at?: string;
}

export interface TestimonialFilters {
  industry?: string;
  rating?: number;
  featured?: boolean;
  search?: string;
  ordering?: string;
}
