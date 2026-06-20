import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../utils/cn';
import { CASE_STUDIES } from '../data/portfolioData';
import type { CaseStudy } from '../data/portfolioData';

interface FeaturedCaseStudiesProps {
  theme: 'dark' | 'light';
}

const FILTERS = [
  { label: 'All Projects',          value: 'all' },
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [visible, setVisible]           = useState(true);

  const projectParam = searchParams.get('project');

  const selected = useMemo(() => {
    if (!projectParam) return null;
    return CASE_STUDIES.find(c => c.id === projectParam) || null;
  }, [projectParam]);

  const setSelected = (cs: CaseStudy | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (cs) {
      newParams.set('project', cs.id);
    } else {
      newParams.delete('project');
    }
    setSearchParams(newParams, { replace: true, preventScrollReset: true });
  };

  const bg      = isDark ? '#0B0D0F' : '#FAFAFA';
  const cardBg  = isDark ? '#121417' : '#FFFFFF';
  const border  = isDark ? '#23262D' : '#E2E8F0';
  const accent  = isDark ? '#D4A017' : '#B8860B';
  const primary = isDark ? '#F8FAFC' : '#0F172A';
  const sub     = isDark ? '#94A3B8' : '#475569';
  const dim     = isDark ? '#64748B' : '#94A3B8';

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

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  return (
    <>
      <section
        style={{ background: bg }}
        className="w-full py-24 px-4 sm:px-6 lg:px-8"
        aria-label="Featured Projects"
      >
        <div className="max-w-7xl mx-auto">

          {/* ── Section header ──────────────────────────────────────────── */}
          <div className="mb-16 text-center">
            <span
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border mb-4"
              style={{ borderColor: border, color: accent, background: isDark ? '#121417' : '#FFFBEB' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
              FEATURED PROJECTS
            </span>
            <h2
              className="text-4xl sm:text-5xl font-black mt-2 mb-4 tracking-tight leading-[1.1]"
              style={{ color: primary }}
            >
              Solutions Designed<br className="hidden sm:inline" />
              To Solve Real Problems.
            </h2>
            <p
              className="text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed"
              style={{ color: sub }}
            >
              A selection of products and platforms built to improve operations, customer experiences, and business growth.
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
                    color:       isActive ? (isDark ? '#0B0D0F' : '#FFFFFF') : sub,
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
  const hoverBorder = isDark ? `${accent}4D` : `${accent}4D`;

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
        'relative rounded-2xl border overflow-hidden cursor-pointer select-none flex flex-col',
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
      <div className="h-48 w-full overflow-hidden border-b relative flex-shrink-0" style={{ borderColor: border }}>
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

      <div className="p-6 md:p-8 flex flex-col flex-grow gap-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5 text-left">
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
            style={{ background: isDark ? '#0B0D0F' : '#F8FAFC', borderColor: border }}
          >
            {cs.accentIcon}
          </span>
        </div>

        {/* Impact metric */}
        <div
          className="rounded-xl px-4 py-3 border flex items-center gap-3"
          style={{ background: isDark ? '#0B0D0F' : '#FFFBEB', borderColor: `${accent}30` }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: dim }}
          >
            Impact
          </span>
          <span
            className="text-base font-black font-mono tracking-tight"
            style={{ color: accent }}
          >
            {cs.metric}
          </span>
        </div>

        {/* Challenge & Solution details */}
        <div className="space-y-4 my-2 text-left">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase font-bold tracking-wider" style={{ color: dim }}>
              Business Challenge
            </span>
            <p className="text-sm font-light leading-relaxed" style={{ color: sub }}>
              {cs.challenge}
            </p>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase font-bold tracking-wider" style={{ color: dim }}>
              Solution Delivered
            </span>
            <p className="text-sm font-light leading-relaxed" style={{ color: sub }}>
              {cs.architecture}
            </p>
          </div>
        </div>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {cs.stack.map(tech => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-[10px] font-semibold border"
              style={{ borderColor: border, color: dim, background: isDark ? '#0B0D0F' : '#F8FAFC' }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* CTA row */}
        <div className="flex items-center gap-1.5 pt-4 border-t" style={{ borderColor: border }}>
          <span
            className="text-sm font-bold transition-colors duration-200"
            style={{ color: hovered ? accent : sub }}
          >
            View Case Study &rarr;
          </span>
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
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  // Accessibility keyboard focus trap & escape handler
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    modal.focus();

    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = modal.querySelectorAll<HTMLElement>(focusableSelector);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        if (e.shiftKey) { // Tab back (Shift+Tab)
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else { // Tab forward (Tab)
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

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
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl outline-none"
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
          <div className="flex flex-col gap-1.5 text-left">
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
            style={{ background: isDark ? '#0B0D0F' : '#FFFBEB', borderColor: `${accent}30` }}
          >
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: dim }}>
              Measured Business Impact
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
              { num: '01', label: 'Business Challenge',           body: cs.challenge },
              { num: '02', label: 'Solution Delivered',            body: cs.architecture },
              { num: '03', label: 'Technical Outcome & Metrics',   body: cs.outcome },
            ] as const
          ).map(({ num, label, body }) => (
            <div key={num} className="flex gap-4 text-left">
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
            className="rounded-xl p-4 border text-left"
            style={{ background: isDark ? '#0B0D0F' : '#F8FAFC', borderColor: border }}
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

          {/* ── Footer actions ───────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                navigate('/contact');
              }}
              className={cn(
                'flex-grow py-3 px-6 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 cursor-pointer border-none',
                isDark ? 'text-[#0B0D0F] bg-[#D4A017] hover:bg-[#E6B325]' : 'text-white bg-[#B8860B] hover:bg-[#A0780A]'
              )}
            >
              Discuss a Similar Project &rarr;
            </button>
            <button
              onClick={onClose}
              className="py-3 px-6 rounded-xl text-sm font-bold border transition-all duration-200 active:scale-95 cursor-pointer"
              style={{ borderColor: border, color: sub, background: isDark ? '#181B1F' : '#F8FAFC' }}
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
    </div>
  );
};

export default FeaturedCaseStudies;
