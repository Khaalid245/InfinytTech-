import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface BreadcrumbCrumb {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbCrumb[];
  theme?: 'dark' | 'light';
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, theme = 'dark', className }) => {
  const isDark = theme === 'dark';

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-xs font-medium py-3 select-none', className)}
    >
      <ol className="inline-flex items-center flex-wrap gap-1.5 list-none p-0 m-0">
        {/* Home Item */}
        <li className="inline-flex items-center">
          <Link
            to="/"
            className={cn(
              'inline-flex items-center gap-1.5 transition-colors',
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            )}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.isCurrent;

          return (
            <li key={item.label} className="inline-flex items-center gap-1.5">
              <ChevronRight
                className={cn('w-3.5 h-3.5 shrink-0', isDark ? 'text-slate-600' : 'text-slate-400')}
                aria-hidden="true"
              />
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(
                    'font-semibold line-clamp-1',
                    isDark ? 'text-accent-primary' : 'text-slate-900 font-bold'
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    'transition-colors line-clamp-1',
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
