'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

const themes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-3">
      {themes.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
            theme === value
              ? 'border-primary bg-primary/5 text-primary shadow-sm'
              : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted/50'
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="text-xs font-semibold">{label}</span>
        </button>
      ))}
    </div>
  );
}
