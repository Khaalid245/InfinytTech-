import { cn } from '../utils/cn';

interface CoreValuesSectionProps {
  theme: 'dark' | 'light';
}

interface ValueCardItem {
  id: string;
  title: string;
  desc: string;
  icon: (props: { className?: string }) => JSX.Element;
}

const Icon = {
  Award: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  Check: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Globe: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Cpu: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="15" x2="23" y2="15" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="15" x2="4" y2="15" />
    </svg>
  ),
  Users: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Layers: ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
};

export default function CoreValuesSection({ theme }: CoreValuesSectionProps) {
  const isDark = theme === 'dark';

  const values: ValueCardItem[] = [
    {
      id: '01',
      title: 'Excellence',
      desc: 'We pursue quality in every detail, from strategy and design to engineering and delivery.',
      icon: Icon.Award,
    },
    {
      id: '02',
      title: 'Ownership',
      desc: 'We take responsibility for outcomes, treating every project as if it were our own.',
      icon: Icon.Check,
    },
    {
      id: '03',
      title: 'Transparency',
      desc: 'Clear communication, honest feedback, and visibility throughout every stage of collaboration.',
      icon: Icon.Globe,
    },
    {
      id: '04',
      title: 'Innovation',
      desc: 'We continuously explore better ways to solve problems through technology and creativity.',
      icon: Icon.Cpu,
    },
    {
      id: '05',
      title: 'Collaboration',
      desc: 'Great products emerge when teams work together with trust, respect, and shared goals.',
      icon: Icon.Users,
    },
    {
      id: '06',
      title: 'Continuous Learning',
      desc: 'Technology evolves rapidly, and so do we through constant learning and improvement.',
      icon: Icon.Layers,
    },
  ];

  return (
    <section 
      className={cn(
        'py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors duration-300',
        isDark ? 'text-white' : 'text-slate-900'
      )}
    >
      {/* 1. Header block */}
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex justify-center">
          <span 
            className={cn(
              'text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border',
              isDark 
                ? 'border-[#2A2A2A] text-[#EAB308] bg-[#171717]/40' 
                : 'border-[#E2E8F0] text-[#CA8A04] bg-slate-50'
            )}
          >
            Our Values
          </span>
        </div>
        <h3 className="text-3xl sm:text-4xl font-black mt-4 leading-tight">
          The Principles Behind Every Product We Build
        </h3>
        <p className={cn('text-sm font-light max-w-xl mx-auto leading-relaxed', isDark ? 'text-[#D4D4D4]' : 'text-slate-600')}>
          Our values shape how we collaborate, innovate, and deliver solutions for clients around the world.
        </p>
      </div>

      {/* 2. Responsive 2x3 Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. Value cards mapping with group hover transitions */}
        {values.map((item) => {
          const CardIcon = item.icon;
          return (
            <div
              key={item.title}
              className={cn(
                'group rounded-2xl border p-8 text-left transition-all duration-300 ease-in-out hover:-translate-y-1',
                isDark 
                  ? 'bg-[#171717] border-[#2A2A2A] hover:bg-[#1F1F1F] hover:border-[#EAB308]/30' 
                  : 'bg-white border-[#E2E8F0] hover:bg-slate-50 hover:border-[#CA8A04]/30'
              )}
            >
              <div className="flex items-start justify-between mb-6">
                {/* Icon Container */}
                <div 
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300',
                    isDark 
                      ? 'border-[#2A2A2A] bg-[#1F1F1F] text-[#EAB308] group-hover:bg-[#EAB308]/10 group-hover:border-[#EAB308]/30' 
                      : 'border-[#E2E8F0] bg-slate-50 text-[#CA8A04] group-hover:bg-[#CA8A04]/10 group-hover:border-[#CA8A04]/30'
                  )}
                >
                  <CardIcon className="w-5 h-5" />
                </div>
                
                {/* Index tag */}
                <span className={cn('font-mono text-xs font-bold tracking-widest', isDark ? 'text-white/20' : 'text-slate-900/20')}>
                  {item.id}
                </span>
              </div>

              {/* Copy */}
              <div className="space-y-2">
                <h4 className="text-base font-bold tracking-tight">
                  {item.title}
                </h4>
                <p className={cn('text-xs font-light leading-relaxed', isDark ? 'text-[#D4D4D4]' : 'text-slate-500')}>
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
