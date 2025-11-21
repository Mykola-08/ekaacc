'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sun, Moon, Palette, Check, Lock, Sparkles, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useActiveSubscriptions } from '@/hooks/use-active-subscriptions';
import { useAuth } from '@/context/auth-context';
import { getThemeService } from '@/services/theme-service';
import type { IThemeService } from '@/services/theme-service';
import type { Theme } from '@/lib/subscription-types';

interface UnifiedThemeSelectorProps {
  onThemeChange?: (themeId: string) => void;
  className?: string;
  variant?: 'settings' | 'subscription' | 'minimal';
  showSubscriptionStatus?: boolean;
}

const SYSTEM_THEMES = [
  { id: 'light', name: 'Light', icon: Sun, color: 'from-yellow-400 to-orange-500' },
  { id: 'dark', name: 'Dark', icon: Moon, color: 'from-slate-600 to-slate-800' },
  { id: 'auto', name: 'Auto', icon: Palette, color: 'from-blue-400 to-purple-500' },
];

export function UnifiedThemeSelector({ 
  onThemeChange, 
  className, 
  variant = 'settings',
  showSubscriptionStatus = false 
}: UnifiedThemeSelectorProps) {
  const { user } = useAuth();
  const { hasLoyalty, hasVip } = useActiveSubscriptions(user?.id);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<IThemeService | null>(null);
  const [systemTheme, setSystemTheme] = useState<string>('light');

  // Handle system theme changes
  useEffect(() => {
    if (variant === 'settings') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setSystemTheme(savedTheme);
      applySystemTheme(savedTheme);
    }
  }, [variant]);

  const applySystemTheme = useCallback((theme: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto theme - detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const handleSystemThemeChange = useCallback((newTheme: string) => {
    setSystemTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applySystemTheme(newTheme);
    onThemeChange?.(newTheme);
  }, [applySystemTheme, onThemeChange]);

  // Load subscription themes for subscription variant
  useEffect(() => {
    if (variant !== 'subscription' || !user?.id) return;

    const loadThemes = async () => {
      try {
        const themeServiceInstance = await getThemeService();
        setService(themeServiceInstance);
        const availableThemes = await themeServiceInstance.getAllThemes();
        const userPreference = await themeServiceInstance.getUserThemePreference(user.id);

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
  }, [user?.id, variant]);

  const handleThemeSelect = useCallback(async (themeId: string) => {
    if (!user?.id) return;

    try {
      setSelectedTheme(themeId);
      // Update theme preference through your preferred method
      // This might involve calling an API or updating local storage
      localStorage.setItem('userTheme', themeId);
      onThemeChange?.(themeId);
    } catch (error) {
      console.error('Failed to set theme:', error);
      setSelectedTheme(currentTheme);
    }
  }, [user?.id, currentTheme, onThemeChange]);

  const isThemeLocked = useCallback((theme: Theme) => {
    if (theme.requiredSubscription === 'vip' && !hasVip) return true;
    if (theme.requiredSubscription === 'loyalty' && !hasLoyalty) return true;
    return false;
  }, [hasVip, hasLoyalty]);

  if (loading && variant === 'subscription') {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-4", className)}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-20 bg-muted rounded-lg mb-3" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === 'settings') {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="grid grid-cols-3 gap-4">
          {SYSTEM_THEMES.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = systemTheme === themeOption.id;
            
            return (
              <Button
                key={themeOption.id}
                onClick={() => handleSystemThemeChange(themeOption.id)}
                variant="ghost"
                className={cn(
                  "relative p-4 rounded-xl border-2 transition-all duration-200 h-auto flex flex-col items-stretch hover:bg-muted/80",
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 dark:border-blue-400 dark:bg-blue-950/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800'
                )}
              >
                <div className={cn(
                  "w-full h-20 rounded-lg mb-3 bg-gradient-to-br",
                  themeOption.color
                )} />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{themeOption.name}</span>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={cn("flex gap-2", className)}>
        {SYSTEM_THEMES.map((themeOption) => {
          const Icon = themeOption.icon;
          const isSelected = systemTheme === themeOption.id;
          
          return (
            <Button
              key={themeOption.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleSystemThemeChange(themeOption.id)}
              className="px-2"
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>
    );
  }

  // Subscription variant
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-4", className)}>
      {themes.map((theme) => {
        const isSelected = selectedTheme === theme.id;
        const isLocked = isThemeLocked(theme);

        return (
          <Card 
            key={theme.id} 
            className={cn(
              "cursor-pointer transition-all hover:bg-muted/80 hover:shadow-md",
              isSelected && "ring-2 ring-blue-500",
              isLocked && "opacity-60 cursor-not-allowed"
            )}
            onClick={() => !isLocked && handleThemeSelect(theme.id)}
          >
            <CardContent className="p-4">
              <div className="relative">
                <div 
                  className={cn("w-full h-20 rounded-lg mb-3 bg-gradient-to-br", 
                    `from-[${theme.colors.primary}] to-[${theme.colors.secondary}]`)} 
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              
              <h4 className="font-medium text-sm mb-1">{theme.name}</h4>
              <p className="text-xs text-muted-foreground mb-2">{theme.description}</p>
              
              {showSubscriptionStatus && (
                <div className="flex items-center justify-between">
                  {theme.requiredSubscription === 'vip' && (
                    <Badge variant="default" className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      VIP
                    </Badge>
                  )}
                  {theme.requiredSubscription === 'loyalty' && (
                    <Badge variant="secondary" className="text-xs">
                      <Timer className="h-3 w-3 mr-1" />
                      Loyalty
                    </Badge>
                  )}
                  {!theme.requiredSubscription && (
                    <Badge variant="outline" className="text-xs">Free</Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}