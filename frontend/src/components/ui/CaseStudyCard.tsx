import React from 'react';
import { Card } from './Card';
import { Heading } from './Heading';
import { Text } from './Text';
import { Button } from './Button';

export interface CaseStudyCardProps {
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  metric?: string;
  metricLabel?: string;
  href?: string;
  className?: string;
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  title,
  category,
  description,
  imageUrl,
  metric,
  metricLabel,
  href,
  className,
}) => {
  return (
    <div className={`group cursor-pointer ${className}`}>
      <Card
        variant="outline"
        padding="none"
        className="overflow-hidden mb-5 border border-border-primary group-hover:border-primary-text transition-all duration-300"
      >
        {imageUrl ? (
          <div className="relative aspect-video w-full overflow-hidden bg-surface-light border-b border-border-primary">
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-surface-light flex items-center justify-center border-b border-border-primary text-secondary-text">
            No image available
          </div>
        )}
        
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start gap-4 mb-4">
            <span className="text-caption text-secondary-text tracking-wider uppercase font-semibold">
              {category}
            </span>
            {metric && (
              <div className="text-right">
                <span className="block text-xl font-medium text-primary-text leading-none">{metric}</span>
                {metricLabel && (
                  <span className="text-[10px] text-secondary-text uppercase tracking-wider font-medium">{metricLabel}</span>
                )}
              </div>
            )}
          </div>
          
          <Heading
            variant="h3"
            className="mb-3 text-xl font-medium leading-snug tracking-tight group-hover:text-neutral-700 transition-colors"
          >
            {title}
          </Heading>
          
          <Text
            variant="body"
            className="mb-6 text-secondary-text text-small line-clamp-2"
          >
            {description}
          </Text>
          
          {href && (
            <Button
              variant="text"
              className="text-small"
            >
              View Case Study
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
export default CaseStudyCard;
