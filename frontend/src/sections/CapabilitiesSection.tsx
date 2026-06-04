import React, { useState } from 'react';
import { cn } from '../utils/cn';

// ─── Inline SVG icons (stroke-width = 2px) ───────────────────────────────
const Icon = {
  Layers: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3-10 5 10 5 10-5-10-5Z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </svg>
  ),
  BrainCircuit: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M9 13h6" />
      <path d="M12 10v6" />
    </svg>
  ),
  Palette: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12c0 2.2 1.8 4 4 4h.5c1.1 0 2 .9 2 2v.5c0 2.2 1.8 4 4 4z" />
      <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
      <circle cx="11.5" cy="7.5" r="1" fill="currentColor" />
      <circle cx="16.5" cy="9.5" r="1" fill="currentColor" />
    </svg>
  ),
  CloudCog: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 9 19h8.5a4.5 4.5 0 0 0 2.5-2.8" />
      <circle cx="12" cy="13" r="2" />
      <path d="M12 10v1M12 15v1M9.5 13h1M13.5 13h1" />
    </svg>
  ),
  Smartphone: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  Rocket: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5" />
      <path d="M12 2C12 2 3 7 3 12c0 2.5 1 4.5 2.5 6l6-6 6 6c1.5-1.5 2.5-3.5 2.5-6 0-5-9-10-9-10z" />
      <path d="M9 15l-3-3" />
      <path d="M15 15l3-3" />
    </svg>
  ),
};

// ─── Types ────────────────────────────────────────────────────────────────
interface Capability {
  id: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  description: string;
}

interface OurCapabilitiesSectionProps {
  theme: 'dark' | 'light';
}

// ─── Capability Card sub-component ────────────────────────────────────────
interface CardProps {
  cap: Capability;
  isDark: boolean;
  cardBg: string;
  border: string;
  primary: string;
  sub: string;
  dim: string;
}

const CapabilityCard: React.FC<CardProps> = ({
  cap, isDark, cardBg, border, primary, sub, dim,
}) => {
  const [hovered, setHovered] = useState(false);
  const IconComp = cap.icon;

  const hoverBg          = isDark ? '#1F1F1F' : '#F8FAFC';
  const hoverBorderColor = isDark ? 'rgba(234,179,8,0.30)' : 'rgba(202,138,4,0.30)';
  const hoverShadowColor = isDark ? 'rgba(234,179,8,0.08)' : 'rgba(202,138,4,0.06)';
  const hoverIconColor   = isDark ? '#EAB308' : '#CA8A04';
  const hoverIconBg      = isDark ? 'rgba(234,179,8,0.10)' : 'rgba(202,138,4,0.08)';

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group relative flex flex-col gap-5 rounded-2xl border p-6 transition-all duration-300 ease-in-out h-full justify-between',
        hovered ? '-translate-y-1' : 'translate-y-0'
      )}
      style={{
        background:  hovered ? hoverBg : cardBg,
        borderColor: hovered ? hoverBorderColor : border,
        boxShadow: hovered
          ? `0 12px 24px -6px ${hoverShadowColor}`
          : '0 2px 6px -2px rgba(0,0,0,0.03)',
      }}
    >
      <div className="space-y-4">
        {/* Header row with Icon + Title + Index */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 flex-shrink-0"
              style={{
                background:  hovered ? hoverIconBg : isDark ? '#0F0F10' : '#F8FAFC',
                borderColor: hovered ? hoverBorderColor : border,
              }}
            >
              <IconComp className="w-6 h-6 transition-colors duration-300" style={{ color: hovered ? hoverIconColor : dim } as React.CSSProperties} />
            </div>

            <h3
              className="text-base font-black tracking-tight leading-snug"
              style={{ color: primary }}
            >
              {cap.title}
            </h3>
          </div>

          <span 
            className="font-mono text-xs font-bold tracking-widest flex-shrink-0"
            style={{ color: hovered ? hoverIconColor : dim }}
          >
            {cap.id}
          </span>
        </div>

        {/* Description */}
        <p
          className="text-xs font-light leading-relaxed"
          style={{ color: sub }}
        >
          {cap.description}
        </p>
      </div>

      {/* SLA Progress Track footer */}
      <div 
        className="border-t pt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider transition-colors duration-300"
        style={{
          borderColor: border,
          color: hovered ? (isDark ? '#EAB308' : '#CA8A04') : dim
        }}
      >
        <span>Practice Core</span>
        <span>Enterprise SLA</span>
      </div>
    </article>
  );
};

// ─── Main section ─────────────────────────────────────────────────────────
export function OurCapabilitiesSection({ theme }: OurCapabilitiesSectionProps) {
  const isDark = theme === 'dark';

  const bg      = isDark ? '#0F0F10' : '#FAFAFA';
  const cardBg  = isDark ? '#171717' : '#FFFFFF';
  const border  = isDark ? '#2A2A2A' : '#E2E8F0';
  const accent  = isDark ? '#FACC15' : '#CA8A04';
  const primary = isDark ? '#FFFFFF' : '#0F172A';
  const sub     = isDark ? '#D4D4D4' : '#475569';
  const dim     = isDark ? '#6B7280' : '#94A3B8';

  const capabilities: Capability[] = [
    {
      id: '01',
      icon: Icon.Layers,
      title: 'Product Engineering',
      description:
        'Scalable web applications, SaaS platforms, enterprise systems, and modern digital products built for long-term growth.',
    },
    {
      id: '02',
      icon: Icon.BrainCircuit,
      title: 'AI & Intelligent Systems',
      description:
        'Machine learning solutions, workflow automation, intelligent assistants, and AI-powered product experiences.',
    },
    {
      id: '03',
      icon: Icon.Palette,
      title: 'Product Design',
      description:
        'User-centered design systems, research-driven experiences, and interfaces that balance usability with business objectives.',
    },
    {
      id: '04',
      icon: Icon.CloudCog,
      title: 'Cloud & Infrastructure',
      description:
        'Cloud-native architectures, deployment pipelines, infrastructure automation, and scalable environments.',
    },
    {
      id: '05',
      icon: Icon.Smartphone,
      title: 'Mobile Experiences',
      description:
        'Cross-platform and native mobile applications engineered for performance, reliability, and growth.',
    },
    {
      id: '06',
      icon: Icon.Rocket,
      title: 'Digital Transformation',
      description:
        'Helping organizations modernize processes, adopt new technologies, and create sustainable competitive advantages.',
    },
  ];

  return (
    <section 
      style={{ background: bg }}
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors duration-300"
      aria-label="Our Capabilities"
    >
      <div className="space-y-16">
        {/* Centered Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex justify-center">
            <span 
              className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border"
              style={{
                background:  isDark ? '#1F1F1F' : '#F1F5F9',
                borderColor: isDark ? '#2A2A2A' : '#E2E8F0',
                color:       accent,
              }}
            >
              Our Capabilities
            </span>
          </div>

          <h2
            className="text-3xl sm:text-4xl font-black leading-tight tracking-tight mt-2"
            style={{ color: primary }}
          >
            The Capabilities Behind Every Solution We Build
          </h2>

          <p
            className="text-base font-light leading-relaxed max-w-xl mx-auto mt-2"
            style={{ color: sub }}
          >
            We combine strategy, design, engineering, and emerging technologies to help organizations build, scale, and transform digital products.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <CapabilityCard
              key={cap.title}
              cap={cap}
              isDark={isDark}
              cardBg={cardBg}
              border={border}
              primary={primary}
              sub={sub}
              dim={dim}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export { OurCapabilitiesSection as CapabilitiesSection };
export default OurCapabilitiesSection;
