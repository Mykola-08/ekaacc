'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PencilEdit01Icon,
  Calendar03Icon,
  PlusSignIcon,
  Search01Icon,
  MoreVerticalIcon,
  BookOpen02Icon,
  Delete01Icon,
  Loading03Icon,
  ArrowLeft01Icon,
} from '@hugeicons/core-free-icons';
import { createJournalEntry, deleteJournalEntry } from '@/app/actions/journal-actions';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type JournalEntry = {
  id: string;
  title: string | null;
  content: string;
  mood: string | null;
  mood_score: number | null;
  tags: string[] | null;
  created_at: string;
};

const MOOD_OPTIONS = [
  { value: 'excellent', label: '😄 Excellent' },
  { value: 'good', label: '🙂 Good' },
  { value: 'neutral', label: '😐 Neutral' },
  { value: 'bad', label: '😕 Bad' },
  { value: 'terrible', label: '😢 Terrible' },
];

const MOOD_BADGE: Record<string, string> = {
  excellent: 'bg-success/10 text-success',
  good: 'bg-primary/10 text-primary',
  neutral: 'bg-muted text-muted-foreground',
  bad: 'bg-warning/10 text-warning-foreground',
  terrible: 'bg-destructive/10 text-destructive',
};

function formatRelative(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function JournalPageClient({ entries: initial }: { entries: JournalEntry[] }) {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>(initial);
  const [view, setView] = useState<'list' | 'write'>('list');
  const [selected, setSelected] = useState<JournalEntry | null>(null);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  // Write state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = entries.filter(
    (e) =>
      (e.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
      e.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!content.trim()) { setError('Please write something before saving.'); return; }
    setSaving(true);
    setError(null);
    const res = await createJournalEntry({ title: title || undefined, content, mood: mood || undefined });
    setSaving(false);
    if (!res.success) { setError(res.error ?? 'Failed to save'); return; }
    // Optimistically prepend
    setEntries((prev) => [res.data as JournalEntry, ...prev]);
    setTitle(''); setContent(''); setMood('');
    setView('list');
    router.refresh();
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteJournalEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (selected?.id === id) setSelected(null);
    });
  };

  // ── Write view ──────────────────────────────────────────
  if (view === 'write') {
    return (
      <div className="flex flex-col gap-4 py-4 md:py-6">
        <div className="flex items-center gap-3 px-4 lg:px-6">
          <Button variant="ghost" size="sm" onClick={() => setView('list')} className="gap-1.5 rounded-lg">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" /> Back
          </Button>
          <h1 className="text-lg font-bold tracking-tight">New Entry</h1>
        </div>

        <div className="px-4 lg:px-6">
          <Card className="rounded-xl">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entry title (optional)"
                  className="h-11 rounded-xl text-base font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">How are you feeling?</Label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue placeholder="Select mood…" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOOD_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="How are you feeling today? Take a deep breath and start writing…"
                  className="min-h-64 resize-none rounded-xl text-base leading-relaxed"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between items-center border-t border-border/60 pt-4">
                <Button variant="ghost" onClick={() => setView('list')} className="rounded-lg">
                  Discard
                </Button>
                <Button onClick={handleSave} disabled={saving} className="gap-2 rounded-lg px-6">
                  {saving && <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />}
                  {saving ? 'Saving…' : 'Save Entry'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── List / detail view ──────────────────────────────────
  return (
    <div className="flex flex-col gap-4 py-4 md:py-6">
      <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <HugeiconsIcon icon={BookOpen02Icon} className="size-5 text-muted-foreground" />
            My Journal
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            A private space for self-reflection.
          </p>
        </div>
        <Button onClick={() => setView('write')} className="shrink-0 gap-2 rounded-lg">
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          New Entry
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[288px_1fr]">
        {/* Entry list */}
        <div className="space-y-3">
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entries…"
              className="pl-9 rounded-lg"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
              <HugeiconsIcon icon={BookOpen02Icon} className="size-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                {search ? 'No entries match your search.' : 'No entries yet. Write your first one!'}
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {filtered.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setSelected(entry)}
                  className={cn(
                    'group w-full rounded-xl border px-4 py-3 text-left transition-all',
                    selected?.id === entry.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40 hover:bg-muted/30'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="truncate text-sm font-semibold text-foreground">
                      {entry.title || 'Untitled'}
                    </h4>
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <button className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <HugeiconsIcon icon={MoreVerticalIcon} className="size-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <HugeiconsIcon icon={Delete01Icon} className="mr-2 size-4" /> Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete entry?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This journal entry will be permanently deleted and cannot be recovered.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatRelative(entry.created_at)}
                    </span>
                    {entry.mood && (
                      <span className={cn('rounded-full px-1.5 py-0.5 text-xs font-medium capitalize', MOOD_BADGE[entry.mood] ?? 'bg-muted text-muted-foreground')}>
                        {entry.mood}
                      </span>
                    )}
                  </div>
                  {!selected || selected.id !== entry.id ? (
                    <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                      {entry.content}
                    </p>
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Entry detail / empty state */}
        <div>
          {selected ? (
            <Card className="rounded-xl">
              <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                <div className="space-y-1 min-w-0">
                  <CardTitle className="text-lg font-bold">{selected.title || 'Untitled'}</CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
                    {new Date(selected.created_at).toLocaleDateString(undefined, {
                      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                    })}
                    {selected.mood && (
                      <span className={cn('rounded-full px-2 py-0.5 font-medium capitalize', MOOD_BADGE[selected.mood] ?? '')}>
                        {selected.mood}
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0 rounded-lg" onClick={() => setSelected(null)}>
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {selected.content}
                </p>
                {selected.tags && selected.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {selected.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-center">
              <HugeiconsIcon icon={PencilEdit01Icon} className="size-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Select an entry to read it, or write a new one.</p>
              <Button variant="outline" onClick={() => setView('write')} className="rounded-lg gap-1.5">
                <HugeiconsIcon icon={PlusSignIcon} className="size-4" /> Write Entry
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
