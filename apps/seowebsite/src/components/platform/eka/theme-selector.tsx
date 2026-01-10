'use client';

import { Badge } from '@/components/platform/ui/badge';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent } from '@/components/platform/ui/card';
import { useState, useEffect, useCallback } from 'react';
import { Check, Lock, Palette, Sparkles, Timer } from 'lucide-react';
import { getThemeService } from '@/services/theme-service';
import type { IThemeService } from '@/services/theme-service';
import { useActiveSubscriptions } from '@/hooks/platform/use-active-subscriptions';
import { useAuth } from '@/lib/platform/supabase-auth';
import { cn } from '@/lib/platform/utils';
import type { Theme } from '@/lib/platform/subscription-types';

interface ThemeSelectorProps {
  onThemeChange?: (themeId: string) => void;
  className?: string;
}

export function ThemeSelector({ onThemeChange, className }: ThemeSelectorProps) {
  const { user: currentUser } = useAuth();
  const { hasLoyalty, hasVip } = useActiveSubscriptions(currentUser?.id);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<IThemeService | null>(null);

  useEffect(() => {
    const loadThemes = async () => {
      if (!currentUser?.id) return;

      try {
        const themeServiceInstance = await getThemeService();
        setService(themeServiceInstance);
        const availableThemes = await themeServiceInstance.getAllThemes();
        const userPreference = await themeServiceInstance.getUserThemePreference(currentUser.id);

        setThemes(availableThemes);
        const themeId = userPreference?.currentTheme || 'default';
        setCurrentTheme(themeId);
        setSelectedTheme(themeId);
      } catch (error) {
        console.error('Failed to load themes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadThemes();
  }, [currentUser?.id]);

  // Apply theme when currentTheme changes
  useEffect(() => {
    if (!currentTheme) return;
    applyThemeToDocument(themes.find(theme => theme.id === currentTheme));
  }, [currentTheme, themes]);

  const canAccessTheme = (theme: Theme): boolean => {
    if (theme.isPublic) return true;
    if (theme.requiredSubscription === 'loyalty') return hasLoyalty || hasVip;
    if (theme.requiredSubscription === 'vip') return hasVip;
    return false;
  };

  const resolveThemeService = useCallback(async () => {
    if (service) {
      return service;
    }
    const instance = await getThemeService();
    setService(instance);
    return instance;
  }, [service]);

  const handleThemeSelect = async (themeId: string, theme: Theme) => {
    if (!canAccessTheme(theme)) return;

    setSelectedTheme(themeId);
    if (onThemeChange) {
      onThemeChange(themeId);
    }
  };

  const handleApplyTheme = async () => {
    if (!currentUser?.id || !selectedTheme) return;

    try {
      const themeServiceInstance = await resolveThemeService();
      await themeServiceInstance.setUserTheme(currentUser.id, selectedTheme);
      setCurrentTheme(selectedTheme);

      // Apply theme to document
      applyThemeToDocument(themes.find(t => t.id === selectedTheme));
    } catch (error) {
      console.error('Failed to apply theme:', error);
    }
  };

  const applyThemeToDocument = (theme: Theme | undefined) => {
    if (!theme) return;

    // Apply CSS variables to document root
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-foreground', theme.colors.foreground);
    root.style.setProperty('--theme-border', theme.colors.border);
    root.style.setProperty('--theme-muted', theme.colors.muted);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const hasChanges = selectedTheme !== currentTheme;

  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => {
          const isLocked = !canAccessTheme(theme);
          const isSelected = selectedTheme === theme.id;
          const isCurrent = currentTheme === theme.id;
          const subscriptionLabel = theme.requiredSubscription === 'loyalty'
            ? 'Loyalty'
            : theme.requiredSubscription === 'vip'
              ? 'VIP'
              : undefined;

          const statusBadge = isCurrent
            ? { label: 'Active', variant: 'default' as const, className: 'text-success border-success/20' }
            : isSelected
              ? { label: 'Selected', variant: 'default' as const, className: 'text-primary border-primary/20' }
              : null;

          return (
            <Card
              key={theme.id}
              className={cn(
                'relative cursor-pointer transition-all duration-200',
                isSelected && 'ring-2 ring-primary shadow-lg',
                isLocked && 'opacity-60 cursor-not-allowed',
                !isLocked && 'hover:shadow-md'
              )}
              onClick={() => handleThemeSelect(theme.id, theme)}
            >
              <CardContent className="p-4">
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}

                {/* Lock indicator */}
                {isLocked && (
                  <div className="absolute top-2 right-2 bg-gray-900 text-white rounded-full p-1.5">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Status badge */}
                {statusBadge && (
                  <div className="absolute top-2 left-2">
                    <Badge variant={statusBadge.variant} className={`text-[10px] uppercase tracking-wide ${statusBadge.className || ''}`}>
                      {statusBadge.label}
                    </Badge>
                  </div>
                )}

                {/* Theme preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">{theme.displayName || theme.name}</h3>
                    </div>
                    {!theme.isPublic && subscriptionLabel && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          theme.requiredSubscription === 'loyalty' && 'bg-amber-500 text-white',
                          theme.requiredSubscription === 'vip' && 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        )}
                      >
                        {subscriptionLabel}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{theme.description}</p>

                  {/* Color palette preview */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                        style={{ backgroundColor: theme.colors.primary }}
                        title="Primary"
                      />
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                        style={{ backgroundColor: theme.colors.secondary }}
                        title="Secondary"
                      />
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                        style={{ backgroundColor: theme.colors.accent }}
                        title="Accent"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                        style={{ backgroundColor: theme.colors.background }}
                        title="Background"
                      />
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                        style={{ backgroundColor: theme.colors.muted }}
                        title="Muted"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>{theme.category === 'premium' ? 'Premium experience' : 'Core experience'}</span>
                    </div>
                    <span>#{theme.order.toString().padStart(2, '0')}</span>
                  </div>
                </div>

                {isLocked && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-background/90 backdrop-blur-sm">
                    <Badge variant="outline" className="flex items-center gap-1 text-xs uppercase">
                      <Timer className="h-3.5 w-3.5" />
                      Coming Soon
                    </Badge>
                    {subscriptionLabel && (
                      <p className="text-xs text-muted-foreground text-center px-4">
                        Unlock with the {subscriptionLabel} membership.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Apply button */}
      {hasChanges && (
        <div className="flex justify-end sticky bottom-4">
          <Button 
            size="lg"
            onClick={handleApplyTheme}
            className="shadow-lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Apply Theme
          </Button>
        </div>
      )}
    </div>
  );
}
