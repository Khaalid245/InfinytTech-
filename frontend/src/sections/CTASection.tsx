import React from 'react';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import type { ButtonProps } from '../components/ui/Button';

export interface CTASectionBtn extends Omit<ButtonProps, 'children'> {
  label: string;
}

export interface CTASectionProps {
  tagline?: string;
  title: string;
  subtitle: string;
  ctas?: CTASectionBtn[];
  background?: 'primary' | 'light' | 'accent-light';
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  tagline,
  title,
  subtitle,
  ctas = [],
  background = 'accent-light', // Usually accent-light gives it a subtle gold/amber backdrop highlight
  className,
}) => {
  return (
    <Section
      background={background}
      padding="lg"
      className={className}
    >
      <Container size="md" className="text-center flex flex-col items-center">
        {tagline && (
          <span className="text-caption text-primary-text font-semibold tracking-wider uppercase mb-4 block">
            {tagline}
          </span>
        )}
        
        <Heading
          variant="h2"
          className="mb-4 text-3xl md:text-5xl font-medium tracking-tight text-primary-text leading-[1.15]"
        >
          {title}
        </Heading>
        
        <Text
          variant="body-large"
          className="mb-8 max-w-xl text-secondary-text leading-relaxed text-base md:text-lg"
        >
          {subtitle}
        </Text>
        
        {ctas.length > 0 && (
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {ctas.map((cta, idx) => (
              <Button
                key={idx}
                variant={cta.variant}
                size={cta.size || 'md'}
                {...cta}
              >
                {cta.label}
              </Button>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
};
export default CTASection;
