'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { HeartCheckIcon, CheckmarkCircle01Icon, Edit02Icon } from '@hugeicons/core-free-icons';
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
  if (score >= 8) return 'bg-success/8 border-success/20';
  if (score >= 6) return 'bg-primary/8 border-primary/20';
  if (score >= 4) return 'bg-warning/8 border-warning/20';
  return 'bg-destructive/8 border-destructive/20';
}

function scoreBarColor(score: number) {
  if (score >= 8) return 'bg-success';
  if (score >= 6) return 'bg-primary';
  if (score >= 4) return 'bg-warning';
  return 'bg-destructive';
}

export type MoodQuickLogProps = {
  /** Today's already-logged mood score (1–10), or null if not yet logged */
  todayScore: number | null;
};

export function MoodQuickLog({ todayScore: initialScore }: MoodQuickLogProps) {
  const [logged, setLogged] = useState<number | null>(initialScore);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [updating, setUpdating] = useState(false);

  const display = hovered ?? logged;
  const step = display ? MOOD_STEPS[display - 1] : null;

  const handleLog = (score: number) => {
    startTransition(async () => {
      await logMoodEntry(score);
      setLogged(score);
      setUpdating(false);
    });
  };

  // Logged state — show confirmation card
  if (logged !== null && !updating) {
    const s = MOOD_STEPS[logged - 1];
    const fillWidth = `${(logged / 10) * 100}%`;
    return (
      <Card className={cn('border transition-all duration-300', scoreBg(logged))}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-2xl">
              {s.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className={cn('text-sm font-semibold', scoreColor(logged))}>
                  Feeling {s.label.toLowerCase()} · {logged}/10
                </p>
                <HugeiconsIcon
                  icon={CheckmarkCircle01Icon}
                  className={cn('size-4 shrink-0', scoreColor(logged))}
                />
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">Today's mood logged</p>
              {/* Mood bar */}
              <div className="bg-muted/60 mt-2 h-1 w-full overflow-hidden rounded-full">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    scoreBarColor(logged)
                  )}
                  style={{ width: fillWidth }}
                />
              </div>
            </div>
          </div>
          {/* Update button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground mt-2 h-7 w-full gap-1.5 text-xs"
            onClick={() => setUpdating(true)}
          >
            <HugeiconsIcon icon={Edit02Icon} className="size-3" />
            Update mood
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <HugeiconsIcon icon={HeartCheckIcon} className="text-muted-foreground size-4" />
          How are you feeling today?
          {step && (
            <span
              className={cn(
                'ml-auto text-xs font-medium tabular-nums',
                scoreColor(hovered ?? logged ?? 0)
              )}
            >
              {step.emoji} {step.label}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Emoji row */}
        <div className="flex items-center gap-0.5">
          {MOOD_STEPS.map(({ score, emoji }) => {
            const isActive =
              hovered !== null ? score <= hovered : logged !== null ? score <= logged : false;
            return (
              <button
                key={score}
                disabled={isPending}
                onClick={() => handleLog(score)}
                onMouseEnter={() => setHovered(score)}
                onMouseLeave={() => setHovered(null)}
                title={`${MOOD_STEPS[score - 1].label} (${score}/10)`}
                className={cn(
                  'flex flex-1 flex-col items-center gap-0.5 rounded-[calc(var(--radius)*0.6)] py-2 transition-all duration-100',
                  'hover:scale-110 active:scale-95',
                  isPending && 'cursor-wait opacity-50',
                  isActive
                    ? score >= 8
                      ? 'bg-success/10'
                      : score >= 6
                        ? 'bg-primary/10'
                        : score >= 4
                          ? 'bg-warning/10'
                          : 'bg-destructive/10'
                    : 'hover:bg-muted/60'
                )}
              >
                <span
                  className={cn(
                    'text-sm leading-none transition-all duration-100',
                    isActive ? 'scale-125 opacity-100' : 'opacity-50'
                  )}
                >
                  {emoji}
                </span>
                <span
                  className={cn(
                    'text-[9px] leading-none font-medium tabular-nums transition-opacity duration-100',
                    isActive ? 'opacity-70' : 'opacity-0'
                  )}
                >
                  {score}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-1.5 flex justify-between px-1">
          <span className="text-muted-foreground text-[10px]">😔 Struggling</span>
          <span className="text-muted-foreground text-[10px]">Thriving 🌟</span>
        </div>
      </CardContent>
    </Card>
  );
}
