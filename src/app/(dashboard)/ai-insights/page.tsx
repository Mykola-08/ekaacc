'use client';

import { InsightsPanel } from '@/components/ai/widgets/insights-panel';

export default function AIInsightsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight">AI Insights</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Personalized wellness insights powered by AI analysis of your data.
        </p>
      </div>
      <InsightsPanel className="border-none p-0 shadow-none" />
    </div>
  );
}
