"use client";

/**
 * Mood Tracker Widget
 *
 * Quick-log mood and view recent mood trend.
 * Designed for the dashboard sidebar or AI page.
 */

import { useState, useEffect, useCallback } from "react";
import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/morphing-toaster";

interface MoodEntry {
  mood: string;
  mood_score: number;
  energy_level: number | null;
  stress_level: number | null;
  logged_at: string;
}

interface MoodTrendData {
  moods: MoodEntry[];
  averageScore: number;
  trend: "improving" | "declining" | "stable";
}

const MOOD_OPTIONS = [
  { emoji: "ðŸ˜¢", label: "Sad", score: 2 },
  { emoji: "ðŸ˜”", label: "Low", score: 3 },
  { emoji: "ðŸ˜", label: "Okay", score: 5 },
  { emoji: "ðŸ™‚", label: "Good", score: 7 },
  { emoji: "ðŸ˜Š", label: "Great", score: 8 },
  { emoji: "ðŸ¤©", label: "Amazing", score: 10 },
];

const trendConfig = {
  improving: { label: "Improving", icon: "â†—", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  declining: { label: "Needs attention", icon: "â†˜", color: "text-red-500", bg: "bg-red-500/10" },
  stable: { label: "Stable", icon: "â†’", color: "text-primary", bg: "bg-primary/10" },
};

function MiniSparkline({ scores }: { scores: number[] }) {
  if (scores.length < 2) return null;

  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min || 1;

  const w = 120;
  const h = 28;

  const points = scores.map((v, i) => {
    const x = 2 + (i / (scores.length - 1)) * (w - 4);
    const y = h - 2 - ((v - min) / range) * (h - 4);
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="moodSparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`2,${h} ${points.join(" ")} ${w - 2},${h}`}
        fill="url(#moodSparkGrad)"
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MoodWidget({ className }: { className?: string }) {
  const [trendData, setTrendData] = useState<MoodTrendData | null>(null);
  const [logging, setLogging] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTrend = useCallback(async () => {
    try {
      const res = await fetch("/api/ai/mood?days=14");
      if (res.ok) {
        const data = await res.json();
        setTrendData(data);
      }
    } catch {
      // Silently fail on first load
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrend();
  }, [fetchTrend]);

  const handleLogMood = useCallback(
    async (option: (typeof MOOD_OPTIONS)[number]) => {
      setLogging(true);
      try {
        const res = await fetch("/api/ai/mood", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood: option.label.toLowerCase(), score: option.score }),
        });

        if (res.ok) {
          toast.success(`Mood logged: ${option.emoji} ${option.label}`);
          await fetchTrend();
        } else {
          toast.error("Failed to log mood");
        }
      } catch {
        toast.error("Failed to log mood");
      } finally {
        setLogging(false);
      }
    },
    [fetchTrend]
  );

  const recentScores = trendData?.moods.map((m) => m.mood_score) ?? [];
  const trend = trendData?.trend ?? "stable";
  const cfg = trendConfig[trend];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={cn("bg-card rounded-lg border p-5", className)}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">How are you feeling?</h3>
        {trendData && trendData.moods.length > 0 && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
              cfg.bg,
              cfg.color
            )}
          >
            <span>{cfg.icon}</span>
            <span>{cfg.label}</span>
          </div>
        )}
      </div>

      {/* Mood picker */}
      <div className="mb-4 flex items-center justify-between gap-1">
        {MOOD_OPTIONS.map((option) => (
          <Button
            key={option.label}
            variant="ghost"
            size="sm"
            disabled={logging}
            onClick={() => handleLogMood(option)}
            className="flex h-auto flex-col gap-0.5 px-2 py-2 hover:scale-110 active:scale-95"
          >
            <span className="text-xl">{option.emoji}</span>
            <span className="text-muted-foreground text-[10px]">{option.label}</span>
          </Button>
        ))}
      </div>

      {/* Sparkline + stats */}
      {loading ? (
        <div className="bg-muted/50 h-12 animate-pulse rounded-lg" />
      ) : recentScores.length >= 2 ? (
        <div>
          <MiniSparkline scores={recentScores} />
          <div className="mt-2 flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">
              {trendData!.moods.length} entries Â· {14} days
            </span>
            <span className="text-muted-foreground">
              Avg: {trendData!.averageScore.toFixed(1)} / 10
            </span>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground py-2 text-center text-xs">
          Log your mood daily to see trends
        </p>
      )}
    </motion.div>
  );
}
