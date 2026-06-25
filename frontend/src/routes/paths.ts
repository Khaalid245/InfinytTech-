export const PATHS = {
  HOME: '/',
  SERVICES: '/services',
  WORK: '/work',
  PROCESS: '/process',
  ABOUT: '/about',
  INSIGHTS: '/blog',
  CONTACT: '/contact',
} as const;

export type PathType = typeof PATHS[keyof typeof PATHS];

