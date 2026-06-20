import React from 'react';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';
import { ArrowRight } from 'lucide-react';

interface PortfolioCtaProps {
  theme: 'dark' | 'light';
}

export const PortfolioCtaSection: React.FC<PortfolioCtaProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const gold    = '#D4A017';
  const bg      = isDark ? 'bg-[#0B0D0F]'  : 'bg-[#F8FAFC]';
  const textPri = isDark ? 'text-[#F8FAFC]'     : 'text-[#0F172A]';
  const textSec = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';

  const handleOpenBooking = () => {
    window.dispatchEvent(new CustomEvent('open-booking-modal'));
  };

  return (
    <section
      className={cn('relative w-full py-28 px-4 sm:px-6 lg:px-8 border-t overflow-hidden transition-colors duration-300', bg)}
      style={{ borderColor: isDark ? '#1E1E20' : '#E8EDF3' }}
      aria-label="Start Your Project"
    >
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[720px] h-[350px] opacity-[0.04] -z-0"
        style={{ background: `radial-gradient(ellipse 65% 55% at 50% 100%, ${gold}, transparent 70%)` }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[800px] mx-auto text-center flex flex-col items-center">
        {/* Section label */}
        <span
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border mb-8"
          style={{ color: gold, borderColor: isDark ? '#252527' : '#E2E8F0', backgroundColor: isDark ? 'rgba(20,20,22,0.9)' : '#F1F5F9' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gold }} aria-hidden="true" />
          GET STARTED
        </span>

        {/* Headline */}
        <h2 className={cn('text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-[1.1] max-w-2xl', textPri)}>
          Ready to Build Your Next Product?
        </h2>

        {/* Subtitle */}
        <p className={cn('text-base sm:text-lg font-light leading-relaxed max-w-xl mb-10', textSec)}>
          Whether you're launching a startup, modernizing operations, or exploring AI, we're ready to help.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center sm:w-auto">
          <Button
            to="/contact"
            variant="primary"
            className={cn(
              'inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold w-full sm:w-auto border-none',
              'transition-all duration-200',
              isDark
                ? 'bg-[#D4A017] text-[#0B0D0F] hover:bg-[#E6B325] shadow-lg shadow-amber-600/10'
                : 'bg-[#0F172A] text-white hover:bg-slate-800'
            )}
          >
            Start Your Project
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Button>

          <Button
            onClick={handleOpenBooking}
            variant="secondary"
            className={cn(
              'px-8 py-4 text-sm font-semibold w-full sm:w-auto',
              'transition-all duration-200',
              isDark
                ? 'border-[#23262D] bg-transparent text-[#94A3B8] hover:bg-[#121417] hover:border-[#23262D]'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            )}
          >
            Book Discovery Call
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioCtaSection;
