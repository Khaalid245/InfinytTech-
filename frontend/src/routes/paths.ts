export const PATHS = {
  HOME: '/',
  SERVICES: '/services',
  WORK: '/work',
  PROCESS: '/process',
  ABOUT: '/about',
  INSIGHTS: '/insights',
  CONTACT: '/contact',
} as const;

export type PathType = typeof PATHS[keyof typeof PATHS];
