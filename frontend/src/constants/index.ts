import { PATHS } from '../routes/paths';

export const SITE_INFO = {
  name: 'InfinytTech',
  tagline: 'Enterprise-Grade Frontend Engineering',
  description: 'We craft high-performance digital products and design systems for enterprise brands. Built on clarity, engineering excellence, and aesthetic longevity.',
  contactEmail: 'hello@infinyttech.com',
  locations: [
    {
      city: 'London Studio',
      address: ['10 Pentagram Lane', 'Clerkenwell, London EC1R'],
      email: 'london@infinyttech.co.uk',
      phone: '+44 20 7946 0958',
    },
    {
      city: 'Zurich Lab',
      address: ['55 Limmatquai', 'Altstadt, Zurich 8001'],
      email: 'zurich@infinyttech.ch',
    },
  ],
} as const;

export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/infinyttech',
  linkedin: 'https://linkedin.com/company/infinyttech',
  github: 'https://github.com/infinyttech',
} as const;

export const NAV_LINKS = [
  { label: 'Services', href: PATHS.SERVICES },
  { label: 'Work', href: PATHS.WORK },
  { label: 'Process', href: PATHS.PROCESS },
  { label: 'About', href: PATHS.ABOUT },
  { label: 'Insights', href: PATHS.INSIGHTS },
  { label: 'Contact', href: PATHS.CONTACT },
] as const;

export const FOOTER_LINKS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: PATHS.ABOUT },
      { label: 'Our Work', href: PATHS.WORK },
      { label: 'Methodology', href: PATHS.PROCESS },
      { label: 'Contact', href: PATHS.CONTACT },
    ],
  },
  {
    title: 'Expertise',
    links: [
      { label: 'Experience Design', href: `${PATHS.SERVICES}#design` },
      { label: 'Systems Engineering', href: `${PATHS.SERVICES}#engineering` },
      { label: 'Enterprise Scalability', href: `${PATHS.SERVICES}#scalability` },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Design Showcase', href: '/showcase' },
      { label: 'Insights & News', href: PATHS.INSIGHTS },
      { label: 'Case Studies', href: PATHS.WORK },
      { label: 'Privacy Policy', href: PATHS.HOME },
    ],
  },
] as const;
