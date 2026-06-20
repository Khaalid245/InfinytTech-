/**
 * Infinyttech Theme Tokens Constants
 * Exports hex codes and spacing values for programatic use in Javascript/TypeScript.
 */

export const THEME_COLORS = {
  brand: {
    yellow: '#D4A017', // Primary gold accent
    gold: '#E6B325',   // Hover gold accent
    amber: '#B8860B',  // Light mode accent
    success: '#22C55E',
    error: '#EF4444',
  },
  dark: {
    canvas: '#0B0D0F', // Primary BG
    surface: '#121417',// Secondary BG
    card: '#181B1F',   // Elevated Surface
    border: '#23262D', // Subtle Border
  },
  light: {
    canvas: '#FFFFFF',
    surface: '#F8FAFC',
    border: '#E2E8F0',
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    }
  },
  gray: {
    muted: '#D4D4D4',  // Primary Dark-mode Subtext
  }
} as const;

export const THEME_FONTS = {
  sans: ['Satoshi', 'Inter', 'sans-serif'],
  mono: ['SF Mono', 'JetBrains Mono', 'monospace'],
} as const;

export const THEME_SHADOWS = {
  yellowGlow: '0 20px 25px -5px rgba(212, 160, 23, 0.1), 0 8px 10px -6px rgba(212, 160, 23, 0.1)',
  yellowGlowHover: '0 25px 30px -5px rgba(212, 160, 23, 0.25), 0 12px 15px -6px rgba(212, 160, 23, 0.25)',
} as const;
