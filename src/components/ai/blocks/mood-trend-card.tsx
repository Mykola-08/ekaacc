'use client';

/**
 * Mood Trend Card
 *
 * Visualizes mood history with a mini sparkline chart and trend indicator.
 */

import * as motion from 'motion/react-client';
import { cn } from '@/lib/utils';

interface MoodDataPoint {
  score: number;
  mood: string;
  date: string;
}

interface MoodTrendProps {
  moods: MoodDataPoint[];
  averageScore: number;
  trend: 'improving' | 'declining' | 'stable';
  days: number;
}

const trendConfig = {
  improving: { label: 'Improving', icon: '?', color: 'text-success', bg: 'bg-success/10' },
  declining: { label: 'Declining', icon: '?', color: 'text-destructive', bg: 'bg-destructive/10' },
  stable: { label: 'Stable', icon: '?', color: 'text-primary', bg: 'bg-primary/10' },
};

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const width = 200;
  const height = 40;
  const padding = 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-10 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <motion.polygon
        points={`${padding},${height} ${points.join(' ')} ${width - padding},${height}`}
        fill="url(#sparkGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      {/* Line */}
      <motion.polyline
        points={points.join(' ')}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

export function MoodTrendCard({ moods, averageScore, trend, days }: MoodTrendProps) {
  const cfg = trendConfig[trend];
  const scores = moods.map((m) => m.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card w-full max-w-sm rounded-lg border p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Mood Trend</p>
          <p className="text-muted-foreground text-xs">Last {days} days</p>
        </div>
        <div
          className={cn(
            'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
            cfg.bg,
            cfg.color
          )}
        >
          <span>{cfg.icon}</span>
          <span>{cfg.label}</span>
        </div>
      </div>

      {scores.length >= 2 && <Sparkline data={scores} />}

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="bg-muted/50 rounded-lg p-2">
          <p className="text-foreground text-lg font-semibold tabular-nums">{averageScore}</p>
          <p className="text-muted-foreground text-2xs">Avg Score</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <p className="text-foreground text-lg font-semibold tabular-nums">{moods.length}</p>
          <p className="text-muted-foreground text-2xs">Entries</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <p className="text-foreground text-lg font-semibold tabular-nums">
            {scores.length > 0 ? Math.max(...scores) : '-'}
          </p>
          <p className="text-muted-foreground text-2xs">Best</p>
        </div>
      </div>
    </motion.div>
  );
}
