import React from 'react';
import { cn } from '../utils/cn';
import { Check } from 'lucide-react';

const PROCESS_STEPS = [
  { num: '01', title: 'Discover', description: 'Analyze requirements, map out constraints, and shape product strategy.' },
  { num: '02', title: 'Design', description: 'Prototype user interfaces and establish high-fidelity design systems.' },
  { num: '03', title: 'Build', description: 'Engineer frontends and scalable backend microservices.' },
  { num: '04', title: 'Launch', description: 'Configure secure hosting, automate deployments, and verify stability.' },
  { num: '05', title: 'Scale', description: 'Track production performance, optimize latency, and add new capabilities.' },
] as const;

const TRUST_VALUES = [
  'Transparent Communication',
  'Modern Engineering Practices',
  'Business-Focused Solutions',
  'Long-Term Partnership',
] as const;

interface PortfolioProcessTrustProps {
  theme: 'dark' | 'light';
}

export const PortfolioProcessTrustSection: React.FC<PortfolioProcessTrustProps> = ({ theme }) => {
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
      style={{ borderColor: isDark ? '#23262D' : '#E8EDF3' }}
      aria-label="Process and Trust"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* ─── SECTION 7: Development Process ─── */}
        <div className="mb-16 text-center">
          <span
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border mb-4"
            style={{ color: gold, borderColor: isDark ? '#23262D' : '#E2E8F0', backgroundColor: isDark ? '#121417' : '#F1F5F9' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gold }} aria-hidden="true" />
            METHODOLOGY
          </span>
          <h2 className={cn('text-4xl sm:text-5xl font-black mt-2 mb-4 tracking-tight leading-[1.1]', textPri)}>
            How We Work.
          </h2>
          <p className={cn('text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed', textSec)}>
            We design, develop, and launch platforms using an agile engineering process focused on clarity at every step.
          </p>
        </div>

        {/* Timeline (Single Row on desktop, stacked on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 relative mb-24 text-left">
          {/* Connector Line (Desktop Only) */}
          <div
            className="hidden md:block absolute top-[28px] left-[50px] right-[50px] h-[1px] -z-0"
            style={{ backgroundColor: isDark ? '#23262D' : '#E2E8F0' }}
          />

          {PROCESS_STEPS.map((step, idx) => (
            <div key={step.title} className="relative z-10 flex flex-col items-start p-4">
              {/* Step indicator */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold border mb-4"
                style={{
                  color: gold,
                  borderColor: isDark ? '#23262D' : '#E2E8F0',
                  backgroundColor: isDark ? '#0B0D0F' : '#FFFFFF',
                }}
              >
                {step.num}
              </div>

              <h3 className={cn('text-base font-black tracking-tight mb-2', textPri)}>
                {step.title}
              </h3>
              <p className={cn('text-xs font-light leading-relaxed', textSec)}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* ─── SECTION 8: Client Trust Section ─── */}
        <div className="w-full pt-16 border-t flex flex-col items-center" style={{ borderColor: isDark ? '#23262D' : '#E8EDF3' }}>
          <span
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border mb-4"
            style={{ color: gold, borderColor: isDark ? '#23262D' : '#E2E8F0', backgroundColor: isDark ? '#121417' : '#F1F5F9' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gold }} aria-hidden="true" />
            WHY US
          </span>
          
          <h2 className={cn('text-3xl sm:text-4xl font-black mb-8 tracking-tight text-center', textPri)}>
            Why Clients Choose InfinityTech.
          </h2>

          {/* Trust Checkmarks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 max-w-2xl w-full text-left">
            {TRUST_VALUES.map((val) => (
              <div key={val} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: isDark ? '#23262D' : '#F1F5F9', backgroundColor: isDark ? '#121417' : '#FFFFFF' }}>
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isDark ? 'rgba(212,160,23,0.08)' : 'rgba(184,134,11,0.03)',
                  }}
                >
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: gold }} strokeWidth={3} />
                </div>
                <span className={cn('text-sm font-semibold tracking-wide', textPri)}>
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioProcessTrustSection;
