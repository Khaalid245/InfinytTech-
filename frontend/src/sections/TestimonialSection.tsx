import React from 'react';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { TestimonialCard } from '../components/ui/TestimonialCard';
import type { TestimonialCardProps } from '../components/ui/TestimonialCard';

export interface TestimonialSectionProps {
  tagline?: string;
  title: string;
  subtitle?: string;
  testimonials: TestimonialCardProps[];
  background?: 'primary' | 'light';
  className?: string;
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({
  tagline,
  title,
  subtitle,
  testimonials,
  background = 'primary',
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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              {...testimonial}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};
export default TestimonialSection;
