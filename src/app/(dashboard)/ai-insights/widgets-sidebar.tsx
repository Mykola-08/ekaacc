"use client";

/**
 * AI Widgets Sidebar
 *
 * Client component wrapper for the dashboard widgets
 * shown alongside the AI chat view.
 */

import { DailySummaryWidget } from "@/components/ai/widgets/daily-summary";
import { MoodWidget } from "@/components/ai/widgets/mood-widget";
import { InsightsPanel } from "@/components/ai/widgets/insights-panel";

export function AIWidgetsSidebar() {
  return (
    <div className="space-y-4">
      <DailySummaryWidget />
      <MoodWidget />
      <InsightsPanel />
    </div>
  );
}
