import React from 'react';
import { cn } from '../../utils/cn';
import { Label } from './Label';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, required = false, className, id, type = 'text', ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full flex flex-col items-start mb-4">
        {label && (
          <Label
            htmlFor={inputId}
            required={required}
          >
            {label}
          </Label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'w-full px-4 py-2.5 bg-surface-light border border-border-primary rounded-md text-body text-primary-text transition-all duration-200 outline-none placeholder:text-neutral-400 focus:border-primary-text focus:bg-primary-bg disabled:opacity-50 disabled:bg-neutral-50 disabled:pointer-events-none',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-small text-red-500 mt-1.5 font-medium leading-none">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span className="text-caption text-secondary-text mt-1.5 leading-none">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
