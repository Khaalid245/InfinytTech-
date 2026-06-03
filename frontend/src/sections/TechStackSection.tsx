import React, { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

// ─── Standard, thin-stroke (2px) inline SVGs ─────────────────────────────
const Icon = {
  Layout: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  ),
  Code: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Cpu: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
    </svg>
  ),
  Sparkles: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5 5 3Z" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" />
    </svg>
  ),
  Layers: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 17 22 12" />
    </svg>
  ),
  Cloud: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  ),
  Smartphone: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  ),
};

// ─── Interfaces ──────────────────────────────────────────────────────────
interface TechItem {
  name: string;
  category: 'runtime' | 'ai' | 'cloud' | 'db';
  icon: React.FC<{ className?: string }>;
  description: string;
}

interface TechStackSectionProps {
  theme: 'dark' | 'light';
}

// ─── Simplified Static Stack Data ────────────────────────────────────────
const TECH_STACK: TechItem[] = [
  {
    name: 'Next.js',
    category: 'runtime',
    icon: Icon.Layout,
    description: 'Modern React framework for fast, SEO-friendly web applications.',
  },
  {
    name: 'Go (Golang)',
    category: 'runtime',
    icon: Icon.Code,
    description: 'High-performance backend technology used for scalable APIs, microservices, and distributed systems.',
  },
  {
    name: 'Python',
    category: 'ai',
    icon: Icon.Cpu,
    description: 'Powering automation, data processing, and AI solutions.',
  },
  {
    name: 'PyTorch',
    category: 'ai',
    icon: Icon.Sparkles,
    description: 'Open-source machine learning framework for training and deploying AI models.',
  },
  {
    name: 'Kubernetes',
    category: 'cloud',
    icon: Icon.Layers,
    description: 'Infrastructure platform that helps applications scale reliably across cloud environments.',
  },
  {
    name: 'Terraform',
    category: 'cloud',
    icon: Icon.Cloud,
    description: 'Automates cloud infrastructure management for consistent, reliable deployments.',
  },
  {
    name: 'PostgreSQL',
    category: 'db',
    icon: Icon.Code,
    description: 'Reliable relational database for scalable applications.',
  },
  {
    name: 'Flutter',
    category: 'runtime',
    icon: Icon.Smartphone,
    description: 'Cross-platform mobile UI framework for native iOS and Android experiences.',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'All Technologies' },
  { key: 'runtime', label: 'Languages & Runtimes' },
  { key: 'ai', label: 'AI & Machine Learning' },
  { key: 'cloud', label: 'Cloud & Scaling' },
  { key: 'db', label: 'Databases & Edge' },
] as const;

