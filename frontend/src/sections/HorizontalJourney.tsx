import { cn } from '../utils/cn';

interface JourneyStep {
  id: string;
  title: string;
  desc: string;
}

interface HorizontalJourneyProps {
  theme: 'dark' | 'light';
}

export default function HorizontalJourney({ theme }: HorizontalJourneyProps) {
  const isDark = theme === 'dark';

  const bg      = isDark ? '#0B0D0F' : '#FAFAFA';
  const border  = isDark ? '#23262D' : '#E2E8F0';
  const accent  = isDark ? '#D4A017' : '#B8860B';
  const primary = isDark ? '#F8FAFC' : '#0F172A';
  const sub     = isDark ? '#94A3B8' : '#475569';

  const steps: JourneyStep[] = [
    { id: '01', title: 'Discover', desc: 'Understand business goals, users, and opportunities.' },
    { id: '02', title: 'Design', desc: 'Validate ideas through strategy and product design.' },
    { id: '03', title: 'Build', desc: 'Develop scalable software with quality engineering.' },
    { id: '04', title: 'Scale', desc: 'Optimize, support, and evolve the product over time.' },
  ];

  return (
    <section 
      style={{ background: bg }}
      className="py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      aria-label="Our Process: A Proven Path from Concept to Scale"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* 1. Header Capsule, Title, and Description */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex justify-center">
            <span 
              className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border"
              style={{
                background:  isDark ? '#181B1F' : '#F1F5F9',
                borderColor: border,
                color:       accent,
              }}
            >
              OUR PROCESS
            </span>
          </div>

          <h2
            className="text-3xl font-black mt-4 leading-tight"
            style={{ color: primary }}
          >
            A Proven Path from Concept to Scale
          </h2>

          <p
            className="text-sm font-light max-w-xl mx-auto leading-relaxed"
            style={{ color: sub }}
          >
            Our streamlined workflow balances high velocity with rigorous, zero-debt engineering standards.
          </p>
        </div>

        {/* 2. Responsive Timeline Container */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          {/* Horizontal line (Desktop) */}
          <div 
            className="absolute top-4 left-12 right-12 h-[1px] hidden md:block transition-colors duration-300"
            style={{ background: border }}
          />

          {/* Vertical line (Mobile) */}
          <div 
            className="absolute top-4 bottom-4 left-8 w-[1px] md:hidden transition-colors duration-300"
            style={{ background: border }}
          />

          {/* Steps Grid mapping */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative z-10">
            {steps.map((step) => (
              <div 
                key={step.id}
                className="group relative flex flex-col items-start md:items-center text-left md:text-center gap-4 pl-14 md:pl-0"
              >
                {/* Numeric indicator circle */}
                <div 
                  className={cn(
                    'w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-medium z-10 transition-all duration-300',
                    'absolute left-4 top-0 md:relative md:left-auto md:top-auto',
                    isDark 
                      ? 'bg-[#0B0D0F] border-[#23262D] text-[#64748B] group-hover:border-[#94A3B8] group-hover:text-zinc-200' 
                      : 'bg-[#FAFAFA] border-[#E2E8F0] text-slate-400 group-hover:border-slate-300 group-hover:text-slate-600'
                  )}
                >
                  {step.id}
                </div>

                {/* Typography wrapper for text details */}
                <div className="space-y-1">
                  <h3 
                    className={cn(
                      'text-lg md:text-xl font-bold transition-colors duration-300',
                      isDark 
                        ? 'text-[#F8FAFC] group-hover:text-[#D4A017]' 
                        : 'text-[#0F172A] group-hover:text-[#B8860B]'
                    )}
                  >
                    {step.title}
                  </h3>
                  <p 
                    className="text-xs md:text-sm font-light leading-relaxed"
                    style={{ color: sub }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
