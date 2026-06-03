import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { cn } from '../utils/cn';

// ─── Inline SVG icons (stroke-width 2, 24×24 viewBox) ────────────────────
const Icons = {
  Cpu: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
    </svg>
  ),
  Cloud: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  ),
  Code: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Smartphone: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  ),
  Layout: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  ),
  Globe: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

// ─── Types ────────────────────────────────────────────────────────────────
interface Capability {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  deliverables: string[];
}

interface CapabilitiesSectionProps {
  theme: 'dark' | 'light';
  tagline?: string;
  title?: string;
  subtitle?: string;
}

// ─── Business Offerings static data (No redundant dev stacks) ──────────────
const CAPABILITIES: Capability[] = [
  {
    icon: Icons.Cpu,
    title: 'AI & Machine Learning Solutions',
    description:
      'Deploy proprietary LLM integrations, autonomous service agents, business optimisation nodes, and dynamic predictive tools.',
    deliverables: ['Proprietary LLMs', 'AI Agent Workflows', 'Predictive Analysis'],
  },
  {
    icon: Icons.Cloud,
    title: 'SaaS & Cloud System Architecture',
    description:
      'Construct highly available, reliable platforms using AWS, Kubernetes, Terraform, and Docker configurations.',
    deliverables: ['High-Availability Infra', 'Multi-Tenant Systems', 'CI/CD Pipelines'],
  },
  {
    icon: Icons.Code,
    title: 'Enterprise Web Engineering',
    description:
      'Deliver blisteringly fast dashboards, database systems, dynamic content architectures, and CMS platforms built to convert.',
    deliverables: ['Performance Dashboards', 'Transactional DBs', 'SEO-Optimized Web Apps'],
  },
  {
    icon: Icons.Smartphone,
    title: 'Cross-Platform Mobile Apps',
    description:
      'Create immersive applications for iOS and Android with premium user experiences, robust offline capabilities, and optimised performance.',
    deliverables: ['iOS & Android Apps', 'Offline Sync Systems', 'Native User Experience'],
  },
  {
    icon: Icons.Layout,
    title: 'Futuristic UI/UX Design System',
    description:
      'Establish high-fidelity designs, rapid functional interactive mockups, brand kits, and modular, clean layout tokens.',
    deliverables: ['Interactive Mockups', 'Custom UI Libraries', 'Design System Tokens'],
  },
  {
    icon: Icons.Globe,
    title: 'Global Branding & Product Strategy',
    description:
      'Refine value propositions, identity kits, global expansion guidelines, and structural design blueprints for your software.',
    deliverables: ['Market Positioning', 'Brand Identity Kits', 'Go-To-Market Plans'],
  },
];

// ─── Card sub-component ───────────────────────────────────────────────────
interface CardProps {
  cap: Capability;
  isDark: boolean;
  cardBg: string;
  border: string;
  primary: string;
  sub: string;
  index: number;
}

const CapabilityCard: React.FC<CardProps> = ({
  cap, isDark, cardBg, border, primary, sub, index,
}) => {
  const [hovered, setHovered] = useState(false);
  const IconComp = cap.icon;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group flex flex-col gap-5 rounded-2xl border p-6 md:p-7',
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
          : '0 2px 8px -2px rgba(0,0,0,0.06)',
        transitionDelay: `${index * 60}ms`,
      }}
    >
      {/* Icon container */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-300 flex-shrink-0"
        style={{
          background:  hovered
            ? isDark ? 'rgba(234,179,8,0.10)' : 'rgba(202,138,4,0.08)'
            : isDark ? '#0F0F10' : '#F8FAFC',
          borderColor: hovered
            ? isDark ? 'rgba(234,179,8,0.30)' : 'rgba(202,138,4,0.30)'
            : border,
        }}
      >
        <IconComp
          className="w-6 h-6 transition-colors duration-300"
        />
      </div>

      {/* Title */}
      <h3
        className="text-lg font-black tracking-tight leading-snug"
        style={{ color: primary }}
      >
        {cap.title}
      </h3>

      {/* Description */}
      <p
        className="text-sm leading-relaxed flex-grow"
        style={{ color: sub }}
      >
        {cap.description}
      </p>

      {/* Business deliverables check grid */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
        {cap.deliverables.map(item => (
          <span
            key={item}
            className="px-2.5 py-1 rounded-md text-[10px] font-bold border tracking-wide flex items-center gap-1.5"
            style={{
              background:  isDark ? '#1F1F1F' : '#F8FAFC',
              borderColor: isDark ? '#2A2A2A' : '#E2E8F0',
              color:       isDark ? '#D4D4D4' : '#475569',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </article>
  );
};

// ─── Main section ─────────────────────────────────────────────────────────
export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({ 
  theme,
  tagline = "Expertise",
  title = "Premium solutions, engineered for scale.",
  subtitle = "We implement custom development workflows to build fast and highly maintainable web applications."
}) => {
  const isDark = theme === 'dark';

  // color shortcuts
  const bg      = isDark ? '#0F0F10' : '#FAFAFA';
  const cardBg  = isDark ? '#171717' : '#FFFFFF';
  const border  = isDark ? '#2A2A2A' : '#E2E8F0';
  const accent  = isDark ? '#FACC15' : '#CA8A04';
  const primary = isDark ? '#FFFFFF' : '#0F172A';
  const sub     = isDark ? '#D4D4D4' : '#475569';

  return (
    <Section
      background={isDark ? 'primary' : 'light'}
      padding="lg"
      style={{ background: bg }}
    >
      <Container size="lg">
        {/* Header Block */}
        <div className="max-w-3xl mb-16 md:mb-24 flex flex-col items-start">
          {tagline && (
            <span className="text-caption font-semibold tracking-wider uppercase mb-3 block" style={{ color: accent }}>
              {tagline}
            </span>
          )}
          <Heading
            variant="h2"
            className="mb-4 text-3xl md:text-4xl font-medium tracking-tight"
            style={{ color: primary }}
          >
            {title}
          </Heading>
          {subtitle && (
            <Text
              variant="body-large"
              className="text-base md:text-lg"
              style={{ color: sub }}
            >
              {subtitle}
            </Text>
          )}
        </div>

        {/* Capabilities Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((cap, index) => (
            <CapabilityCard
              key={cap.title}
              cap={cap}
              isDark={isDark}
              cardBg={cardBg}
              border={border}
              primary={primary}
              sub={sub}
              index={index}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default CapabilitiesSection;
