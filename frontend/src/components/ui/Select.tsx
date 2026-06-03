import React from 'react';
import { cn } from '../../utils/cn';
import { Label } from './Label';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, required = false, className, id, ...props }, ref) => {
    const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

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
        <div className="relative w-full">
          <select
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-2.5 bg-surface-light border border-border-primary rounded-md text-body text-primary-text transition-all duration-200 outline-none appearance-none focus:border-primary-text focus:bg-primary-bg disabled:opacity-50 disabled:bg-neutral-50 disabled:pointer-events-none pr-10',
              error && 'border-red-500 focus:border-red-500',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
              >
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-secondary-text">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
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

Select.displayName = 'Select';
export default Select;
