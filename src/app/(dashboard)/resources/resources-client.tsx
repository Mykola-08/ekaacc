'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  BookOpen02Icon,
  Video01Icon,
  File01Icon,
  Search01Icon,
  Link01Icon,
  MusicNote02Icon,
  Activity01Icon,
  Castle01Icon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import {
  markResourceOpened,
  toggleResourceCompleted,
  toggleSavedResource,
} from '@/app/actions/resources-actions';

type Resource = {
  id: string;
  title: string;
  description: string | null;
  type: string | null;
  url: string | null;
  is_published: boolean | null;
  created_at: string;
  tags: string[] | null;
};

const TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  article:     { label: 'Article',     icon: BookOpen02Icon, color: 'bg-primary/10 text-primary' },
  video:       { label: 'Video',       icon: Video01Icon,    color: 'bg-warning/10 text-warning' },
  exercise:    { label: 'Exercise',    icon: Activity01Icon, color: 'bg-success/10 text-success' },
  meditation:  { label: 'Meditation',  icon: MusicNote02Icon,color: 'bg-secondary/80 text-secondary-foreground' },
  audio:       { label: 'Audio',       icon: MusicNote02Icon,color: 'bg-secondary text-secondary-foreground' },
  worksheet:   { label: 'Worksheet',   icon: File01Icon,     color: 'bg-muted text-muted-foreground' },
  protocol:    { label: 'Protocol',    icon: Castle01Icon,  color: 'bg-destructive/10 text-destructive' },
  kinesiology: { label: 'Kinesiology', icon: Activity01Icon, color: 'bg-success/20 text-success' },
  link:        { label: 'Link',        icon: Link01Icon,     color: 'bg-muted text-muted-foreground' },
};

const ALL_TYPES = ['all', 'article', 'video', 'exercise', 'audio', 'worksheet', 'protocol', 'link'];

// Fallback mock resources when DB is empty
const FALLBACK: Resource[] = [
  { id: '1', title: 'CBT Foundations',        description: 'A complete guide to cognitive behavioral therapy.',    type: 'article',   url: null, is_published: true, created_at: '', tags: ['cbt', 'anxiety'] },
  { id: '2', title: 'Mindfulness Series',      description: '10-minute guided meditations for beginners.',         type: 'video',     url: null, is_published: true, created_at: '', tags: ['mindfulness'] },
  { id: '3', title: 'Anxiety Worksheet',       description: 'Printable PDF to help track and analyze triggers.',   type: 'worksheet', url: null, is_published: true, created_at: '', tags: ['anxiety'] },
  { id: '4', title: 'Breathing Exercises',     description: 'Box breathing and 4-7-8 techniques for stress.',      type: 'exercise',  url: null, is_published: true, created_at: '', tags: ['stress', 'breathing'] },
  { id: '5', title: 'Sleep Hygiene Guide',     description: 'Evidence-based practices for better sleep quality.',  type: 'article',   url: null, is_published: true, created_at: '', tags: ['sleep'] },
  { id: '6', title: 'Grounding Techniques',    description: 'The 5-4-3-2-1 method for managing panic attacks.',    type: 'exercise',  url: null, is_published: true, created_at: '', tags: ['anxiety', 'grounding'] },
];

