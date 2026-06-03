import { useState } from 'react';
import { cn } from '../utils/cn';

interface MissionVisionValuesProps {
  theme: 'dark' | 'light';
}

interface ValueItem {
  id: string;
  title: string;
  desc: string;
}

export default function MissionVisionValues({ theme }: MissionVisionValuesProps) {
  const [activeTab, setActiveTab] = useState<'mission' | 'vision' | 'values'>('mission');
  const isDark = theme === 'dark';

  const values: ValueItem[] = [
    {
      id: '01',
      title: 'Excellence',
      desc: 'We deliver exceptional software code bases that pass rigorous audits. We accept nothing short of outstanding execution.',
    },
    {
      id: '02',
      title: 'Ownership',
      desc: 'Every developer acts as a principal founder, treating system uptime, deadlines, and project success as their own responsibility.',
    },
    {
      id: '03',
      title: 'Transparency',
      desc: 'Open communication, real-time code repositories, and weekly video sessions guarantee absolute collaboration alignment.',
    },
    {
      id: '04',
      title: 'Innovation',
      desc: 'Constant technological experimentation. We deploy modern agentic frameworks, multi-tenant databases, and zero-trust clouds.',
    },
    {
      id: '05',
      title: 'Collaboration',
      desc: 'We integrate with your internal product developers seamlessly, sharing roadmap parameters and scaling as a single team.',
    },
    {
      id: '06',
      title: 'Continuous Learning',
      desc: 'The digital frontier changes daily. We actively train in next-generation type-safety, AI fine-tuning, and low-latency execution.',
    },
  ];

  return (
    <section 
      className={cn(
        'max-w-5xl mx-auto py-12 px-6 lg:px-8 rounded-3xl border transition-all duration-300 my-8',
        isDark 
          ? 'bg-[#171717]/10 border-[#2A2A2A]' 
          : 'bg-[#FAFAFA] border-[#E2E8F0]'
      )}
    >
      <div className="space-y-12">
        {/* 1. Segmented Navigation Bar */}
        <div 
          className={cn(
            'flex space-x-1 p-1.5 rounded-xl border max-w-md w-full mx-auto transition-colors duration-300',
            isDark ? 'bg-[#0F0F10] border-[#2A2A2A]' : 'bg-slate-100 border-[#E2E8F0]'
          )}
          role="tablist"
          aria-label="Mission, Vision, and Values tabs"
        >
          {(['mission', 'vision', 'values'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={isActive}
                className={cn(
                  'flex-1 text-center py-2 text-xs font-semibold uppercase tracking-wider rounded-lg select-none cursor-pointer',
                  'transition-all duration-300 ease-out transform outline-none',
                  isActive 
                    ? isDark
                      ? 'bg-[#EAB308] text-[#0F0F10] scale-[1.02] shadow-sm'
                      : 'bg-[#CA8A04] text-white scale-[1.02] shadow-sm'
                    : isDark
                      ? 'text-[#D4D4D4] hover:text-white hover:bg-[#171717]/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* 2. Responsive Render Areas */}
        <div className="min-h-[220px] flex flex-col justify-center">
          {activeTab === 'mission' && (
            <div className="animate-fade-in text-center max-w-3xl mx-auto space-y-4">
              <span className={cn('font-mono text-xs font-bold tracking-widest uppercase', isDark ? 'text-[#EAB308]' : 'text-[#CA8A04]')}>
                Mission
              </span>
              <h3 className={cn('text-3xl font-black tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                Our Mission
              </h3>
              <p className={cn('text-lg font-light leading-relaxed', isDark ? 'text-[#D4D4D4]' : 'text-slate-600')}>
                To help startups, businesses, and organizations build scalable digital products through modern engineering, AI innovation, and world-class technology solutions.
              </p>
            </div>
          )}

          {activeTab === 'vision' && (
            <div className="animate-fade-in text-center max-w-3xl mx-auto space-y-4">
              <span className={cn('font-mono text-xs font-bold tracking-widest uppercase', isDark ? 'text-[#EAB308]' : 'text-[#CA8A04]')}>
                Vision
              </span>
              <h3 className={cn('text-3xl font-black tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                Our Vision
              </h3>
              <p className={cn('text-lg font-light leading-relaxed', isDark ? 'text-[#D4D4D4]' : 'text-slate-600')}>
                To become Africa's most trusted technology partner, connecting world-class engineering talent with organizations building the future.
              </p>
            </div>
          )}

          {activeTab === 'values' && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <span className={cn('font-mono text-xs font-bold tracking-widest uppercase', isDark ? 'text-[#EAB308]' : 'text-[#CA8A04]')}>
                  Values
                </span>
                <h3 className={cn('text-2xl font-black tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                  Our Core Values
                </h3>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                {values.map((val) => (
                  <div
                    key={val.title}
                    className={cn(
                      'group rounded-2xl border p-6 transition-all duration-300 text-left flex flex-col justify-between space-y-4',
                      isDark 
                        ? 'bg-[#171717] border-[#2A2A2A] hover:border-[#EAB308]/30 text-white' 
                        : 'bg-white border-[#E2E8F0] hover:border-[#CA8A04]/30 text-slate-900'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn('font-mono text-xs font-bold tracking-widest', isDark ? 'text-[#EAB308]/60' : 'text-[#CA8A04]/60')}>
                        {val.id}
                      </span>
                      <span 
                        className={cn(
                          'w-2.5 h-2.5 rounded-full transition-transform duration-300 transform group-hover:scale-150',
                          isDark ? 'bg-[#EAB308]' : 'bg-[#CA8A04]'
                        )}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-base font-bold tracking-tight">
                        {val.title}
                      </h4>
                      <p className={cn('text-xs font-light leading-relaxed', isDark ? 'text-[#D4D4D4]' : 'text-slate-500')}>
                        {val.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
