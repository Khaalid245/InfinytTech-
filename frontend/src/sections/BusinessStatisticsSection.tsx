import React, { useEffect, useState, useRef } from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { Container } from '../components/layout/Container';
import { StaggerContainer } from '../components/animation/StaggerContainer';
import { FadeUp } from '../components/animation/FadeUp';
import { cn } from '../utils/cn';

interface BusinessStatisticsProps {
  theme: 'dark' | 'light';
}

const CountUp: React.FC<{ end: number; suffix?: string; duration?: number }> = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime: number;
          let animationFrame: number;

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            
            // easeOutExpo
            const easeOut = progress === duration ? 1 : 1 - Math.pow(2, -10 * progress / duration);
            
            if (progress < duration) {
              setCount(Math.min(Math.floor(end * easeOut), end));
              animationFrame = requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          animationFrame = requestAnimationFrame(animate);
          observer.disconnect();
          
          return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
          };
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export const BusinessStatisticsSection: React.FC<BusinessStatisticsProps> = ({ theme }) => {
  const { data: settings, isLoading } = useSiteSettings();
  const isDark = theme === 'dark';

  const stats = [
    {
      id: 'projects',
      label: 'Completed Projects',
      value: settings?.completed_projects || 40,
      suffix: '+',
    },
    {
      id: 'clients',
      label: 'Happy Clients',
      value: settings?.happy_clients || 98,
      suffix: '%',
    },
    {
      id: 'countries',
      label: 'Countries Served',
      value: settings?.countries_served || 5,
      suffix: '',
    },
    {
      id: 'experience',
      label: 'Years Experience',
      value: settings?.years_experience || 3,
      suffix: '+',
    },
  ];

  return (
    <section className="py-12 border-b border-border-primary">
      <Container size="lg">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  'h-32 rounded-2xl border p-6 flex flex-col items-center justify-center animate-pulse',
                  isDark ? 'bg-[#121417] border-[#23262D]' : 'bg-white border-slate-200'
                )}
              >
                <div className="h-10 w-24 bg-surface-light rounded-md mb-3" />
                <div className="h-4 w-32 bg-surface-light rounded" />
              </div>
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <FadeUp key={stat.id} delay={idx * 0.1}>
                <div
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border p-8 flex flex-col items-center justify-center text-center transition-all duration-300',
                    isDark 
                      ? 'bg-[#121417] border-[#23262D] hover:border-accent-primary/50 hover:bg-[#181a1f]' 
                      : 'bg-white border-slate-200 hover:border-accent-primary/50 hover:shadow-xl hover:shadow-accent-primary/5'
                  )}
                >
                  {/* Subtle glass effect glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-accent-primary to-transparent" />
                  
                  <span className="relative z-10 text-4xl sm:text-5xl font-black tracking-tight text-accent-primary mb-2">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </span>
                  
                  <span className={cn(
                    'relative z-10 text-sm font-semibold tracking-wide uppercase',
                    isDark ? 'text-secondary-text group-hover:text-primary-text' : 'text-secondary-text'
                  )}>
                    {stat.label}
                  </span>
                </div>
              </FadeUp>
            ))}
          </StaggerContainer>
        )}
      </Container>
    </section>
  );
};

export default BusinessStatisticsSection;
