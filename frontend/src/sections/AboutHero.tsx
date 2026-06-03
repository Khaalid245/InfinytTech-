import { cn } from '../utils/cn';

interface AboutHeroProps {
  theme: 'dark' | 'light';
}

export default function AboutHero({ theme }: AboutHeroProps) {
  const isDark = theme === 'dark';

  const manifesto = [
    { title: 'Built in Africa', desc: "Powered by the continent's top technical minds." },
    { title: 'Designed for the World', desc: 'Engineered to compete in Palo Alto, London, and Tokyo.' },
    { title: 'Business First', desc: 'Delivering measurable commercial impact, not just lines of code.' },
    { title: 'Engineering Excellence', desc: 'Strict compilation audits and zero technical debt guarantees.' },
    { title: 'Long-Term Partnership', desc: 'Committed to active scaling, cloud support, and lasting SLAs.' },
  ];

  // Theme-specific style tokens
  const bgSection = isDark ? 'bg-[#0F0F10]' : 'bg-[#FAFAFA]';
  const textPrimary = isDark ? 'text-white' : 'text-[#0F172A]';
  const textSecondary = isDark ? 'text-[#D4D4D4]' : 'text-[#475569]';
  const borderBase = isDark ? 'border-[#2A2A2A]' : 'border-[#E2E8F0]';
  const cardBg = isDark ? 'bg-[#171717]' : 'bg-white';
  const accentColor = isDark ? '#EAB308' : '#CA8A04'; // Golden vs Amber

  return (
    <section className={cn('py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300', bgSection)}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* ══════════════════════════════════════════════════════════════
            LEFT COLUMN — Strategic Narrative & Metrics (lg:col-span-7)
        ══════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 flex flex-col gap-6 items-start">
          {/* Eyebrow Tag */}
          <span
            className={cn(
              'inline-flex items-center text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border transition-all duration-300',
              isDark 
                ? 'border-[#2A2A2A] text-[#FACC15] bg-[#171717]' 
                : 'border-[#E2E8F0] text-[#CA8A04] bg-white shadow-sm'
            )}
          >
            LET'S BUILD TOGETHER
          </span>

          {/* Section Title */}
          <h1 className={cn('text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight', textPrimary)}>
            Building the Future of Digital Innovation from Africa.
          </h1>

          {/* Strategic Paragraph */}
          <p className={cn('text-lg sm:text-xl font-light leading-relaxed max-w-2xl', textSecondary)}>
            We partner with ambitious startups, enterprises, and organizations to design, engineer, and scale world-class digital products.
          </p>

          {/* Core Metrics Grid */}
          <div className={cn('grid grid-cols-3 gap-4 pt-6 border-t w-full mt-2', borderBase)}>
            {[
              { val: 'Top 1.5%', label: 'Elite Developer Select' },
              { val: 'Silicon Valley', label: 'Standards Workflow' },
              { val: 'Sovereign', label: 'Scale Infrastructure' },
            ].map((metric) => (
              <div key={metric.val} className="flex flex-col gap-1">
                <span 
                  className="text-base sm:text-lg lg:text-xl font-black tracking-tight"
                  style={{ color: accentColor }}
                >
                  {metric.val}
                </span>
                <span className={cn('text-[9px] sm:text-xs font-semibold uppercase tracking-wider', textSecondary)}>
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            RIGHT COLUMN — Manifesto Card (lg:col-span-5)
        ══════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 w-full">
          <div
            className={cn(
              'group relative p-8 rounded-3xl border overflow-hidden transition-all duration-300 shadow-xl',
              cardBg,
              borderBase
            )}
          >
            {/* Ambient Backlight Gradient Glow */}
            <div 
              className="absolute -top-10 -right-10 w-24 h-24 rounded-full pointer-events-none blur-xl transition-all duration-500" 
              style={{
                background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`
              }}
            />

            {/* Header Bar */}
            <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: isDark ? '#2A2A2A' : '#E2E8F0' }}>
              <span className={cn('text-xs font-mono font-bold uppercase tracking-wider', textPrimary)}>
                THE MANIFESTO
              </span>
              <span 
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border select-none"
                style={{
                  borderColor: isDark ? '#2A2A2A' : '#E2E8F0',
                  color: accentColor,
                  background: isDark ? '#1F1F1F' : '#F8FAFC'
                }}
              >
                Our Creed
              </span>
            </div>

            {/* Manifesto Items */}
            <div className="flex flex-col gap-4">
              {manifesto.map((item, idx) => {
                const num = `0${idx + 1}`;
                return (
                  <div 
                    key={item.title} 
                    className="group/row flex items-start gap-4 p-3 rounded-2xl transition-all duration-300 hover:bg-[#EAB308]/5 dark:hover:bg-[#EAB308]/[0.02]"
                  >
                    {/* Index Badge */}
                    <div 
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 flex-shrink-0 border',
                        'group-hover/row:scale-115',
                        isDark 
                          ? 'bg-[#1F1F1F] border-[#2A2A2A] text-zinc-400 group-hover/row:border-[#EAB308] group-hover/row:text-[#FACC15] group-hover/row:shadow-[0_0_12px_rgba(234,179,8,0.2)]'
                          : 'bg-[#F1F5F9] border-[#E2E8F0] text-slate-500 group-hover/row:border-[#CA8A04] group-hover/row:text-[#CA8A04]'
                      )}
                    >
                      {num}
                    </div>

                    {/* Content */}
                    <div className="space-y-0.5 pt-0.5">
                      <h4 
                        className={cn(
                          'text-sm font-bold tracking-tight transition-colors duration-200',
                          textPrimary,
                          isDark ? 'group-hover/row:text-[#FACC15]' : 'group-hover/row:text-[#CA8A04]'
                        )}
                      >
                        {item.title}
                      </h4>
                      <p className={cn('text-xs font-light leading-relaxed', textSecondary)}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
