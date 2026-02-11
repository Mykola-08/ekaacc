'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Loader2, Lock, Palette, Check, RotateCcw, Sparkles, Type, Circle } from 'lucide-react';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import { InlineFeedbackCompact } from '@/components/ui/inline-feedback';
import {
  useThemeStore,
  ACCENT_COLORS,
  FONT_FAMILIES,
  TEXT_COLOR_PRESETS,
  UI_RADIUS_VALUES,
  DEFAULT_THEME,
  type AccentColor,
  type FontFamily,
  type TextColorPreset,
  type UIRadius,
  type ThemeCustomization,
} from '@/store/theme-store';
import {
  saveAppearancePreferences,
  getUserSubscriptionStatus,
} from '@/app/actions/appearance';

interface AppearanceSettingsProps {
  isSubscribed?: boolean;
}

export function AppearanceSettings({ isSubscribed: initialSubscribed }: AppearanceSettingsProps) {
  const { theme, setTheme, resetTheme } = useThemeStore();
  const [saving, setSaving] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed ?? false);
  const feedback = useMorphingFeedback();

  useEffect(() => {
    if (initialSubscribed === undefined) {
      getUserSubscriptionStatus().then((result) => {
        setIsSubscribed(result.isSubscribed);
      });
    }
  }, [initialSubscribed]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    feedback.setLoading('Saving...');
    const result = await saveAppearancePreferences(theme);
    if (result.success) {
      feedback.setSuccess('Appearance saved');
    } else {
      feedback.setError(result.error || 'Failed to save');
    }
    setSaving(false);
  }, [theme, feedback]);

  const handleReset = useCallback(() => {
    resetTheme();
    feedback.setSuccess('Reset to defaults');
  }, [resetTheme, feedback]);

  const handleSetTheme = useCallback(
    (key: keyof ThemeCustomization, value: any, premium: boolean) => {
      if (premium && !isSubscribed) return;
      setTheme({ [key]: value });
    },
    [isSubscribed, setTheme]
  );

  return (
    <div className="grid gap-8">
      {/* ─── Accent Color ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-border/50 bg-card p-10 shadow-sm"
      >
        <h2 className="mb-8 flex items-center gap-4 text-2xl font-semibold text-foreground">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Palette className="h-6 w-6" />
          </div>
          Accent Color
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Choose your preferred accent color. It applies to buttons, highlights, and active elements.
        </p>
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
          {(Object.entries(ACCENT_COLORS) as [AccentColor, typeof ACCENT_COLORS[AccentColor]][]).map(
            ([key, color]) => {
              const selected = theme.accentColor === key;
              const locked = color.premium && !isSubscribed;
              return (
                <button
                  key={key}
                  onClick={() => handleSetTheme('accentColor', key, color.premium)}
                  disabled={locked}
                  className={cn(
                    'group relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all',
                    selected
                      ? 'border-foreground shadow-md'
                      : 'border-transparent hover:border-border',
                    locked && 'cursor-not-allowed opacity-60'
                  )}
                  title={locked ? 'Premium only — upgrade to unlock' : color.label}
                >
                  <div
                    className={cn(
                      'relative flex h-10 w-10 items-center justify-center rounded-full shadow-sm ring-2 ring-offset-2 ring-offset-background transition-transform',
                      selected ? 'scale-110 ring-foreground' : 'ring-transparent group-hover:scale-105'
                    )}
                    style={{ backgroundColor: color.swatch }}
                  >
                    {selected && <Check className="h-4 w-4 text-white" />}
                    {locked && (
                      <Lock className="h-3.5 w-3.5 text-white/80" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {color.label}
                  </span>
                  {color.premium && (
                    <Badge
                      variant="secondary"
                      className="absolute -right-1 -top-1 gap-0.5 rounded-full px-1.5 py-0 text-[10px] font-bold"
                    >
                      <Sparkles className="h-2.5 w-2.5" />
                      PRO
                    </Badge>
                  )}
                </button>
              );
            }
          )}
        </div>
      </motion.div>

      {/* ─── Font Size (Free) ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-lg border border-border/50 bg-card p-10 shadow-sm"
      >
        <h2 className="mb-8 flex items-center gap-4 text-2xl font-semibold text-foreground">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Type className="h-6 w-6" />
          </div>
          Typography
        </h2>

        {/* Font Size Slider */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-lg font-semibold text-foreground">Font Size</Label>
              <p className="mt-1 text-sm text-muted-foreground">
                Adjust the base text size across the interface
              </p>
            </div>
            <span className="rounded-lg bg-secondary px-3 py-1.5 text-sm font-bold tabular-nums text-foreground">
              {theme.fontSize}px
            </span>
          </div>
          <Slider
            value={[theme.fontSize]}
            onValueChange={([v]) => setTheme({ fontSize: v })}
            min={13}
            max={20}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Compact</span>
            <span>Default</span>
            <span>Large</span>
          </div>
        </div>

        {/* Font Family (Premium) */}
        <div className="mt-10 space-y-4">
          <div className="flex items-center gap-3">
            <Label className="text-lg font-semibold text-foreground">Font Family</Label>
            {!isSubscribed && (
              <Badge variant="secondary" className="gap-1 rounded-full text-xs">
                <Sparkles className="h-3 w-3" /> Premium fonts
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Choose your preferred typeface. Premium fonts require a subscription.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(Object.entries(FONT_FAMILIES) as [FontFamily, typeof FONT_FAMILIES[FontFamily]][]).map(
              ([key, font]) => {
                const selected = theme.fontFamily === key;
                const locked = font.premium && !isSubscribed;
                return (
                  <button
                    key={key}
                    onClick={() => handleSetTheme('fontFamily', key, font.premium)}
                    disabled={locked}
                    className={cn(
                      'relative flex items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition-all',
                      selected
                        ? 'border-foreground bg-accent shadow-sm'
                        : 'border-border hover:border-foreground/20 hover:bg-secondary/60',
                      locked && 'cursor-not-allowed opacity-50'
                    )}
                  >
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: font.css }}
                    >
                      {font.label}
                    </span>
                    {selected && <Check className="h-4 w-4 text-foreground" />}
                    {locked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </motion.div>

      {/* ─── Text Color Presets (Premium) ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-lg border border-border/50 bg-card p-10 shadow-sm"
      >
        <h2 className="mb-6 flex items-center gap-4 text-2xl font-semibold text-foreground">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Circle className="h-6 w-6" />
          </div>
          Text Color
          {!isSubscribed && (
            <Badge variant="secondary" className="gap-1 rounded-full text-xs">
              <Sparkles className="h-3 w-3" /> Premium presets
            </Badge>
          )}
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Adjust text color tone for better readability or personal preference.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {(Object.entries(TEXT_COLOR_PRESETS) as [TextColorPreset, typeof TEXT_COLOR_PRESETS[TextColorPreset]][]).map(
            ([key, preset]) => {
              const selected = theme.textColorPreset === key;
              const locked = preset.premium && !isSubscribed;
              return (
                <button
                  key={key}
                  onClick={() =>
                    handleSetTheme('textColorPreset', key, preset.premium)
                  }
                  disabled={locked}
                  className={cn(
                    'relative flex flex-col gap-2 rounded-lg border-2 p-4 text-left transition-all',
                    selected
                      ? 'border-foreground bg-accent shadow-sm'
                      : 'border-border hover:border-foreground/20',
                    locked && 'cursor-not-allowed opacity-50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{preset.label}</span>
                    {selected && <Check className="h-4 w-4" />}
                    {locked && <Lock className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  {/* Preview swatch */}
                  <div className="flex gap-1.5">
                    <div
                      className="h-4 w-8 rounded"
                      style={{ backgroundColor: preset.fg }}
                    />
                    <div
                      className="h-4 w-8 rounded"
                      style={{ backgroundColor: preset.mutedFg }}
                    />
                  </div>
                </button>
              );
            }
          )}
        </div>
      </motion.div>

      {/* ─── UI Corners ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-lg border border-border/50 bg-card p-10 shadow-sm"
      >
        <h2 className="mb-6 flex items-center gap-4 text-2xl font-semibold text-foreground">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="4" width="16" height="16" rx="4" />
            </svg>
          </div>
          Corner Radius
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Adjust the roundness of buttons, cards, and UI elements.
        </p>
        <div className="flex flex-wrap gap-3">
          {(Object.entries(UI_RADIUS_VALUES) as [UIRadius, typeof UI_RADIUS_VALUES[UIRadius]][]).map(
            ([key, radius]) => {
              const selected = theme.uiRadius === key;
              const locked = radius.premium && !isSubscribed;
              return (
                <button
                  key={key}
                  onClick={() => handleSetTheme('uiRadius', key, radius.premium)}
                  disabled={locked}
                  className={cn(
                    'relative flex items-center gap-3 border-2 px-5 py-3 transition-all',
                    selected
                      ? 'border-foreground bg-accent shadow-sm'
                      : 'border-border hover:border-foreground/20',
                    locked && 'cursor-not-allowed opacity-50'
                  )}
                  style={{ borderRadius: radius.value }}
                >
                  <div
                    className="h-6 w-6 border-2 border-foreground/40 bg-secondary"
                    style={{ borderRadius: radius.value }}
                  />
                  <span className="text-sm font-semibold">{radius.label}</span>
                  {selected && <Check className="h-4 w-4" />}
                  {locked && <Lock className="h-3 w-3 text-muted-foreground" />}
                </button>
              );
            }
          )}
        </div>
      </motion.div>

      {/* ─── Premium Upsell (if not subscribed) ───────────────── */}
      {!isSubscribed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg border border-amber-300/30 bg-linear-to-r from-amber-50 to-orange-50 p-8 shadow-sm dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">
                Unlock Premium Customization
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get access to exclusive accent colors, premium fonts, text color presets, and
                advanced UI customization with a subscription.
              </p>
              <Button
                className="mt-4 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-6 font-semibold text-white hover:from-amber-600 hover:to-orange-600"
                asChild
              >
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── Save / Reset actions ─────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <InlineFeedbackCompact
          status={feedback.status}
          message={feedback.message}
          onDismiss={feedback.reset}
        />
        <Button
          variant="outline"
          className="h-10 rounded-lg px-6 font-semibold"
          onClick={handleReset}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
        <Button
          className="h-10 rounded-lg bg-primary px-8 font-semibold text-primary-foreground shadow-sm"
          onClick={handleSave}
          disabled={saving}
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {saving ? 'Saving...' : 'Save Appearance'}
        </Button>
      </div>
    </div>
  );
}
