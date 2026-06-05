import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

interface ServicesHeroProps {
  theme: 'dark' | 'light';
  setCurrentPage?: (page: string) => void;
}

export const ServicesHero: React.FC<ServicesHeroProps> = ({ theme, setCurrentPage }) => {
  const isDark = theme === 'dark';

  const textPrimary = isDark ? 'text-white' : 'text-[#0F172A]';
  const textSecondary = isDark ? 'text-[#D4D4D4]' : 'text-[#475569]';

  return (
    <section 
      className={cn(
        'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 pt-8 pb-16 transition-colors duration-300'
      )}
    >
      {/* 1. Sovereign Capabilities Badge / Services & Expertise */}
      <div>
        <span
          className={cn(
            'inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border transition-all duration-300',
            isDark 
              ? 'border-[#2A2A2A] text-[#FACC15] bg-[#171717]' 
              : 'border-slate-200 text-[#CA8A04] bg-slate-100'
          )}
        >
          Services & Expertise
        </span>
      </div>

      {/* 2. Main High-Contrast Headline with Gradient Highlight */}
      <h1 
        className={cn(
          'text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight max-w-4xl mx-auto',
          textPrimary
        )}
      >
        Technology Solutions <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-500 to-yellow-400">
          Built for Growth.
        </span>
      </h1>

      {/* 3. Supporting Description Body */}
      <p 
        className={cn(
          'text-lg sm:text-xl font-light leading-relaxed max-w-2xl mx-auto',
          textSecondary
        )}
      >
        We help startups, businesses, and organizations design, build, and scale digital products through engineering, AI, cloud infrastructure, and product design.
      </p>

      {/* 4. Flex Row CTAs with tactile scale transitions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2 w-full sm:w-auto">
        <Link
          to="/contact"
          onClick={() => setCurrentPage?.('contact')}
          className={cn(
            'inline-flex items-center justify-center px-8 py-4 rounded-xl text-sm font-extrabold transition-all duration-200 active:scale-95 w-full sm:w-auto shadow-xl cursor-pointer',
            isDark
              ? 'bg-[#FACC15] text-[#0F0F10] shadow-yellow-500/10 hover:bg-[#EAB308]'
              : 'bg-[#CA8A04] text-white shadow-amber-600/10 hover:bg-[#B45309]'
          )}
        >
          Start Your Project
        </Link>

        <Link
          to="/work"
          onClick={() => setCurrentPage?.('portfolio')}
          className={cn(
            'inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 w-full sm:w-auto cursor-pointer',
            isDark
              ? 'border border-[#2A2A2A] bg-[#171717] text-white hover:bg-[#1F1F1F]'
              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          )}
        >
          View Our Work
        </Link>
      </div>

      {/* 5. Service Indicators */}
      <div className="pt-10 flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-6 gap-y-3 text-xs sm:text-sm font-semibold tracking-wide">
        {[
          'Web Development',
          'Mobile Apps',
          'AI Solutions',
          'Product Design',
          'Cloud & DevOps'
        ].map((item, index) => (
          <React.Fragment key={item}>
            {index > 0 && (
              <span className={isDark ? 'text-zinc-800 select-none' : 'text-slate-300 select-none'} aria-hidden="true">
                •
              </span>
            )}
            <span
              className={cn(
                'transition-all duration-200',
                isDark 
                  ? 'text-zinc-400 hover:text-[#FACC15]' 
                  : 'text-slate-500 hover:text-[#CA8A04]'
              )}
            >
              {item}
            </span>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default ServicesHero;

