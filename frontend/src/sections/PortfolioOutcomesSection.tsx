import React from 'react';
import { cn } from '../utils/cn';
import { Zap, Smile, Server, FileText, TrendingUp, ShieldCheck } from 'lucide-react';

interface OutcomeItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const OUTCOMES: OutcomeItem[] = [
  {
    title: 'Faster Operations',
    description: 'Optimize transaction speeds, reduce network latencies, and speed up critical pipeline processing by up to 92%.',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    title: 'Improved Customer Experience',
    description: 'Dialect-aware interfaces, edge voice synthesis, and native offline features tailored to keep customer retention high.',
    icon: <Smile className="w-5 h-5" />,
  },
  {
    title: 'Scalable Infrastructure',
    description: 'Asynchronous messaging brokers and database clusters engineered to support sudden peak volumes without service failure.',
    icon: <Server className="w-5 h-5" />,
  },
  {
    title: 'Reduced Manual Processes',
    description: 'Transform manual tracking, administrative record files, and paper logs into secure, automated system workflows.',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: 'Higher Team Productivity',
    description: 'Automated ingestion channels, OCR parsing tools, and centralized dashboards built to maximize team coordination efficiency.',
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    title: 'Future-Ready Systems',
    description: 'Modular architectures, clean design systems, and robust database layers built to evolve alongside emerging business goals.',
    icon: <ShieldCheck className="w-5 h-5" />,
  },
];

const TECHNOLOGIES = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'Django',
  'Flutter',
  'AWS',
  'Docker',
  'PostgreSQL',
  'OpenAI',
] as const;

interface PortfolioOutcomesProps {
  theme: 'dark' | 'light';
}

export const PortfolioOutcomesSection: React.FC<PortfolioOutcomesProps> = ({ theme }) => {
  const isDark = theme === 'dark';

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
      aria-label="Business Outcomes"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* ─── SECTION 5: Results & Impact ─── */}
        <div className="mb-16 text-center">
          <span
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border mb-4"
            style={{ color: gold, borderColor: isDark ? '#252527' : '#E2E8F0', backgroundColor: isDark ? 'rgba(20,20,22,0.9)' : '#F1F5F9' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gold }} aria-hidden="true" />
            BUSINESS OUTCOMES
          </span>
          <h2 className={cn('text-4xl sm:text-5xl font-black mt-2 mb-4 tracking-tight leading-[1.1]', textPri)}>
            Technology That Creates<br className="hidden sm:inline" />
            Measurable Impact.
          </h2>
          <p className={cn('text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed', textSec)}>
            We focus on real outcomes that push business forward, avoiding vanity metrics to construct highly functional, resilient tech foundations.
          </p>
        </div>

        {/* Outcomes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {OUTCOMES.map((outcome) => (
            <div
              key={outcome.title}
              className={cn(
                'flex flex-col text-left p-6 md:p-8 rounded-2xl border transition-all duration-300 hover:border-zinc-700/50',
                cardBg,
                border
              )}
            >
              {/* Icon Container */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 border"
                style={{
                  color: gold,
                  borderColor: isDark ? 'rgba(245,197,24,0.2)' : 'rgba(202,138,4,0.2)',
                  background: isDark ? 'rgba(245,197,24,0.05)' : 'rgba(245,197,24,0.02)',
                }}
              >
                {outcome.icon}
              </div>

              <h3 className={cn('text-lg font-black tracking-tight mb-2', textPri)}>
                {outcome.title}
              </h3>
              <p className={cn('text-xs font-light leading-relaxed', textSec)}>
                {outcome.description}
              </p>
            </div>
          ))}
        </div>

        {/* ─── SECTION 6: Technologies Used ─── */}
        <div className="w-full pt-16 border-t flex flex-col items-center" style={{ borderColor: isDark ? '#1E1E20' : '#E8EDF3' }}>
          <span
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border mb-4"
            style={{ color: gold, borderColor: isDark ? '#252527' : '#E2E8F0', backgroundColor: isDark ? 'rgba(20,20,22,0.9)' : '#F1F5F9' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gold }} aria-hidden="true" />
            TECHNOLOGY
          </span>
          <h3 className={cn('text-2xl font-black mb-6 tracking-tight', textPri)}>
            Modern Tech Stack.
          </h3>
          <p className={cn('text-xs font-light leading-relaxed max-w-md text-center mb-8', textSec)}>
            We design products with reliable languages, frameworks, and cloud services selected for longevity and performance.
          </p>

          {/* Tech tags list */}
          <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl">
            {TECHNOLOGIES.map((tech) => (
              <span
                key={tech}
                className={cn(
                  'px-4 py-2 text-xs font-semibold rounded-full border cursor-default transition-all duration-300 hover:-translate-y-[2px]',
                  isDark
                    ? 'border-[#23262D] text-[#94A3B8] bg-[#121417] hover:border-[#D4A017]/50 hover:text-white hover:bg-[#D4A017]/10'
                    : 'border-slate-200 text-[#475569] bg-white hover:border-[#D4A017]/50 hover:text-[#0F172A] hover:bg-[#D4A017]/04'
                )}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioOutcomesSection;
