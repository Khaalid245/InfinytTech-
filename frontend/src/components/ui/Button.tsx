import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'group relative overflow-hidden inline-flex items-center justify-center transition-all duration-300 active:scale-95 focus:outline-none select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer before:absolute before:inset-0 before:z-0 before:bg-current/5 before:translate-y-[100%] hover:before:translate-y-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.16,1,0.3,1)]';

    const variants = {
      primary: 'font-semibold rounded-xl bg-primary-text dark:bg-accent-secondary text-[color:var(--color-primary-bg)] border border-primary-text dark:border-accent-secondary hover:bg-neutral-800 dark:hover:bg-accent-primary dark:hover:border-accent-primary',
      secondary: 'font-medium rounded-md bg-primary-bg text-primary-text border border-border-primary hover:bg-surface-light hover:border-primary-text',
      ghost: 'font-medium rounded-md bg-transparent text-primary-text hover:bg-surface-light active:bg-border-primary',
      text: 'font-medium rounded-md bg-transparent text-primary-text p-0 hover:text-accent-primary relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-accent-primary after:transition-all after:duration-200',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3 text-base gap-2.5',
    };

    // Text variant doesn't need sizes padding
    const sizeStyle = variant === 'text' ? 'text-body font-medium' : sizes[size];

    const innerContent = (
      <>
        {isLoading && (
          <svg
            className="relative z-10 animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="relative z-10 flex-shrink-0">{leftIcon}</span>}
        <span className="relative z-10 inline-flex overflow-hidden">
          <span className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-[150%]">
            {children}
          </span>
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-y-[150%] group-hover:translate-y-0">
            {children}
          </span>
        </span>
        {!isLoading && rightIcon && <span className="relative z-10 flex-shrink-0">{rightIcon}</span>}
      </>
    );

    if (props.to) {
      return (
        <Link
          to={props.to}
          className={cn(baseStyles, variants[variant], sizeStyle, className)}
          onClick={props.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        >
          {innerContent}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizeStyle, className)}
        {...props}
      >
        {innerContent}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
