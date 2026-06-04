import { useState } from 'react';
import { cn } from '../utils/cn';
import { 
  Target, 
  Eye, 
  Compass, 
  Award, 
  ShieldCheck, 
  Globe, 
  Sparkles, 
  Users, 
  BookOpen, 
  type LucideIcon 
} from 'lucide-react';

interface MissionVisionValuesProps {
  theme: 'dark' | 'light';
}

interface ValueItem {
  id: string;
  title: string;
  desc: string;
  icon: LucideIcon;
}

export default function MissionVisionValues({ theme }: MissionVisionValuesProps) {
  const [activeTab, setActiveTab] = useState<'mission' | 'vision' | 'values'>('mission');
  const isDark = theme === 'dark';

  const tabIcons = {
    mission: Target,
    vision: Eye,
    values: Compass,
  };

  const values: ValueItem[] = [
    {
      id: '01',
      title: 'Excellence',
      desc: 'We hold ourselves to the highest standards, ensuring every solution we deliver is durable, reliable, and crafted with meticulous attention to detail.',
      icon: Award,
    },
    {
      id: '02',
      title: 'Ownership',
      desc: 'We approach every project with the mindset of a founder, taking full responsibility for the outcomes and long-term success of the partners we serve.',
      icon: ShieldCheck,
    },
    {
      id: '03',
      title: 'Transparency',
      desc: 'We build trust through honest, open, and clear communication, keeping our partners fully aligned and informed at every stage.',
      icon: Globe,
    },
    {
      id: '04',
      title: 'Innovation',
      desc: 'We challenge conventional approaches and continuously seek better ways to solve meaningful problems.',
      icon: Sparkles,
    },
    {
      id: '05',
      title: 'Collaboration',
      desc: 'We work as an extension of your team, aligning our goals with yours to build strong, unified partnerships that amplify our collective impact.',
      icon: Users,
    },
    {
      id: '06',
      title: 'Continuous Learning',
      desc: 'We remain perpetually curious, constantly expanding our knowledge and adapting to new paradigms to deliver future-ready solutions.',
      icon: BookOpen,
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
            const IconComponent = tabIcons[tab];
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
                <span className="flex items-center justify-center gap-2">
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{tab}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. Responsive Render Areas */}
        <div className="min-h-[220px] flex flex-col justify-center">
          {activeTab === 'mission' && (
            <div className="animate-fade-in text-center max-w-3xl mx-auto space-y-4">
              <div className="flex justify-center">
                <div className={cn(
                  'w-12 h-12 rounded-2xl border flex items-center justify-center',
                  isDark ? 'border-[#2A2A2A] bg-[#171717] text-[#EAB308]' : 'border-[#E2E8F0] bg-white text-[#CA8A04]'
                )}>
                  <Target className="w-6 h-6" />
                </div>
              </div>
              <span className={cn('font-mono text-xs font-bold tracking-widest uppercase block', isDark ? 'text-[#EAB308]' : 'text-[#CA8A04]')}>
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
              <div className="flex justify-center">
                <div className={cn(
                  'w-12 h-12 rounded-2xl border flex items-center justify-center',
                  isDark ? 'border-[#2A2A2A] bg-[#171717] text-[#EAB308]' : 'border-[#E2E8F0] bg-white text-[#CA8A04]'
                )}>
                  <Eye className="w-6 h-6" />
                </div>
              </div>
              <span className={cn('font-mono text-xs font-bold tracking-widest uppercase block', isDark ? 'text-[#EAB308]' : 'text-[#CA8A04]')}>
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
                {values.map((val) => {
                  const ValIcon = val.icon;
                  return (
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
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300',
                          isDark 
                            ? 'border-[#2A2A2A] bg-[#1F1F1F] text-[#EAB308] group-hover:bg-[#EAB308]/10 group-hover:border-[#EAB308]/30' 
                            : 'border-[#E2E8F0] bg-slate-50 text-[#CA8A04] group-hover:bg-[#CA8A04]/10 group-hover:border-[#CA8A04]/30'
                        )}>
                          <ValIcon className="w-4 h-4" />
                        </div>
                        <span className={cn('font-mono text-xs font-bold tracking-widest', isDark ? 'text-[#EAB308]/60' : 'text-[#CA8A04]/60')}>
                          {val.id}
                        </span>
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
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
