// ─── src/sections/ClientLogosSection.tsx ─────────────────────────────────────
import React from 'react';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { useClients } from '../hooks/useTestimonials';
import { Image } from '../components/ui/Image';
import { StaggerContainer, StaggerItem } from '../components/animation/StaggerContainer';

export interface ClientLogosSectionProps {
  title?: string;
  theme?: 'dark' | 'light';
  className?: string;
}

export const ClientLogosSection: React.FC<ClientLogosSectionProps> = ({
  title = "Trusted by innovative companies worldwide",
  theme = 'light',
  className,
}) => {
  const { data: clientsData, isLoading, isError } = useClients();
  const clients = clientsData?.results || [];

  return (
    <Section
      background={theme === 'dark' ? 'primary' : 'light'}
      padding="md"
      className={`border-y border-border-primary/50 overflow-hidden ${className || ''}`}
    >
      <Container size="lg">
        {title && (
          <div className="text-center mb-10 md:mb-14">
            <h3 className="text-sm md:text-base font-semibold tracking-wider uppercase text-secondary-text mb-2">
              {title}
            </h3>
            <p className="text-xs md:text-sm text-secondary-text/70 max-w-2xl mx-auto">
              Organizations that trust InfinytTech to build modern digital solutions.
            </p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-24 md:w-36 h-10 md:h-14 bg-surface-light border border-border-primary rounded-md animate-pulse opacity-50" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-sm text-secondary-text">Unable to load client logos. Please try again later.</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-secondary-text border border-border-primary border-dashed rounded-lg py-6 inline-block px-12">
              Client logos will appear here soon.
            </p>
          </div>
        ) : (
          <StaggerContainer className="flex flex-wrap justify-center items-center gap-x-10 gap-y-8 md:gap-x-16 md:gap-y-12 lg:gap-x-20">
            {clients.map((client: any) => {
              const logoUrl = client.company_logo?.file;
              if (!logoUrl) return null;

              return (
                <StaggerItem 
                  key={client.id} 
                  className="flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300 ease-out grayscale hover:grayscale-0 hover:scale-105 w-24 md:w-32 lg:w-40"
                  aria-label={`Logo of ${client.company_name}`}
                >
                  <Image
                    src={logoUrl}
                    alt={`${client.company_name} logo`}
                    className="h-10 md:h-14 w-auto object-contain"
                  />
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </Container>
    </Section>
  );
};

export default ClientLogosSection;
