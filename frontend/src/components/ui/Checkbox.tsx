import React from 'react';
import { cn } from '../../utils/cn';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col items-start mb-4">
        <label className="flex items-start cursor-pointer select-none">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={cn('peer sr-only', className)}
            {...props}
          />
          <div className="w-5 h-5 border border-border-primary rounded-sm flex items-center justify-center bg-surface-light peer-checked:bg-primary-text peer-checked:border-primary-text peer-focus:border-primary-text peer-checked:[&_svg]:scale-100 peer-checked:[&_svg]:opacity-100 transition-all duration-200 mr-3 mt-0.5 flex-shrink-0">
            <svg
              className="w-3.5 h-3.5 text-primary-bg scale-75 opacity-0 transition-all duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          {label && (
            <span className="text-small text-secondary-text leading-tight cursor-pointer font-medium pt-0.5">
              {label}
            </span>
          )}
        </label>
        {error && (
          <span className="text-small text-red-500 mt-1.5 font-medium leading-none pl-8">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
