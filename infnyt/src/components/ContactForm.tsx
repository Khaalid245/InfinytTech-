'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

type Field = 'name' | 'email' | 'company' | 'service' | 'message';

const SERVICES = [
  'Software Development',
  'Product Design',
  'AI & Automation',
  'Infrastructure & DevOps',
  'Other',
];

const INPUT = 'px-4 py-2.5 border border-white/[0.07] bg-[rgba(0,20,26,0.5)] text-[13.5px] text-white placeholder:text-white/30 focus:outline-none focus:border-[rgba(225,255,81,0.30)] focus:ring-1 focus:ring-[rgba(225,255,81,0.08)] transition-colors w-full';
const LABEL = 'text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40';
const REQUIRED: React.CSSProperties = { color: '#e1ff51' };

export default function ContactForm() {
  const [fields, setFields] = useState<Record<Field, string>>({
    name: '', email: '', company: '', service: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function set(f: Field) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFields((prev) => ({ ...prev, [f]: e.target.value }));
      // Clear field error on change
      if (fieldErrors[f]) setFieldErrors((prev) => { const n = { ...prev }; delete n[f]; return n; });
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setServerError('');
    setFieldErrors({});

    const res = await api.contacts.submit(fields);

    if (res.success) {
      setSubmitted(true);
    } else {
      // Map backend field errors to frontend field names
      const mapped: Record<string, string> = {};
      if (res.errors.full_name) mapped.name = res.errors.full_name[0];
      if (res.errors.name) mapped.name = res.errors.name[0];
      if (res.errors.email) mapped.email = res.errors.email[0];
      if (res.errors.message) mapped.message = res.errors.message[0];
      setFieldErrors(mapped);
      setServerError(res.message || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-12 h-12 flex items-center justify-center text-lg font-bold" style={{ background: 'rgba(225,255,81,0.10)', border: '1px solid rgba(225,255,81,0.25)', color: '#e1ff51' }}>✓</div>
        <h3 className="text-[20px] font-bold text-white tracking-[-0.01em]">Message sent.</h3>
        <p className="text-[14px] text-white/50 max-w-85 leading-[1.65]">We&rsquo;ll get back to you within one business day.</p>
        <button
          onClick={() => { setSubmitted(false); setFields({ name: '', email: '', company: '', service: '', message: '' }); }}
          className="mt-1 text-[13px] font-semibold transition-opacity duration-200 hover:opacity-70"
          style={{ color: '#e1ff51' }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {serverError && !Object.keys(fieldErrors).length && (
        <div className="px-4 py-3 text-[13px]" style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.20)', color: 'rgba(255,120,120,0.90)' }}>
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="flex flex-col gap-2">
          <span className={LABEL}>Full name <span style={REQUIRED}>*</span></span>
          <input required type="text" placeholder="Jane Smith" value={fields.name} onChange={set('name')} className={INPUT} disabled={loading} />
          {fieldErrors.name && <span className="text-[11px]" style={{ color: 'rgba(255,120,120,0.90)' }}>{fieldErrors.name}</span>}
        </label>
        <label className="flex flex-col gap-2">
          <span className={LABEL}>Work email <span style={REQUIRED}>*</span></span>
          <input required type="email" placeholder="jane@company.com" value={fields.email} onChange={set('email')} className={INPUT} disabled={loading} />
          {fieldErrors.email && <span className="text-[11px]" style={{ color: 'rgba(255,120,120,0.90)' }}>{fieldErrors.email}</span>}
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="flex flex-col gap-2">
          <span className={LABEL}>Company</span>
          <input type="text" placeholder="Acme Inc." value={fields.company} onChange={set('company')} className={INPUT} disabled={loading} />
        </label>
        <label className="flex flex-col gap-2">
          <span className={LABEL}>Area of interest</span>
          <select value={fields.service} onChange={set('service')} className={`${INPUT} scheme-dark`} disabled={loading}>
            <option value="">Select a service…</option>
            {SERVICES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className={LABEL}>Tell us about your project <span style={REQUIRED}>*</span></span>
        <textarea required rows={5} placeholder="Describe what you're building, where you're stuck, or what outcome you're aiming for…" value={fields.message} onChange={set('message')} className={`${INPUT} resize-none leading-[1.65]`} disabled={loading} />
        {fieldErrors.message && <span className="text-[11px]" style={{ color: 'rgba(255,120,120,0.90)' }}>{fieldErrors.message}</span>}
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-1 inline-flex items-center justify-center gap-2.5 self-start px-6 py-2.5 text-[14px] font-bold tracking-[-0.01em] transition-all duration-200 hover:-translate-y-px hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        style={{ background: '#e1ff51', color: '#000000', boxShadow: '0 8px 24px rgba(225,255,81,0.18), 0 2px 6px rgba(0,0,0,0.35)' }}
      >
        {loading ? 'Sending…' : 'Send message'}
        {!loading && <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />}
      </button>
    </form>
  );
}
