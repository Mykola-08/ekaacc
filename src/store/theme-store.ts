import { create } from 'zustand';

// ─── Theme customization types ──────────────────────────────────────────

export type AccentColor =
  | 'blue'
  | 'purple'
  | 'teal'
  | 'green'
  | 'orange'
  | 'rose'
  | 'amber'
  | 'indigo';

export type FontFamily = 'system' | 'inter' | 'geist' | 'poppins' | 'dm-sans' | 'space-grotesk';

export type TextColorPreset = 'default' | 'warm' | 'cool' | 'high-contrast' | 'muted-soft';

export type UIRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface ThemeCustomization {
  // Free options
  accentColor: AccentColor;
  fontSize: number; // 14-20

  // Premium options (subscription required)
  fontFamily: FontFamily;
  textColorPreset: TextColorPreset;
  uiRadius: UIRadius;
  customForeground: string | null; // hex color
  sidebarStyle: 'default' | 'minimal' | 'gradient';
}

export const DEFAULT_THEME: ThemeCustomization = {
  accentColor: 'blue',
  fontSize: 16,
  fontFamily: 'system',
  textColorPreset: 'default',
  uiRadius: 'lg',
  customForeground: null,
  sidebarStyle: 'default',
};

// ─── Accent color definitions (oklch values) ────────────────────────────

export const ACCENT_COLORS: Record<
  AccentColor,
  {
    label: string;
    light: { bg: string; fg: string };
    dark: { bg: string; fg: string };
    swatch: string; // hex for the swatch preview
    premium: boolean;
  }
> = {
  blue: {
    label: 'Blue',
    light: { bg: 'oklch(0.96 0.015 259.5)', fg: 'oklch(0.30 0.10 259.5)' },
    dark: { bg: 'oklch(0.28 0.06 259.5)', fg: 'oklch(0.85 0.08 259.5)' },
    swatch: '#0071e3',
    premium: false,
  },
  purple: {
    label: 'Purple',
    light: { bg: 'oklch(0.93 0.05 290)', fg: 'oklch(0.30 0.10 290)' },
    dark: { bg: 'oklch(0.35 0.10 290)', fg: 'oklch(0.92 0.05 290)' },
    swatch: '#8B5CF6',
    premium: false,
  },
  teal: {
    label: 'Teal',
    light: { bg: 'oklch(0.93 0.04 185)', fg: 'oklch(0.30 0.06 185)' },
    dark: { bg: 'oklch(0.35 0.07 185)', fg: 'oklch(0.92 0.04 185)' },
    swatch: '#14B8A6',
    premium: false,
  },
  green: {
    label: 'Green',
    light: { bg: 'oklch(0.93 0.04 145)', fg: 'oklch(0.30 0.08 145)' },
    dark: { bg: 'oklch(0.35 0.08 145)', fg: 'oklch(0.92 0.04 145)' },
    swatch: '#22C55E',
    premium: false,
  },
  orange: {
    label: 'Orange',
    light: { bg: 'oklch(0.93 0.05 65)', fg: 'oklch(0.35 0.10 55)' },
    dark: { bg: 'oklch(0.38 0.10 55)', fg: 'oklch(0.92 0.04 65)' },
    swatch: '#F97316',
    premium: true,
  },
  rose: {
    label: 'Rose',
    light: { bg: 'oklch(0.93 0.04 15)', fg: 'oklch(0.35 0.10 15)' },
    dark: { bg: 'oklch(0.38 0.10 15)', fg: 'oklch(0.92 0.04 15)' },
    swatch: '#F43F5E',
    premium: true,
  },
  amber: {
    label: 'Amber',
    light: { bg: 'oklch(0.93 0.06 80)', fg: 'oklch(0.35 0.10 75)' },
    dark: { bg: 'oklch(0.38 0.10 75)', fg: 'oklch(0.92 0.05 80)' },
    swatch: '#F59E0B',
    premium: true,
  },
  indigo: {
    label: 'Indigo',
    light: { bg: 'oklch(0.93 0.05 270)', fg: 'oklch(0.30 0.10 270)' },
    dark: { bg: 'oklch(0.35 0.10 270)', fg: 'oklch(0.92 0.05 270)' },
    swatch: '#6366F1',
    premium: true,
  },
};

export const FONT_FAMILIES: Record<FontFamily, { label: string; css: string; premium: boolean }> = {
  system: {
    label: 'System Default',
    css: 'system-ui, -apple-system, sans-serif',
    premium: false,
  },
  inter: { label: 'Inter', css: "'Inter', sans-serif", premium: false },
  geist: {
    label: 'Geist',
    css: "var(--font-geist-sans), 'Geist Sans', sans-serif",
    premium: false,
  },
  poppins: { label: 'Poppins', css: "'Poppins', sans-serif", premium: true },
  'dm-sans': { label: 'DM Sans', css: "'DM Sans', sans-serif", premium: true },
  'space-grotesk': {
    label: 'Space Grotesk',
    css: "'Space Grotesk', sans-serif",
    premium: true,
  },
};

export const TEXT_COLOR_PRESETS: Record<
  TextColorPreset,
  { label: string; fg: string; mutedFg: string; premium: boolean }
> = {
  default: {
    label: 'Default',
    fg: 'oklch(0.145 0 0)',
    mutedFg: 'oklch(0.556 0 0)',
    premium: false,
  },
  warm: {
    label: 'Warm',
    fg: 'oklch(0.20 0.02 50)',
    mutedFg: 'oklch(0.50 0.02 50)',
    premium: true,
  },
  cool: {
    label: 'Cool',
    fg: 'oklch(0.18 0.02 250)',
    mutedFg: 'oklch(0.52 0.02 240)',
    premium: true,
  },
  'high-contrast': {
    label: 'High Contrast',
    fg: 'oklch(0.05 0 0)',
    mutedFg: 'oklch(0.35 0 0)',
    premium: true,
  },
  'muted-soft': {
    label: 'Muted Soft',
    fg: 'oklch(0.28 0 0)',
    mutedFg: 'oklch(0.58 0 0)',
    premium: true,
  },
};

export const UI_RADIUS_VALUES: Record<
  UIRadius,
  { label: string; value: string; premium: boolean }
> = {
  none: { label: 'Sharp', value: '0px', premium: false },
  sm: { label: 'Subtle', value: '0.5rem', premium: false },
  md: { label: 'Medium', value: '0.625rem', premium: false },
  lg: { label: 'Rounded', value: '0.875rem', premium: false },
  full: { label: 'Pill', value: '1.25rem', premium: true },
};

// ─── Zustand store ──────────────────────────────────────────────────────

interface ThemeState {
  theme: ThemeCustomization;
  isLoaded: boolean;
  setTheme: (theme: Partial<ThemeCustomization>) => void;
  resetTheme: () => void;
  setLoaded: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: DEFAULT_THEME,
  isLoaded: false,
  setTheme: (partial) => set((state) => ({ theme: { ...state.theme, ...partial } })),
  resetTheme: () => set({ theme: DEFAULT_THEME }),
  setLoaded: () => set({ isLoaded: true }),
}));
