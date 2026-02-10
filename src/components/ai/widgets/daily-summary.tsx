"use client";

/**
 * Daily Summary Widget
 *
 * Displays the AI-generated daily wellness summary.
 * Fetches from /api/ai/summary endpoint.
 */

import { useState, useEffect, useCallback } from "react";
import * as motion from "motion/react-client";
import { Sun, Moon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/morphing-toaster";

export function DailySummaryWidget({ className }: { className?: string }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSummary = useCallback(async (refresh = false) => {
    try {
      const url = refresh ? "/api/ai/summary?refresh=true" : "/api/ai/summary";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSummary(true);
    toast.success("Summary refreshed");
  }, [fetchSummary]);

  const hour = new Date().getHours();
  const isEvening = hour >= 18 || hour < 6;
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const TimeIcon = isEvening ? Moon : Sun;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={cn(
        "relative overflow-hidden rounded-lg border p-5",
        "bg-linear-to-br from-primary/5 via-card to-card",
        className
      )}
    >
      {/* Subtle glow */}
      <div className="bg-primary/5 pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl" />

      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <TimeIcon className="text-primary h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{greeting}</h3>
              <p className="text-muted-foreground text-[10px]">Your daily wellness brief</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
          </Button>
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="bg-muted/50 h-4 w-full animate-pulse rounded" />
            <div className="bg-muted/50 h-4 w-3/4 animate-pulse rounded" />
            <div className="bg-muted/50 h-4 w-5/6 animate-pulse rounded" />
          </div>
        ) : summary ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-muted-foreground text-sm leading-relaxed"
          >
            {summary}
          </motion.p>
        ) : (
          <p className="text-muted-foreground py-4 text-center text-xs">
            Start chatting with EKA to get a personalized daily summary
          </p>
        )}
      </div>
    </motion.div>
  );
}
