'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

type CommandEntry = {
  label: string;
  href: string;
  section: 'Core' | 'Care' | 'Therapist' | 'Admin';
  shortcut?: string;
};

const COMMANDS: CommandEntry[] = [
  { label: 'Home', href: '/dashboard', section: 'Core' },
  { label: 'Inbox', href: '/inbox', section: 'Core' },
  { label: 'Bookings', href: '/bookings', section: 'Core' },
  { label: 'Plan & Benefits', href: '/plan', section: 'Care' },
  { label: 'Resources', href: '/resources', section: 'Care' },
  { label: 'Community', href: '/community', section: 'Care' },
  { label: 'Goals', href: '/goals', section: 'Care' },
  { label: 'Therapist Today', href: '/therapist/today', section: 'Therapist' },
  { label: 'Session Notes', href: '/therapist/session-notes', section: 'Therapist' },
  { label: 'Operations', href: '/operations', section: 'Admin' },
  { label: 'Users Console', href: '/console/users', section: 'Admin' },
  { label: 'Settings', href: '/settings', section: 'Core', shortcut: '⇧S' },
];

export function GlobalCommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<CommandEntry['section'], CommandEntry[]>();
    for (const entry of COMMANDS) {
      const existing = map.get(entry.section) ?? [];
      existing.push(entry);
      map.set(entry.section, existing);
    }
    return map;
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="Search modules and pages..." />
        <CommandList>
          <CommandEmpty>No matching pages.</CommandEmpty>
          {Array.from(grouped.entries()).map(([section, entries], index) => (
            <div key={section}>
              {index > 0 && <CommandSeparator />}
              <CommandGroup heading={section}>
                {entries.map((entry) => (
                  <CommandItem
                    key={entry.href}
                    value={`${entry.label} ${entry.href}`}
                    onSelect={() => {
                      router.push(entry.href);
                      setOpen(false);
                    }}
                  >
                    <span>{entry.label}</span>
                    {entry.shortcut && <CommandShortcut>{entry.shortcut}</CommandShortcut>}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
