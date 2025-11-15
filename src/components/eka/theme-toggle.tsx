'use client';

import { Button, Dropdown, DropdownAction, DropdownContent, DropdownItem } from '@/components/keep';
import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

;
;

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <Dropdown>
      <DropdownAction asChild>
        <Button variant="outline" size="sm">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownAction>
      <DropdownContent align="end">
        <DropdownItem onClick={() => setTheme('light')}>
          Light
        </DropdownItem>
        <DropdownItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownItem>
        <DropdownItem onClick={() => setTheme('system')}>
          System
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}
