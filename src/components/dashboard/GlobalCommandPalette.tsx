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
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Layout01Icon,
  Message01Icon,
  Calendar03Icon,
  Wallet01Icon,
  BookOpen01Icon,
  Target01Icon,
  HeartCheckIcon,
  UserGroupIcon,
  DocumentValidationIcon,
  Settings01Icon,
  ChartBarLineIcon,
  SparklesIcon,
  Edit02Icon,
  Shield01Icon,
  Clock01Icon,
} from '@hugeicons/core-free-icons';

type CommandEntry = {
  label: string;
  href: string;
  section: 'Core' | 'Care' | 'Therapist' | 'Admin';
  shortcut?: string;
  icon: React.ComponentProps<typeof HugeiconsIcon>['icon'];
};

const COMMANDS: CommandEntry[] = [
  { label: 'Home', href: '/dashboard', section: 'Core', icon: Layout01Icon },
  { label: 'Messages', href: '/messages', section: 'Core', icon: Message01Icon },
  { label: 'Bookings', href: '/bookings', section: 'Core', icon: Calendar03Icon },
  { label: 'Wallet', href: '/finances', section: 'Core', icon: Wallet01Icon },
  { label: 'Notifications', href: '/notifications', section: 'Core', icon: HeartCheckIcon },
  { label: 'Settings', href: '/settings', section: 'Core', shortcut: '⇧S', icon: Settings01Icon },

  { label: 'Journal', href: '/journal', section: 'Care', icon: Edit02Icon },
  { label: 'Wellness', href: '/wellness', section: 'Care', icon: HeartCheckIcon },
  { label: 'Goals', href: '/wellness', section: 'Care', icon: Target01Icon },
  { label: 'AI Insights', href: '/ai-insights', section: 'Care', icon: SparklesIcon },
  { label: 'Resources', href: '/resources', section: 'Care', icon: BookOpen01Icon },
  { label: 'Assignments', href: '/assignments', section: 'Care', icon: DocumentValidationIcon },

  { label: 'Client Directory', href: '/therapist/clients', section: 'Therapist', icon: UserGroupIcon },
  { label: 'Session Notes', href: '/therapist/session-notes', section: 'Therapist', icon: Edit02Icon },
  { label: 'Availability', href: '/availability', section: 'Therapist', icon: Clock01Icon },

  { label: 'Users Console', href: '/console/users', section: 'Admin', icon: UserGroupIcon },
  { label: 'Analytics', href: '/console/analytics', section: 'Admin', icon: ChartBarLineIcon },
  { label: 'Feature Flags', href: '/console/features', section: 'Admin', icon: Shield01Icon },
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
        <CommandInput placeholder="Search pages and actions…" />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <HugeiconsIcon icon={SparklesIcon} className="size-8 text-muted-foreground/30" />
              <span className="text-sm text-muted-foreground">No matching pages found</span>
            </div>
          </CommandEmpty>
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
                    className="gap-2.5"
                  >
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-[calc(var(--radius)*0.5)] bg-muted text-muted-foreground">
                      <HugeiconsIcon icon={entry.icon} className="size-3.5" />
                    </div>
                    <span>{entry.label}</span>
                    {entry.shortcut && <CommandShortcut>{entry.shortcut}</CommandShortcut>}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
        {/* Footer hint */}
        <div className="border-t border-border/50 px-3 py-2">
          <p className="text-[10px] text-muted-foreground/50">
            <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">↵</kbd> to navigate &nbsp;
            <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">↑↓</kbd> to move &nbsp;
            <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">Esc</kbd> to close
          </p>
        </div>
      </Command>
    </CommandDialog>
  );
}
