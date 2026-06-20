
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';

// ─── Standard, thin-stroke (2px) inline SVGs ─────────────────────────────
const Icon = {
  ArrowRight: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Check: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

interface Step {
  num: string;
  title: string;
  desc: string;
}

interface InteractiveCtaSectionProps {
  theme: 'dark' | 'light';
  onNavigate?: (id: string) => void;
}

export default function InteractiveCtaSection({ theme, onNavigate }: InteractiveCtaSectionProps) {
  const isDark = theme === 'dark';

  const steps: Step[] = [
    { num: '1', title: 'Discovery Call', desc: 'We learn about your goals, requirements, and timeline.' },
    { num: '2', title: 'Product Assessment', desc: 'Our team evaluates scope, technical requirements, and opportunities.' },
    { num: '3', title: 'Roadmap & Proposal', desc: 'Receive a clear plan, timeline, and project estimate.' },
    { num: '4', title: 'Build & Scale', desc: 'Engineering scalable systems with continuous optimization and growth.' },
  ];

  // Color Mapping Tokens
  const bgSection = isDark 
    ? 'bg-[#121417]/30 border-t border-[#23262D]' 
    : 'bg-[#F1F5F9]/40 border-t border-slate-200';
  const bgPanel = isDark ? 'bg-[#0B0D0F]' : 'bg-white shadow-lg shadow-slate-100';
  const textPrimary = isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]';
  const textSecondary = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const borderBase = isDark ? 'border-[#23262D]' : 'border-[#E2E8F0]';
  
  const handleOpenScheduler = () => {
    window.dispatchEvent(new CustomEvent('open-booking-modal'));
  };

  return (
    <section className={cn('py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300', bgSection)}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* ══════════════════════════════════════════════════════════════
            LEFT COLUMN — High-Conversion Copy & scheduler CTAs
        ══════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-6 flex flex-col gap-6 items-start">
          {/* Eyebrow Tag */}
          <span
            className={cn(
              'inline-flex items-center text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border transition-all duration-300',
              isDark 
                ? 'border-[#23262D] text-[#D4A017] bg-[#0B0D0F]' 
                : 'border-[#E2E8F0] text-[#B8860B] bg-white shadow-sm'
            )}
          >
            LET'S BUILD TOGETHER
          </span>

          {/* Section Title */}
          <h2 className={cn('text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight', textPrimary)}>
            Ready to Work With a Long-Term Technology Partner?
          </h2>

          {/* Supporting Narrative */}
          <p className={cn('text-base font-light leading-relaxed max-w-xl', textSecondary)}>
            We partner with ambitious startups, businesses, and organizations to transform ideas into scalable digital products through strategy, engineering, and long-term collaboration.
          </p>

          {/* Action Buttons — primary first, clear hierarchy */}
          <div className="flex flex-col gap-3 pt-2 w-full sm:w-auto">
            {/* PRIMARY: Book a Discovery Call — lowest friction, clearest next step */}
            <Button
              type="button"
              variant="primary"
              onClick={handleOpenScheduler}
              className={cn(
                'gap-2 px-8 py-4 shadow-md w-full sm:w-auto border-none font-bold text-base',
                isDark
                  ? 'bg-[#D4A017] text-[#0B0D0F] hover:bg-[#E6B325] shadow-amber-500/5'
                  : 'bg-[#0F172A] text-white hover:bg-slate-800 shadow-slate-900/10'
              )}
            >
              Book a Free Discovery Call
              <Icon.ArrowRight className="w-4 h-4" />
            </Button>

            {/* Micro-copy: removes hesitation */}
            <p className={cn('text-xs font-light text-center sm:text-left', textSecondary)}>
              No commitment required — we'll discuss your goals and recommend a path forward.
            </p>

            {/* SECONDARY: direct project start */}
            <Button
              to="/contact"
              variant="secondary"
              onClick={() => onNavigate?.('contact')}
              className={cn(
                'px-6 py-3 w-full sm:w-auto text-sm',
                isDark
                  ? 'bg-transparent text-[#94A3B8] border-[#23262D] hover:bg-[#121417] hover:border-[#23262D]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              )}
            >
              or send us a project brief →
            </Button>
          </div>

          {/* Support Metadata Trust Lines */}
          <div className="space-y-2 pt-2 text-xs font-medium">
            {/* Trust Line 1 */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
              </span>
              <span className={textSecondary}>Typically responds within 24 hours.</span>
            </div>
            
            {/* Trust Line 2 */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E6B325]"></span>
              <span className={textSecondary}>Let's discuss your goals, timeline, and requirements.</span>
            </div>

            {/* Trust Line 3 */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#3B82F6]"></span>
              <span className={textSecondary}>No-obligation consultation.</span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            RIGHT COLUMN — Onboarding Roadmap Timeline Card
        ══════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-6 w-full">
          <div
            className={cn(
              'relative rounded-2xl border p-6 md:p-8 flex flex-col gap-8 transition-all duration-300',
              bgPanel,
              borderBase
            )}
          >
            {/* Card Title */}
            <div>
              <h3 className={cn('text-lg font-bold tracking-tight', textPrimary)}>
                How We Start Every Partnership
              </h3>
              <p className="text-xs opacity-50 mt-1 select-none">
                Our structured path from initial outreach to product scale.
              </p>
            </div>

            {/* Steps Timeline Wrapper */}
            <div className="relative flex flex-col gap-6">
              {/* Vertical line indicator */}
              <div 
                className={cn(
                  'absolute left-[15px] top-6 bottom-6 w-[1.5px] pointer-events-none bg-gradient-to-b'
                )}
                style={{
                  backgroundImage: isDark
                    ? 'linear-gradient(to bottom, #E6B325 0%, rgba(230,179,37,0) 100%)'
                    : 'linear-gradient(to bottom, #B8860B 0%, rgba(184,134,11,0) 100%)',
                }}
              />

              {/* Render Steps */}
              {steps.map((step) => (
                <div key={step.num} className="group flex items-start gap-4 relative">
                  {/* Step Bubble index bubble */}
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 flex-shrink-0',
                      'group-hover:scale-110',
                      isDark
                        ? 'bg-[#121417] border-[#23262D] text-[#94A3B8] group-hover:border-[#E6B325] group-hover:text-[#D4A017] group-hover:shadow-[0_0_12px_rgba(212,160,23,0.2)]'
                        : 'bg-[#FAFAFA] border-[#E2E8F0] text-slate-500 group-hover:border-[#B8860B] group-hover:text-[#B8860B] group-hover:shadow-[0_0_12px_rgba(184,134,11,0.15)]'
                    )}
                  >
                    {step.num}
                  </div>

                  {/* Step Content */}
                  <div className="space-y-1 pt-1.5">
                    <h4 className={cn('text-sm font-bold tracking-tight transition-colors duration-300', textPrimary)}>
                      {step.title}
                    </h4>
                    <p className={cn('text-xs font-light leading-relaxed', textSecondary)}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footprint Trust Area Checklist Grid */}
            <div 
              className={cn(
                'pt-6 border-t grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-normal select-none',
                 isDark ? 'border-[#23262D]' : 'border-slate-100'
              )}
            >
              {[
                'Secure cloud deployments',
                'Clear project roadmap',
                'Dedicated product team',
                'Long-term support available',
              ].map((bullet) => (
                <div key={bullet} className="flex items-center gap-2">
                  <Icon.Check 
                    className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-500" 
                  />
                  <span className={textSecondary}>{bullet}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
