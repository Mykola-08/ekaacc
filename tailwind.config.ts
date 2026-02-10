import tailwindcssAnimate from 'tailwindcss-animate';
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/context/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'SF Pro Text',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'system-ui',
          'sans-serif',
        ],
        display: [
          'SF Pro Display',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        primary: {
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
          950: '#172554',
          DEFAULT: '#2563EB',
        },
        accent: {
          light: '#F5F5F7', // Apple Gray (Clean neutral instead of yellow)
          DEFAULT: '#0071E3', // Apple Blue (Active state)
          gold: '#C69C6D', // Premium Metallic Gold (for specific branding)
          dark: '#1D1D1F',
        },
        'eka-dark': '#1D1D1F', // Apple Black (Rich gray-black)
        gray: {
          50: '#fafafa',
          100: '#f5f5f7', // Apple Gray
          200: '#e5e5e7',
          300: '#d2d2d7',
          400: '#a1a1a6',
          500: '#86868b',
          600: '#6e6e73',
          700: '#424245',
          800: '#1d1d1f', // Apple Gray Dark
          900: '#171717',
          950: '#000000',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        marketing: {
          primary: '#2563EB',
          accent: '#FFB405', // EKA Gold from original repo
          'accent-light': '#FDE68A',
          'accent-dark': '#B45309',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        pill: '9999px',
        card: 'var(--radius)',
        'card-sm': 'var(--radius-sm)',
        'card-md': 'var(--radius-md)',
        'card-xl': 'var(--radius-xl)',
        'card-2xl': 'var(--radius-2xl)',
        'card-3xl': 'var(--radius-3xl)',
        apple: 'var(--apple-border-radius)',
        'apple-lg': 'var(--apple-border-radius-large)',
        'apple-xl': 'var(--apple-border-radius-xl)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'subtle-pulse': 'subtlePulse 3s ease-in-out infinite',
        'gentle-float': 'gentleFloat 6s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      boxShadow: {
        'eka-sm': 'var(--shadow-sm)',
        'eka-base': 'var(--shadow-base)',
        'eka-md': 'var(--shadow-md)',
        'eka-lg': 'var(--shadow-lg)',
        'eka-xl': 'var(--shadow-xl)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