export function ResourcesPageClient({
  resources,
  savedResourceIds,
  savedState,
}: {
  resources: Resource[];
  savedResourceIds: string[];
  savedState: Record<string, { completed: boolean; lastOpenedAt: string | null }>;
}) {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(savedResourceIds));
  const [resourceState, setResourceState] = useState(savedState);

  const displayResources = resources.length > 0 ? resources : FALLBACK;

  const filtered = displayResources.filter((r) => {
    const matchesSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.description ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (r.tags ?? []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesType = activeType === 'all' || r.type === activeType;
    const matchesSaved = !savedOnly || savedIds.has(r.id);
    const matchesCompleted = !hideCompleted || !resourceState[r.id]?.completed;
    return matchesSearch && matchesType && matchesSaved && matchesCompleted;
  });

  // Only show type filters that have resources
  const usedTypes = ['all', ...Array.from(new Set(displayResources.map((r) => r.type).filter(Boolean)))];

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Resource Library</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Self-guided materials, exercises, and therapeutic tools.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources…"
              className="h-9 pl-9 rounded-[var(--radius)]"
            />
          </div>
        </div>
      </div>

      {/* Type filter chips */}
      <div className="flex flex-wrap gap-2 px-4 lg:px-6">
        <button
          onClick={() => setSavedOnly((current) => !current)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
            savedOnly
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          Saved only
        </button>
        <button
          onClick={() => setHideCompleted((current) => !current)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
            hideCompleted
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          Hide completed
        </button>
        {usedTypes.map((type) => {
          const cfg = type === 'all' ? null : TYPE_CONFIG[type!];
          const count = type === 'all' ? displayResources.length : displayResources.filter((r) => r.type === type).length;
          return (
            <button
              key={type}
              onClick={() => setActiveType(type!)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                activeType === type
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {cfg && <HugeiconsIcon icon={cfg.icon} className="size-3" />}
              {type === 'all' ? 'All' : (cfg?.label ?? type)}
              <span className={cn(
                'rounded-full px-1.5 py-0 tabular-nums text-xs',
                activeType === type ? 'bg-primary-foreground/20' : 'bg-muted'
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Resource grid */}
      {filtered.length === 0 ? (
        <div className="mx-4 flex flex-col items-center gap-3 rounded-[var(--radius)] border border-dashed py-14 text-center lg:mx-6">
          <HugeiconsIcon icon={File01Icon} className="size-8 text-muted-foreground/30" />
          <div>
            <p className="font-semibold">No resources found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search or filter.</p>
          </div>
          <Button variant="ghost" size="sm" className="rounded-[calc(var(--radius)*0.8)]" onClick={() => { setSearch(''); setActiveType('all'); setSavedOnly(false); setHideCompleted(true); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
          {filtered.map((r) => {
            const cfg = TYPE_CONFIG[r.type ?? 'article'] ?? TYPE_CONFIG.article;
            const isSaved = savedIds.has(r.id);
            const isCompleted = resourceState[r.id]?.completed ?? false;
            const lastOpenedAt = resourceState[r.id]?.lastOpenedAt;
            return (
              <Card key={r.id} className="group flex flex-col rounded-[var(--radius)] border border-border/60 transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={cn('rounded-[var(--radius)] p-2.5 shrink-0', cfg.color)}>
                      <HugeiconsIcon icon={cfg.icon} className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <h3 className="text-sm font-semibold text-foreground leading-snug flex-1">
                          {r.title}
                        </h3>
                        {isCompleted && (
                          <Badge variant="secondary" className="shrink-0 text-[10px] uppercase tracking-wide">
                            Completed
                          </Badge>
                        )}
                        <Badge variant="outline" className="shrink-0 text-xs capitalize">
                          {cfg.label}
                        </Badge>
                      </div>
                      {r.description && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {r.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {(r.tags ?? []).length > 0 && (
                  <CardContent className="pt-0 pb-3">
                    <div className="flex flex-wrap gap-1">
                      {(r.tags ?? []).slice(0, 4).map((tag) => (
                        <span key={tag} className="rounded-[calc(var(--radius)*0.8)] bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {lastOpenedAt && (
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        Continue where you left off · {new Date(lastOpenedAt).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                )}

                <CardFooter className="pt-0 mt-auto">
                  <Button
                    variant={isSaved ? 'default' : 'outline'}
                    size="sm"
                    className="mr-2 rounded-[var(--radius)] text-xs"
                    onClick={async () => {
                      const result = await toggleSavedResource(r.id);
                      if (!result.success) return;
                      setSavedIds((current) => {
                        const next = new Set(current);
                        if (next.has(r.id)) {
                          next.delete(r.id);
                        } else {
                          next.add(r.id);
                        }
                        return next;
                      });
                    }}
                  >
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  <Button
                    variant={isCompleted ? 'default' : 'outline'}
                    size="sm"
                    className="mr-2 rounded-[var(--radius)] text-xs"
                    onClick={async () => {
                      const result = await toggleResourceCompleted(r.id);
                      if (!result.success) return;
                      setSavedIds((current) => {
                        const next = new Set(current);
                        next.add(r.id);
                        return next;
                      });
                      setResourceState((current) => ({
                        ...current,
                        [r.id]: {
                          completed: Boolean(result.completed),
                          lastOpenedAt: current[r.id]?.lastOpenedAt ?? null,
                        },
                      }));
                    }}
                  >
                    {isCompleted ? 'Completed' : 'Mark complete'}
                  </Button>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-[var(--radius)] gap-1.5 text-xs"
                        onClick={() => {
                          void markResourceOpened(r.id);
                          setResourceState((current) => ({
                            ...current,
                            [r.id]: {
                              completed: current[r.id]?.completed ?? false,
                              lastOpenedAt: new Date().toISOString(),
                            },
                          }));
                          setSavedIds((current) => {
                            const next = new Set(current);
                            next.add(r.id);
                            return next;
                          });
                        }}
                      >
                        <HugeiconsIcon icon={cfg.icon} className="size-3.5" />
                        {r.type === 'video' ? 'Watch' : r.type === 'audio' ? 'Listen' : r.type === 'exercise' ? 'Start Exercise' : 'Open'}
                      </Button>
                    </a>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full rounded-[var(--radius)] gap-1.5 text-xs" disabled>
                      <HugeiconsIcon icon={cfg.icon} className="size-3.5" />
                      Coming Soon
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
