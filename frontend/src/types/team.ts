// ─── src/types/team.ts ────────────────────────────────────────────────────────
export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface TeamMemberPhoto {
  id: string;
  file: string;
  file_name: string;
  alt_text: string;
}

export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  slug: string;
  position: string;
  department: Department;
  photo: TeamMemberPhoto | null;
  short_bio: string;
  biography: string;
  email: string;
  phone: string;
  linkedin_url: string;
  github_url: string;
  website_url: string;
  skills: string[];
  years_of_experience: number | null;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
}
