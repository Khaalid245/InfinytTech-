import React from 'react';
import { cn } from '../../utils/cn';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: HeadingLevel;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span';
  children: React.ReactNode;
}

const styles: Record<HeadingLevel, string> = {
  h1: 'text-h1 font-medium tracking-tight text-primary-text',
  h2: 'text-h2 font-medium tracking-tight text-primary-text',
  h3: 'text-h3 font-medium tracking-tight text-primary-text',
  h4: 'text-h4 font-medium tracking-tight text-primary-text',
};

export const Heading: React.FC<HeadingProps> = ({
  variant = 'h1',
  as,
  className,
  children,
  ...props
}) => {
  const Component = as || variant;
  return (
    <Component
      className={cn(styles[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
};
export default Heading;
