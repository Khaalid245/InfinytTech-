import React, { useRef, useEffect } from 'react';
import { cn } from '../utils/cn';
import {
  Target,
  Users,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Handshake,
  Check,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Feature {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const LEFT_FEATURES: Feature[] = [
  {
    icon: Target,
    title: 'Business-First Strategy',
    description:
      'Every product decision is aligned with measurable business outcomes, ensuring technology delivers real value — not just functional code.',
  },
  {
    icon: Users,
    title: 'Dedicated Product Team',
    description:
      'Work directly with designers, engineers, and product specialists throughout every project phase — no account managers as intermediaries.',
  },
  {
    icon: MessageSquare,
    title: 'Transparent Collaboration',
    description:
      'Structured milestones, weekly updates, shared roadmaps, and clear communication from the first meeting to post-launch.',
  },
];

const RIGHT_FEATURES: Feature[] = [
  {
    icon: ShieldCheck,
    title: 'Quality Engineering',
    description:
      'Maintainable architecture, security-first development, and performance optimisation built into every release — not added as an afterthought.',
  },
  {
    icon: TrendingUp,
    title: 'Scalable Solutions',
    description:
      'We design systems that grow with your business without requiring expensive rebuilds or architectural overhauls as demand increases.',
  },
  {
    icon: Handshake,
    title: 'Long-Term Partnership',
    description:
      'Our relationship continues well beyond launch with active monitoring, optimisation, and strategic product evolution aligned to your roadmap.',
  },
];

const TRUST_ITEMS = [
  'Business-first delivery',
  'Enterprise engineering standards',
  'Transparent project management',
  'Long-term technical partnership',
];

// ─── Feature Row ───────────────────────────────────────────────────────────────

interface FeatureRowProps {
  feature: Feature;
  isDark: boolean;
  isLast: boolean;
  delay: number;
}

const FeatureRow: React.FC<FeatureRowProps> = ({ feature, isDark, isLast, delay }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const IconComponent = feature.icon;
  const gold = '#D4A017';

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const textPrimary   = isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]';
  const textSecondary = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const dividerColor  = isDark ? '#23262D'        : '#F1F5F9';
  const iconBg        = isDark ? 'rgba(212,160,23,0.08)' : 'rgba(184,134,11,0.08)';
  const iconBorder    = isDark ? 'rgba(212,160,23,0.20)' : 'rgba(184,134,11,0.20)';

  return (
    <div
      ref={rowRef}
      className={cn(
        'group flex items-start gap-5 py-8',
        !isLast && 'border-b',
      )}
      style={{ borderColor: dividerColor }}
    >
      {/* Icon container */}
      <div
        className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border',
          'motion-safe:transition-all motion-safe:duration-300',
          'group-hover:scale-110 group-hover:shadow-[0_0_18px_2px_rgba(212,160,23,0.12)]'
        )}
        style={{
          backgroundColor: iconBg,
          borderColor: iconBorder,
          color: gold,
        }}
        aria-hidden="true"
      >
        <IconComponent className="w-5 h-5" strokeWidth={1.75} />
      </div>

      {/* Text */}
      <div className="space-y-2 pt-0.5 flex-1 min-w-0">
        <h3
          className={cn(
            'text-[15px] sm:text-base font-semibold tracking-tight leading-snug',
            'motion-safe:transition-colors motion-safe:duration-200',
            textPrimary,
            'group-hover:' + (isDark ? 'text-white' : 'text-[#0F172A]')
          )}
          style={{ color: undefined }}
        >
          {feature.title}
        </h3>
        <p className={cn('text-sm font-light leading-[1.75]', textSecondary)}>
          {feature.description}
        </p>
      </div>
    </div>
  );
};

// ─── Section ───────────────────────────────────────────────────────────────────

interface WhyInfinytTechProps {
  theme: 'dark' | 'light';
}

