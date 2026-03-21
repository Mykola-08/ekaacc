'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Dialog as RadixDialog } from 'radix-ui';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SearchIcon,
  SparklesIcon,
  ArrowRight01Icon,
  Cancel01Icon,
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
  Edit02Icon,
  Shield01Icon,
  Clock01Icon,
  CheckListIcon,
  Notification03Icon,
  Pulse01Icon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

// ── Command registry ────────────────────────────────────────────────

type Section = 'Core' | 'Care' | 'Therapist' | 'Admin';

type CommandEntry = {
  label: string;
  description?: string;
  href: string;
  section: Section;
  shortcut?: string;
  icon: React.ComponentProps<typeof HugeiconsIcon>['icon'];
  keywords?: string;
};

const COMMANDS: CommandEntry[] = [
  {
    label: 'Home',
    description: 'Dashboard overview',
    href: '/dashboard',
    section: 'Core',
    icon: Layout01Icon,
  },
  {
    label: 'Messages',
    description: 'Chat & conversations',
    href: '/messages',
    section: 'Core',
    icon: Message01Icon,
  },
  {
    label: 'Bookings',
    description: 'Sessions & appointments',
    href: '/bookings',
    section: 'Core',
    icon: Calendar03Icon,
  },
  {
    label: 'Wallet',
    description: 'Balance & transactions',
    href: '/finances',
    section: 'Core',
    icon: Wallet01Icon,
  },
  {
    label: 'Notifications',
    description: 'Alerts & updates',
    href: '/notifications',
    section: 'Core',
    icon: Notification03Icon,
  },
  {
    label: 'Settings',
    description: 'Account preferences',
    href: '/settings',
    section: 'Core',
    shortcut: '⇧S',
    icon: Settings01Icon,
  },

  {
    label: 'Journal',
    description: 'Write & reflect',
    href: '/journal',
    section: 'Care',
    icon: Edit02Icon,
    keywords: 'write diary',
  },
  {
    label: 'Wellness',
    description: 'Goals & progress',
    href: '/wellness',
    section: 'Care',
    icon: HeartCheckIcon,
    keywords: 'health goals',
  },
  {
    label: 'AI Insights',
    description: 'Personalized AI analysis',
    href: '/ai-insights',
    section: 'Care',
    icon: SparklesIcon,
    keywords: 'artificial intelligence',
  },
  {
    label: 'Resources',
    description: 'Articles & guides',
    href: '/resources',
    section: 'Care',
    icon: BookOpen01Icon,
  },
  {
    label: 'Assignments',
    description: 'Homework & tasks',
    href: '/assignments',
    section: 'Care',
    icon: CheckListIcon,
  },
  {
    label: 'Goals',
    description: 'Track active goals',
    href: '/wellness',
    section: 'Care',
    icon: Target01Icon,
  },
  {
    label: 'Mood Tracker',
    description: 'Log & view mood trends',
    href: '/wellness',
    section: 'Care',
    icon: Pulse01Icon,
    keywords: 'mood feelings',
  },
  {
    label: 'Book Session',
    description: 'Schedule a new appointment',
    href: '/book',
    section: 'Care',
    icon: Calendar03Icon,
    keywords: 'book appointment schedule',
  },

  {
    label: 'Client Directory',
    description: 'Manage your clients',
    href: '/therapist/clients',
    section: 'Therapist',
    icon: UserGroupIcon,
  },
  {
    label: 'Session Notes',
    description: 'Record session details',
    href: '/therapist/session-notes',
    section: 'Therapist',
    icon: DocumentValidationIcon,
  },
  {
    label: 'Availability',
    description: 'Set working hours',
    href: '/availability',
    section: 'Therapist',
    icon: Clock01Icon,
  },

  {
    label: 'Users Console',
    description: 'Manage platform users',
    href: '/console/users',
    section: 'Admin',
    icon: UserGroupIcon,
  },
  {
    label: 'Analytics',
    description: 'Platform performance',
    href: '/console/analytics',
    section: 'Admin',
    icon: ChartBarLineIcon,
  },
  {
    label: 'Feature Flags',
    description: 'Toggle features',
    href: '/console/features',
    section: 'Admin',
    icon: Shield01Icon,
  },
  {
    label: 'Audit Log',
    description: 'System event history',
    href: '/console/audit',
    section: 'Admin',
    icon: CheckListIcon,
  },
];

