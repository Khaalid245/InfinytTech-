import React, { useState, useCallback, useId } from 'react';
import { cn } from '../utils/cn';
import { Plus, Minus, Calendar, ArrowRight } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AnswerBlock {
  intro: string;
  bullets?: string[];
  outro?: string;
}

interface FaqItem {
  question: string;
  answer: AnswerBlock;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FAQS: FaqItem[] = [
  {
    question: 'How long does a typical project take?',
    answer: {
      intro: 'Most projects take 8–14 weeks from discovery to launch. Timelines vary based on scope, complexity, and your team\'s availability.',
      bullets: [
        'Discovery & planning',
        'Design & engineering',
        'Testing & deployment',
        'Regular milestone reviews',
      ],
      outro: 'Larger enterprise platforms with multiple integrations typically span 4–6 months. Every engagement starts with a scoped roadmap before development begins.',
    },
  },
  {
    question: 'Do you work with startups and enterprises?',
    answer: {
      intro: 'Yes. We adapt our process to your stage and size.',
      bullets: [
        'Startups — rapid MVP development with lean, scalable architecture',
        'Growing businesses — structured feature expansion and platform scaling',
        'Enterprises — digital transformation and legacy system modernisation',
      ],
      outro: 'Our team treats your context as the primary design constraint.',
    },
  },
  {
    question: 'Can you improve or rebuild an existing product?',
    answer: {
      intro: 'Absolutely. We regularly step into existing projects without disrupting what is already working.',
      bullets: [
        'Technical audits and codebase reviews',
        'User experience redesigns',
        'Legacy system modernisation',
        'Platform scaling and performance tuning',
      ],
    },
  },
  {
    question: 'What technologies do you use?',
    answer: {
      intro: 'We select technologies based on your business requirements, not trends.',
      bullets: [
        'Frontend — React, Next.js, TypeScript',
        'Backend — Node.js, Python, REST & GraphQL APIs',
        'Infrastructure — AWS, GCP, Vercel, Docker',
        'Data — PostgreSQL, MongoDB, Redis',
      ],
      outro: 'Every selection prioritises long-term maintainability, security, and scalability.',
    },
  },
  {
    question: 'How do you communicate during development?',
    answer: {
      intro: 'You have full visibility throughout the project — never a black box.',
      bullets: [
        'Weekly progress updates and sprint reviews',
        'Shared project management and staging environments',
        'Direct access to your engineering team',
        'Structured documentation at every milestone',
      ],
    },
  },
  {
    question: 'Do you provide support after launch?',
    answer: {
      intro: 'Yes. We offer structured post-launch support so your product keeps improving.',
      bullets: [
        'Ongoing maintenance and bug resolution',
        'Cloud monitoring and performance optimisation',
        'Feature expansion and roadmap execution',
        'SLA-backed technical partnership',
      ],
    },
  },
];

// ─── Accordion Item ────────────────────────────────────────────────────────────

interface AccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  isDark: boolean;
  isLast: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  item,
  isOpen,
  onToggle,
  isDark,
  isLast,
}) => {
  const uid      = useId();
  const headerId = `faq-h-${uid}`;
  const panelId  = `faq-p-${uid}`;
  const gold     = '#D4A017';

  const textSecondary = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const bulletDot     = isDark ? '#23262D'        : '#CBD5E1';

  return (
    <div
      className={cn(
        // Divider approach instead of card boxes — cleaner reading rail
        'group border-b',
        isLast ? 'border-b-0' : '',
        isDark ? 'border-[#23262D]' : 'border-slate-200'
      )}
    >
      {/* Trigger ────────────────────────────────────────────────────────── */}
      <button
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className={cn(
          'w-full flex items-center gap-4 py-6 text-left cursor-pointer',
          'motion-safe:transition-all motion-safe:duration-300',
          'outline-none focus-visible:ring-2 focus-visible:ring-inset rounded-sm',
          isDark ? 'focus-visible:ring-[#D4A017]/30' : 'focus-visible:ring-amber-400/40',
          // Hover: subtle warm tint on the row
          !isOpen && (isDark
            ? 'hover:bg-[#D4A017]/[0.03]'
            : 'hover:bg-amber-50/60'),
          'px-2 -mx-2 rounded-xl'
        )}
      >
        {/* Question text */}
        <span
          className={cn(
            'flex-1 text-[15px] sm:text-base font-semibold tracking-tight leading-snug',
            'motion-safe:transition-colors motion-safe:duration-200',
            isOpen
              ? isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
              : isDark ? 'text-[#94A3B8]' : 'text-[#1E293B]',
            'group-hover:' + (isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]')
          )}
        >
          {item.question}
        </span>

        {/* Icon — rotates + turns gold on open ─────────────────────────── */}
        <span
          className={cn(
            'w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0',
            'motion-safe:transition-all motion-safe:duration-300',
            // Hover rotate on closed
            !isOpen && 'group-hover:rotate-90'
          )}
          style={
            isOpen
              ? { borderColor: `${gold}40`, color: gold, backgroundColor: `${gold}0D` }
              : {
                  borderColor: isDark ? '#23262D' : '#E2E8F0',
                  color:       isDark ? '#64748B' : '#94A3B8',
                }
          }
          aria-hidden="true"
        >
          {isOpen
            ? <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
            : <Plus  className="w-3.5 h-3.5" strokeWidth={2.5} />}
        </span>
      </button>

      {/* Answer panel — CSS grid-rows trick for smooth height ────────────── */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={cn(
          'grid motion-safe:transition-all motion-safe:duration-[350ms] motion-safe:ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-7 pt-0 pl-0 pr-2 space-y-4">
            {/* Intro sentence */}
            <p className={cn('text-[15px] font-light leading-[1.8]', textSecondary)}>
              {item.answer.intro}
            </p>

            {/* Bullet list */}
            {item.answer.bullets && (
              <ul className="space-y-2.5" aria-label="Details">
                {item.answer.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    {/* Dot */}
                    <span
                      className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: bulletDot }}
                      aria-hidden="true"
                    />
                    <span className={cn('text-[14px] font-light leading-relaxed', textSecondary)}>
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Closing sentence */}
            {item.answer.outro && (
              <p className={cn('text-[14px] font-light leading-relaxed italic', textSecondary)}>
                {item.answer.outro}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Section ───────────────────────────────────────────────────────────────────

interface ServicesFaqSectionProps {
  theme: 'dark' | 'light';
}

export const ServicesFaqSection: React.FC<ServicesFaqSectionProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const gold          = '#D4A017';
  const bg            = isDark ? 'bg-[#0B0D0F]'  : 'bg-[#FAFAFA]';
  const textPrimary   = isDark ? 'text-[#F8FAFC]'     : 'text-[#0F172A]';
  const textSecondary = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';

  const toggle = useCallback(
    (idx: number) => setOpenIndex(prev => (prev === idx ? null : idx)),
    []
  );

  const handleDiscoveryCall = () => {
    window.dispatchEvent(new CustomEvent('open-booking-modal'));
  };

  return (
    <section
      className={cn(
        'w-full py-28 lg:py-36 transition-colors duration-300 relative overflow-hidden',
        bg
      )}
      aria-label="Frequently Asked Questions"
    >
      {/* Top accent line */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${gold}20, transparent)` }}
        aria-hidden="true"
      />

      {/* ── Outer container: 1200px ─────────────────────────────────────── */}
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">

          {/* Badge */}
          <span
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border"
            style={{
              color: gold,
              borderColor: isDark ? '#23262D' : '#E2E8F0',
              backgroundColor: isDark ? '#121417' : '#F8FAFC',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gold }} aria-hidden="true" />
            Frequently Asked Questions
          </span>

          {/* Heading */}
          <h2 className={cn('text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight', textPrimary)}>
            Everything You Need to Know<br className="hidden sm:block" />{' '}
            Before We Build Together
          </h2>

          {/* Subtitle */}
          <p className={cn('text-base sm:text-[17px] font-light leading-[1.75]', textSecondary)}>
            We believe great partnerships begin with clarity. Here are answers to the questions
            clients ask most before working with InfinytTech.
          </p>
        </div>

        {/* ── Accordion — constrained to 860px, centered ─────────────────── */}
        <div className="max-w-[860px] mx-auto">

          {/* Subtle container — bordered rail */}
          <div
            className={cn(
              'rounded-2xl border overflow-hidden',
              isDark ? 'border-[#23262D] bg-[#121417]' : 'border-slate-200 bg-white'
            )}
          >
            <div className="px-6 sm:px-10">
              {FAQS.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  item={faq}
                  isOpen={openIndex === idx}
                  onToggle={() => toggle(idx)}
                  isDark={isDark}
                  isLast={idx === FAQS.length - 1}
                />
              ))}
            </div>
          </div>

          {/* ── Trust footer ───────────────────────────────────────────────── */}
          <div
            className={cn(
              'mt-4 rounded-2xl border px-8 sm:px-10 py-8',
              'flex flex-col sm:flex-row items-center justify-between gap-6',
              'motion-safe:transition-colors motion-safe:duration-300',
              isDark
                ? 'border-[#23262D] bg-[#121417]'
                : 'border-slate-200 bg-white'
            )}
          >
            {/* Copy */}
            <div className="text-center sm:text-left space-y-1.5 max-w-sm">
              <h3 className={cn('text-[17px] font-bold tracking-tight', textPrimary)}>
                Still have questions?
              </h3>
              <p className={cn('text-sm font-light leading-relaxed', textSecondary)}>
                Our engineering team is happy to discuss your project, architecture,
                timeline, or business goals.
              </p>
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              {/* Primary — gold */}
              <button
                type="button"
                onClick={handleDiscoveryCall}
                className={cn(
                  'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl',
                  'text-sm font-bold tracking-wide whitespace-nowrap',
                  'motion-safe:transition-all motion-safe:duration-300 group',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  isDark
                    ? 'bg-[#D4A017] text-[#0B0D0F] hover:bg-[#E6B325] focus-visible:ring-[#D4A017]/60 focus-visible:ring-offset-[#121417]'
                    : 'bg-[#0F172A] text-white hover:bg-slate-800 focus-visible:ring-slate-900/40 focus-visible:ring-offset-white'
                )}
              >
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
                Book a Discovery Call
              </button>

              {/* Secondary — ghost */}
              <a
                href="/contact"
                className={cn(
                  'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border',
                  'text-sm font-semibold tracking-wide whitespace-nowrap',
                  'motion-safe:transition-all motion-safe:duration-300 group',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  isDark
                    ? 'border-[#23262D] text-[#94A3B8] hover:border-[#D4A017]/30 hover:text-white focus-visible:ring-[#D4A017]/30 focus-visible:ring-offset-[#121417]'
                    : 'border-slate-200 text-slate-700 hover:border-amber-200 hover:text-slate-900 focus-visible:ring-slate-400/40 focus-visible:ring-offset-white'
                )}
              >
                Contact Our Team
                <ArrowRight
                  className="w-3.5 h-3.5 flex-shrink-0 motion-safe:transition-transform motion-safe:duration-300 group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ServicesFaqSection;
