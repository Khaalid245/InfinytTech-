import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../utils/cn';
import { useProcessSteps } from '../hooks/useServices';
import { getLucideIcon } from '../utils/iconHelper';
import { Search, Check } from 'lucide-react';

// ─── Component ────────────────────────────────────────────────────────────────

interface WorkflowTimelineProps {
  theme: 'dark' | 'light';
}

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [activeStep, setActiveStep] = useState<number>(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch process steps via React Query hook
  const { data: rawSteps = [], isLoading, isError } = useProcessSteps();
  const processSteps = [...rawSteps].sort((a, b) => a.order - b.order);

  // Colour tokens
  const bg = isDark ? 'bg-[#0B0D0F]' : 'bg-[#FAFAFA]';
  const textPrimary = isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]';
  const textSecondary = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const textMuted = isDark ? 'text-[#64748B]' : 'text-slate-400';
  const cardBg = isDark
    ? 'bg-[#121417] border-[#23262D]'
    : 'bg-white border-slate-200';
  const dividerColor = isDark ? 'border-[#23262D]' : 'border-slate-200';
  const trackBg = isDark ? 'bg-[#23262D]' : 'bg-slate-200';
  const deliverableRow = isDark
    ? 'border-[#23262D] bg-[#181B1F]/60 hover:bg-[#181B1F] hover:border-[#D4A017]/20'
    : 'border-slate-100 bg-slate-50 hover:bg-[#D4A017]/04 hover:border-[#D4A017]/20';
  const outcomeRow = isDark
    ? 'border-[#23262D] bg-[#121417]/60'
    : 'border-slate-100 bg-white';

  const gold = '#D4A017';

  if (isLoading) {
    return (
      <section className={cn('w-full py-28 lg:py-36 transition-colors duration-300 relative overflow-hidden', bg)} aria-label="Our Delivery Process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 animate-pulse">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="h-6 w-36 bg-slate-200 dark:bg-zinc-800 rounded-full mx-auto" />
            <div className="h-12 w-2/3 bg-slate-200 dark:bg-zinc-800 rounded-md mx-auto" />
            <div className="h-6 w-1/2 bg-slate-200 dark:bg-zinc-800 rounded-md mx-auto" />
          </div>
          <div className="h-32 bg-slate-100 dark:bg-[#121417] border border-slate-200 dark:border-[#23262D] rounded-2xl max-w-5xl mx-auto" />
          <div className="h-96 bg-slate-100 dark:bg-[#121417] border border-slate-200 dark:border-[#23262D] rounded-2xl max-w-5xl mx-auto" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={cn('w-full py-28 lg:py-36 transition-colors duration-300 relative overflow-hidden', bg)} aria-label="Our Delivery Process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <p className={textSecondary}>Error loading delivery process. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (processSteps.length === 0) {
    return (
      <section className={cn('w-full py-28 lg:py-36 transition-colors duration-300 relative overflow-hidden', bg)} aria-label="Our Delivery Process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <p className={textSecondary}>No delivery process steps available.</p>
        </div>
      </section>
    );
  }

  const activeData = processSteps[activeStep];
  const progressPercent = processSteps.length > 1 ? (activeStep / (processSteps.length - 1)) * 100 : 0;

  const goToStep = (idx: number) => {
    setActiveStep(idx);
  };

  // Keyboard navigation on the step-list
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      goToStep(Math.min(activeStep + 1, processSteps.length - 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goToStep(Math.max(activeStep - 1, 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToStep(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToStep(processSteps.length - 1);
    }
  };

  // Scroll panel into view on mobile after step change
  useEffect(() => {
    if (panelRef.current && window.innerWidth < 1024) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeStep]);

  return (
    <section
      className={cn('w-full py-28 lg:py-36 transition-colors duration-300 relative overflow-hidden', bg)}
      aria-label="Our Delivery Process"
    >
      {/* Subtle radial backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${gold} 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">

        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Badge */}
          <div>
            <span
              className={cn(
                'inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full border',
                isDark ? 'border-[#23262D] bg-[#121417]/80' : 'border-slate-200 bg-slate-100'
              )}
              style={{ color: gold }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: gold }}
                aria-hidden="true"
              />
              Our Delivery Process
            </span>
          </div>

          <h2 className={cn('text-4xl sm:text-5xl lg:text-[3.25rem] font-black leading-[1.12] tracking-tight', textPrimary)}>
            From Idea to Product.{' '}
            <span className="block">A Transparent Process.</span>
          </h2>

          <p className={cn('text-base sm:text-lg leading-relaxed font-light max-w-xl mx-auto', textSecondary)}>
            Every successful product follows a structured process designed for clarity, quality,
            speed, and long-term business success.
          </p>
        </div>

        {/* ── Interactive Timeline ────────────────────────────────────────── */}
        <div className="relative max-w-5xl mx-auto">

          {/* Connecting Track — desktop only */}
          <div
            className={cn(
              'hidden lg:block absolute top-[44px] left-[calc(10%+28px)] right-[calc(10%+28px)] h-[2px] z-0 rounded-full overflow-hidden',
              trackBg
            )}
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out"
              style={{ width: `${progressPercent}%`, backgroundColor: gold }}
            />
          </div>

          {/* Step Buttons */}
          <div
            role="tablist"
            aria-label="Process steps"
            className="flex lg:grid lg:grid-cols-5 gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-none relative z-10"
            onKeyDown={handleKeyDown}
          >
            {processSteps.map((step, idx) => {
              const StepIcon = getLucideIcon(step.icon, Search);
              const isActive = activeStep === idx;
              const isCompleted = idx < activeStep;

              return (
                <button
                  key={step.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="process-panel"
                  id={`step-tab-${idx}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => goToStep(idx)}
                  className={cn(
                    'flex-shrink-0 lg:w-full flex flex-col items-center text-center cursor-pointer',
                    'motion-safe:transition-all motion-safe:duration-300 group outline-none',
                    'focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg',
                    isDark ? 'focus-visible:ring-[#D4A017]/60 focus-visible:ring-offset-[#0B0D0F]' : 'focus-visible:ring-[#B8860B]/60 focus-visible:ring-offset-[#FFFFFF]'
                  )}
                >
                  {/* Icon Circle */}
                  <div
                    className={cn(
                      'w-[56px] h-[56px] rounded-full flex items-center justify-center border-2',
                      'motion-safe:transition-all motion-safe:duration-300 z-10 relative',
                      isActive
                        ? 'scale-110'
                        : isCompleted
                        ? isDark ? 'bg-[#181B1F] border-[#D4A017]/40 text-[#D4A017]/70' : 'bg-[#B8860B]/08 border-[#B8860B]/30 text-[#B8860B]'
                        : isDark
                        ? 'bg-[#121417] border-[#23262D] text-[#64748B] group-hover:border-[#D4A017]/20 group-hover:text-[#F8FAFC]'
                        : 'bg-white border-slate-200 text-slate-400 group-hover:border-[#B8860B]/40 group-hover:text-[#0F172A]'
                    )}
                    style={
                      isActive
                        ? {
                            backgroundColor: isDark ? '#0B0D0F' : 'rgba(212,160,23,0.08)',
                            borderColor: gold,
                            color: gold,
                            boxShadow: `0 0 0 4px rgba(212, 160, 23, 0.08), 0 0 24px 4px rgba(212, 160, 23, 0.15)`,
                          }
                        : undefined
                    }
                    aria-hidden="true"
                  >
                    <StepIcon
                      className={cn(
                        'w-5 h-5 motion-safe:transition-transform motion-safe:duration-300',
                        'group-hover:scale-110'
                      )}
                    />
                  </div>

                  {/* Step Label */}
                  <div className="mt-3 space-y-0.5">
                    <span
                      className={cn(
                        'font-mono text-[10px] font-bold tracking-[0.15em] block uppercase',
                        'motion-safe:transition-colors motion-safe:duration-300',
                        isActive ? '' : textMuted
                      )}
                      style={{ color: isActive ? gold : undefined }}
                    >
                      {step.step_number}
                    </span>
                    <span
                      className={cn(
                        'text-[13px] font-semibold tracking-tight block',
                        'motion-safe:transition-colors motion-safe:duration-300',
                        isActive
                          ? textPrimary
                          : isDark
                          ? 'text-zinc-400 group-hover:text-zinc-200'
                          : 'text-slate-500 group-hover:text-slate-700'
                      )}
                    >
                      {step.short_title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Active Detail Panel ─────────────────────────────────────────── */}
        <div
          ref={panelRef}
          id="process-panel"
          role="tabpanel"
          aria-labelledby={`step-tab-${activeStep}`}
          key={activeStep}
          className={cn(
            'rounded-2xl border max-w-5xl mx-auto overflow-hidden',
            'motion-safe:animate-[panelFadeUp_0.35s_cubic-bezier(0.16,1,0.3,1)_both]',
            cardBg
          )}
        >
          {/* Panel top bar */}
          <div
            className={cn('flex items-center justify-between px-8 md:px-12 py-5 border-b', dividerColor)}
          >
            {/* Stage label + icon */}
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-md"
                style={{ color: gold, backgroundColor: isDark ? 'rgba(212,160,23,0.08)' : 'rgba(184,134,11,0.08)' }}
              >
                Stage {activeData.step_number}
              </span>
              {React.createElement(getLucideIcon(activeData.icon, Search), {
                className: 'w-4 h-4',
                style: { color: gold, opacity: 0.7 },
              })}
            </div>
            {/* Duration */}
            <div className="text-right">
              <span className={cn('text-[10px] font-mono tracking-wider uppercase block', textMuted)}>
                Typical Engagement
              </span>
              <span className="text-sm font-bold block mt-0.5" style={{ color: gold }}>
                {activeData.duration}
              </span>
            </div>
          </div>

          {/* Panel main content */}
          <div className="px-8 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* LEFT: title + description */}
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <h3 className={cn('text-2xl sm:text-3xl font-black tracking-tight leading-tight', textPrimary)}>
                  {activeData.full_title}
                </h3>
                <p className={cn('text-base sm:text-[17px] leading-[1.75] font-light', textSecondary)}>
                  {activeData.description}
                </p>
              </div>

              {/* Divider */}
              <hr className={cn('border-0 border-t', dividerColor)} />

              {/* KEY DELIVERABLES */}
              <div>
                <span className={cn('text-[10px] font-bold tracking-[0.18em] uppercase block mb-4', textMuted)}>
                  Key Deliverables
                </span>
                <div className="flex flex-col gap-2.5">
                  {activeData.deliverables.map((item) => (
                    <div
                      key={item}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl border',
                        'motion-safe:transition-colors motion-safe:duration-200',
                        deliverableRow
                      )}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: isDark ? 'rgba(212,160,23,0.1)' : 'rgba(184,134,11,0.1)', color: gold }}
                        aria-hidden="true"
                      >
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                      <span className={cn('text-sm font-medium leading-snug', textPrimary)}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: business outcomes */}
            <div className="flex flex-col gap-8">
              {/* Spacer to align with title block on large screens */}
              <div className="hidden lg:block" style={{ minHeight: '120px' }} aria-hidden="true" />

              {/* Divider (desktop) */}
              <hr className={cn('border-0 border-t hidden lg:block', dividerColor)} />

              {/* BUSINESS OUTCOMES */}
              <div>
                <span className={cn('text-[10px] font-bold tracking-[0.18em] uppercase block mb-4', textMuted)}>
                  Business Outcomes
                </span>
                <div className="flex flex-col gap-2.5">
                  {activeData.outcomes.map((item) => (
                    <div
                      key={item}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl border',
                        outcomeRow
                      )}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 opacity-60"
                        style={{ backgroundColor: isDark ? 'rgba(212,160,23,0.08)' : 'rgba(184,134,11,0.08)', color: gold }}
                        aria-hidden="true"
                      >
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                      <span className={cn('text-sm font-medium leading-snug', textSecondary)}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Trust Footer Strip ──────────────────────────────────────────── */}
        <div className={cn('border-t max-w-5xl mx-auto pt-10', dividerColor)}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Weekly Progress Updates',
              'Dedicated Product Team',
              'Structured 2-Week Build Cycles',
              'Long-Term Technical Partnership',
            ].map((item) => (
              <div
                key={item}
                className={cn(
                  'flex items-center gap-2.5 text-[11px] font-semibold tracking-wider uppercase',
                  textSecondary
                )}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: isDark ? 'rgba(212,160,23,0.1)' : 'rgba(184,134,11,0.1)', color: gold }}
                  aria-hidden="true"
                >
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Panel enter animation keyframes (injected via style tag) */}
      <style>{`
        @keyframes panelFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes panelFadeUp {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        }
      `}</style>
    </section>
  );
};

export default WorkflowTimeline;
