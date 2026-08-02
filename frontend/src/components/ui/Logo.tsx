import React from 'react';
import { cn } from '../../utils/cn';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { resolveImageUrl } from '../../utils/imageHelper';

interface LogoProps {
  className?: string;
  theme?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ className, theme = 'dark' }) => {
  const { data: settings, isLoading } = useSiteSettings();

  if (isLoading) {
    return <div className={cn("bg-slate-200/20 animate-pulse rounded-md", className)} style={{ width: '120px' }} />;
  }

  let logoUrl: string | null = null;
  if (settings) {
    if (theme === 'dark' && settings.dark_logo_details?.url) {
      logoUrl = settings.dark_logo_details.url;
    } else if (theme === 'light' && settings.light_logo_details?.url) {
      logoUrl = settings.light_logo_details.url;
    } else if (settings.primary_logo_details?.url) {
      logoUrl = settings.primary_logo_details.url;
    }
  }

  const companyName = settings?.company_name || 'Company';

  if (!logoUrl) {
    return <span className={cn("font-extrabold text-xl tracking-tighter select-none", className)}>{companyName}</span>;
  }

  return (
    <img 
      src={resolveImageUrl(logoUrl)} 
      alt={`${companyName} Logo`} 
      className={cn("w-auto object-contain transition-opacity duration-300", className)} 
    />
  );
};
