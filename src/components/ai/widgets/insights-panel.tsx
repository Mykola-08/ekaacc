'use client';

/**
 * AI Insights Panel Widget
 *
 * Fetches and displays active AI-generated wellness insights
 * for the authenticated user. Used on dashboards and the AI page.
 */

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/morphing-toaster';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { AnalyticsUpIcon, ArrowRight01Icon, Brain01Icon, BulbIcon, FavouriteIcon, Idea01Icon, Refresh01Icon, SparklesIcon, Target01Icon, ZapIcon } from '@hugeicons/core-free-icons';

interface Insight {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: number;
  actionItems: string[];
  createdAt: string;
}

const typeConfig: Record<string, { icon: IconSvgElement; color: string; bg: string }> = {
  wellness: { icon: FavouriteIcon, color: 'text-destructive', bg: 'bg-destructive/10' },
  therapy: { icon: Brain01Icon, color: 'text-chart-4', bg: 'bg-chart-4/100/10' },
  behavioral: { icon: Target01Icon, color: 'text-warning', bg: 'bg-warning/10' },
  progress: { icon: AnalyticsUpIcon, color: 'text-success', bg: 'bg-success/10' },
  recommendation: { icon: BulbIcon, color: 'text-primary', bg: 'bg-primary/10' },
  mood: { icon: ZapIcon, color: 'text-warning', bg: 'bg-warning/10' },
  engagement: { icon: AnalyticsUpIcon, color: 'text-info', bg: 'bg-info/10' },
};

export function InsightsPanel({ className }: { className?: string }) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchInsights = useCallback(async () => {
    try {
      const res = await fetch('/api/ai/insights');
      if (res.ok) {
        const data = await res.json();
        setInsights(data.insights || []);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/insights', { method: 'POST' });
      if (res.ok) {
        await fetchInsights();
        toast.success('New insights generated');
      } else {
        toast.error('Failed to generate insights');
      }
    } catch {
      toast.error('Failed to generate insights');
    } finally {
      setGenerating(false);
    }
  }, [fetchInsights]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return (
    <div
      className={cn('bg-card rounded-[calc(var(--radius)*0.8)] border p-5', className)}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-[calc(var(--radius)*0.8)]">
            <HugeiconsIcon icon={SparklesIcon} className="text-primary size-4"  />
          </div>
          <div>
            <h3 className="text-sm font-semibold">AI Insights</h3>
            <p className="text-muted-foreground text-xs">Personalized wellness analysis</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGenerate}
          disabled={generating}
          className="h-8 gap-1.5 text-xs"
        >
          <HugeiconsIcon icon={Refresh01Icon} className={cn('h-3.5 w-3.5', generating && 'animate-spin')}  />
          {generating ? 'Generating...' : 'Refresh'}
        </Button>
      </div>

      {loading ? (
        <div className="">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted/50 h-20 animate-pulse rounded-[var(--radius)]" />
          ))}
        </div>
      ) : insights.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <HugeiconsIcon icon={Brain01Icon} className="text-muted-foreground size-8"  />
          <div>
            <p className="text-muted-foreground text-sm">No insights yet</p>
            <p className="text-muted-foreground text-xs">
              Chat with EKA or log your mood to generate insights
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating}>
            Generate Insights
          </Button>
        </div>
      ) : (
        <div className=".5">
          
            {insights.slice(0, 5).map((insight, i) => {
              const cfg = typeConfig[insight.type] || typeConfig.wellness;
              const Icon = cfg.icon;

              return (
                <div
                  key={insight.id}
                  className="bg-muted/40 rounded-[var(--radius)] p-3"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <div
                      className={cn('flex h-6 w-6 items-center justify-center rounded-[calc(var(--radius)*0.6)]', cfg.bg)}
                    >
                      <HugeiconsIcon icon={Icon} className={cn('h-3.5 w-3.5', cfg.color)} />
                    </div>
                    <p className="flex-1 text-sm font-medium">{insight.title}</p>
                    <span className="text-muted-foreground text-2xs">
                      {Math.round(insight.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-muted-foreground pl-8 text-xs leading-relaxed">
                    {insight.description}
                  </p>
                  {insight.actionItems.length > 0 && (
                    <ul className=".5 mt-2 pl-8">
                      {insight.actionItems.slice(0, 3).map((item, j) => (
                        <li key={j} className="flex items-start gap-1.5 text-xs">
                          <HugeiconsIcon icon={ArrowRight01Icon} className="text-primary mt-0.5 size-3 shrink-0"  />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          
        </div>
      )}
    </div>
  );
}
