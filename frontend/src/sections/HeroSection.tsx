import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';
import { ArrowRight, Check } from 'lucide-react';
import { Image } from '../components/ui/Image';
import { useSiteSettings } from '../hooks/useSiteSettings';

// ─── Types ─────────────────────────────────────────────────────────────────
interface HeroSectionProps {
  theme: 'dark' | 'light';
}

interface FeaturedProject {
  id: string;
  tabLabel: string;
  title: string;
  metric: string;
  metricLabel: string;
  bullets: string[];
  stack: string[];
  imageUrl: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────
const PROJECTS: FeaturedProject[] = [
  {
    id: 'healthcare',
    tabLabel: 'Healthcare',
    title: 'Healthcare Management Platform',
    metric: '92%',
    metricLabel: 'Faster Patient Intake',
    bullets: ['Patient Records', 'Appointment Scheduling', 'Laboratory Integration', 'Analytics Dashboard'],
    stack: ['React', 'Django', 'PostgreSQL'],
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'real-estate',
    tabLabel: 'Real Estate',
    title: 'Real Estate Management System',
    metric: '$4M+',
    metricLabel: 'Volume Managed',
    bullets: ['Spatial Indexing Engine', 'Boundary Verification', 'Deal Flow Automation', 'Real-Time Valuation'],
    stack: ['Next.js', 'PostGIS', 'Node.js'],
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'ai-assistant',
    tabLabel: 'AI Assistant',
    title: 'AI Customer Support System',
    metric: '350%',
    metricLabel: 'Retention Growth',
    bullets: ['Dialect-Aware Translation', 'WebAssembly Neural Network', 'On-Device Voice Processing', 'Churn Analytics'],
    stack: ['Python', 'ONNX Runtime', 'React'],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'saas-dashboard',
    tabLabel: 'Enterprise SaaS',
    title: 'Enterprise SaaS Dashboard',
    metric: '$14M',
    metricLabel: 'Volume Settled',
    bullets: ['Microservices Architecture', 'Cross-Border Transfers', 'Distributed Saga Orchestration', 'Compliance Validation'],
    stack: ['Go', 'Kubernetes', 'gRPC'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
  },
];

const TRUST = [
  'Product Strategy',
  'Enterprise Engineering',
  'AI Solutions',
  'Long-Term Partnership',
];

// ─── Component ─────────────────────────────────────────────────────────────
export const HeroSection: React.FC<HeroSectionProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const advance = useCallback((next: number) => {
    setActive(next);
    setProgressKey(k => k + 1);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      advance((active + 1) % PROJECTS.length);
    }, 5000);
    return () => clearInterval(t);
  }, [paused, active, advance]);

  const proj = PROJECTS[active];

  // Design tokens
  const accent    = isDark ? '#D4A017' : '#B8860B';
  const accentHov = isDark ? '#E6B325' : '#7A5A08';
  const border    = isDark ? '#23262D' : '#E2E8F0';
  const surface   = isDark ? '#121417' : '#FFFFFF';
  const elevated  = isDark ? '#181B1F' : '#F8FAFC';
  const textSub   = isDark ? '#94A3B8' : '#475569';
  const textDim   = isDark ? '#64748B' : '#94A3B8';
  const textPri   = isDark ? '#F8FAFC' : '#0F172A';

  return (
    <section
      aria-label="Hero"
      className={cn(
        'relative w-full overflow-hidden',
        isDark ? 'bg-[#0B0D0F]' : 'bg-[#FAFAFA]'
      )}
      style={{ paddingTop: 'clamp(4rem, 10vw, 8rem)', paddingBottom: 'clamp(4rem, 10vw, 8rem)' }}
    >
      {/* Atmospheric glows */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full"
        style={{ background: accent, opacity: 0.022, filter: 'blur(160px)' }} />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
        style={{ background: accent, opacity: 0.015, filter: 'blur(130px)' }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 xl:gap-20 items-start">

          {/* ══════════════════════════════════════════════════════════
               LEFT — Messaging Column
          ══════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-7 max-w-2xl">

            {/* Badge */}
            <div className={cn('self-start opacity-0 translate-y-2 transition-all duration-600', mounted && 'opacity-100 translate-y-0 animate-fade-in-up delay-75')}>
              <span
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] border"
                style={{ borderColor: border, color: accent, background: isDark ? 'rgba(18,20,23,0.9)' : 'rgba(255,251,235,0.9)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
                Software Engineering For Growing Businesses
              </span>
            </div>

            {/* Headline */}
            <h1
              className={cn(
                'opacity-0 translate-y-3 transition-all duration-700 font-black tracking-tight',
                mounted && 'opacity-100 translate-y-0 animate-fade-in-up delay-150'
              )}
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.035em',
                color: textPri
              }}
            >
              {settings?.hero_title || 'Technology Built For Real Business Growth.'}
            </h1>

            {/* Sub-headline */}
            <p
              className={cn(
                'opacity-0 translate-y-3 transition-all duration-700 text-base sm:text-lg font-light leading-relaxed max-w-[520px]',
                mounted && 'opacity-100 translate-y-0 animate-fade-in-up delay-300'
              )}
              style={{ color: textSub }}
            >
              {settings?.hero_subtitle || 'We help startups and businesses design, build, and scale web platforms, mobile applications, AI solutions, and cloud systems.'}
            </p>

            {/* CTAs */}
            <div
              className={cn(
                'flex flex-wrap gap-3.5 items-center opacity-0 translate-y-3 transition-all duration-700',
                mounted && 'opacity-100 translate-y-0 animate-fade-in-up delay-500'
              )}
            >
              {/* Primary */}
              <Link
                to={settings?.hero_primary_button_url || '/contact'}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 active:scale-[0.97]"
                style={{
                  background: accent,
                  color: '#0B0D0F',
                  boxShadow: `0 8px 28px -6px ${accent}45`,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = accentHov; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = accent; }}
              >
                {settings?.hero_primary_button_text || 'Start Your Project'}
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>

              {/* Secondary */}
              <Link
                to={settings?.hero_secondary_button_url || '/work'}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide border transition-all duration-200 active:scale-[0.97]"
                style={{
                  background: surface,
                  color: textSub,
                  borderColor: border,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = isDark ? `${accent}40` : '#CBD5E1';
                  el.style.background = elevated;
                  el.style.color = textPri;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = border;
                  el.style.background = surface;
                  el.style.color = textSub;
                }}
              >
                {settings?.hero_secondary_button_text || 'View Case Studies'}
              </Link>
            </div>

            {/* Trust Indicators */}
            <div
              className={cn(
                'grid grid-cols-2 gap-x-8 gap-y-3.5 pt-7 border-t opacity-0 translate-y-3 transition-all duration-700',
                mounted && 'opacity-100 translate-y-0 animate-fade-in-up delay-500'
              )}
              style={{ borderColor: isDark ? 'rgba(35,38,45,0.6)' : 'rgba(226,232,240,0.9)' }}
            >
              {TRUST.map(label => (
                <div key={label} className="flex items-center gap-2.5">
                  <div
                    className="flex-none flex items-center justify-center w-5 h-5 rounded-full border"
                    style={{
                      background: isDark ? 'rgba(212,160,23,0.09)' : 'rgba(184,134,11,0.09)',
                      borderColor: isDark ? 'rgba(212,160,23,0.28)' : 'rgba(184,134,11,0.28)',
                    }}
                  >
                    <Check className="w-3 h-3" style={{ color: accent }} strokeWidth={3} />
                  </div>
                  <span className="text-xs sm:text-[13px] font-semibold" style={{ color: textSub }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════
               RIGHT — Featured Project Showcase
          ══════════════════════════════════════════════════════════ */}
          <div
            className={cn(
              'w-full lg:w-[400px] xl:w-[440px] flex flex-col gap-3 opacity-0 transition-all duration-700',
              mounted && 'opacity-100 animate-fade-in-right delay-700'
            )}
          >
            {/* Meta bar */}
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: textDim }}>
                Featured Case Studies
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: paused ? textDim : '#22C55E', opacity: paused ? 0.4 : 1 }}
                />
                <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: paused ? textDim : '#22C55E' }}>
                  {paused ? 'Paused' : 'Live'}
                </span>
              </div>
            </div>

            {/* Card */}
            <div
              className="relative rounded-2xl border overflow-hidden flex flex-col shadow-2xl transition-shadow duration-300"
              style={{
                borderColor: border,
                background: surface,
                boxShadow: isDark
                  ? '0 24px 64px -16px rgba(0,0,0,0.7), 0 4px 20px -4px rgba(0,0,0,0.4)'
                  : '0 24px 64px -16px rgba(15,23,42,0.12), 0 4px 20px -4px rgba(15,23,42,0.06)',
              }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Tab Row */}
              <div className="flex border-b" style={{ borderColor: border, background: elevated }}>
                {PROJECTS.map((p, i) => {
                  const isActive = active === i;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => advance(i)}
                      className="relative flex-1 py-3 px-1 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer"
                      style={{
                        borderBottomColor: isActive ? accent : 'transparent',
                        color: isActive ? textPri : textDim,
                        background: isActive ? surface : 'transparent',
                      }}
                    >
                      {p.tabLabel}
                    </button>
                  );
                })}
              </div>

              {/* Preview Image */}
              <div
                className="relative w-full overflow-hidden bg-slate-900"
                style={{ aspectRatio: '16/9' }}
              >
                <Image
                  key={proj.id}
                  src={proj.imageUrl}
                  alt={proj.title}
                  className="w-full h-full transition-opacity duration-500"
                  style={{ filter: 'brightness(0.78) contrast(1.08) saturate(0.9)' }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />
                {/* Metric badge floating on image */}
                <div className="absolute bottom-4 left-4">
                  <div
                    className="inline-flex flex-col px-3.5 py-2.5 rounded-xl backdrop-blur-md border"
                    style={{ background: 'rgba(0,0,0,0.55)', borderColor: 'rgba(255,255,255,0.12)' }}
                  >
                    <span className="text-2xl font-black text-white tracking-tight leading-none">{proj.metric}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{proj.metricLabel}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-4">
                {/* Eyebrow + Title */}
                <div>
                  <span
                    className="text-[9px] font-extrabold uppercase tracking-[0.22em] block mb-1.5"
                    style={{ color: accent }}
                  >
                    Featured Case Study
                  </span>
                  <h3
                    className="text-base font-bold tracking-tight leading-snug"
                    style={{ color: textPri }}
                  >
                    {proj.title}
                  </h3>
                </div>

                {/* Feature Bullets */}
                <ul className="space-y-2">
                  {proj.bullets.map(b => (
                    <li key={b} className="flex items-center gap-2.5 text-[12px] sm:text-xs" style={{ color: textSub }}>
                      <span className="w-1 h-1 rounded-full flex-none" style={{ background: accent }} />
                      {b}
                    </li>
                  ))}
                </ul>

                {/* Divider row: Stack + CTA */}
                <div
                  className="flex items-center justify-between gap-3 pt-4 border-t"
                  style={{ borderColor: border }}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {proj.stack.map(t => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border"
                        style={{ background: elevated, borderColor: border, color: textDim }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/work?project=${proj.id}`}
                    className="group/link flex-none inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-opacity duration-150 hover:opacity-70"
                    style={{ color: accent }}
                  >
                    View Case Study
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                  </Link>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-[3px]" style={{ background: isDark ? '#1E2228' : '#F1F5F9' }}>
                <div
                  key={`${progressKey}-${active}`}
                  className="h-full animate-hero-progress"
                  style={{ background: `linear-gradient(to right, ${accent}, ${accentHov})`, transformOrigin: 'left' }}
                />
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {PROJECTS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => advance(i)}
                  className="transition-all duration-300 rounded-full cursor-pointer"
                  style={{
                    width: active === i ? '20px' : '6px',
                    height: '6px',
                    background: active === i ? accent : textDim,
                    opacity: active === i ? 1 : 0.35,
                  }}
                  aria-label={`View project ${i + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={cn(
          'absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5',
          'opacity-0 transition-opacity duration-1000 z-20',
          mounted && 'opacity-100 delay-1000'
        )}
      >
        <div className="h-12 flex items-start justify-center overflow-hidden w-5">
          <svg className="w-3.5 h-9" viewBox="0 0 14 36" fill="none" stroke={textDim} strokeWidth={1.5}>
            <path className="animate-scroll-line" strokeLinecap="round" d="M7 0v28" />
            <path className="animate-scroll-chevron" strokeLinecap="round" strokeLinejoin="round" d="M1 22l6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
