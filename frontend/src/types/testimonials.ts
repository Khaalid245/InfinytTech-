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
  testimonials_count?: number;
  is_active?: boolean;
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
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  published_at?: string;
  related_project?: any;
}

export interface TestimonialFilters {
  industry?: string;
  rating?: number;
  featured?: boolean;
  search?: string;
  ordering?: string;
}

export type AdminClientPayload = Omit<Partial<Client>, 'company_logo'> & {
  company_logo?: string | null;
};

export type AdminTestimonialPayload = Omit<Partial<Testimonial>, 'client' | 'author_photo' | 'related_project'> & {
  client: string; // ID of the client
  author_photo?: string | null;
  related_project_id?: string | null;
};
