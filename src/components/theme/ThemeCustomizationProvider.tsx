'use client';

import { useEffect } from 'react';
import {
  useThemeStore,
  ACCENT_COLORS,
  FONT_FAMILIES,
  TEXT_COLOR_PRESETS,
  UI_RADIUS_VALUES,
  DEFAULT_THEME,
  type ThemeCustomization,
} from '@/store/theme-store';

/**
 * Applies the user's custom theme variables to :root.
 * Loaded once on mount and reactively on changes.
 */
export function ThemeCustomizationProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: Partial<ThemeCustomization> | null;
}) {
  const { theme, setTheme, setLoaded, isLoaded } = useThemeStore();

  // Hydrate store from server-loaded prefs on first render
  useEffect(() => {
    if (initialTheme && !isLoaded) {
      setTheme(initialTheme);
      setLoaded();
    } else if (!isLoaded) {
      // Try localStorage fallback
      try {
        const stored = localStorage.getItem('eka-theme-customization');
        if (stored) {
          const parsed = JSON.parse(stored);
          setTheme(parsed);
        }
      } catch {
        // ignore
      }
      setLoaded();
    }
  }, [initialTheme, isLoaded, setTheme, setLoaded]);

  // Persist to localStorage whenever theme changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('eka-theme-customization', JSON.stringify(theme));
      } catch {
        // ignore
      }
    }
  }, [theme, isLoaded]);

  // Apply CSS variables whenever theme changes
  useEffect(() => {
    if (!isLoaded) return;
    applyThemeToDOM(theme);
  }, [theme, isLoaded]);

  return <>{children}</>;
}

function applyThemeToDOM(theme: ThemeCustomization) {
  const root = document.documentElement;
  const isDark = root.classList.contains('dark');

  // 1. Accent color
  const accent = ACCENT_COLORS[theme.accentColor] || ACCENT_COLORS.blue;
  const mode = isDark ? accent.dark : accent.light;
  root.style.setProperty('--accent', mode.bg);
  root.style.setProperty('--accent-foreground', mode.fg);

  // Also update sidebar accent to match
  root.style.setProperty('--sidebar-accent', mode.bg);
  root.style.setProperty('--sidebar-accent-foreground', mode.fg);

  // 2. Font size
  root.style.setProperty('--base-font-size', `${theme.fontSize}px`);
  root.style.fontSize = `${theme.fontSize}px`;

  // 3. Font family (premium)
  const fontDef = FONT_FAMILIES[theme.fontFamily] || FONT_FAMILIES.system;
  root.style.setProperty('--custom-font-family', fontDef.css);
  root.style.fontFamily = fontDef.css;

  // 4. Text color preset (premium)
  const textPreset =
    TEXT_COLOR_PRESETS[theme.textColorPreset] || TEXT_COLOR_PRESETS.default;
  if (theme.textColorPreset !== 'default') {
    if (!isDark) {
      root.style.setProperty('--foreground', textPreset.fg);
      root.style.setProperty('--muted-foreground', textPreset.mutedFg);
    }
  } else {
    // Reset to defaults
    root.style.removeProperty('--foreground');
    root.style.removeProperty('--muted-foreground');
  }

  // 5. Custom foreground color override (premium)
  if (theme.customForeground) {
    root.style.setProperty('--foreground', theme.customForeground);
  }

  // 6. UI radius
  const radiusDef =
    UI_RADIUS_VALUES[theme.uiRadius] || UI_RADIUS_VALUES.lg;
  root.style.setProperty('--radius', radiusDef.value);
}

/**
 * Observes dark mode toggling so accent re-applies correctly.
 */
export function useThemeDarkModeSync() {
  const { theme, isLoaded } = useThemeStore();

  useEffect(() => {
    if (!isLoaded) return;
    const observer = new MutationObserver(() => {
      applyThemeToDOM(theme);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, [theme, isLoaded]);
}
