import React, { useState, useMemo } from 'react';
import { cn } from '../utils/cn';
import { useServices } from '../hooks/useServices';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { 
  Layers, 
  BrainCircuit, 
  Palette, 
  CloudCog, 
  Smartphone, 
  Rocket, 
  Cpu, 
  Globe, 
  Code, 
  Sparkles, 
  Shield, 
  Zap, 
  Server, 
  Database,
  Workflow,
  type LucideIcon 
} from 'lucide-react';

// ─── Dynamic Icon Map ─────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  layers: Layers,
  product: Layers,
  brain: BrainCircuit,
  ai: BrainCircuit,
  palette: Palette,
  design: Palette,
  cloud: CloudCog,
  infrastructure: CloudCog,
  mobile: Smartphone,
  smartphone: Smartphone,
  rocket: Rocket,
  transformation: Rocket,
  cpu: Cpu,
  iot: Cpu,
  globe: Globe,
  code: Code,
  sparkles: Sparkles,
  shield: Shield,
  zap: Zap,
  server: Server,
  database: Database,
  workflow: Workflow,
};

function resolveIcon(iconName?: string, defaultIndex: number = 0): LucideIcon {
  if (iconName) {
    const key = iconName.toLowerCase().trim();
    if (ICON_MAP[key]) return ICON_MAP[key];
    const partialMatch = Object.keys(ICON_MAP).find(k => key.includes(k));
    if (partialMatch) return ICON_MAP[partialMatch];
  }
  const defaultList: LucideIcon[] = [Layers, BrainCircuit, Palette, CloudCog, Smartphone, Rocket];
  return defaultList[defaultIndex % defaultList.length];
}

// ─── Types ────────────────────────────────────────────────────────────────
interface CapabilityItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface OurCapabilitiesSectionProps {
  theme: 'dark' | 'light';
}

// ─── Default Capabilities Fallbacks ───────────────────────────────────────
const DEFAULT_CAPABILITIES: CapabilityItem[] = [
  {
    id: '01',
    icon: Layers,
    title: 'Product Engineering',
    description:
      'Scalable web applications, SaaS platforms, enterprise systems, and modern digital products built for long-term growth.',
  },
  {
    id: '02',
    icon: BrainCircuit,
    title: 'AI & Intelligent Systems',
    description:
      'Machine learning solutions, workflow automation, intelligent assistants, and AI-powered product experiences.',
  },
  {
    id: '03',
    icon: Palette,
    title: 'Product Design',
    description:
      'User-centered design systems, research-driven experiences, and interfaces that balance usability with business objectives.',
  },
  {
    id: '04',
    icon: CloudCog,
    title: 'Cloud & Infrastructure',
    description:
      'Cloud-native architectures, deployment pipelines, infrastructure automation, and scalable environments.',
  },
  {
    id: '05',
    icon: Smartphone,
    title: 'Mobile Experiences',
    description:
      'Cross-platform and native mobile applications engineered for performance, reliability, and growth.',
  },
  {
    id: '06',
    icon: Rocket,
    title: 'Digital Transformation',
    description:
      'Helping organizations modernize processes, adopt new technologies, and create sustainable competitive advantages.',
  },
];

// ─── Capability Card sub-component ────────────────────────────────────────
interface CardProps {
  cap: CapabilityItem;
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

  const hoverBg          = isDark ? '#181B1F' : '#F8FAFC';
  const hoverBorderColor = isDark ? 'rgba(212,160,23,0.30)' : 'rgba(184,134,11,0.30)';
  const hoverShadowColor = isDark ? 'rgba(212,160,23,0.08)' : 'rgba(184,134,11,0.06)';
  const hoverIconColor   = isDark ? '#E6B325' : '#B8860B';
  const hoverIconBg      = isDark ? 'rgba(212,160,23,0.10)' : 'rgba(184,134,11,0.08)';

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
                background:  hovered ? hoverIconBg : isDark ? '#0B0D0F' : '#F8FAFC',
                borderColor: hovered ? hoverBorderColor : border,
              }}
            >
              <IconComp className="w-5 h-5 transition-colors duration-300" style={{ color: hovered ? hoverIconColor : dim } as React.CSSProperties} />
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
          color: hovered ? (isDark ? '#E6B325' : '#B8860B') : dim
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
  const { data: servicesData } = useServices();
  const { data: settings } = useSiteSettings();

  const bg      = isDark ? '#0B0D0F' : '#FAFAFA';
  const cardBg  = isDark ? '#121417' : '#FFFFFF';
  const border  = isDark ? '#23262D' : '#E2E8F0';
  const accent  = isDark ? '#D4A017' : '#B8860B';
  const primary = isDark ? '#F8FAFC' : '#0F172A';
  const sub     = isDark ? '#94A3B8' : '#475569';
  const dim     = isDark ? '#64748B' : '#94A3B8';

  // Merge dynamic backend services with default cards to ensure 6 complete cards
  const capabilities: CapabilityItem[] = useMemo(() => {
    const dbServices = servicesData?.results || [];
    if (dbServices.length === 0) {
      return DEFAULT_CAPABILITIES;
    }

    const mappedFromDb: CapabilityItem[] = dbServices.map((svc, idx) => ({
      id: String(idx + 1).padStart(2, '0'),
      icon: resolveIcon(svc.icon || svc.slug || svc.title, idx),
      title: svc.title,
      description: svc.short_description || svc.description.replace(/<[^>]*>?/gm, '').slice(0, 130) + '...',
    }));

    if (mappedFromDb.length >= 6) {
      return mappedFromDb.slice(0, 6);
    }

    // Blend with defaults to maintain full 6-card grid
    const fillers = DEFAULT_CAPABILITIES.slice(mappedFromDb.length).map((def, fIdx) => ({
      ...def,
      id: String(mappedFromDb.length + fIdx + 1).padStart(2, '0'),
    }));

    return [...mappedFromDb, ...fillers];
  }, [servicesData]);

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
                background:  isDark ? '#181B1F' : '#F1F5F9',
                borderColor: isDark ? '#23262D' : '#E2E8F0',
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
            We combine strategy, design, engineering, and emerging technologies to help {settings?.company_name || 'organizations'} build, scale, and transform digital products.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <CapabilityCard
              key={cap.id + '-' + cap.title}
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
