/**
 * Unified Design Tokens - Apple-like Design System
 * Single source of truth for all design values across the application
 */

export const designTokens = {
  // ==========================================
  // COLORS - Apple-inspired palette
  // ==========================================
  colors: {
    // Primary brand colors
    primary: {
      DEFAULT: '#2563EB', // Blue
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    // Accent colors (EKA Gold)
    accent: {
      light: '#FDE68A',
      DEFAULT: '#FFB405',
      dark: '#B45309',
    },
    // EKA Brand
    ekaDark: '#000035',
    // Neutrals - Apple gray scale
    gray: {
      50: '#fafafa',
      100: '#f5f5f7', // Apple Gray Light
      200: '#e5e5e7',
      300: '#d2d2d7',
      400: '#a1a1a6',
      500: '#86868b',
      600: '#6e6e73',
      700: '#424245',
      800: '#1d1d1f', // Apple Gray Dark
      900: '#171717',
    },
    // Surface colors
    surface: {
      primary: '#ffffff',
      muted: '#f8fafc',
      elevated: '#f1f5f9',
    },
  },

  // ==========================================
  // TYPOGRAPHY - SF Pro inspired
  // ==========================================
  typography: {
    fontFamily: {
      sans: ['SF Pro Text', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      display: ['SF Pro Display', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      // Large titles (Hero sections)
      '8xl': { size: '6rem', lineHeight: '0.9', letterSpacing: '-0.035em', weight: 200 },
      '7xl': { size: '4.5rem', lineHeight: '0.95', letterSpacing: '-0.03em', weight: 200 },
      '6xl': { size: '3.75rem', lineHeight: '0.95', letterSpacing: '-0.025em', weight: 300 },
      '5xl': { size: '3rem', lineHeight: '1', letterSpacing: '-0.025em', weight: 300 },
      // Headlines
      '4xl': { size: '2.25rem', lineHeight: '1.1', letterSpacing: '-0.02em', weight: 300 },
      '3xl': { size: '1.875rem', lineHeight: '1.15', letterSpacing: '-0.02em', weight: 500 },
      '2xl': { size: '1.5rem', lineHeight: '1.2', letterSpacing: '-0.02em', weight: 500 },
      'xl': { size: '1.25rem', lineHeight: '1.3', letterSpacing: '-0.015em', weight: 500 },
      // Body text
      'lg': { size: '1.125rem', lineHeight: '1.5', letterSpacing: '-0.012em', weight: 400 },
      'base': { size: '1rem', lineHeight: '1.5', letterSpacing: '-0.006em', weight: 400 },
      'sm': { size: '0.875rem', lineHeight: '1.5', letterSpacing: '-0.006em', weight: 400 },
      'xs': { size: '0.75rem', lineHeight: '1.5', letterSpacing: '-0.003em', weight: 400 },
    },
  },

  // ==========================================
  // SPACING - Consistent padding/margin scale
  // ==========================================
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    '2xl': '2rem',   // 32px
    '3xl': '3rem',   // 48px
    '4xl': '4rem',   // 64px
    '5xl': '6rem',   // 96px
    '6xl': '8rem',   // 128px
  },

  // ==========================================
  // BORDER RADIUS - Apple-style rounded corners
  // ==========================================
  borderRadius: {
    none: '0',
    sm: '0.75rem',    // 12px - Small elements
    md: '1rem',       // 16px - Medium elements
    lg: '1.25rem',    // 20px - Standard Apple radius
    xl: '1.75rem',    // 28px - Large elements
    '2xl': '2rem',    // 32px - Extra large
    '3xl': '2.5rem',  // 40px - Hero sections
    full: '9999px',   // Pill buttons
  },

  // ==========================================
  // SHADOWS - Apple-style elevation
  // ==========================================
  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(0, 0, 0, 0.02)',
    DEFAULT: '0 4px 20px rgba(0, 0, 0, 0.06)',
    md: '0 6px 24px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 30px rgba(0, 0, 0, 0.12)',
    xl: '0 20px 60px rgba(0, 0, 0, 0.08)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  },

  // ==========================================
  // ANIMATION - Natural easing curves
  // ==========================================
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      medium: '300ms',
      slow: '500ms',
      slower: '700ms',
    },
    easing: {
      // Ease-out (enter animations)
      outQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      outCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      outQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
      outQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
      outExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
      // Ease-in-out (movement animations)
      inOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
      inOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      inOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
      // Apple spring (bouncy)
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // ==========================================
  // BREAKPOINTS - Responsive design
  // ==========================================
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ==========================================
  // Z-INDEX - Stacking order
  // ==========================================
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
  },
} as const;

// Type exports for TypeScript
export type DesignTokens = typeof designTokens;
export type ColorScale = keyof typeof designTokens.colors.primary;
export type SpacingScale = keyof typeof designTokens.spacing;
export type BorderRadiusScale = keyof typeof designTokens.borderRadius;
export type ShadowScale = keyof typeof designTokens.shadows;
export type AnimationDuration = keyof typeof designTokens.animation.duration;
export type AnimationEasing = keyof typeof designTokens.animation.easing;
