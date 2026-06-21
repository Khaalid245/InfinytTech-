import React, { useEffect, useRef } from 'react';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';
import { ArrowRight, ChevronDown, Check } from 'lucide-react';

interface ServicesHeroProps {
  theme: 'dark' | 'light';
  setCurrentPage?: (page: string) => void;
}

const TRUST_ITEMS = [
  'Strategy First',
  'Enterprise Engineering',
  'Transparent Delivery',
  'Long-Term Partnership',
] as const;

// ─────────────────────────────────────────────────────────────────────────────

export const ServicesHero: React.FC<ServicesHeroProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const wrapperRef = useRef<HTMLDivElement>(null);

  const gold    = '#D4A017';
  const bg      = isDark ? 'bg-[#0B0D0F]'  : 'bg-[#F8FAFC]';
  const textPri = isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]';
  const textSec = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';

  // Smooth fade-up on mount
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { el.style.opacity = '1'; return; }

    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.style.transition =
          'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      })
    );
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      className={cn('relative w-full overflow-hidden transition-colors duration-300', bg)}
      aria-label="SERVICES & EXPERTISE"
    >
      {/* Headline atmosphere glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[420px] opacity-[0.06]"
        style={{ background: `radial-gradient(ellipse 65% 55% at 50% 0%, ${gold}, transparent 70%)` }}
        aria-hidden="true"
      />
      {/* Top accent line */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${gold}20, transparent)` }}
        aria-hidden="true"
      />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div
        ref={wrapperRef}
        className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 flex flex-col items-center text-center"
      >

        {/* Section label */}
        <span
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border mb-8"
          style={{ color: gold, borderColor: isDark ? '#23262D' : '#E2E8F0', backgroundColor: isDark ? '#121417' : '#F1F5F9' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gold }} aria-hidden="true" />
          SERVICES &amp; EXPERTISE
        </span>

        {/* ── Headline ── two punchy lines, period-terminated for authority */}
        <h1
          className={cn(
            'text-[2.75rem] sm:text-5xl lg:text-[3.75rem] font-black leading-[1.08] tracking-tight mb-6 max-w-[780px]',
            textPri
          )}
        >
          Build Better{' '}
          <span style={{ color: gold }}>Digital Products.</span>
          <br />
          Scale With Confidence.
        </h1>

        {/* ── Supporting text — max 2 readable lines ── */}
        <p
          className={cn('text-base sm:text-[17px] font-light leading-[1.75] mb-10', textSec)}
          style={{ maxWidth: '620px' }}
        >
          We help startups and growing businesses design, build, and launch
          web platforms, mobile apps, AI solutions, and cloud systems.
        </p>

        {/* ── CTA Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center sm:w-auto mb-6">
          <Button
            to="/contact"
            variant="primary"
            className={cn(
              'inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold w-full sm:w-auto border-none',
              'motion-safe:transition-all motion-safe:duration-200',
              isDark
                ? 'bg-[#D4A017] text-[#0B0D0F] hover:bg-[#E6B325] shadow-lg shadow-amber-500/10'
                : 'bg-[#0F172A] text-white hover:bg-slate-800'
            )}
          >
            Start Your Project
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Button>

          <Button
            to="/#portfolio"
            variant="secondary"
            className={cn(
              'px-8 py-4 text-sm font-semibold w-full sm:w-auto',
              'motion-safe:transition-all motion-safe:duration-200',
              isDark
                ? 'border-[#23262D] bg-transparent text-[#94A3B8] hover:bg-[#121417] hover:border-[#23262D]'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            )}
          >
            View Case Studies
          </Button>
        </div>

        {/* ── Trust row — lightweight, directly below CTAs ── */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 mb-12"
          role="list"
          aria-label="Our commitments"
        >
          {TRUST_ITEMS.map((item) => (
            <div key={item} role="listitem" className="flex items-center gap-1.5">
              <Check
                className="w-3.5 h-3.5 flex-shrink-0"
                style={{ color: gold }}
                strokeWidth={3}
                aria-hidden="true"
              />
              <span
                className="text-[12px] font-medium tracking-wide"
                style={{ color: isDark ? '#64748B' : '#94A3B8' }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* ── Scroll cue ── */}
        <button
          onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to capabilities"
          className="flex flex-col items-center gap-1.5 mt-4 cursor-pointer opacity-30 hover:opacity-70 motion-safe:transition-opacity motion-safe:duration-300 outline-none focus-visible:opacity-70"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: isDark ? '#64748B' : '#CBD5E1' }}>
            Explore Capabilities
          </span>
          <ChevronDown className={cn('w-4 h-4 motion-safe:animate-bounce', isDark ? 'text-zinc-700' : 'text-slate-300')} strokeWidth={2} />
        </button>
      </div>

      {/* Bottom section fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-28"
        style={{ background: `linear-gradient(to bottom, transparent, ${isDark ? '#0B0D0F' : '#FAFAFA'})` }}
        aria-hidden="true"
      />
    </section>
  );
};

export default ServicesHero;
