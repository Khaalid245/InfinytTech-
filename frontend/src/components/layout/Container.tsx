import React from 'react';
import { cn } from '../../utils/cn';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  size = 'lg',
  className,
  children,
  ...props
}) => {
  const sizes = {
    sm: 'max-w-3xl',      // 768px - reading optimized
    md: 'max-w-5xl',      // 1024px
    lg: 'max-w-7xl',      // 1280px - default desktop container
    xl: 'max-w-8xl',      // 1440px
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'w-full mx-auto px-4 md:px-8 lg:px-12',
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
export default Container;
