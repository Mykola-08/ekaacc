'use client';

/**
 * Mood Logged Card
 *
 * Beautiful visual block displayed when a mood is logged via AI tool call.
 * Animated entry with motion primitives.
 */

import * as motion from 'motion/react-client';
import { cn } from '@/lib/utils';

interface MoodLoggedProps {
  mood: string;
  score: number;
  energy?: number;
  stress?: number;
}

const moodEmojis: Record<string, string> = {
  excellent: '🌟',
  good: '😊',
  neutral: '😐',
  bad: '😔',
  terrible: '😢',
};

const moodColors: Record<string, string> = {
  excellent: 'from-success/20 to-success/10 border-success/30',
  good: 'from-info/20 to-info/10 border-primary/30',
  neutral: 'from-warning/20 to-warning/10 border-vip-gold-1/30',
  bad: 'from-warning/20 to-destructive/10 border-warning/30',
  terrible: 'from-destructive/20 to-destructive/10 border-destructive/30',
};

function Gauge({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">
          {value}/{max}
        </span>
      </div>
      <div className="bg-muted h-1.5 overflow-hidden rounded-full">
        <motion.div
          className="from-primary to-primary/70 h-full rounded-full bg-linear-to-r"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

export function MoodLoggedCard({ mood, score, energy, stress }: MoodLoggedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'w-full max-w-sm rounded-lg border bg-linear-to-br p-4',
        moodColors[mood] || moodColors.neutral
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="text-3xl">{moodEmojis[mood] || '📝'}</span>
        <div>
          <p className="text-sm font-semibold capitalize">{mood}</p>
          <p className="text-muted-foreground text-xs">Mood logged</p>
        </div>
      </div>

      <div className=".5">
        <Gauge label="Mood Score" value={score} />
        {energy != null && <Gauge label="Energy" value={energy} />}
        {stress != null && <Gauge label="Stress" value={stress} />}
      </div>

      <p className="text-muted-foreground mt-3 text-xs">✓ Saved to your wellness journal</p>
    </motion.div>
  );
}