export default function TechStackSection({ theme }: TechStackSectionProps) {
  const isDark = theme === 'dark';
  const [activeTechFilter, setActiveTechFilter] = useState<string>('all');
  
  // State to manage smooth fade/scale transition when switching filters
  const [visibleTech, setVisibleTech] = useState<TechItem[]>(TECH_STACK);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setVisibleTech(
        activeTechFilter === 'all'
          ? TECH_STACK
          : TECH_STACK.filter((item) => item.category === activeTechFilter)
      );
      setIsTransitioning(false);
    }, 200); // Matches transition duration
    return () => clearTimeout(timer);
  }, [activeTechFilter]);

  // Color mappings based on active theme
  const bgColors = isDark ? 'bg-[#0F0F10] border-t border-[#2A2A2A]' : 'bg-[#FAFAFA] border-t border-[#E2E8F0]';
  const textPrimary = isDark ? 'text-white' : 'text-[#0F172A]';
  const textSecondary = isDark ? 'text-[#D4D4D4]' : 'text-[#475569]';

  return (
    <section className={cn('py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300', bgColors)}>
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ─── 1. Section Header ─── */}
        <div className="text-center space-y-4 max-w-3xl mx-auto flex flex-col items-center">
          <span
            className={cn(
              'inline-flex items-center text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border transition-all duration-300',
              isDark 
                ? 'border-[#2A2A2A] text-[#FACC15] bg-[#171717]' 
                : 'border-[#E2E8F0] text-[#CA8A04] bg-white shadow-sm'
            )}
          >
            Technology Stack
          </span>
          
          <h2 className={cn('text-3xl sm:text-4xl font-black mt-4 leading-tight tracking-tight', textPrimary)}>
            Tools We Trust to Build and Scale
          </h2>
          
          <p className={cn('text-base max-w-xl mx-auto font-light leading-relaxed', textSecondary)}>
            We use proven technologies, modern frameworks, and scalable infrastructure to build reliable digital products 
            for startups, businesses, and growing organizations.
          </p>
        </div>

        {/* ─── 2. Interactive Category Tab Bar ─── */}
        <div className="flex justify-center">
          <div 
            className={cn(
              'flex items-center gap-1.5 p-1.5 rounded-xl border max-w-full overflow-x-auto no-scrollbar scroll-smooth',
              isDark ? 'bg-[#171717]/60 border-[#2A2A2A]' : 'bg-white border-slate-200 shadow-sm'
            )}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeTechFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveTechFilter(cat.key)}
                  className={cn(
                    'px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer',
                    isActive
                      ? isDark
                        ? 'bg-[#EAB308] text-[#0F0F10] shadow-md shadow-yellow-500/10'
                        : 'bg-[#CA8A04] text-white shadow-md shadow-amber-600/10'
                      : isDark
                        ? 'text-[#D4D4D4] hover:text-white hover:bg-white/5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── 3. Dynamic Periodic Grid Layout ─── */}
        <div 
          className={cn(
            'grid grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300',
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          )}
        >
          {visibleTech.map((tech) => {
            const IconComponent = tech.icon;
            
            return (
              <div
                key={tech.name}
                className={cn(
                  'group relative flex flex-col justify-start rounded-2xl border p-5 md:p-6 overflow-hidden select-none min-h-[160px]',
                  'transition-all duration-300 ease-in-out hover:-translate-y-1',
                  isDark 
                    ? 'bg-[#171717] border-[#2A2A2A] hover:bg-[#1F1F1F] hover:border-[#EAB308]/30 hover:shadow-lg hover:shadow-yellow-500/[0.02]' 
                    : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CA8A04]/30 hover:shadow-lg hover:shadow-slate-200/50'
                )}
              >
                {/* Dark Mode Specific Radial Glow */}
                {isDark && (
                  <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full pointer-events-none blur-xl transition-all duration-300 bg-[#EAB308]/[0.02] group-hover:bg-[#EAB308]/[0.06]" />
                )}

                <div className="space-y-4">
                  {/* Icon & Category Header */}
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300',
                        isDark 
                          ? 'border-[#2A2A2A] bg-[#0F0F10] text-[#D4D4D4] group-hover:bg-[#EAB308]/10 group-hover:border-[#EAB308]/30 group-hover:text-[#FACC15]' 
                          : 'border-slate-200 bg-slate-50 text-slate-600 group-hover:bg-[#CA8A04]/10 group-hover:border-[#CA8A04]/30 group-hover:text-[#CA8A04]'
                      )}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <span 
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border select-none',
                        isDark 
                          ? 'border-[#2A2A2A] bg-[#1F1F1F] text-[#D4D4D4]' 
                          : 'border-slate-100 bg-slate-50 text-slate-500'
                      )}
                    >
                      {tech.category === 'db' ? 'Database' : tech.category}
                    </span>
                  </div>

                  {/* Name and simplified description */}
                  <div className="space-y-1.5">
                    <h3 className={cn('text-base font-bold tracking-tight', textPrimary)}>
                      {tech.name}
                    </h3>
                    <p className={cn('text-xs font-light leading-relaxed', textSecondary)}>
                      {tech.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
