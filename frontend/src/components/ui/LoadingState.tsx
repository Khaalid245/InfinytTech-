import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingStateProps {
  variant?: 'spinner' | 'skeleton';
  lines?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'spinner',
  lines = 3,
  className,
}) => {
  if (variant === 'skeleton') {
    return (
      <div className={cn('w-full space-y-4 animate-pulse', className)}>
        <div className="h-6 bg-surface-light border border-border-primary rounded w-1/3" />
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                'h-4 bg-surface-light border border-border-primary rounded',
                idx === lines - 1 ? 'w-2/3' : 'w-full'
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-[3px] border-border-primary" />
        <div className="absolute inset-0 rounded-full border-[3px] border-primary-text border-t-transparent animate-spin" />
      </div>
    </div>
  );
};
export default LoadingState;
