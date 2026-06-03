import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'outline' | 'elevation';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'outline',
  hoverable = false,
  padding = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'bg-primary-bg rounded-md transition-all duration-300';
  
  const variants = {
    flat: 'border border-transparent bg-surface-light',
    outline: 'border border-border-primary',
    elevation: 'shadow-elegant',
  };

  const hovers = {
    flat: 'hover:bg-neutral-100/50',
    outline: 'hover:border-primary-text hover:shadow-elegant',
    elevation: 'hover:shadow-elegant-lg hover:-translate-y-0.5',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6 md:p-8',
    lg: 'p-8 md:p-12',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverable && hovers[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
