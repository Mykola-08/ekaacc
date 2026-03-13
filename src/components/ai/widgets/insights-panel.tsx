'use client';

/**
 * AI Insights Panel Widget
 *
 * Fetches and displays active AI-generated wellness insights
 * for the authenticated user. Used on dashboards and the AI page.
 */

import { useEffect, useState, useCallback } from 'react';
import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';
import {
  Brain,
  ChevronRight,
  Heart,
  Lightbulb,
  Target,
  TrendingUp,
  Zap,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/morphing-toaster';

interface Insight {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: number;
  actionItems: string[];
  createdAt: string;
}

const typeConfig: Record<string, { icon: typeof Brain; color: string; bg: string }> = {
  wellness: { icon: Heart, color: 'text-destructive', bg: 'bg-destructive/10' },
  therapy: { icon: Brain, color: 'text-chart-4', bg: 'bg-chart-4/100/10' },
  behavioral: { icon: Target, color: 'text-warning', bg: 'bg-warning/10' },
  progress: { icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
  recommendation: { icon: Lightbulb, color: 'text-primary', bg: 'bg-primary/10' },
  mood: { icon: Zap, color: 'text-warning', bg: 'bg-warning/10' },
  engagement: { icon: TrendingUp, color: 'text-info', bg: 'bg-info/10' },
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn('bg-card rounded-lg border p-5', className)}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <Sparkles className="text-primary h-4 w-4" />
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
          <RefreshCw className={cn('h-3.5 w-3.5', generating && 'animate-spin')} />
          {generating ? 'Generating...' : 'Refresh'}
        </Button>
      </div>

      {loading ? (
        <div className="">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted/50 h-20 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : insights.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <Brain className="text-muted-foreground h-8 w-8" />
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
          <AnimatePresence mode="popLayout">
            {insights.slice(0, 5).map((insight, i) => {
              const cfg = typeConfig[insight.type] || typeConfig.wellness;
              const Icon = cfg.icon;

              return (
                <motion.div
                  key={insight.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-muted/40 rounded-xl p-3"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <div
                      className={cn('flex h-6 w-6 items-center justify-center rounded-md', cfg.bg)}
                    >
                      <Icon className={cn('h-3.5 w-3.5', cfg.color)} />
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
                          <ChevronRight className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
