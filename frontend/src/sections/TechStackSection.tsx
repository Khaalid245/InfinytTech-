import { useState, useMemo } from 'react';
import { cn } from '../utils/cn';
import { useTechnologies } from '../hooks/usePortfolio';
import { getLucideIcon } from '../utils/iconHelper';
import { 
  Code2, 
  Cpu, 
  Layers, 
  Sparkles, 
  Cloud, 
  Database, 
  Smartphone, 
  Server, 
  Globe, 
  Braces,
  Boxes,
  type LucideIcon
} from 'lucide-react';
import type { Technology } from '../types/portfolio';

// ─── Interfaces ──────────────────────────────────────────────────────────
interface TechItem {
  id: string;
  name: string;
  slug: string;
  category: 'runtime' | 'ai' | 'cloud' | 'db';
  icon: LucideIcon;
  description: string;
}

interface TechStackSectionProps {
  theme: 'dark' | 'light';
}

// ─── Curated descriptions map ───────────────────────────────────────────
const TECH_DESCRIPTIONS: Record<string, { category: 'runtime' | 'ai' | 'cloud' | 'db'; description: string; defaultIcon: LucideIcon }> = {
  'nextjs': { category: 'runtime', defaultIcon: Globe, description: 'Modern React framework for fast, SEO-friendly, server-rendered web platforms.' },
  'next.js': { category: 'runtime', defaultIcon: Globe, description: 'Modern React framework for fast, SEO-friendly, server-rendered web platforms.' },
  'react': { category: 'runtime', defaultIcon: Code2, description: 'Component-driven UI library for building interactive, high-performance web applications.' },
  'typescript': { category: 'runtime', defaultIcon: Braces, description: 'Strictly typed JavaScript superset for reliable, enterprise-scale software engineering.' },
  'go': { category: 'runtime', defaultIcon: Server, description: 'High-performance backend language for scalable APIs, microservices, and distributed systems.' },
  'go (golang)': { category: 'runtime', defaultIcon: Server, description: 'High-performance backend language for scalable APIs, microservices, and distributed systems.' },
  'django': { category: 'runtime', defaultIcon: Server, description: 'Enterprise Python framework for secure, scalable backends and robust APIs.' },
  'flutter': { category: 'runtime', defaultIcon: Smartphone, description: 'Cross-platform mobile UI framework for native iOS and Android experiences.' },
  'nodejs': { category: 'runtime', defaultIcon: Code2, description: 'Asynchronous event-driven JavaScript runtime for fast, scalable network applications.' },
  'node.js': { category: 'runtime', defaultIcon: Code2, description: 'Asynchronous event-driven JavaScript runtime for fast, scalable network applications.' },
  
  'python': { category: 'ai', defaultIcon: Cpu, description: 'Powering automated workflows, high-throughput data processing, and AI integrations.' },
  'pytorch': { category: 'ai', defaultIcon: Sparkles, description: 'Open-source machine learning framework for training and deploying deep learning models.' },
  'tensorflow': { category: 'ai', defaultIcon: Sparkles, description: 'End-to-end open source platform for machine learning and neural networks.' },
  'openai': { category: 'ai', defaultIcon: Sparkles, description: 'Large language models and AI embeddings for intelligent conversational workflows.' },

  'aws': { category: 'cloud', defaultIcon: Cloud, description: 'Cloud infrastructure delivering elastic scalability, enterprise security, and global reach.' },
  'kubernetes': { category: 'cloud', defaultIcon: Layers, description: 'Container orchestration platform that scales applications reliably across cloud clusters.' },
  'terraform': { category: 'cloud', defaultIcon: Cloud, description: 'Infrastructure-as-Code automating multi-cloud provisioning and reproducible deployments.' },
  'docker': { category: 'cloud', defaultIcon: Boxes, description: 'Containerization engine standardizing build, test, and release pipelines.' },

  'postgresql': { category: 'db', defaultIcon: Database, description: 'Advanced open-source relational database with ACID compliance and high query concurrency.' },
  'mysql': { category: 'db', defaultIcon: Database, description: 'Proven enterprise relational database engine powering modern transactional systems.' },
  'graphql': { category: 'db', defaultIcon: Braces, description: 'Flexible query language for APIs enabling declarative, efficient client data fetching.' },
  'redis': { category: 'db', defaultIcon: Database, description: 'In-memory data structure store used as a distributed cache and real-time message broker.' },
};

const CATEGORIES = [
  { key: 'all', label: 'All Technologies' },
  { key: 'runtime', label: 'Languages & Runtimes' },
  { key: 'ai', label: 'AI & Machine Learning' },
  { key: 'cloud', label: 'Cloud & Scaling' },
  { key: 'db', label: 'Databases & APIs' },
] as const;

