import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '../utils/cn';
import { Globe, Layers, Cpu, Check } from 'lucide-react';

interface ImpactGroup {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  items: string[];
}

const ITEM_CATEGORY_MAP: Record<string, string> = {
  // Industries
  'Financial Technology': 'enterprise',
  'Healthcare Technology': 'mobile',
  'PropTech & Real Estate': 'web',
  'Logistics & Supply Chain': 'web',
  'EdTech & E-Learning': 'web',
  'Retail & Commerce': 'uiux',

  // Product Taxonomy
  'Enterprise SaaS Platforms': 'enterprise',
  'High-Performance Web Apps': 'web',
  'Android & iOS Native Apps': 'mobile',
  'Edge-Optimized AI Systems': 'ai',
  'Cloud Logging & Monitoring': 'cloud',
  'Interactive Design Systems': 'uiux',

  // Engineering Competencies
  'Low-latency gRPC APIs': 'enterprise',
  'Offline-first CRDT syncing': 'mobile',
  'PostGIS Spatial coordinate indices': 'web',
  'Edge-compiled WebAssembly ML': 'ai',
  'Event-driven Go microservices': 'enterprise',
  'Kubernetes cluster configurations': 'cloud',
};

const IMPACT_GROUPS: ImpactGroup[] = [
  {
    title: 'Industries Served',
    subtitle: 'Deployments built for complex domains.',
    icon: <Globe className="w-5 h-5" />,
    items: [
      'Financial Technology',
      'Healthcare Technology',
      'PropTech & Real Estate',
      'Logistics & Supply Chain',
      'EdTech & E-Learning',
      'Retail & Commerce',
    ],
  },
  {
    title: 'Product Taxonomy',
    subtitle: 'System formats engineered to scale.',
    icon: <Layers className="w-5 h-5" />,
    items: [
      'Enterprise SaaS Platforms',
      'High-Performance Web Apps',
      'Android & iOS Native Apps',
      'Edge-Optimized AI Systems',
      'Cloud Logging & Monitoring',
      'Interactive Design Systems',
    ],
  },
  {
    title: 'Engineering Competencies',
    subtitle: 'Technical capabilities we deploy.',
    icon: <Cpu className="w-5 h-5" />,
    items: [
      'Low-latency gRPC APIs',
      'Offline-first CRDT syncing',
      'PostGIS Spatial coordinate indices',
      'Edge-compiled WebAssembly ML',
      'Event-driven Go microservices',
      'Kubernetes cluster configurations',
    ],
  },
];

interface PortfolioImpactProps {
  theme: 'dark' | 'light';
}

export const PortfolioImpactSummary: React.FC<PortfolioImpactProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [searchParams, setSearchParams] = useSearchParams();

  const handleItemClick = (item: string) => {
    const category = ITEM_CATEGORY_MAP[item];
    if (category) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('filter', category);
      setSearchParams(newParams, { replace: true, preventScrollReset: true });
    }

    const target = document.querySelector('[aria-label="PROJECT LIBRARY"]');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const gold    = '#D4A017';
  const bg      = isDark ? 'bg-[#0B0D0F]'  : 'bg-[#F8FAFC]';
  const cardBg  = isDark ? 'bg-[#121417]'  : 'bg-[#FFFFFF]';
  const border  = isDark ? 'border-[#23262D]' : 'border-[#E2E8F0]';
  const textPri = isDark ? 'text-[#F8FAFC]'     : 'text-[#0F172A]';
  const textSec = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';

  return (
    <section
      className={cn('w-full py-24 px-4 sm:px-6 lg:px-8 border-t transition-colors duration-300', bg)}
      style={{ borderColor: isDark ? '#1E1E20' : '#E8EDF3' }}
      aria-label="Impact Summary"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border mb-4"
            style={{ color: gold, borderColor: isDark ? '#252527' : '#E2E8F0', backgroundColor: isDark ? 'rgba(20,20,22,0.9)' : '#F1F5F9' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gold }} aria-hidden="true" />
            IMPACT SUMMARY
          </span>
          <h2 className={cn('text-4xl sm:text-5xl font-black mt-2 mb-4 tracking-tight leading-[1.1]', textPri)}>
            Our Footprint Across<br className="hidden sm:inline" />
            Digital Frontiers.
          </h2>
          <p className={cn('text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed', textSec)}>
            A high-level overview of the industries we serve, the formats of platforms we engineer, and the technical competencies we deploy.
          </p>
        </div>

        {/* Impact Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {IMPACT_GROUPS.map((group) => (
            <div
              key={group.title}
              className={cn(
                'flex flex-col text-left p-6 md:p-8 rounded-2xl border transition-all duration-300 hover:border-zinc-700/50',
                cardBg,
                border
              )}
            >
              {/* Group Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center border"
                  style={{
                    color: gold,
                    borderColor: isDark ? 'rgba(245,197,24,0.2)' : 'rgba(202,138,4,0.2)',
                    background: isDark ? 'rgba(245,197,24,0.05)' : 'rgba(245,197,24,0.02)',
                  }}
                >
                  {group.icon}
                </div>
                <div>
                  <h3 className={cn('text-base font-black tracking-tight leading-none', textPri)}>
                    {group.title}
                  </h3>
                  <span className={cn('text-[10px] font-light leading-none', textSec)}>
                    {group.subtitle}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <ul className="flex flex-col gap-2 mt-4 pt-4 border-t" style={{ borderColor: isDark ? '#222224' : '#E2E8F0' }}>
                {group.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        'group flex items-center gap-2.5 w-full text-left py-1.5 px-2.5 -mx-2.5 rounded-xl transition-all duration-200 cursor-pointer border border-transparent',
                        isDark 
                          ? 'hover:bg-[#D4A017]/08 hover:border-[#D4A017]/20' 
                          : 'hover:bg-slate-100 hover:border-slate-200'
                      )}
                    >
                      <Check
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: gold }}
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                      <span className={cn('text-xs font-semibold tracking-wide flex-grow transition-colors duration-200', textPri)}>
                        {item}
                      </span>
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider transition-all duration-200 px-2 py-0.5 rounded border opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                        style={{
                          borderColor: isDark ? 'rgba(245,197,24,0.3)' : 'rgba(202,138,4,0.3)',
                          color: gold,
                          backgroundColor: isDark ? 'rgba(245,197,24,0.05)' : 'rgba(245,197,24,0.02)',
                        }}
                      >
                        Explore &rarr;
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioImpactSummary;
