import React, { useState } from 'react';
import { cn } from '../utils/cn';

// ─── Types ────────────────────────────────────────────────────────────────
interface Step {
  num: string;
  title: string;
  action: string;
  detail: string;
}

interface WorkflowTimelineProps {
  theme: 'dark' | 'light';
}

// ─── Static step data ─────────────────────────────────────────────────────
const STEPS: Step[] = [
  {
    num: '01',
    title: 'Strategy & Discovery',
    action: 'Aligning business goals, user needs, and product requirements.',
    detail:
      'We conduct scoping workshops, market research, and stakeholder alignment sessions to define the product vision, scoping blueprints, and key success metrics before any design or code begins.',
  },
  {
    num: '02',
    title: 'Architecture & Planning',
    action: 'Defining system blueprints, technology stack, and milestones.',
    detail:
      'Our team designs a secure, scalable system architecture and maps out a detailed implementation roadmap with clear development phases, integration criteria, and delivery timelines.',
  },
  {
    num: '03',
    title: 'Design & Development',
    action: 'Creating premium user experiences and robust software.',
    detail:
      'We design high-fidelity, intuitive user interfaces in Figma and build them using modern, scalable frontend and backend technologies, delivering regular progress updates and interactive demos.',
  },
  {
    num: '04',
    title: 'Testing & Optimization',
    action: 'Validating quality, performance, and security.',
    detail:
      'We perform comprehensive QA checks, load testing, security audits, and performance tuning to ensure your product is exceptionally fast, secure, and ready for real-world traffic.',
  },
  {
    num: '05',
    title: 'Launch & Growth',
    action: 'Deploying seamlessly and supporting long-term success.',
    detail:
      'We handle deployment to cloud environments with zero downtime and provide active monitoring, telemetry analysis, and strategic support to help scale your product as your business grows.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────
export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [activeStep, setActiveStep] = useState<number | null>(null);

  // ── colour tokens ──────────────────────────────────────────────────────
  const bg      = isDark ? '#0F0F10' : '#FAFAFA';
  const cardBg  = isDark ? '#171717' : '#FFFFFF';
  const border  = isDark ? '#2A2A2A' : '#E2E8F0';
  const accent  = isDark ? '#FACC15' : '#CA8A04';
  const accent2 = isDark ? '#EAB308' : '#B45309';
  const primary = isDark ? '#FFFFFF' : '#0F172A';
  const sub     = isDark ? '#D4D4D4' : '#475569';
  const dim     = isDark ? '#6B7280' : '#94A3B8';
  const trackInactive = isDark ? '#2A2A2A' : '#E2E8F0';

  return (
    <section
      style={{ background: bg }}
      className="w-full py-24 px-4 sm:px-6 lg:px-8"
      aria-label="Workflow Architecture Timeline"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Section header ────────────────────────────────────────────── */}
        <div className="text-center mb-20">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border mb-4"
            style={{
              background:  isDark ? '#1F1F1F' : '#F1F5F9',
              borderColor: isDark ? '#2A2A2A' : '#E2E8F0',
              color:       accent,
            }}
          >
            Our Workflow Architecture
          </span>
          <h2
            className="text-3xl sm:text-4xl font-black tracking-tight mt-2 mb-4"
            style={{ color: primary }}
          >
            How We Ensure Project Success
          </h2>
          <p
            className="text-base font-light leading-relaxed max-w-xl mx-auto"
            style={{ color: sub }}
          >
            We follow structured product engineering protocols, eliminating friction
            from discovery to cloud deployment.
          </p>
        </div>

        {/* ── Timeline ──────────────────────────────────────────────────── */}
        <div className="relative">

          {/* ── Desktop center vertical track ── */}
          <div
            className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5"
            style={{ background: trackInactive }}
            aria-hidden
          >
            {/* Animated gradient overlay — travels down the track */}
            <div
              className="absolute inset-0 w-full"
              style={{
                background: `linear-gradient(to bottom, ${accent}, ${accent2})`,
                maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
              }}
            />
          </div>

          {/* ── Mobile left-rail vertical track ── */}
          <div
            className="lg:hidden absolute left-[15px] top-0 bottom-0 w-0.5"
            style={{ background: trackInactive }}
            aria-hidden
          >
            <div
              className="absolute inset-0 w-full"
              style={{
                background: `linear-gradient(to bottom, ${accent}, ${accent2})`,
                maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
              }}
            />
          </div>

          {/* ── Steps ── */}
          <div className="space-y-12 lg:space-y-16">
            {STEPS.map((step, idx) => {
              const isRight   = idx % 2 === 1;          // odd steps go right
              const isFocused = activeStep === idx;
              const isDimmed  = activeStep !== null && !isFocused;

              return (
                <div
                  key={step.num}
                  onMouseEnter={() => setActiveStep(idx)}
                  onMouseLeave={() => setActiveStep(null)}
                  className={cn(
                    // Mobile: left-rail layout
                    'relative flex items-start gap-6 pl-12',
                    // Desktop: alternating center layout
                    'lg:pl-0 lg:flex lg:items-center lg:gap-0',
                    isRight ? 'lg:flex-row-reverse' : 'lg:flex-row',
                    'transition-opacity duration-300',
                    isDimmed ? 'opacity-40' : 'opacity-100'
                  )}
                >
                  {/* ── Content block ── */}
                  <div
                    className={cn(
                      'flex-1 lg:w-1/2',
                      // Desktop padding — push content away from center circle
                      isRight ? 'lg:pl-12' : 'lg:pr-12',
                      'lg:flex',
                      isRight ? 'lg:justify-start' : 'lg:justify-end'
                    )}
                  >
                    <div
                      className={cn(
                        'rounded-2xl border p-6 md:p-7 transition-all duration-300 w-full lg:max-w-md',
                        isFocused ? 'shadow-lg' : ''
                      )}
                      style={{
                        background:  cardBg,
                        borderColor: isFocused
                          ? isDark ? 'rgba(234,179,8,0.35)' : 'rgba(202,138,4,0.35)'
                          : border,
                        boxShadow: isFocused
                          ? `0 12px 32px -6px ${isDark ? 'rgba(234,179,8,0.10)' : 'rgba(202,138,4,0.08)'}`
                          : undefined,
                      }}
                    >
                      {/* Step number */}
                      <span
                        className="text-xs font-black font-mono tracking-widest mb-2 block"
                        style={{ color: accent }}
                      >
                        {step.num}
                      </span>

                      {/* Title */}
                      <h3
                        className="text-xl font-black tracking-tight mb-2"
                        style={{ color: primary }}
                      >
                        {step.title}
                      </h3>

                      {/* Core action */}
                      <p
                        className="text-sm font-semibold mb-3 leading-snug"
                        style={{ color: isFocused ? accent : sub }}
                      >
                        {step.action}
                      </p>

                      {/* Detail */}
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: dim }}
                      >
                        {step.detail}
                      </p>
                    </div>
                  </div>

                  {/* ── Central circle badge (desktop) / left-rail circle (mobile) ── */}
                  {/* Mobile circle — absolute over the left rail */}
                  <div
                    className={cn(
                      'lg:hidden absolute left-0 top-6 w-8 h-8 rounded-full border-2 flex items-center justify-center',
                      'transition-all duration-300 flex-shrink-0',
                      isFocused ? 'scale-110' : 'scale-100'
                    )}
                    style={{
                      background:  isDark ? '#1F1F1F' : '#FFFFFF',
                      borderColor: accent,
                      color:       accent,
                      boxShadow:   isFocused
                        ? `0 0 0 4px ${isDark ? 'rgba(234,179,8,0.15)' : 'rgba(202,138,4,0.12)'}`
                        : undefined,
                    }}
                  >
                    <span className="text-[10px] font-black font-mono">{step.num}</span>
                  </div>

                  {/* Desktop circle — sits on the center line */}
                  <div
                    className={cn(
                      'hidden lg:flex absolute left-1/2 -translate-x-1/2',
                      'w-12 h-12 rounded-full border-2 items-center justify-center',
                      'transition-all duration-300 z-10 cursor-default',
                      isFocused ? 'scale-110' : 'scale-100'
                    )}
                    style={{
                      background:  isDark ? '#1F1F1F' : '#FFFFFF',
                      borderColor: accent,
                      color:       accent,
                      boxShadow:   isFocused
                        ? `0 0 0 6px ${isDark ? 'rgba(234,179,8,0.15)' : 'rgba(202,138,4,0.12)'}, 0 4px 16px -4px ${isDark ? 'rgba(234,179,8,0.25)' : 'rgba(202,138,4,0.20)'}`
                        : `0 0 0 3px ${isDark ? 'rgba(234,179,8,0.06)' : 'rgba(202,138,4,0.06)'}`,
                    }}
                    aria-hidden
                  >
                    <span className="text-xs font-black font-mono">{step.num}</span>
                  </div>

                  {/* ── Empty spacer — keeps flex proportions on desktop ── */}
                  <div className="hidden lg:block lg:w-1/2" aria-hidden />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowTimeline;
