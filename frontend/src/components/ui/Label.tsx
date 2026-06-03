import React from 'react';
import { cn } from '../../utils/cn';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({
  required = false,
  className,
  children,
  ...props
}) => {
  return (
    <label
      className={cn(
        'text-small font-medium text-primary-text block select-none mb-1.5',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-accent-primary ml-1 font-bold">*</span>}
    </label>
  );
};
export default Label;
