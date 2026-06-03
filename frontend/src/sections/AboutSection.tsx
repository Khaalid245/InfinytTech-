import React from 'react';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { cn } from '../utils/cn';

export interface AboutFeature {
  label: string;
  value: string;
}

export interface AboutSectionProps {
  tagline?: string;
  title: string;
  paragraphs: string[];
  features?: AboutFeature[];
  imageUrl?: string;
  imagePosition?: 'left' | 'right';
  background?: 'primary' | 'light';
  className?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  tagline,
  title,
  paragraphs,
  features = [],
  imageUrl,
  imagePosition = 'right',
  background = 'primary',
  className,
}) => {
  const isLeft = imagePosition === 'left';

  return (
    <Section
      background={background}
      padding="lg"
      className={className}
    >
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Optional Image Panel */}
          {imageUrl && (
            <div className={cn(
              'w-full lg:col-span-5 flex justify-center',
              isLeft ? 'lg:order-1' : 'lg:order-2'
            )}>
              <div className="w-full aspect-4/3 bg-surface-light border border-border-primary rounded-xl overflow-hidden shadow-elegant">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* Content Column */}
          <div className={cn(
            'flex flex-col items-start',
            imageUrl ? 'lg:col-span-7' : 'lg:col-span-12',
            isLeft ? 'lg:order-2' : 'lg:order-1'
          )}>
            {tagline && (
              <span className="text-caption text-accent-primary font-semibold tracking-wider uppercase mb-3 block">
                {tagline}
              </span>
            )}
            
            <Heading
              variant="h2"
              className="mb-6 text-3xl md:text-4xl font-medium tracking-tight text-primary-text"
            >
              {title}
            </Heading>
            
            <div className="space-y-5 mb-8">
              {paragraphs.map((para, idx) => (
                <Text
                  key={idx}
                  variant="body"
                  className="text-secondary-text leading-relaxed text-base"
                >
                  {para}
                </Text>
              ))}
            </div>

            {/* Features Stats Grid */}
            {features.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border-primary w-full">
                {features.map((feature, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="block text-3xl font-light text-primary-text font-mono tracking-tighter">
                      {feature.value}
                    </span>
                    <span className="block text-caption text-secondary-text tracking-wider uppercase font-semibold">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </Container>
    </Section>
  );
};
export default AboutSection;
