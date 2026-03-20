'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SparklesIcon,
  Alert02Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';
import { useToast } from '@/hooks/platform/ui/use-toast';

interface Insight {
  id: string;
  content: string;
  insight_type: string;
  severity: string;
  is_read: boolean;
}

interface InsightsResponse {
  insights: Insight[];
}

function InsightIcon({ severity }: { severity: string }) {
  if (severity === 'critical') {
    return (
      <HugeiconsIcon icon={Cancel01Icon} className="size-4 shrink-0 text-destructive" />
    );
  }
  if (severity === 'warning') {
    return (
      <HugeiconsIcon icon={Alert02Icon} className="size-4 shrink-0 text-warning" />
    );
  }
  // positive / info / default
  return (
    <HugeiconsIcon icon={SparklesIcon} className="size-4 shrink-0 text-primary" />
  );
}

export function AIInsightCards() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/insights');
      if (!res.ok) throw new Error('Failed to fetch insights');
      const data: InsightsResponse = await res.json();
      setInsights(data.insights ?? []);
    } catch {
      toast({ title: 'Could not load insights', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const handleDismiss = async (id: string) => {
    // Optimistically remove from UI
    setInsights((prev) => prev.filter((insight) => insight.id !== id));
    try {
      const res = await fetch(`/api/ai/insights/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to dismiss insight');
    } catch {
      toast({ title: 'Could not dismiss insight', variant: 'destructive' });
      // Re-fetch to restore the item
      fetchInsights();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={SparklesIcon} className="size-4 text-primary" />
          Personalized Insights
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2">
          {/* Loading state */}
          {loading && (
            <>
              <div className="h-16 animate-pulse rounded-[var(--radius)] bg-muted" />
              <div className="h-16 animate-pulse rounded-[var(--radius)] bg-muted" />
              <div className="h-16 animate-pulse rounded-[var(--radius)] bg-muted" />
            </>
          )}

          {/* Empty state */}
          {!loading && insights.length === 0 && (
            <p className="text-sm text-muted-foreground py-2">
              No insights yet — they'll appear as you use the app
            </p>
          )}

          {/* Insight cards */}
          {!loading &&
            insights.slice(0, 3).map((insight) => (
              <div
                key={insight.id}
                className="rounded-[var(--radius)] border border-border p-3 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <InsightIcon severity={insight.severity} />
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <Badge variant="secondary" className="self-start capitalize">
                        {insight.insight_type.replace(/_/g, ' ')}
                      </Badge>
                      <p className="text-sm line-clamp-3 text-foreground">{insight.content}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 shrink-0 px-2 text-xs text-muted-foreground"
                    onClick={() => handleDismiss(insight.id)}
                    aria-label="Dismiss insight"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
