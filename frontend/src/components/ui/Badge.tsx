import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm select-none';
  
  const variants = {
    primary: 'bg-primary-text text-primary-bg',
    secondary: 'bg-surface-light text-secondary-text border border-border-primary',
    accent: 'bg-accent-primary/10 text-neutral-800 border border-accent-primary/20',
    outline: 'border border-primary-text text-primary-text bg-transparent',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};
export default Badge;
