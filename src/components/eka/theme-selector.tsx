'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Lock, Palette, Sparkles } from 'lucide-react';
import { getThemeService } from '@/services/theme-service';
import type { IThemeService } from '@/services/theme-service';
import { useActiveSubscriptions } from '@/hooks/use-active-subscriptions';
import { useData } from '@/context/unified-data-context';
import { cn } from '@/lib/utils';
import type { Theme } from '@/lib/subscription-types';

interface ThemeSelectorProps {
  onThemeChange?: (themeId: string) => void;
  className?: string;
}

export function ThemeSelector({ onThemeChange, className }: ThemeSelectorProps) {
  const { currentUser } = useData();
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

  useEffect(() => {
    if (!currentTheme) return;
    applyThemeToDocument(themes.find(theme => theme.id === currentTheme));
  }, [currentTheme, themes]);

  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => {
          const isLocked = !canAccessTheme(theme);
          const isSelected = selectedTheme === theme.id;
          const isCurrent = currentTheme === theme.id;
          
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

                {/* Current theme indicator */}
                {isCurrent && !isSelected && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">Current</Badge>
                  </div>
                )}

                {/* Theme preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                    </div>
                    {!theme.isPublic && (
                      <Badge 
                        className={cn(
                          theme.requiredSubscription === 'loyalty' && 'bg-amber-500',
                          theme.requiredSubscription === 'vip' && 'bg-gradient-to-r from-purple-600 to-pink-600'
                        )}
                      >
                        {theme.requiredSubscription === 'loyalty' ? 'Loyal' : 'VIP'}
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

                  {/* Locked message */}
                  {isLocked && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {theme.requiredSubscription === 'loyalty' 
                          ? 'Requires Loyal or VIP membership' 
                          : 'Requires VIP membership'}
                      </p>
                    </div>
                  )}
                </div>
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
