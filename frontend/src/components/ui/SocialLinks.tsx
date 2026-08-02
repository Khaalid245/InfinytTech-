import React from 'react';
import { 
  Mail, 
  Globe
} from 'lucide-react';
import type { SocialLink } from '../../types/siteSettings.types';
import { cn } from '../../utils/cn';

interface SocialLinksProps {
  socialLinks?: SocialLink[];
  className?: string;
  itemClassName?: string;
  iconClassName?: string;
}

// Inline SVGs for brand icons that are not exported by the project's lucide-react version
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const TiktokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const getSocialIcon = (platform: string, className?: string) => {
  const p = platform.toLowerCase().trim();
  switch (p) {
    case 'linkedin':
      return <LinkedinIcon className={className} />;
    case 'github':
      return <GithubIcon className={className} />;
    case 'instagram':
      return <InstagramIcon className={className} />;
    case 'facebook':
      return <FacebookIcon className={className} />;
    case 'twitter':
    case 'x':
      return <TwitterIcon className={className} />;
    case 'youtube':
      return <YoutubeIcon className={className} />;
    case 'telegram':
      return <TelegramIcon className={className} />;
    case 'email':
      return <Mail className={className} />;
    case 'whatsapp':
      return <WhatsappIcon className={className} />;
    case 'tiktok':
      return <TiktokIcon className={className} />;
    default:
      return <Globe className={className} />;
  }
};

const getPlatformLabel = (platform: string) => {
  const p = platform.toLowerCase().trim();
  switch (p) {
    case 'linkedin': return 'LinkedIn';
    case 'github': return 'GitHub';
    case 'instagram': return 'Instagram';
    case 'facebook': return 'Facebook';
    case 'twitter': return 'X (Twitter)';
    case 'youtube': return 'YouTube';
    case 'telegram': return 'Telegram';
    case 'email': return 'Email';
    case 'whatsapp': return 'WhatsApp';
    case 'tiktok': return 'TikTok';
    default: return platform.charAt(0).toUpperCase() + platform.slice(1);
  }
};

export const SocialLinks: React.FC<SocialLinksProps> = ({
  socialLinks = [],
  className,
  itemClassName,
  iconClassName,
}) => {
  const activeLinks = [...socialLinks]
    .filter(link => link.is_active)
    .sort((a, b) => a.order - b.order);

  if (activeLinks.length === 0) return null;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {activeLinks.map(link => {
        const label = getPlatformLabel(link.platform);
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${label}`}
            title={label}
            className={cn(
              'p-2 rounded-lg border transition-all duration-300 hover:scale-105 active:scale-95 outline-none',
              'border-border-primary/50 text-secondary-text hover:text-accent-primary hover:border-accent-primary/80 bg-surface-light/40 hover:bg-surface-light focus-visible:ring-2 focus-visible:ring-accent-primary/60 focus-visible:ring-offset-2',
              itemClassName
            )}
          >
            {getSocialIcon(link.platform, cn('w-4 h-4', iconClassName))}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
