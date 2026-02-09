"use client";

/**
 * Mood Logged Card
 *
 * Beautiful visual block displayed when a mood is logged via AI tool call.
 * Animated entry with motion primitives.
 */

import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";

interface MoodLoggedProps {
  mood: string;
  score: number;
  energy?: number;
  stress?: number;
}

const moodEmojis: Record<string, string> = {
  excellent: "🌟",
  good: "😊",
  neutral: "😐",
  bad: "😔",
  terrible: "😢",
};

const moodColors: Record<string, string> = {
  excellent: "from-emerald-500/20 to-green-500/10 border-emerald-500/30",
  good: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
  neutral: "from-amber-500/20 to-yellow-500/10 border-amber-500/30",
  bad: "from-orange-500/20 to-red-500/10 border-orange-500/30",
  terrible: "from-red-500/20 to-rose-500/10 border-red-500/30",
};

function Gauge({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value}/{max}</span>
      </div>
      <div className="bg-muted h-1.5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
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
        "rounded-2xl border bg-gradient-to-br p-4 w-full max-w-sm",
        moodColors[mood] || moodColors.neutral
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{moodEmojis[mood] || "📝"}</span>
        <div>
          <p className="text-sm font-semibold capitalize">{mood}</p>
          <p className="text-muted-foreground text-xs">Mood logged</p>
        </div>
      </div>

      <div className="space-y-2.5">
        <Gauge label="Mood Score" value={score} />
        {energy != null && <Gauge label="Energy" value={energy} />}
        {stress != null && <Gauge label="Stress" value={stress} />}
      </div>

      <p className="text-muted-foreground mt-3 text-[11px]">
        ✓ Saved to your wellness journal
      </p>
    </motion.div>
  );
}
