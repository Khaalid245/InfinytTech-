import React from 'react';
import { Card } from './Card';
import { Text } from './Text';

export interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  imageUrl?: string;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  company,
  imageUrl,
  className,
}) => {
  return (
    <Card
      variant="outline"
      padding="md"
      className={className}
    >
      <div className="flex flex-col h-full justify-between">
        <Text
          variant="body-large"
          className="mb-8 text-primary-text font-serif italic relative before:content-['“'] before:text-4xl before:text-accent-primary/20 before:absolute before:-top-4 before:-left-4 text-lg md:text-xl leading-relaxed"
        >
          {quote}
        </Text>
        <div className="flex items-center gap-4 border-t border-border-primary pt-6 mt-auto">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={author}
              loading="lazy"
              className="w-12 h-12 rounded-full object-cover border border-border-primary grayscale"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-surface-light border border-border-primary flex items-center justify-center font-medium text-primary-text">
              {author.charAt(0)}
            </div>
          )}
          <div>
            <span className="block text-body font-medium text-primary-text leading-tight">{author}</span>
            <span className="text-small text-secondary-text leading-tight block mt-0.5">
              {role}, <span className="font-medium text-neutral-600">{company}</span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default TestimonialCard;
