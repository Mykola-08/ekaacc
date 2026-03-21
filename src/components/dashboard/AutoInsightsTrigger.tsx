'use client';

import { useEffect } from 'react';

const INSIGHTS_KEY = 'eka_ai_last_insights_trigger';
const SUMMARY_KEY = 'eka_ai_last_summary_prefetch';
const MOOD_TREND_KEY = 'eka_ai_last_moodtrend_prefetch';
const THIRTY_MINUTES = 1000 * 60 * 30;
const SIX_HOURS = 1000 * 60 * 60 * 6;
const TWO_HOURS = 1000 * 60 * 60 * 2;

function canRun(key: string, ttlMs: number) {
  const previous = Number(window.localStorage.getItem(key) ?? 0);
  return Date.now() - previous > ttlMs;
}

function markRun(key: string) {
  window.localStorage.setItem(key, String(Date.now()));
}

export function AutoInsightsTrigger() {
  useEffect(() => {
    const runSilentAiFlows = async () => {
      try {
        if (canRun(INSIGHTS_KEY, SIX_HOURS)) {
          await fetch('/api/ai/insights', { method: 'POST' });
          markRun(INSIGHTS_KEY);
        }

        if (canRun(SUMMARY_KEY, THIRTY_MINUTES)) {
          await fetch('/api/ai/summary');
          markRun(SUMMARY_KEY);
        }

        if (canRun(MOOD_TREND_KEY, TWO_HOURS)) {
          await fetch('/api/ai/mood?days=14');
          markRun(MOOD_TREND_KEY);
        }
      } catch {
        // Ignore errors for fire-and-forget behavior.
      }
    };

    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(
        () => {
          void runSilentAiFlows();
        }
      );
      return;
    }

    void runSilentAiFlows();
  }, []);

  return null;
}
