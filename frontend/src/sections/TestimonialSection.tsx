import React from 'react';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { TestimonialCard } from '../components/ui/TestimonialCard';
import { useFeaturedTestimonials } from '../hooks/useTestimonials';
import { LoadingState } from '../components/ui/LoadingState';
import { StaggerContainer, StaggerItem } from '../components/animation/StaggerContainer';

export interface TestimonialSectionProps {
  tagline?: string;
  title?: string;
  subtitle?: string;
  background?: 'primary' | 'light';
  className?: string;
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({
  tagline = "Testimonials",
  title = "What Our Clients Say",
  subtitle,
  background = 'primary',
  className,
}) => {
  const { data: testimonialsData, isLoading, isError } = useFeaturedTestimonials();
  const testimonials = testimonialsData?.results || [];

  if (isError) {
    return (
      <Section background={background} padding="lg" className={className}>
        <Container size="lg">
          <div className="text-center py-12 border border-border-primary border-dashed rounded-xl">
            <Text variant="body" className="text-secondary-text">Unable to load testimonials. Please try again later.</Text>
          </div>
        </Container>
      </Section>
    );
  }

  if (!isLoading && testimonials.length === 0) {
    return (
      <Section background={background} padding="lg" className={className}>
        <Container size="lg">
          <div className="text-center py-12 border border-border-primary border-dashed rounded-xl bg-surface-light/50">
            <Text variant="body" className="text-secondary-text">Client testimonials will appear here soon.</Text>
          </div>
        </Container>
      </Section>
    );
  }

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

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingState />
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((t: any, index: number) => (
              <StaggerItem 
                key={t.id} 
                className={index === 0 ? "md:col-span-1 lg:col-span-2" : "col-span-1"}
              >
                <TestimonialCard
                  quote={t.testimonial}
                  author={t.author_name}
                  role={t.author_position}
                  company={t.client.company_name}
                  imageUrl={t.author_photo?.file}
                  clientLogoUrl={t.client.company_logo?.file}
                  rating={t.rating}
                  projectUrl={t.related_project ? `/work?library=${t.related_project.slug}` : undefined}
                  className="h-full w-full"
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Container>
    </Section>
  );
};
export default TestimonialSection;
