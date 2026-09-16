// ─── src/sections/ClientLogosSection.tsx ─────────────────────────────────────
import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { useClients } from '../hooks/useTestimonials';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { resolveImageUrl } from '../utils/imageHelper';
import { StaggerContainer, StaggerItem } from '../components/animation/StaggerContainer';
import { cn } from '../utils/cn';
import { 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  GraduationCap, 
  Coins, 
  Cloud, 
  HeartPulse, 
  Boxes, 
  Scale, 
  Lock 
} from 'lucide-react';
import type { Client } from '../types/testimonials';

export interface ClientLogosSectionProps {
  title?: string;
  theme?: 'dark' | 'light';
  className?: string;
}

// Map industry to modern Lucide icon for typographic badges
function getIndustryIcon(industry?: string) {
  const ind = (industry || '').toLowerCase();
  if (ind.includes('fintech') || ind.includes('bank') || ind.includes('pay')) return Coins;
  if (ind.includes('edtech') || ind.includes('education') || ind.includes('learn')) return GraduationCap;
  if (ind.includes('cloud') || ind.includes('infra') || ind.includes('devops')) return Cloud;
  if (ind.includes('health') || ind.includes('bio') || ind.includes('med')) return HeartPulse;
  if (ind.includes('supply') || ind.includes('logistics') || ind.includes('freight')) return Boxes;
  if (ind.includes('legal') || ind.includes('compliance') || ind.includes('law')) return Scale;
  if (ind.includes('cyber') || ind.includes('sec')) return Lock;
  if (ind.includes('ai') || ind.includes('tech')) return Sparkles;
  return Building2;
}

// Individual Client Logo / Badge Item Component
const ClientLogoCard: React.FC<{ client: Client; isDark: boolean }> = ({ client, isDark }) => {
  const [imageError, setImageError] = useState(false);
  const rawLogoUrl = client.company_logo?.file;
  const resolvedLogoUrl = rawLogoUrl ? resolveImageUrl(rawLogoUrl) : undefined;
  
  const hasValidImage = Boolean(resolvedLogoUrl && !imageError);
  const IndustryIcon = getIndustryIcon(client.industry);

  const cardContent = (
    <div
      className={cn(
        'group relative flex items-center justify-center h-16 sm:h-20 px-5 sm:px-6 py-3 rounded-2xl transition-all duration-300 min-w-[150px] sm:min-w-[180px] max-w-[220px] w-full',
        isDark
          ? 'bg-[#121417] border border-[#23262D] text-slate-200 shadow-sm hover:border-[#D4A017]/50 hover:shadow-lg hover:-translate-y-1'
          : 'bg-white border border-slate-200/90 text-slate-800 shadow-sm hover:border-amber-500/40 hover:shadow-md hover:-translate-y-1'
      )}
    >
      {hasValidImage ? (
        <img
          src={resolvedLogoUrl}
          alt={`${client.company_name} logo`}
          onError={() => setImageError(true)}
          className={cn(
            'max-h-8 sm:max-h-10 max-w-[130px] w-auto object-contain transition-all duration-300',
            isDark
              ? 'filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 brightness-110'
              : 'filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 contrast-125'
          )}
          loading="lazy"
        />
      ) : (
        <div
          className={cn(
            'flex items-center gap-2.5 transition-colors',
            isDark
              ? 'text-slate-200 group-hover:text-[#D4A017]'
              : 'text-slate-800 group-hover:text-amber-600'
          )}
        >
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
              isDark
                ? 'bg-[#D4A017]/15 text-[#D4A017]'
                : 'bg-amber-500/10 text-amber-600'
            )}
          >
            <IndustryIcon className="w-4 h-4" />
          </div>
          <div className="text-left overflow-hidden">
            <div
              className={cn(
                'font-bold text-xs sm:text-sm tracking-tight truncate max-w-[110px] sm:max-w-[125px]',
                isDark ? 'text-slate-100' : 'text-slate-900'
              )}
            >
              {client.company_name}
            </div>
            {client.industry && (
              <div
                className={cn(
                  'text-[10px] font-medium truncate max-w-[110px] sm:max-w-[125px]',
                  isDark ? 'text-slate-400' : 'text-slate-500'
                )}
              >
                {client.industry}
              </div>
            )}
          </div>
        </div>
      )}

      {/* External link indicator on hover if website is present */}
      {client.website && (
        <div
          className={cn(
            'absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity',
            isDark ? 'text-slate-400 hover:text-[#D4A017]' : 'text-slate-400 hover:text-amber-600'
          )}
        >
          <ExternalLink className="w-3 h-3" />
        </div>
      )}
    </div>
  );

  if (client.website) {
    return (
      <a
        href={client.website}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-2xl"
        title={`Visit ${client.company_name} (${client.industry || 'Client'})`}
      >
        {cardContent}
      </a>
    );
  }

  return <div>{cardContent}</div>;
};

export const ClientLogosSection: React.FC<ClientLogosSectionProps> = ({
  title = "Trusted by innovative companies worldwide",
  theme = 'light',
  className,
}) => {
  const { data: clientsData, isLoading, isError } = useClients();
  const { data: settings } = useSiteSettings();
  const clients: Client[] = clientsData?.results || [];

  const isDark = theme === 'dark';
  const companyName = settings?.company_name || 'InfinytTech';

  return (
    <section
      className={cn(
        'py-14 sm:py-18 px-4 sm:px-6 lg:px-8 border-y transition-colors duration-300 overflow-hidden relative',
        isDark
          ? 'bg-[#0B0D0F] border-[#23262D]'
          : 'bg-[#F8FAFC] border-[#E2E8F0]',
        className
      )}
    >
      <Container size="lg">
        {/* Header with pill tag */}
        <div className="text-center mb-10 md:mb-12 max-w-3xl mx-auto space-y-3">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full border transition-all duration-300',
              isDark
                ? 'border-[#23262D] text-[#D4A017] bg-[#121417]'
                : 'border-[#E2E8F0] text-[#B8860B] bg-white shadow-xs'
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Social Proof & Partners
          </span>

          <h3
            className={cn(
              'text-xl sm:text-2xl md:text-3xl font-bold tracking-tight',
              isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
            )}
          >
            {title}
          </h3>

          <p
            className={cn(
              'text-xs sm:text-sm max-w-xl mx-auto',
              isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'
            )}
          >
            Forward-thinking organizations that partner with {companyName} to build resilient, mission-critical digital systems.
          </p>
        </div>

        {/* Dynamic Client Grid */}
        {isLoading ? (
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-40 sm:w-48 h-16 sm:h-20 rounded-2xl animate-pulse border',
                  isDark
                    ? 'bg-[#121417] border-[#23262D]'
                    : 'bg-white border-slate-200'
                )}
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-6">
            <p className={cn('text-xs sm:text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
              Unable to load client partners at this moment.
            </p>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-6">
            <p
              className={cn(
                'text-xs sm:text-sm border border-dashed rounded-xl py-6 px-8 inline-block',
                isDark ? 'text-slate-400 border-[#23262D]' : 'text-slate-500 border-slate-200'
              )}
            >
              Client partners will appear here once published from the Admin CMS.
            </p>
          </div>
        ) : (
          <StaggerContainer className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            {clients.map((client: Client) => (
              <StaggerItem key={client.id} className="flex items-center justify-center">
                <ClientLogoCard client={client} isDark={isDark} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Container>
    </section>
  );
};

export default ClientLogosSection;
