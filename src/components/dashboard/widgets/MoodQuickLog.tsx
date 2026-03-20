'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { HeartCheckIcon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import { logMoodEntry } from '@/app/actions/mood-actions';

const MOOD_STEPS = [
  { score: 1, emoji: '😔', label: 'Very low' },
  { score: 2, emoji: '😟', label: 'Low' },
  { score: 3, emoji: '😕', label: 'Not great' },
  { score: 4, emoji: '😐', label: 'Okay-ish' },
  { score: 5, emoji: '🙂', label: 'Alright' },
  { score: 6, emoji: '😊', label: 'Good' },
  { score: 7, emoji: '😄', label: 'Pretty good' },
  { score: 8, emoji: '😁', label: 'Great' },
  { score: 9, emoji: '🤩', label: 'Excellent' },
  { score: 10, emoji: '🌟', label: 'Amazing' },
];

function scoreColor(score: number) {
  if (score >= 8) return 'text-success';
  if (score >= 6) return 'text-primary';
  if (score >= 4) return 'text-warning';
  return 'text-destructive';
}

function scoreBg(score: number) {
  if (score >= 8) return 'bg-success/10 border-success/30';
  if (score >= 6) return 'bg-primary/10 border-primary/30';
  if (score >= 4) return 'bg-warning/10 border-warning/30';
  return 'bg-destructive/10 border-destructive/30';
}

export type MoodQuickLogProps = {
  /** Today's already-logged mood score (1–10), or null if not yet logged */
  todayScore: number | null;
};

export function MoodQuickLog({ todayScore: initialScore }: MoodQuickLogProps) {
  const [logged, setLogged] = useState<number | null>(initialScore);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const display = hovered ?? logged;
  const step = display ? MOOD_STEPS[display - 1] : null;

  const handleLog = (score: number) => {
    startTransition(async () => {
      await logMoodEntry(score);
      setLogged(score);
    });
  };

  if (logged !== null) {
    const s = MOOD_STEPS[logged - 1];
    return (
      <Card className={cn('border transition-all', scoreBg(logged))}>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-2xl">
            {s.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn('text-sm font-semibold', scoreColor(logged))}>
              Mood: {logged}/10 · {s.label}
            </p>
            <p className="text-xs text-muted-foreground">Today's check-in logged</p>
          </div>
          <HugeiconsIcon icon={CheckmarkCircle01Icon} className={cn('size-4 shrink-0', scoreColor(logged))} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={HeartCheckIcon} className="size-4 text-muted-foreground" />
            <p className="text-sm font-semibold">How are you feeling?</p>
          </div>
          {step && (
            <span className={cn('text-xs font-medium tabular-nums', scoreColor(hovered ?? 0))}>
              {step.emoji} {step.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {MOOD_STEPS.map(({ score, emoji }) => (
            <button
              key={score}
              disabled={isPending}
              onClick={() => handleLog(score)}
              onMouseEnter={() => setHovered(score)}
              onMouseLeave={() => setHovered(null)}
              title={`Log mood ${score}/10`}
              className={cn(
                'flex flex-1 items-center justify-center rounded-[calc(var(--radius)*0.8)] py-2 text-base transition-all',
                'hover:bg-muted/60 hover:scale-110 active:scale-95',
                isPending && 'opacity-50 cursor-wait',
                hovered !== null && score <= hovered
                  ? score >= 8
                    ? 'bg-success/10'
                    : score >= 6
                      ? 'bg-primary/10'
                      : score >= 4
                        ? 'bg-warning/10'
                        : 'bg-destructive/10'
                  : 'bg-transparent'
              )}
            >
              <span className={cn(
                'text-xs leading-none transition-transform',
                hovered !== null && score <= hovered ? 'scale-125' : 'opacity-60'
              )}>
                {emoji}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-1 flex justify-between px-1">
          <span className="text-xs text-muted-foreground">😔 Low</span>
          <span className="text-xs text-muted-foreground">Great 🌟</span>
        </div>
      </CardContent>
    </Card>
  );
}
