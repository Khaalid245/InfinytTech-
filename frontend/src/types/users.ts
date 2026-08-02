export type UserRole = 
  | 'super_admin'
  | 'admin'
  | 'content_manager'
  | 'sales'
  | 'hr'
  | 'editor'
  | 'viewer';

export interface UserActivity {
  id: string;
  action: 'login' | 'logout' | 'password_reset' | 'profile_update' | 'role_change' | 'status_change' | 'account_lock' | 'account_unlock';
  description: string;
  ip_address: string | null;
  user_agent: string;
  user_email?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  department: string | null;
  phone: string | null;
  avatar: string | null; // UUID
  avatar_details?: {
    id: string;
    url: string;
    title: string;
    alt_text: string;
  };
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  failed_login_attempts: number;
  locked_until: string | null;
  max_login_attempts: number;
}

export interface UserListResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  department: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  avatar_url: string | null;
  failed_login_attempts: number;
  locked_until: string | null;
}
