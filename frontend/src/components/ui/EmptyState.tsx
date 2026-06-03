import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Heading } from './Heading';
import { Text } from './Text';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-border-primary rounded-md bg-surface-light/30 ${className}`}>
      {Icon && (
        <div className="mb-6 p-4 bg-surface-light border border-border-primary text-secondary-text rounded-full inline-flex justify-center items-center">
          <Icon className="w-8 h-8 stroke-[1.25]" />
        </div>
      )}
      <Heading
        variant="h3"
        className="mb-2 text-lg font-medium text-primary-text"
      >
        {title}
      </Heading>
      <Text
        variant="body"
        className="max-w-md text-secondary-text text-small mb-6 leading-relaxed"
      >
        {description}
      </Text>
      {actionText && onAction && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
export default EmptyState;
