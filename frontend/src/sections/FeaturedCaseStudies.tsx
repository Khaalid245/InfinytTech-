import React, { useState, useMemo, useEffect } from 'react';
import { cn } from '../utils/cn';

// ─── Types ─────────────────────────────────────────────────────────────────
interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  category: 'all' | 'ai' | 'saas' | 'web' | 'mobile';
  metric: string;
  challenge: string;
  architecture: string;
  outcome: string;
  stack: string[];
  accentIcon: string;
  imageUrl: string;
}

interface FeaturedCaseStudiesProps {
  theme: 'dark' | 'light';
}

// ─── Static data ─────────────────────────────────────────────────────────────
const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'dahab',
    title: 'Dahab Gateway System',
    industry: 'Global Remittance',
    category: 'saas',
    metric: '$14M Processed Vol',
    challenge:
      'Unifying fragmented country compliance rules, low-bandwidth nodes across remote African corridors, and peak-hour infrastructure strain that caused cascading settlement delays.',
    architecture:
      'Constructed an event-driven Go microservices pipeline powered by gRPC inter-service communication, utilising local Edge caching mechanisms and a distributed saga pattern for cross-border transaction orchestration.',
    outcome:
      'Secured transaction failure rate to <0.02% and achieved near-instantaneous compliance approvals across UK FCA and IGAD regulatory frameworks.',
    stack: ['Go', 'Kubernetes', 'gRPC', 'PostgreSQL', 'AWS Cloud'],
    accentIcon: '💳',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'somlearn',
    title: 'SomLearn AI Education Engine',
    industry: 'EdTech / E-Learning',
    category: 'ai',
    metric: '350% Retention Growth',
    challenge:
      'Adapting standardised technical educational materials to fit varying local Somali dialect variations and low internet connectivity levels across regional learning centres.',
    architecture:
      'Structured a bespoke offline-first AI translation model running directly on edge consumer mobile browsers via WebAssembly, with a voice synthesis layer trained on 40h of Af-Soomaali speech corpora.',
    outcome:
      'Empowered over 18,000 active concurrent regional software engineering students with voice-assisted instruction delivered natively in Somali dialects.',
    stack: ['Python', 'ONNX Runtime', 'WebAssembly', 'React', 'MongoDB'],
    accentIcon: '🧠',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'guri',
    title: 'Guri Portal',
    industry: 'Property / Real Estate',
    category: 'web',
    metric: '120k Monthly Active Users',
    challenge:
      'Addressing zero existing localised address database systems and highly unreliable mapping information across East African urban and peri-urban zones.',
    architecture:
      'Engineered a visual, user-driven interactive landmark mapping module inside high-speed Next.js interfaces, backed by PostGIS spatial indexing for sub-50ms proximity queries.',
    outcome:
      'Streamlined verified commercial land and residential deals across Mogadishu, Hargeisa, and Garowe, resulting in $4M+ in closed transactions within 8 months.',
    stack: ['Next.js', 'PostGIS', 'Node.js', 'TailwindCSS', 'Vercel'],
    accentIcon: '🏙️',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'kaal',
    title: 'Kaal Hospital Management App',
    industry: 'Healthcare Services',
    category: 'mobile',
    metric: '92% Faster Patient Intake',
    challenge:
      'Fragile paper-based records, lack of unified patient identity, and unreliable electrical grid setups at regional medical facilities serving 50,000+ patients annually.',
    architecture:
      'Configured secure Android-native offline SQLite storage with biometric synchronisation nodes that link to secondary Azure cloud nodes on connectivity restoration using a conflict-free replicated data type (CRDT) strategy.',
    outcome:
      'Secured 32,000+ encrypted digital patient health identity cards with fully offline medication inventory synchronisation across 14 regional clinics.',
    stack: ['Flutter', 'SQLite', 'NodeJS API', 'Docker Hub', 'Azure Security'],
    accentIcon: '🏥',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  },
];

const FILTERS = [
  { label: 'All Deployments',       value: 'all' },
  { label: 'AI & Machine Learning', value: 'ai' },
  { label: 'Enterprise SaaS',       value: 'saas' },
  { label: 'Web Platforms',         value: 'web' },
  { label: 'Mobile Architectures',  value: 'mobile' },
] as const;

// ─── Category accent colour map ───────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  ai:     '#8B5CF6',
  saas:   '#3B82F6',
  web:    '#10B981',
  mobile: '#F59E0B',
};

