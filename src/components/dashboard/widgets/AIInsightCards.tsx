'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SparklesIcon,
  Alert02Icon,
  Cancel01Icon,
  Refresh01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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

function severityStyles(severity: string) {
  if (severity === 'critical') {
    return {
      border: 'border-destructive/20 bg-destructive/5',
      icon: <HugeiconsIcon icon={Cancel01Icon} className="size-4 shrink-0 text-destructive" />,
      badge: 'bg-destructive/10 text-destructive border-destructive/20',
    };
  }
  if (severity === 'warning') {
    return {
      border: 'border-warning/20 bg-warning/5',
      icon: <HugeiconsIcon icon={Alert02Icon} className="size-4 shrink-0 text-warning" />,
      badge: 'bg-warning/10 text-warning border-warning/20',
    };
  }
  return {
    border: 'border-primary/15 bg-primary/5',
    icon: <HugeiconsIcon icon={SparklesIcon} className="size-4 shrink-0 text-primary" />,
    badge: 'bg-primary/10 text-primary border-primary/20',
  };
}

export function AIInsightCards() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dismissing, setDismissing] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchInsights = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch('/api/ai/insights');
      if (!res.ok) throw new Error('Failed to fetch insights');
      const data: InsightsResponse = await res.json();
      setInsights(data.insights ?? []);
    } catch {
      toast({ title: 'Could not load insights', variant: 'destructive' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const handleDismiss = async (id: string) => {
    setDismissing((prev) => new Set(prev).add(id));
    // Let the fade-out animate, then remove
    setTimeout(() => {
      setInsights((prev) => prev.filter((i) => i.id !== id));
      setDismissing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 200);
    try {
      const res = await fetch(`/api/ai/insights/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to dismiss insight');
    } catch {
      toast({ title: 'Could not dismiss insight', variant: 'destructive' });
      fetchInsights(true);
    }
  };

  const visibleInsights = insights.slice(0, 3);
  const hasMore = insights.length > 3;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <HugeiconsIcon icon={SparklesIcon} className="size-4 text-primary" />
          Personalized Insights
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => fetchInsights(true)}
            disabled={refreshing}
            aria-label="Refresh insights"
            title="Refresh"
          >
            <HugeiconsIcon
              icon={Refresh01Icon}
              className={cn('size-3.5', refreshing && 'animate-spin')}
            />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2">
          {/* Loading state */}
          {loading && (
            <>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-[var(--radius)] bg-muted"
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </>
          )}

          {/* Empty state */}
          {!loading && insights.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <div className="flex size-10 items-center justify-center rounded-[var(--radius)] bg-muted/60">
                <HugeiconsIcon icon={SparklesIcon} className="size-5 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">
                No insights yet — they'll appear as you use the app
              </p>
            </div>
          )}

          {/* Insight cards */}
          {!loading &&
            visibleInsights.map((insight, i) => {
              const styles = severityStyles(insight.severity);
              const isDismissing = dismissing.has(insight.id);
              return (
                <div
                  key={insight.id}
                  className={cn(
                    'rounded-[var(--radius)] border p-3 transition-all duration-200 animate-in fade-in',
                    styles.border,
                    isDismissing && 'opacity-0 scale-95 pointer-events-none'
                  )}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-1 items-start gap-2">
                      {styles.icon}
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <Badge
                          variant="outline"
                          className={cn('self-start text-[10px] capitalize', styles.badge)}
                        >
                          {insight.insight_type.replace(/_/g, ' ')}
                        </Badge>
                        <p className="text-sm leading-snug text-foreground/90 line-clamp-3">
                          {insight.content}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 shrink-0 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                      onClick={() => handleDismiss(insight.id)}
                      aria-label="Dismiss insight"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              );
            })}

          {/* View all link */}
          {!loading && (hasMore || insights.length > 0) && (
            <Link href="/ai-insights">
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 h-7 w-full gap-1 text-xs text-muted-foreground hover:text-primary"
              >
                View all insights
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
