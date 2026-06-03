import React, { useState } from 'react';
import { cn } from '../utils/cn';

// ─── Inline SVG icons (stroke-width 2, 24×24) ────────────────────────────
const Icons = {
  Check: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  Users: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Award: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  Cloud: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  ),
  Layers: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59" />
      <path d="m6.08 14.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59" />
    </svg>
  ),
  ArrowRight: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  ),
};

// ─── Types ────────────────────────────────────────────────────────────────
interface Differentiator {
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  stat: string;
  title: string;
  description: string;
}

interface WhyChooseUsProps {
  theme: 'dark' | 'light';
}

// ─── Static data ──────────────────────────────────────────────────────────
const DIFFERENTIATORS: Differentiator[] = [
  {
    icon: Icons.Users,
    stat: 'Business-First',
    title: 'Business-First Approach',
    description:
      'Every project begins with understanding your goals and users. We build technology that supports measurable business outcomes, not features alone.',
  },
  {
    icon: Icons.Award,
    stat: 'Product Ownership',
    title: 'True Product Ownership',
    description:
      'We act as an extension of your team — proactively identifying opportunities, mitigating risks, and ensuring every decision drives product success.',
  },
  {
    icon: Icons.Cloud,
    stat: 'Full Visibility',
    title: 'Transparent Communication',
    description:
      'Clear timelines, structured updates, and direct collaboration ensure complete visibility throughout the entire development process.',
  },
  {
    icon: Icons.Layers,
    stat: 'Quality Engineering',
    title: 'Quality Engineering',
    description:
      'Built with maintainability, security, performance, and scalability in mind — ensuring long-term reliability as your business grows.',
  },
  {
    icon: Icons.Users,
    stat: 'Modern Engineering',
    title: 'Modern Engineering Practices',
    description:
      "We leverage proven architectures and modern technologies to create products ready for today's and tomorrow's demands.",
  },
  {
    icon: Icons.Award,
    stat: 'Long-Term Support',
    title: 'Long-Term Partnership',
    description:
      'Our commitment does not end at launch. We provide ongoing support, optimisation, and strategic guidance as your product evolves.',
  },
];

// ─── Differentiator card ─────────────────────────────────────────────────
interface CardProps {
  item: Differentiator;
  isDark: boolean;
  accent: string;
  cardBg: string;
  border: string;
  primary: string;
  sub: string;
  dim: string;
  secondary?: boolean;
}

const DiffCard: React.FC<CardProps> = ({
  item, isDark, accent, cardBg, border, primary, sub, dim, secondary = false,
}) => {
  const [hovered, setHovered] = useState(false);
  const IconComp = item.icon;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group relative flex flex-col gap-4 rounded-2xl border p-6',
        'transition-all duration-300 ease-in-out',
        hovered ? '-translate-y-1' : 'translate-y-0'
      )}
      style={{
        background:  cardBg,
        borderColor: hovered
          ? isDark ? 'rgba(234,179,8,0.30)' : 'rgba(202,138,4,0.30)'
          : border,
        boxShadow: hovered
          ? `0 16px 40px -8px ${isDark ? 'rgba(234,179,8,0.08)' : 'rgba(202,138,4,0.06)'}`
          : '0 2px 8px -2px rgba(0,0,0,0.05)',
      }}
    >
      {/* Icon container */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 flex-shrink-0"
        style={{
          background:  hovered
            ? isDark ? 'rgba(234,179,8,0.10)' : 'rgba(202,138,4,0.08)'
            : isDark ? '#0F0F10' : '#F8FAFC',
          borderColor: hovered
            ? isDark ? 'rgba(234,179,8,0.30)' : 'rgba(202,138,4,0.30)'
            : border,
        }}
      >
        <IconComp className="w-5 h-5" style={{ color: hovered ? accent : dim } as React.CSSProperties} />
      </div>

      {/* Stat metric */}
      <span
        className="text-sm font-black font-mono tracking-tight transition-all duration-300"
        style={{
          color:     secondary ? dim : accent,
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          display:   'inline-block',
          textShadow: hovered && isDark && !secondary ? `0 0 20px rgba(234,179,8,0.30)` : undefined,
        }}
      >
        {item.stat}
      </span>

      {/* Title */}
      <h3
        className="text-base font-black tracking-tight leading-snug -mt-1"
        style={{ color: primary }}
      >
        {item.title}
      </h3>

      {/* Description */}
      <p
        className="text-sm leading-relaxed flex-grow"
        style={{ color: sub }}
      >
        {item.description}
      </p>

      {/* Arrow wayfinding */}
      <div className="flex items-center mt-1">
        <Icons.ArrowRight
          className="w-4 h-4 transition-all duration-300"
          style={{
            color:     accent,
            opacity:   hovered ? 1 : 0,
            transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          } as React.CSSProperties}
        />
      </div>
    </article>
  );
};

