import React from 'react';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { ServiceCard } from '../components/ui/ServiceCard';
import type { ServiceCardProps } from '../components/ui/ServiceCard';
import { cn } from '../utils/cn';

export interface ServicesSectionProps {
  tagline?: string;
  title: string;
  subtitle?: string;
  services: ServiceCardProps[];
  columns?: 2 | 3 | 4;
  background?: 'primary' | 'light';
  className?: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  tagline,
  title,
  subtitle,
  services,
  columns = 3,
  background = 'primary',
  className,
}) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <Section
      background={background}
      padding="lg"
      className={className}
    >
      <Container size="lg">
        {/* Header Block */}
        <div className="max-w-3xl mb-16 md:mb-24 flex flex-col items-start">
          {tagline && (
            <span className="text-caption text-accent-primary font-semibold tracking-wider uppercase mb-3 block">
              {tagline}
            </span>
          )}
          <Heading
            variant="h2"
            className="mb-4 text-3xl md:text-4xl font-medium tracking-tight text-primary-text"
          >
            {title}
          </Heading>
          {subtitle && (
            <Text
              variant="body-large"
              className="text-secondary-text text-base md:text-lg"
            >
              {subtitle}
            </Text>
          )}
        </div>

        {/* Services Grid */}
        <div className={cn('grid gap-8', gridCols[columns])}>
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              {...service}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};
export default ServicesSection;