const SECTION_ORDER: Section[] = ['Core', 'Care', 'Therapist', 'Admin'];

// ── Recent searches (localStorage) ────────────────────────────────

const RECENT_KEY = 'eka:recent-searches';

function getRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveRecent(q: string) {
  const prev = getRecent().filter((s) => s !== q);
  localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...prev].slice(0, 5)));
}

// ── Highlight matching text ────────────────────────────────────────

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 text-primary rounded-[2px]">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── AI thinking dots ──────────────────────────────────────────────

function ThinkingDots() {
  return (
    <span className="ml-1 inline-flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="bg-primary size-1 animate-pulse rounded-full"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────

export function GlobalCommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'navigate' | 'ai'>('navigate');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/ai/command' }),
  });

  const aiResponse = useMemo(() => {
    const last = [...messages].reverse().find((m) => m.role === 'assistant');
    return last?.parts?.[0]?.type === 'text' ? last.parts[0].text : '';
  }, [messages]);

  // ── Open / close ──────────────────────────────────────────────

  const handleOpen = useCallback(
    (value: boolean) => {
      setOpen(value);
      if (!value) {
        setTimeout(() => {
          setQuery('');
          setMode('navigate');
          setSelectedIndex(0);
          setMessages([]);
        }, 150);
      } else {
        setRecent(getRecent());
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [setMessages]
  );

  // ── Global ⌘K listener ────────────────────────────────────────

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleOpen(!open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, handleOpen]);

  // ── Filter results ────────────────────────────────────────────

  const filteredBySection = useMemo(() => {
    const q = query.replace(/^\?/, '').trim().toLowerCase();
    if (!q) return null; // show recent when empty
    const matched = COMMANDS.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.keywords?.toLowerCase().includes(q) ||
        c.href.includes(q)
    );
    const bySection = new Map<Section, CommandEntry[]>();
    for (const cmd of matched) {
      const existing = bySection.get(cmd.section) ?? [];
      existing.push(cmd);
      bySection.set(cmd.section, existing);
    }
    return SECTION_ORDER.filter((s) => bySection.has(s)).map((s) => ({
      section: s,
      items: bySection.get(s)!,
    }));
  }, [query]);

  const flatResults = useMemo(
    () => filteredBySection?.flatMap((s) => s.items) ?? [],
    [filteredBySection]
  );

  // ── Detect AI mode ────────────────────────────────────────────

  useEffect(() => {
    if (query.startsWith('?')) {
      setMode('ai');
    } else if (!query) {
      setMode('navigate');
    }
  }, [query]);

  // ── Keyboard navigation ───────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (mode === 'ai') {
      if (e.key === 'Enter' && !e.shiftKey && query.replace(/^\?/, '').trim()) {
        e.preventDefault();
        const q = query.replace(/^\?/, '').trim();
        saveRecent(q);
        setRecent(getRecent());
        sendMessage({ text: q });
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        setMode('navigate');
        setQuery((v) => v.replace(/^\?/, ''));
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = flatResults[selectedIndex];
      if (cmd) navigateTo(cmd);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setMode('ai');
      if (!query.startsWith('?')) setQuery('?');
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const navigateTo = (cmd: CommandEntry) => {
    saveRecent(cmd.label);
    setRecent(getRecent());
    router.push(cmd.href);
    handleOpen(false);
  };

  const handleAIMode = () => {
    setMode('ai');
    if (!query.startsWith('?')) setQuery('?');
    inputRef.current?.focus();
  };

  const cleanQuery = query.replace(/^\?/, '').trim();

  return (
    <RadixDialog.Root open={open} onOpenChange={handleOpen}>
      <RadixDialog.Portal>
        {/* Backdrop */}
        <RadixDialog.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
            'duration-150'
          )}
        />

        {/* Centered container */}
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh] sm:pt-[14vh]">
          <RadixDialog.Content
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              inputRef.current?.focus();
            }}
            className={cn(
              'w-full max-w-2xl overflow-hidden rounded-2xl',
              'border-border/40 bg-background/98 border shadow-2xl',
              'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              'duration-150 outline-none'
            )}
          >
            <RadixDialog.Title className="sr-only">Search</RadixDialog.Title>
            <RadixDialog.Description className="sr-only">
              Search pages or ask AI a question
            </RadixDialog.Description>

            {/* ── Search input ──────────────────────────────── */}
            <div className="border-border/40 flex items-center gap-3 border-b px-4 py-0">
              {/* Mode icon */}
              <div className="shrink-0">
                {mode === 'ai' ? (
                  <HugeiconsIcon icon={SparklesIcon} className="text-primary size-5" />
                ) : (
                  <HugeiconsIcon icon={SearchIcon} className="text-muted-foreground size-5" />
                )}
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  mode === 'ai'
                    ? 'Ask AI anything… (press Enter to send)'
                    : 'Search pages, features… (? for AI)'
                }
                className="text-foreground placeholder:text-muted-foreground/50 h-14 flex-1 bg-transparent text-base outline-none"
                aria-label="Search"
                autoComplete="off"
                spellCheck={false}
              />

              {/* Right: AI pill + clear */}
              <div className="flex items-center gap-1.5">
                {query ? (
                  <button
                    onClick={() => {
                      setQuery('');
                      setMode('navigate');
                      inputRef.current?.focus();
                    }}
                    className="bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground flex size-6 items-center justify-center rounded-full transition-colors"
                    aria-label="Clear"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                  </button>
                ) : null}
                <button
                  onClick={handleAIMode}
                  className={cn(
                    'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150',
                    mode === 'ai'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  )}
                  aria-label="Ask AI"
                >
                  <HugeiconsIcon icon={SparklesIcon} className="size-3" />
                  AI
                </button>
              </div>
            </div>

            {/* ── Body ─────────────────────────────────────── */}
            <div
              className="max-h-[56vh] min-h-[120px] overflow-y-auto overscroll-contain"
              ref={resultsRef}
            >
              {/* AI mode */}
              {mode === 'ai' && (
                <div className="p-4">
                  {!aiResponse &&
                    !(status === 'submitted' || status === 'streaming') &&
                    !cleanQuery && (
                      <div className="flex flex-col items-center gap-3 py-8 text-center">
                        <div className="bg-primary/10 flex size-12 items-center justify-center rounded-[var(--radius)]">
                          <HugeiconsIcon icon={SparklesIcon} className="text-primary size-6" />
                        </div>
                        <div>
                          <p className="text-foreground text-sm font-medium">Ask me anything</p>
                          <p className="text-muted-foreground mt-0.5 text-xs">
                            Try "What's my mood average?" or "Suggest a journaling topic"
                          </p>
                        </div>
                        {/* Suggestion chips */}
                        <div className="flex flex-wrap justify-center gap-2">
                          {[
                            'Summarize my week',
                            'How is my mood trending?',
                            'Suggest a journal topic',
                            'What goals should I focus on?',
                          ].map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => {
                                setQuery(suggestion);
                                sendMessage({ text: suggestion });
                                saveRecent(suggestion);
                                setRecent(getRecent());
                              }}
                              className="border-border/60 bg-muted/50 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary rounded-full border px-3 py-1.5 text-xs transition-all"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {(status === 'submitted' || status === 'streaming' || aiResponse) && (
                    <div className="space-y-3">
                      {/* User query display */}
                      {cleanQuery && (
                        <div className="flex justify-end">
                          <div className="bg-primary text-primary-foreground max-w-[80%] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm">
                            {cleanQuery}
                          </div>
                        </div>
                      )}

                      {/* AI response */}
                      <div className="flex items-start gap-2.5">
                        <div className="bg-primary/10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                          <HugeiconsIcon icon={SparklesIcon} className="text-primary size-3.5" />
                        </div>
                        <div className="flex-1">
                          {(status === 'submitted' || status === 'streaming') && !aiResponse ? (
                            <div className="flex flex-col gap-2 pt-1">
                              <div className="bg-muted h-3 w-full animate-pulse rounded-full" />
                              <div className="bg-muted h-3 w-4/5 animate-pulse rounded-full" />
                              <div className="bg-muted h-3 w-3/5 animate-pulse rounded-full" />
                            </div>
                          ) : (
                            <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
                              {aiResponse}
                              {(status === 'submitted' || status === 'streaming') && (
                                <ThinkingDots />
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigate mode — empty (show recents) */}
              {mode === 'navigate' && !filteredBySection && (
                <div className="p-3">
                  {recent.length > 0 ? (
                    <>
                      <p className="text-muted-foreground/50 px-2 pt-1 pb-1.5 text-[10px] font-semibold tracking-wider uppercase">
                        Recent
                      </p>
                      {recent.map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            setQuery(r);
                            inputRef.current?.focus();
                          }}
                          className="text-muted-foreground hover:bg-muted/60 hover:text-foreground flex w-full items-center gap-2.5 rounded-[calc(var(--radius)*0.8)] px-3 py-2 text-sm transition-colors"
                        >
                          <HugeiconsIcon
                            icon={SearchIcon}
                            className="size-3.5 shrink-0 opacity-50"
                          />
                          {r}
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-8 text-center">
                      <HugeiconsIcon
                        icon={SearchIcon}
                        className="text-muted-foreground/20 size-8"
                      />
                      <p className="text-muted-foreground text-sm">Start typing to search</p>
                      <p className="text-muted-foreground/50 text-xs">
                        Type <kbd className="bg-muted rounded px-1 font-mono">?</kbd> to ask AI
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigate mode — with results */}
              {mode === 'navigate' && filteredBySection && (
                <>
                  {filteredBySection.length === 0 ? (
                    <div className="flex flex-col items-center gap-2.5 py-10 text-center">
                      <HugeiconsIcon
                        icon={SearchIcon}
                        className="text-muted-foreground/20 size-8"
                      />
                      <p className="text-muted-foreground text-sm">
                        No results for &ldquo;{query}&rdquo;
                      </p>
                      <button
                        onClick={() => {
                          setMode('ai');
                          setQuery(`?${query}`);
                        }}
                        className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors"
                      >
                        <HugeiconsIcon icon={SparklesIcon} className="size-3" />
                        Ask AI instead
                      </button>
                    </div>
                  ) : (
                    <div className="p-2">
                      {(() => {
                        let globalIndex = 0;
                        return filteredBySection.map(({ section, items }) => (
                          <div key={section}>
                            <p className="text-muted-foreground/50 px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase">
                              {section}
                            </p>
                            {items.map((item) => {
                              const idx = globalIndex++;
                              const isSelected = idx === selectedIndex;
                              return (
                                <button
                                  key={item.href}
                                  ref={(el) => {
                                    itemRefs.current[idx] = el;
                                  }}
                                  onClick={() => navigateTo(item)}
                                  onMouseEnter={() => setSelectedIndex(idx)}
                                  className={cn(
                                    'flex w-full items-center gap-3 rounded-[calc(var(--radius)*0.8)] px-3 py-2.5 text-left transition-colors duration-100',
                                    isSelected ? 'bg-muted/70' : 'hover:bg-muted/40'
                                  )}
                                >
                                  <div
                                    className={cn(
                                      'flex size-7 shrink-0 items-center justify-center rounded-[calc(var(--radius)*0.6)] transition-colors',
                                      isSelected
                                        ? 'bg-primary/15 text-primary'
                                        : 'bg-muted text-muted-foreground'
                                    )}
                                  >
                                    <HugeiconsIcon icon={item.icon} className="size-3.5" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-foreground text-sm leading-tight font-medium">
                                      <Highlight text={item.label} query={query} />
                                    </p>
                                    {item.description && (
                                      <p className="text-muted-foreground text-xs leading-tight">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                  {item.shortcut && (
                                    <kbd className="bg-muted text-muted-foreground shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px]">
                                      {item.shortcut}
                                    </kbd>
                                  )}
                                  {isSelected && (
                                    <HugeiconsIcon
                                      icon={ArrowRight01Icon}
                                      className="text-muted-foreground size-3.5 shrink-0"
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Footer ───────────────────────────────────── */}
            <div className="border-border/40 flex items-center justify-between border-t px-4 py-2">
              <div className="text-muted-foreground/50 flex items-center gap-3 text-[10px]">
                {mode === 'navigate' ? (
                  <>
                    <span className="flex items-center gap-1">
                      <kbd className="bg-muted rounded px-1 font-mono text-[10px]">↑↓</kbd> navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="bg-muted rounded px-1 font-mono text-[10px]">↵</kbd> open
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="bg-muted rounded px-1 font-mono text-[10px]">Tab</kbd> ask AI
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1">
                      <kbd className="bg-muted rounded px-1 font-mono text-[10px]">↵</kbd> send
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="bg-muted rounded px-1 font-mono text-[10px]">Tab</kbd>{' '}
                      navigate
                    </span>
                  </>
                )}
              </div>
              <span className="text-muted-foreground/40 flex items-center gap-1 text-[10px]">
                <kbd className="bg-muted rounded px-1 font-mono text-[10px]">Esc</kbd> close
              </span>
            </div>
          </RadixDialog.Content>
        </div>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