export const WhyInfinytTechSection: React.FC<WhyInfinytTechProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const headerRef = useRef<HTMLDivElement>(null);

  const gold          = '#D4A017';
  const bg            = isDark ? 'bg-[#0B0D0F]'  : 'bg-[#F8FAFC]';
  const textPrimary   = isDark ? 'text-[#F8FAFC]'     : 'text-[#0F172A]';
  const textSecondary = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const cardBg        = isDark ? '#121417'        : '#FFFFFF';
  const cardBorder    = isDark ? '#23262D'        : '#E8EDF3';
  const trustBg       = isDark ? 'rgba(212,160,23,0.08)' : 'rgba(212,160,23,0.04)';
  const trustBorder   = isDark ? '#23262D'        : '#E8EDF3';

  // Fade-up the header block
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={cn('w-full py-28 lg:py-36 relative overflow-hidden transition-colors duration-300', bg)}
      aria-label="Why Choose InfinytTech"
    >
      {/* Decorative radial backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          background: `radial-gradient(ellipse 55% 40% at 50% 0%, ${gold} 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Top separator line */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${gold}18, transparent)` }}
        aria-hidden="true"
      />

      {/* ── Main container: 1280px ─────────────────────────────────────── */}
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div ref={headerRef} className="text-center space-y-6 max-w-2xl mx-auto">

          {/* Badge */}
          <span
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border"
            style={{
              color: gold,
              borderColor: isDark ? '#23262D' : '#E2E8F0',
              backgroundColor: isDark ? '#121417' : '#F8FAFC',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: gold }}
              aria-hidden="true"
            />
            Why InfinytTech
          </span>

          {/* Heading */}
          <h2 className={cn('text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight', textPrimary)}>
            Why Teams Choose<br className="hidden sm:block" />{' '}
            <span style={{ color: gold }}>InfinytTech</span>
          </h2>

          {/* Subtitle */}
          <p className={cn('text-base sm:text-[17px] font-light leading-[1.75]', textSecondary)}>
            We combine product strategy, modern engineering, and transparent collaboration to build
            digital products that scale with confidence and create measurable business value.
          </p>
        </div>

        {/* ── Proof stats bar ─────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-2xl border"
          style={{ borderColor: cardBorder }}
        >
          {[
            { value: '40+',   label: 'Products Launched' },
            { value: '98%',   label: 'On-Time Delivery' },
            { value: '5',     label: 'Countries Served' },
            { value: '3+ yr', label: 'Avg. Partnership Length' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-7 px-4 text-center"
              style={{ backgroundColor: cardBg, borderLeft: i > 0 ? `1px solid ${cardBorder}` : 'none' }}
            >
              <span
                className="text-2xl sm:text-3xl font-black tracking-tight leading-none"
                style={{ color: gold }}
              >
                {stat.value}
              </span>
              <span
                className={cn('text-[11px] font-medium tracking-wide mt-1.5 leading-snug', textSecondary)}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Two-column feature grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left column */}
          <div
            className="rounded-[24px] border overflow-hidden"
            style={{ backgroundColor: cardBg, borderColor: cardBorder }}
          >
            {/* Subtle inner header strip */}
            <div
              className="px-8 pt-8 pb-4 border-b"
              style={{ borderColor: cardBorder }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: isDark ? '#64748B' : '#CBD5E1' }}
              >
                Strategy &amp; Collaboration
              </span>
            </div>

            <div className="px-8">
              {LEFT_FEATURES.map((feature, idx) => (
                <FeatureRow
                  key={feature.title}
                  feature={feature}
                  isDark={isDark}
                  isLast={idx === LEFT_FEATURES.length - 1}
                  delay={idx * 80}
                />
              ))}
            </div>
          </div>

          {/* Right column */}
          <div
            className="rounded-[24px] border overflow-hidden"
            style={{ backgroundColor: cardBg, borderColor: cardBorder }}
          >
            {/* Subtle inner header strip */}
            <div
              className="px-8 pt-8 pb-4 border-b"
              style={{ borderColor: cardBorder }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: isDark ? '#64748B' : '#CBD5E1' }}
              >
                Engineering &amp; Longevity
              </span>
            </div>

            <div className="px-8">
              {RIGHT_FEATURES.map((feature, idx) => (
                <FeatureRow
                  key={feature.title}
                  feature={feature}
                  isDark={isDark}
                  isLast={idx === RIGHT_FEATURES.length - 1}
                  delay={idx * 80 + 60}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Trust bar ──────────────────────────────────────────────────── */}
        <div
          className="rounded-[20px] border px-6 sm:px-10 py-6"
          style={{ backgroundColor: trustBg, borderColor: trustBorder }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRUST_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-3">
                {/* Check badge */}
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isDark ? 'rgba(212,160,23,0.1)' : 'rgba(184,134,11,0.1)',
                    color: gold,
                  }}
                  aria-hidden="true"
                >
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span
                  className={cn('text-[13px] font-medium leading-snug tracking-tight', textPrimary)}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyInfinytTechSection;