export default function TechStackSection({ theme }: TechStackSectionProps) {
  const isDark = theme === 'dark';
  const [activeTechFilter, setActiveTechFilter] = useState<string>('all');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Fetch dynamic technologies from MySQL database
  const { data: dbTechnologies, isLoading } = useTechnologies();

  // Map database technologies or fallbacks
  const allTechItems: TechItem[] = useMemo(() => {
    if (dbTechnologies && dbTechnologies.length > 0) {
      return dbTechnologies.map((t: Technology) => {
        const key = t.slug.toLowerCase();
        const matched = TECH_DESCRIPTIONS[key] || TECH_DESCRIPTIONS[t.name.toLowerCase()];
        
        // Infer or use database category
        let category: 'runtime' | 'ai' | 'cloud' | 'db' = 'runtime';
        if (t.category && ['runtime', 'ai', 'cloud', 'db'].includes(t.category)) {
          category = t.category as 'runtime' | 'ai' | 'cloud' | 'db';
        } else if (matched) {
          category = matched.category;
        } else if (key.includes('ai') || key.includes('ml') || key.includes('torch') || key.includes('gpt') || key.includes('python')) {
          category = 'ai';
        } else if (key.includes('cloud') || key.includes('aws') || key.includes('docker') || key.includes('kube') || key.includes('infra')) {
          category = 'cloud';
        } else if (key.includes('sql') || key.includes('db') || key.includes('redis') || key.includes('graph') || key.includes('mongo')) {
          category = 'db';
        }

        const iconComponent = getLucideIcon(t.icon_name, matched?.defaultIcon || Code2);

        return {
          id: t.id,
          name: t.name,
          slug: t.slug,
          category,
          icon: iconComponent,
          description: t.description || matched?.description || 'Enterprise-grade technology engineered for high performance, reliability, and security.',
        };
      });
    }

    // Default fallback if database query is loading / empty
    return Object.entries(TECH_DESCRIPTIONS).slice(0, 8).map(([slug, meta], idx) => ({
      id: `fallback-${idx}`,
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
      category: meta.category,
      icon: meta.defaultIcon,
      description: meta.description,
    }));
  }, [dbTechnologies]);

  // Filtered technology items
  const visibleTech = useMemo(() => {
    if (activeTechFilter === 'all') return allTechItems;
    return allTechItems.filter((item) => item.category === activeTechFilter);
  }, [allTechItems, activeTechFilter]);

  const handleTechFilterChange = (filter: string) => {
    if (filter === activeTechFilter) return;
    setIsTransitioning(true);
    setActiveTechFilter(filter);
    setTimeout(() => setIsTransitioning(false), 200);
  };

  // Color mappings based on active theme
  const bgColors = isDark ? 'bg-[#0B0D0F] border-t border-[#23262D]' : 'bg-[#FAFAFA] border-t border-[#E2E8F0]';
  const textPrimary = isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]';
  const textSecondary = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';

  return (
    <section className={cn('py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300', bgColors)}>
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ─── 1. Section Header ─── */}
        <div className="text-center space-y-4 max-w-3xl mx-auto flex flex-col items-center">
          <span
            className={cn(
              'inline-flex items-center text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border transition-all duration-300',
              isDark 
                ? 'border-[#23262D] text-[#D4A017] bg-[#121417]' 
                : 'border-[#E2E8F0] text-[#B8860B] bg-white shadow-sm'
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
              isDark ? 'bg-[#121417]/60 border-[#23262D]' : 'bg-white border-slate-200 shadow-sm'
            )}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeTechFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => handleTechFilterChange(cat.key)}
                  className={cn(
                    'px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer',
                    isActive
                      ? isDark
                        ? 'bg-[#E6B325] text-[#0B0D0F] shadow-md shadow-amber-600/10'
                        : 'bg-[#B8860B] text-white shadow-md shadow-amber-600/10'
                      : isDark
                        ? 'text-[#94A3B8] hover:text-white hover:bg-white/5'
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
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-2xl border p-5 md:p-6 min-h-[160px] animate-pulse flex flex-col justify-between',
                  isDark ? 'bg-[#121417] border-[#23262D]' : 'bg-white border-[#E2E8F0]'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className={cn('w-10 h-10 rounded-xl', isDark ? 'bg-zinc-800' : 'bg-slate-100')} />
                  <div className={cn('w-16 h-4 rounded', isDark ? 'bg-zinc-800' : 'bg-slate-100')} />
                </div>
                <div className="space-y-2">
                  <div className={cn('w-28 h-5 rounded', isDark ? 'bg-zinc-800' : 'bg-slate-100')} />
                  <div className={cn('w-full h-3.5 rounded', isDark ? 'bg-zinc-800' : 'bg-slate-100')} />
                  <div className={cn('w-4/5 h-3.5 rounded', isDark ? 'bg-zinc-800' : 'bg-slate-100')} />
                </div>
              </div>
            ))}
          </div>
        ) : (
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
                    ? 'bg-[#121417] border-[#23262D] hover:bg-[#181B1F] hover:border-[#E6B325]/30 hover:shadow-lg hover:shadow-amber-500/[0.02]' 
                    : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#B8860B]/30 hover:shadow-lg hover:shadow-slate-200/50'
                )}
              >
                {/* Dark Mode Specific Radial Glow */}
                {isDark && (
                  <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full pointer-events-none blur-xl transition-all duration-300 bg-[#E6B325]/[0.02] group-hover:bg-[#E6B325]/[0.06]" />
                )}

                <div className="space-y-4">
                  {/* Icon & Category Header */}
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300',
                        isDark 
                          ? 'border-[#23262D] bg-[#0B0D0F] text-[#94A3B8] group-hover:bg-[#E6B325]/10 group-hover:border-[#E6B325]/30 group-hover:text-[#D4A017]' 
                          : 'border-slate-200 bg-slate-50 text-slate-600 group-hover:bg-[#B8860B]/10 group-hover:border-[#B8860B]/30 group-hover:text-[#B8860B]'
                      )}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <span 
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border select-none',
                        isDark 
                          ? 'border-[#23262D] bg-[#181B1F] text-[#94A3B8]' 
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
        )}

      </div>
    </section>
  );
}
