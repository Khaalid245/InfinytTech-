import { cn } from '../utils/cn';

interface OurStorySectionProps {
  theme: 'dark' | 'light';
}

export default function OurStorySection({ theme }: OurStorySectionProps) {
  const isDark = theme === 'dark';

  // Theme-specific color classes
  const eyebrowText = isDark ? 'text-[#D4A017]' : 'text-[#B8860B]';
  const borderHover = isDark ? 'group-hover:border-[#E6B325]/40' : 'group-hover:border-[#B8860B]/40';

  return (
    <section 
      className={cn(
        'max-w-7xl mx-auto py-16 rounded-3xl p-8 lg:p-16 border transition-all duration-500 ease-in-out group my-16',
        isDark 
          ? 'bg-[#121417]/40 border-[#23262D] text-[#F8FAFC]' 
          : 'bg-[#FAFAFA] border-[#E2E8F0] text-slate-900'
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Left Side: Strategic Narrative & Core Copy */}
        <div className="md:col-span-8 flex flex-col items-start text-left">
          {/* Eyebrow Tag */}
          <span 
            className={cn(
              'text-xs font-bold uppercase tracking-wider block mb-4 transition-colors duration-300',
              eyebrowText
            )}
          >
            Our Story
          </span>

          {/* Section Title */}
          <h2 
            className={cn(
              'text-2xl sm:text-3xl font-black mb-6 tracking-tight transition-colors duration-300',
              isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
            )}
          >
            Bridging Tech Corridors
          </h2>

          {/* Bold Core Narrative */}
          <p 
            className={cn(
              'text-base sm:text-lg font-semibold leading-relaxed mb-6 transition-colors duration-500 ease-out',
              isDark 
                ? 'text-[#F8FAFC] group-hover:text-[#D4A017]' 
                : 'text-slate-900 group-hover:text-[#B8860B]'
            )}
          >
            We believe world-class technology talent exists everywhere. Yet too many organizations struggle to access reliable engineering partners capable of turning ambitious ideas into scalable digital products.
          </p>

          {/* Detailed Body Paragraphs */}
          <div 
            className={cn(
              'text-sm font-light leading-relaxed space-y-4 transition-colors duration-300',
              isDark ? 'text-[#94A3B8]' : 'text-slate-600'
            )}
          >
            <p>
              InfinytTech was founded to bridge that gap. We unite highly disciplined, self-starting developers with international networks, breaking down traditional Silicon Valley corridors to unlock global engineering capacity.
            </p>
            <p>
              By combining strict quality standards, modern development workflows, and a philosophy of long-term partnership, we deliver production-ready SaaS platforms, machine learning systems, and complex product architectures directly to enterprises worldwide on time.
            </p>
          </div>
        </div>

        {/* Right Side: Infinite Logo Loop Badge with hover-rotation */}
        <div className="md:col-span-4 flex items-center justify-center md:justify-end">
          <div 
            className={cn(
              'w-28 h-28 rounded-full border flex items-center justify-center font-bold text-4xl shadow-sm transition-all duration-300 ease-out',
              isDark 
                ? 'border-[#23262D] bg-[#121417] hover:bg-[#181B1F] text-[#D4A017]' 
                : 'border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#B8860B]',
              'group-hover:-translate-y-1 cursor-pointer',
              borderHover
            )}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <span 
              className="inline-block transition-transform duration-500 group-hover:rotate-12 select-none"
              aria-hidden="true"
            >
              ∞
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
