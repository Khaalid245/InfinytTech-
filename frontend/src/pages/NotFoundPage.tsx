import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Home, ArrowRight, Compass, HelpCircle } from 'lucide-react';
import { cn } from '../utils/cn';

interface NotFoundPageProps {
  theme?: 'dark' | 'light';
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';

  return (
    <div className={cn(
      "min-h-[75vh] flex items-center justify-center py-20 px-4 relative overflow-hidden",
      isDark ? "bg-[#0B0D11] text-white" : "bg-slate-50 text-slate-900"
    )}>
      {/* Background ambient glow effect */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none" 
      />

      <Container size="md" className="relative z-10 text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-primary/60 bg-surface-light/40 backdrop-blur-md mb-6">
          <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
          <span className="text-caption font-semibold tracking-wider uppercase text-accent-primary">
            HTTP 404 &bull; Resource Not Found
          </span>
        </div>

        {/* Hero 404 Headline */}
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary-text via-primary-text/80 to-primary-text/20 mb-4 select-none">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-text mb-4">
          Lost in Digital Space?
        </h2>

        <p className="max-w-md mx-auto text-base text-secondary-text leading-relaxed mb-10">
          The requested path does not exist, has been archived, or was moved during our platform optimization.
        </p>

        {/* Quick Recovery Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-accent-primary hover:bg-accent-secondary text-white transition-all duration-200 shadow-lg shadow-accent-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </Link>

          <Link
            to="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-border-primary bg-surface-light/60 hover:bg-surface-light text-primary-text transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Compass className="w-4 h-4" />
            Explore Solutions
          </Link>
        </div>

        {/* Helpful Quick Links Grid */}
        <div className="max-w-md mx-auto pt-8 border-t border-border-primary/50 text-left">
          <p className="text-caption font-semibold uppercase tracking-wider text-secondary-text mb-4 text-center">
            Popular Destinations
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/work"
              className="flex items-center justify-between p-3 rounded-lg border border-border-primary/40 bg-surface-light/30 hover:bg-surface-light/70 hover:border-accent-primary/40 transition-colors group"
            >
              <span className="text-sm font-medium text-primary-text">Case Studies</span>
              <ArrowRight className="w-4 h-4 text-secondary-text group-hover:text-accent-primary group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              to="/contact"
              className="flex items-center justify-between p-3 rounded-lg border border-border-primary/40 bg-surface-light/30 hover:bg-surface-light/70 hover:border-accent-primary/40 transition-colors group"
            >
              <span className="text-sm font-medium text-primary-text">Contact Support</span>
              <HelpCircle className="w-4 h-4 text-secondary-text group-hover:text-accent-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundPage;
