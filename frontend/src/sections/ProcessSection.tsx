import React from 'react';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';

export interface ProcessStep {
  number: string; // e.g. "01"
  title: string;
  description: string;
}

export interface ProcessSectionProps {
  tagline?: string;
  title: string;
  subtitle?: string;
  steps: ProcessStep[];
  background?: 'primary' | 'light';
  className?: string;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({
  tagline,
  title,
  subtitle,
  steps,
  background = 'light', // Typically process sections look good on structured background panels
  className,
}) => {
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

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-start group">
              {/* Step Number Badge */}
              <div className="text-5xl font-light text-border-primary group-hover:text-accent-primary transition-colors duration-300 font-mono tracking-tighter mb-6 leading-none">
                {step.number}
              </div>
              {/* Step Info */}
              <Heading
                variant="h3"
                className="mb-3 text-lg font-medium tracking-tight text-primary-text"
              >
                {step.title}
              </Heading>
              <Text
                variant="body"
                className="text-secondary-text text-small leading-relaxed"
              >
                {step.description}
              </Text>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
export default ProcessSection;
