import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card } from './Card';
import { Heading } from './Heading';
import { Text } from './Text';
import { Button } from './Button';

export interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  linkText?: string;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon: Icon,
  title,
  description,
  href,
  linkText = 'Learn More',
  className,
}) => {
  return (
    <Card
      variant="outline"
      hoverable
      padding="md"
      className={className}
    >
      <div className="flex flex-col h-full items-start">
        <div className="mb-6 p-3 bg-surface-light rounded-md border border-border-primary text-primary-text inline-flex justify-center items-center">
          <Icon className="w-6 h-6 stroke-[1.5]" />
        </div>
        <Heading
          variant="h3"
          className="mb-3 text-xl font-medium tracking-tight"
        >
          {title}
        </Heading>
        <Text
          variant="body"
          className="mb-6 text-secondary-text leading-relaxed flex-grow"
        >
          {description}
        </Text>
        {href && (
          <Button
            variant="text"
            className="text-small"
          >
            {linkText}
          </Button>
        )}
      </div>
    </Card>
  );
};
export default ServiceCard;
