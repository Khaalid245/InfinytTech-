import React from 'react';
import { cn } from '../../utils/cn';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  background?: 'primary' | 'light' | 'accent-light';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  background = 'primary',
  padding = 'lg',
  className,
  children,
  ...props
}) => {
  const backgrounds = {
    primary: 'bg-primary-bg text-primary-text',
    light: 'bg-surface-light text-primary-text border-y border-border-primary',
    'accent-light': 'bg-accent-primary/5 text-primary-text',
  };

  const paddings = {
    none: 'py-0',
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-20',
    lg: 'py-16 md:py-28', // Standard enterprise vertical breathing room
    xl: 'py-24 md:py-40', // Premium hero/editorial layout space
  };

  return (
    <section
      className={cn(
        'w-full relative overflow-hidden',
        backgrounds[background],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};
export default Section;
