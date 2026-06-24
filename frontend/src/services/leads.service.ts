// ─── leads.service.ts ─────────────────────────────────────────────────────────
// Reusable API methods for the Leads CRM endpoints.
// Base URL is read from VITE_API_BASE_URL environment variable.
// ─────────────────────────────────────────────────────────────────────────────
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api/leads`,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

export interface LeadSubmissionPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  project_type?: string;
  budget_range?: string;
  message: string;
  source?: string;
}

/**
 * POST /api/leads/contact/
 * Submits a lead request / contact inquiry to the backend.
 */
export async function submitLead(payload: LeadSubmissionPayload): Promise<any> {
  const { data } = await api.post('/contact/', payload);
  return data;
}
