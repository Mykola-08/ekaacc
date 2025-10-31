
'use client';

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: "Light", value: "light", icon: Sun },
    { name: "Dark", value: "dark", icon: Moon },
    { name: "System", value: "system", icon: Monitor },
  ];

  return (
    <div className="space-y-2">
      <Label>Appearance</Label>
      <div className="grid grid-cols-3 gap-2 rounded-lg border p-1">
        {themes.map((t) => (
          <Button
            key={t.value}
            variant="ghost"
            size="sm"
            className={cn(
              "flex h-auto flex-col items-center justify-center gap-1 p-2",
              theme === t.value && "bg-accent"
            )}
            onClick={() => setTheme(t.value)}
          >
            <t.icon className="h-5 w-5" />
            <span className="text-xs">{t.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
