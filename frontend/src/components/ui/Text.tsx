import React from 'react';
import { cn } from '../../utils/cn';

type TextVariant = 'body-large' | 'body' | 'small' | 'caption';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  as?: 'p' | 'span' | 'div';
  children: React.ReactNode;
}

const styles: Record<TextVariant, string> = {
  'body-large': 'text-body-large text-secondary-text leading-relaxed font-light',
  'body': 'text-body text-secondary-text leading-relaxed',
  'small': 'text-small text-secondary-text leading-normal',
  'caption': 'text-caption text-secondary-text uppercase tracking-wider font-semibold',
};

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  as: Component = 'p',
  className,
  children,
  ...props
}) => {
  return (
    <Component
      className={cn(styles[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
};
export default Text;
