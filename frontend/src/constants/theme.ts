/**
 * Infinyttech Theme Tokens Constants
 * Exports hex codes and spacing values for programatic use in Javascript/TypeScript.
 */

export const THEME_COLORS = {
  brand: {
    yellow: '#FACC15', // Premium Neon Yellow
    gold: '#EAB308',   // Golden Accent Underlines
    amber: '#CA8A04',  // Light-Mode Contrast Amber (replaces yellow on light background for accessibility)
    success: '#22C55E',// Operational Green
    error: '#EF4444',  // Action Block Red
  },
  dark: {
    canvas: '#0F0F10', // 93% Black Charcoal Background
    surface: '#171717',// Flat Header / Sidebar Backgrounds
    card: '#1F1F1F',   // Secondary Elevation
    border: '#2A2A2A', // Subtle Grid Divider
  },
  light: {
    canvas: '#FAFAFA', // Soft Off-White Gray
    surface: '#FFFFFF',// Pure White Elevation
    border: '#E2E8F0', // Slate-200 Divider Line
    text: {
      primary: '#0F172A',   // Slate-900
      secondary: '#475569', // Slate-600
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
  yellowGlow: '0 20px 25px -5px rgba(250, 204, 21, 0.1), 0 8px 10px -6px rgba(250, 204, 21, 0.1)',
  yellowGlowHover: '0 25px 30px -5px rgba(250, 204, 21, 0.25), 0 12px 15px -6px rgba(250, 204, 21, 0.25)',
} as const;
