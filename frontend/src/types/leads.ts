
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';
export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface LeadTimelineEvent {
  id: string;
  action: string;
  description: string;
  created_by_name: string;
  created_at: string;
}

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  company: string;
  industry: string;
  website: string;
  company_size: string;
  country: string;
  project_type: string;
  budget_range: string;
  message: string;
  source: string;
  status: LeadStatus;
  priority: LeadPriority;
  assigned_to: string | null;
  assigned_to_email: string | null;
  assigned_to_name: string | null;
  services: string[]; // UUIDs of services
  notes: string;
  timeline: LeadTimelineEvent[];
  created_at: string;
  updated_at: string;
}

export interface LeadAnalytics {
  kpis: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    proposals: number;
    won: number;
    lost: number;
    conversion_rate: number;
  };
  sources: { source: string; count: number }[];
  monthly: { month: string; leads: number }[];
  funnel: { name: string; value: number }[];
}

export interface LeadListResponse {
  success: boolean;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Lead[];
  };
}

export interface LeadAnalyticsResponse {
  success: boolean;
  data: LeadAnalytics;
}
