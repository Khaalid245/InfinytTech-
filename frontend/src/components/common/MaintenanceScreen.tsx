import React from 'react';
import { Wrench, Mail, Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SiteSettings } from '../../types/siteSettings.types';

void React;

interface MaintenanceScreenProps {
  theme?: 'dark' | 'light';
  settings?: SiteSettings | null;
}

/**
 * Branded Maintenance Screen displayed when site-wide maintenance mode is active.
 * Unauthenticated visitors see this recovery view, while administrators can
 * bypass it or access the staff login portal.
 */
export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  settings,
}) => {
  const companyName = settings?.company_name || 'Infinity Technologies';
  const contactEmail = settings?.primary_email || settings?.sales_email || 'contact@infinyttech.com';

  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-primary-bg text-primary-text relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-xl mx-auto text-center space-y-8 relative z-10">
        {/* Status pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/25 text-accent-primary text-xs font-semibold uppercase tracking-wider shadow-sm">
          <Wrench className="w-3.5 h-3.5 animate-pulse" />
          <span>System Maintenance • Platform Upgrades</span>
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium tracking-tight leading-tight">
            Engineering Upgrades in Progress
          </h1>
          <p className="text-secondary-text text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            {companyName} is currently undergoing scheduled platform maintenance to enhance security, scalability, and infrastructure performance. Normal service will resume shortly.
          </p>
        </div>

        {/* Feature status indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left p-5 rounded-2xl bg-surface-light border border-border-primary/60 backdrop-blur-sm shadow-xl">
          <div className="flex items-start gap-3 p-2">
            <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center text-accent-primary shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-primary-text">Infrastructure Upgrades</p>
              <p className="text-[11px] text-secondary-text">Deploying reliability and performance optimizations.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 shrink-0 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            </div>
            <div>
              <p className="text-xs font-semibold text-primary-text">Data Security</p>
              <p className="text-[11px] text-secondary-text">All user records and project data are safe and secure.</p>
            </div>
          </div>
        </div>

        {/* Call-to-actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href={`mailto:${contactEmail}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-primary text-primary-bg font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-accent-primary/20"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Core Team</span>
          </a>
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface-muted border border-border-primary text-primary-text font-medium text-sm hover:border-accent-primary/50 transition-all"
          >
            <Lock className="w-4 h-4 text-secondary-text" />
            <span>Staff Portal Login</span>
          </Link>
        </div>

        <p className="text-caption text-secondary-text/80 text-xs pt-4">
          Need immediate enterprise support? Email us directly at{' '}
          <a href={`mailto:${contactEmail}`} className="text-accent-primary hover:underline">
            {contactEmail}
          </a>
        </p>
      </div>
    </div>
  );
};

export default MaintenanceScreen;
