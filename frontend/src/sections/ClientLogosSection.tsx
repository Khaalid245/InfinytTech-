// ─── src/sections/ClientLogosSection.tsx ─────────────────────────────────────
import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { useClients } from '../hooks/useTestimonials';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { resolveImageUrl } from '../utils/imageHelper';
import { StaggerContainer, StaggerItem } from '../components/animation/StaggerContainer';
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
const ClientLogoCard: React.FC<{ client: Client }> = ({ client }) => {
  const [imageError, setImageError] = useState(false);
  const rawLogoUrl = client.company_logo?.file;
  const resolvedLogoUrl = rawLogoUrl ? resolveImageUrl(rawLogoUrl) : undefined;
  
  const hasValidImage = Boolean(resolvedLogoUrl && !imageError);
  const IndustryIcon = getIndustryIcon(client.industry);

  const cardContent = (
    <div className="group relative flex items-center justify-center h-16 sm:h-20 px-5 sm:px-6 py-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 min-w-[150px] sm:min-w-[180px] max-w-[220px] w-full">
      {hasValidImage ? (
        <img
          src={resolvedLogoUrl}
          alt={`${client.company_name} logo`}
          onError={() => setImageError(true)}
          className="max-h-8 sm:max-h-10 max-w-[130px] w-auto object-contain filter grayscale opacity-65 group-hover:grayscale-0 group-hover:opacity-100 dark:brightness-125 transition-all duration-300"
          loading="lazy"
        />
      ) : (
        <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <IndustryIcon className="w-4 h-4" />
          </div>
          <div className="text-left overflow-hidden">
            <div className="font-bold text-xs sm:text-sm tracking-tight truncate max-w-[110px] sm:max-w-[125px]">
              {client.company_name}
            </div>
            {client.industry && (
              <div className="text-[10px] text-slate-400 font-medium truncate max-w-[110px] sm:max-w-[125px]">
                {client.industry}
              </div>
            )}
          </div>
        </div>
      )}

      {/* External link indicator on hover if website is present */}
      {client.website && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-amber-500">
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
    <Section
      background={isDark ? 'primary' : 'light'}
      padding="md"
      className={`border-y border-slate-200/80 dark:border-slate-800/80 overflow-hidden relative ${className || ''}`}
    >
      <Container size="lg">
        {/* Header with pill tag */}
        <div className="text-center mb-10 md:mb-12 max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full border border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-500/5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Social Proof & Partners
          </span>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Forward-thinking organizations that partner with {companyName} to build resilient, mission-critical digital systems.
          </p>
        </div>

        {/* Dynamic Client Grid */}
        {isLoading ? (
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="w-40 sm:w-48 h-16 sm:h-20 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl animate-pulse" 
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-6">
            <p className="text-xs sm:text-sm text-slate-500">
              Unable to load client partners at this moment.
            </p>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs sm:text-sm text-slate-500 border border-slate-200 dark:border-slate-800 border-dashed rounded-xl py-6 px-8 inline-block">
              Client partners will appear here once published from the Admin CMS.
            </p>
          </div>
        ) : (
          <StaggerContainer className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            {clients.map((client: Client) => (
              <StaggerItem key={client.id} className="flex items-center justify-center">
                <ClientLogoCard client={client} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Container>
    </Section>
  );
};

export default ClientLogosSection;
