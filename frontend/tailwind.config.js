/**
 * Infinyttech Front-End Design System Tokens
 * Reference file for development team to align Figma specs with the codebase.
 * 
 * Note: Since this project uses Tailwind v4 (CSS-first variables configuration),
 * these tokens are active at runtime via CSS custom variables in src/index.css.
 * This JS configuration acts as the shared design team reference.
 */

module.exports = {
  darkMode: 'class', // Controlled by adding '.dark' class to <html> or <body>
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FACC15', // Premium Neon Yellow (accents and highlights in Dark Mode)
          gold: '#EAB308',   // Golden Accent Underlines & focus states
          amber: '#CA8A04',  // Light-Mode Contrast Amber (substituted for yellow on light backgrounds to pass WCAG AA)
          success: '#22C55E',// Operational Green / Status Active
          error: '#EF4444',  // Action Block Red / Error states
        },
        dark: {
          canvas: '#0F0F10', // 93% Black Charcoal Background (SaaS master canvas)
          surface: '#171717',// Flat Header / Footer / Sidebar Backgrounds
          card: '#1F1F1F',   // Secondary Elevation / Card Backgrounds
          border: '#2A2A2A', // Subtle Grid Dividers / Borders
        },
        light: {
          canvas: '#FAFAFA', // Soft Off-White Gray (Editorial Background)
          surface: '#FFFFFF',// Pure White Elevation / Card Backgrounds
          border: '#E2E8F0', // Slate-200 Divider Line
          text: {
            primary: '#0F172A',   // Slate-900 (High Contrast Typography)
            secondary: '#475569', // Slate-600 (Readable Body copy)
          }
        },
        gray: {
          muted: '#D4D4D4',  // Primary Dark-mode Subtext / Neutral text
        }
      },
      fontFamily: {
        sans: ['Satoshi', 'Inter', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'yellow-glow': '0 20px 25px -5px rgba(250, 204, 21, 0.1), 0 8px 10px -6px rgba(250, 204, 21, 0.1)',
        'yellow-glow-hover': '0 25px 30px -5px rgba(250, 204, 21, 0.25), 0 12px 15px -6px rgba(250, 204, 21, 0.25)',
      }
    },
  },
  plugins: [],
}
