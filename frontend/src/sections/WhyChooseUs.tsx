import React, { useState } from 'react';
import { cn } from '../utils/cn';
import { 
  Target, 
  BadgeCheck, 
  ShieldCheck, 
  Handshake, 
  MessageSquare, 
  Globe, 
  type LucideIcon 
} from 'lucide-react';


// ─── Types ────────────────────────────────────────────────────────────────
interface Differentiator {
  icon: LucideIcon;
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
    icon: Target,
    stat: 'Business-First',
    title: 'Business-First Thinking',
    description:
      'Every technical decision is evaluated against business goals, helping organizations invest in technology that creates measurable value.',
  },
  {
    icon: BadgeCheck,
    stat: 'Product Ownership',
    title: 'Product Ownership',
    description:
      'We go beyond implementation by identifying risks, uncovering opportunities, and helping shape stronger product decisions.',
  },
  {
    icon: MessageSquare,
    stat: 'Transparency',
    title: 'Transparent Communication',
    description:
      'Clear milestones, regular updates, and open collaboration ensure complete visibility throughout the engagement.',
  },
  {
    icon: ShieldCheck,
    stat: 'Quality Engineering',
    title: 'Quality Engineering',
    description:
      'Built with maintainability, performance, security, and scalability to support long-term business growth.',
  },
  {
    icon: Handshake,
    stat: 'Partnership',
    title: 'Long-Term Partnership',
    description:
      'Our relationship continues after launch through optimization, support, and strategic guidance as products evolve.',
  },
  {
    icon: Globe,
    stat: 'Standards',
    title: 'Global Standards',
    description:
      'We apply internationally recognized engineering practices and delivery standards to every project we undertake.',
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
  item, isDark, cardBg, border, primary, sub, dim,
}) => {
  const [hovered, setHovered] = useState(false);
  const IconComp = item.icon;

  const hoverBorderColor = isDark ? 'rgba(212,160,23,0.35)' : 'rgba(184,134,11,0.35)';
  const hoverShadowColor = isDark ? 'rgba(212,160,23,0.08)' : 'rgba(184,134,11,0.06)';
  const hoverIconColor   = isDark ? '#E6B325' : '#B8860B';
  const hoverIconBg      = isDark ? 'rgba(212,160,23,0.10)' : 'rgba(184,134,11,0.08)';

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group relative flex flex-col gap-3 rounded-2xl border p-5',
        'transition-all duration-300 ease-in-out h-full min-h-[140px]',
        hovered ? '-translate-y-1' : 'translate-y-0'
      )}
      style={{
        background:  cardBg,
        borderColor: hovered ? hoverBorderColor : border,
        boxShadow: hovered
          ? `0 12px 24px -6px ${hoverShadowColor}`
          : '0 2px 6px -2px rgba(0,0,0,0.03)',
      }}
    >
      {/* Inline Icon + Title */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 flex-shrink-0"
          style={{
            background:  hovered ? hoverIconBg : isDark ? '#0B0D0F' : '#F8FAFC',
            borderColor: hovered ? hoverBorderColor : border,
          }}
        >
          <IconComp className="w-4.5 h-4.5" style={{ color: hovered ? hoverIconColor : dim } as React.CSSProperties} />
        </div>

        <h3
          className="text-base font-black tracking-tight leading-snug"
          style={{ color: primary }}
        >
          {item.title}
        </h3>
      </div>

      {/* Description */}
      <p
        className="text-xs font-light leading-relaxed"
        style={{ color: sub }}
      >
        {item.description}
      </p>
    </article>
  );
};

// ─── Main section ─────────────────────────────────────────────────────────
export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const bg      = isDark ? '#0B0D0F' : '#FAFAFA';
  const cardBg  = isDark ? '#181B1F' : '#FFFFFF';
  const border  = isDark ? '#23262D' : '#E2E8F0';
  const accent  = isDark ? '#D4A017' : '#B8860B';
  const primary = isDark ? '#F8FAFC' : '#0F172A';
  const sub     = isDark ? '#94A3B8' : '#475569';
  const dim     = isDark ? '#64748B' : '#94A3B8';

  return (
    <section
      style={{ background: bg }}
      className="w-full py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      aria-label="Why Choose InfinytTech"
    >
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Centered Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex justify-center">
            <span
              className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border"
              style={{
                background:  isDark ? '#181B1F' : '#F1F5F9',
                borderColor: isDark ? '#23262D' : '#E2E8F0',
                color:       accent,
              }}
            >
              Why InfinytTech
            </span>
          </div>

          <h2
            className="text-3xl sm:text-4xl font-black leading-tight tracking-tight mt-2"
            style={{ color: primary }}
          >
            What Makes Us Different
          </h2>
        </div>

        {/* Centered 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {DIFFERENTIATORS.map(item => (
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
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
