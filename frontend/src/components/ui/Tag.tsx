import React from 'react';
import { cn } from '../../utils/cn';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
  children: React.ReactNode;
}

export const Tag: React.FC<TagProps> = ({
  active = false,
  onRemove,
  onClick,
  className,
  children,
  ...props
}) => {
  const isClickable = !!onClick;
  
  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 text-small border rounded-full transition-all duration-200 select-none',
        active
          ? 'bg-primary-text border-primary-text text-primary-bg'
          : 'bg-primary-bg border-border-primary text-secondary-text hover:border-primary-text hover:text-primary-text',
        isClickable && 'cursor-pointer',
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e);
          }}
          className={cn(
            'flex items-center justify-center rounded-full w-3.5 h-3.5 hover:bg-neutral-200 focus:outline-none transition-colors ml-0.5 cursor-pointer',
            active && 'hover:bg-neutral-800 text-primary-bg'
          )}
        >
          <svg
            className="w-2.5 h-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};
export default Tag;