// ─── Main section ─────────────────────────────────────────────────────────
export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const bg      = isDark ? '#0F0F10' : '#FAFAFA';
  const cardBg  = isDark ? '#1F1F1F' : '#FFFFFF';
  const border  = isDark ? '#2A2A2A' : '#E2E8F0';
  const accent  = isDark ? '#FACC15' : '#CA8A04';
  const primary = isDark ? '#FFFFFF' : '#0F172A';
  const sub     = isDark ? '#D4D4D4' : '#475569';
  const dim     = isDark ? '#6B7280' : '#94A3B8';

  return (
    <section
      style={{ background: bg }}
      className="w-full py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      aria-label="Why Choose InfinytTech"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

        {/* ══════════════════════════════════════════════════════════════
            LEFT — Brand value prop + guarantee badge
        ══════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 flex flex-col gap-8">

          {/* Badge + headline + editorial */}
          <div className="flex flex-col gap-4">
            <span
              className="self-start px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border"
              style={{
                background:  isDark ? '#1F1F1F' : '#F1F5F9',
                borderColor: isDark ? '#2A2A2A' : '#E2E8F0',
                color:       accent,
              }}
            >
              Why InfinytTech
            </span>

            <h2
              className="text-3xl sm:text-4xl font-black leading-tight tracking-tight"
              style={{ color: primary }}
            >
              Built for Businesses<br />That Expect More
            </h2>

            <p
              className="text-base font-light leading-relaxed max-w-sm"
              style={{ color: sub }}
            >
              We combine strategic thinking, world-class engineering, and transparent
              collaboration to help organisations build digital products with confidence.
              Our focus is not simply delivering software — but creating solutions that
              generate long-term business value.
            </p>
          </div>

          {/* Clean Code Standards badge */}
          <div
            className="rounded-2xl border p-5 flex items-start gap-4"
            style={{
              background:  isDark ? '#0F0F10' : '#F0FDF4',
              borderColor: isDark ? 'rgba(34,197,94,0.25)' : 'rgba(34,197,94,0.35)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0"
              style={{
                background:  'rgba(34,197,94,0.10)',
                borderColor: 'rgba(34,197,94,0.30)',
              }}
            >
              <Icons.Check className="w-5 h-5" style={{ color: '#22C55E' } as React.CSSProperties} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-black tracking-tight" style={{ color: '#22C55E' }}>
                Clean Code Standards
              </span>
              <span className="text-xs font-light leading-relaxed" style={{ color: sub }}>
                Every solution follows maintainable architecture, code review processes, and quality assurance practices.
              </span>
            </div>
          </div>

          {/* Supporting trust metrics strip */}
          <div
            className="grid grid-cols-2 gap-3 pt-2"
          >
            {[
              { label: 'Scalable Solutions',   value: 'Grows with you' },
              { label: 'Transparent Delivery', value: 'Clear milestones' },
              { label: 'Global Standards',     value: 'Global Best Practices' },
              { label: 'Long-Term Support',    value: 'Long-Term Support' },
            ].map(m => (
              <div
                key={m.label}
                className="flex flex-col gap-0.5 p-3 rounded-xl border"
                style={{ borderColor: border, background: isDark ? '#171717' : '#FFFFFF' }}
              >
                <span
                  className="text-[10px] uppercase tracking-wider font-semibold"
                  style={{ color: dim }}
                >
                  {m.label}
                </span>
                <span
                  className="text-base font-black font-mono"
                  style={{ color: accent }}
                >
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            RIGHT — two visual tiers of differentiator cards
        ══════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 flex flex-col gap-4">

          {/* Primary row — 3 cards, full visual weight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {DIFFERENTIATORS.slice(0, 3).map(item => (
              <DiffCard
                key={item.title}
                item={item}
                isDark={isDark}
                accent={accent}
                cardBg={cardBg}
                border={border}
                primary={primary}
                sub={sub}
                dim={dim}
                secondary={false}
              />
            ))}
          </div>

          {/* Secondary row — 3 cards, slightly lighter emphasis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {DIFFERENTIATORS.slice(3).map(item => (
              <DiffCard
                key={item.title}
                item={item}
                isDark={isDark}
                accent={accent}
                cardBg={isDark ? '#171717' : '#F8FAFC'}
                border={border}
                primary={primary}
                sub={sub}
                dim={dim}
                secondary={true}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