// ─── Main component ───────────────────────────────────────────────────────
export const FeaturedCaseStudies: React.FC<FeaturedCaseStudiesProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selected, setSelected]         = useState<CaseStudy | null>(null);
  const [visible, setVisible]           = useState(true);

  // ── colour shortcuts ──────────────────────────────────────────────────
  const bg      = isDark ? '#0F0F10' : '#FAFAFA';
  const cardBg  = isDark ? '#171717' : '#FFFFFF';
  const border  = isDark ? '#2A2A2A' : '#E2E8F0';
  const accent  = isDark ? '#FACC15' : '#CA8A04';
  const primary = isDark ? '#FFFFFF' : '#0F172A';
  const sub     = isDark ? '#D4D4D4' : '#475569';
  const dim     = isDark ? '#6B7280' : '#94A3B8';

  // ── filtered list with fade transition ──────────────────────────────
  const filtered = useMemo(
    () => activeFilter === 'all'
      ? CASE_STUDIES
      : CASE_STUDIES.filter(c => c.category === activeFilter),
    [activeFilter]
  );

  const handleFilter = (value: string) => {
    setVisible(false);
    setTimeout(() => {
      setActiveFilter(value);
      setVisible(true);
    }, 200);
  };

  // ── lock body scroll when modal open ────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  return (
    <>
      <section
        style={{ background: bg }}
        className="w-full py-24 px-4 sm:px-6 lg:px-8"
        aria-label="Featured Case Studies"
      >
        <div className="max-w-7xl mx-auto">

          {/* ── Section header ──────────────────────────────────────────── */}
          <div className="mb-16 text-center">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border mb-4"
              style={{ borderColor: border, color: accent, background: isDark ? '#171717' : '#FFFBEB' }}
            >
              Sovereign Case Studies
            </span>
            <h2
              className="text-3xl sm:text-4xl font-black mt-2 mb-4 tracking-tight"
              style={{ color: primary }}
            >
              Proven Deployments Across Global Frontiers
            </h2>
            <p
              className="text-lg font-light max-w-2xl mx-auto leading-relaxed"
              style={{ color: sub }}
            >
              Explore deep engineering post-mortems of actual products designed, coded,
              and deployed securely under InfinytTech's guidance.
            </p>
          </div>

          {/* ── Filter bar ──────────────────────────────────────────────── */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {FILTERS.map(f => {
              const isActive = activeFilter === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => handleFilter(f.value)}
                  className="px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 active:scale-95 cursor-pointer"
                  style={{
                    borderColor: isActive ? accent : border,
                    background:  isActive ? accent : cardBg,
                    color:       isActive ? (isDark ? '#0F0F10' : '#FFFFFF') : sub,
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* ── Case studies grid ───────────────────────────────────────── */}
          <div
            className={cn(
              'grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-300',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            )}
          >
            {filtered.map(cs => (
              <CaseStudyCard
                key={cs.id}
                cs={cs}
                isDark={isDark}
                accent={accent}
                cardBg={cardBg}
                border={border}
                primary={primary}
                sub={sub}
                dim={dim}
                onClick={() => setSelected(cs)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Deep-dive modal ─────────────────────────────────────────────── */}
      {selected && (
        <CaseStudyModal
          cs={selected}
          isDark={isDark}
          accent={accent}
          cardBg={cardBg}
          border={border}
          primary={primary}
          sub={sub}
          dim={dim}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
};

// ─── Card sub-component ───────────────────────────────────────────────────
interface CardProps {
  cs: CaseStudy;
  isDark: boolean;
  accent: string;
  cardBg: string;
  border: string;
  primary: string;
  sub: string;
  dim: string;
  onClick: () => void;
}

const CaseStudyCard: React.FC<CardProps> = ({
  cs, isDark, accent, cardBg, border, primary, sub, dim, onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  const catColor = CATEGORY_COLORS[cs.category] ?? accent;
  const hoverBorder = isDark ? `${accent}4D` : `${accent}4D`; // 30% opacity hex

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Open case study: ${cs.title}`}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative rounded-2xl border overflow-hidden cursor-pointer select-none',
        'transition-all duration-300',
        hovered ? '-translate-y-1' : 'translate-y-0'
      )}
      style={{
        background:   cardBg,
        borderColor:  hovered ? hoverBorder : border,
        boxShadow:    hovered
          ? `0 12px 40px -8px ${accent}20`
          : '0 2px 8px -2px rgba(0,0,0,0.08)',
      }}
    >
      {/* Top accent bar */}
      <div className="h-[3px] w-full" style={{ background: catColor }} />

      {/* Visual Mockup Header */}
      <div className="h-44 w-full overflow-hidden border-b relative" style={{ borderColor: border }}>
        <img 
          src={cs.imageUrl} 
          alt={cs.title} 
          className={cn(
            'w-full h-full object-cover transition-transform duration-500',
            hovered ? 'scale-105' : 'scale-100'
          )}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="p-6 md:p-8 flex flex-col gap-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            {/* Category pill */}
            <span
              className="inline-flex items-center self-start px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border"
              style={{ borderColor: `${catColor}40`, color: catColor, background: `${catColor}12` }}
            >
              {cs.industry}
            </span>
            <h3 className="text-xl font-black tracking-tight leading-snug" style={{ color: primary }}>
              {cs.title}
            </h3>
          </div>
          {/* Icon badge */}
          <span
            className="text-3xl w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border"
            style={{ background: isDark ? '#0F0F10' : '#F8FAFC', borderColor: border }}
          >
            {cs.accentIcon}
          </span>
        </div>

        {/* Impact metric */}
        <div
          className="rounded-xl px-4 py-3 border flex items-center gap-3"
          style={{ background: isDark ? '#0F0F10' : '#FFFBEB', borderColor: `${accent}30` }}
        >
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: dim }}
          >
            Impact
          </span>
          <span
            className="text-lg font-black font-mono tracking-tight"
            style={{ color: accent }}
          >
            {cs.metric}
          </span>
        </div>

        {/* Challenge excerpt */}
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: sub }}>
          {cs.challenge}
        </p>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-1.5">
          {cs.stack.map(tech => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-[10px] font-semibold border"
              style={{ borderColor: border, color: dim, background: isDark ? '#0F0F10' : '#F8FAFC' }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* CTA row */}
        <div className="flex items-center gap-1.5 mt-auto pt-1">
          <span
            className="text-sm font-bold transition-colors duration-200"
            style={{ color: hovered ? accent : sub }}
          >
            Read Analysis
          </span>
          <svg
            className="w-4 h-4 transition-transform duration-200"
            style={{
              color:     hovered ? accent : sub,
              transform: hovered ? 'translateX(2px)' : 'translateX(0)',
            }}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </article>
  );
};

// ─── Modal sub-component ──────────────────────────────────────────────────
interface ModalProps {
  cs: CaseStudy;
  isDark: boolean;
  accent: string;
  cardBg: string;
  border: string;
  primary: string;
  sub: string;
  dim: string;
  onClose: () => void;
}

const CaseStudyModal: React.FC<ModalProps> = ({
  cs, isDark, accent, cardBg, border, primary, sub, dim, onClose,
}) => {
  const catColor = CATEGORY_COLORS[cs.category] ?? accent;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`Case study: ${cs.title}`}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl"
        style={{ background: cardBg, borderColor: border }}
      >
        {/* Accent bar */}
        <div className="h-[3px] w-full rounded-t-2xl" style={{ background: catColor }} />

        {/* Visual Banner Image */}
        <div className="h-56 w-full overflow-hidden border-b relative" style={{ borderColor: border }}>
          <img 
            src={cs.imageUrl} 
            alt={cs.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* ── Modal header ────────────────────────────────────────────── */}
        <div
          className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b"
          style={{ background: cardBg, borderColor: border }}
        >
          <div className="flex flex-col gap-1.5">
            <span
              className="inline-flex items-center self-start px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border"
              style={{ borderColor: `${catColor}40`, color: catColor, background: `${catColor}12` }}
            >
              {cs.industry}
            </span>
            <h2 className="text-2xl font-black tracking-tight leading-snug" style={{ color: primary }}>
              {cs.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="mt-1 w-9 h-9 flex items-center justify-center rounded-full border flex-shrink-0 transition-all duration-150 active:scale-95 cursor-pointer"
            style={{ borderColor: border, color: sub }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = accent)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-7">

          {/* ── Impact banner ─────────────────────────────────────────── */}
          <div
            className="rounded-xl p-5 border text-center"
            style={{ background: isDark ? '#0F0F10' : '#FFFBEB', borderColor: `${accent}30` }}
          >
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: dim }}>
              Measured Impact
            </p>
            <p
              className="text-4xl font-black font-mono tracking-tight"
              style={{ color: accent }}
            >
              {cs.metric}
            </p>
          </div>

          {/* ── Narrative sections ────────────────────────────────────── */}
          {(
            [
              { num: '01', label: 'Operational Challenge',           body: cs.challenge },
              { num: '02', label: 'Architectural Execution Strategy', body: cs.architecture },
              { num: '03', label: 'Technical Results Achieved',       body: cs.outcome },
            ] as const
          ).map(({ num, label, body }) => (
            <div key={num} className="flex gap-4">
              <span
                className="text-xs font-black font-mono mt-0.5 flex-shrink-0 w-6"
                style={{ color: accent }}
              >
                {num}
              </span>
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: dim }}
                >
                  {label}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: sub }}>
                  {body}
                </p>
              </div>
            </div>
          ))}

          {/* ── Tech stack pills ─────────────────────────────────────── */}
          <div
            className="rounded-xl p-4 border"
            style={{ background: isDark ? '#0F0F10' : '#F8FAFC', borderColor: border }}
          >
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: dim }}>
              Technology Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {cs.stack.map(tech => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border"
                  style={{ borderColor: `${accent}40`, color: accent, background: `${accent}10` }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* ── Footer close button ──────────────────────────────────── */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-bold border transition-all duration-200 active:scale-95 cursor-pointer"
            style={{ borderColor: border, color: sub, background: isDark ? '#1F1F1F' : '#F8FAFC' }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.color = accent;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = border;
              e.currentTarget.style.color = sub;
            }}
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCaseStudies;
