'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SparklesIcon,
  CheckmarkCircle01Icon,
  Refresh01Icon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { cn } from '@/lib/utils';

interface SummaryResponse {
  summary: string | null;
  recommendations: string[];
  moodTrend: string | null;
  cached: boolean;
}

function TrendBadge({ trend }: { trend: string }) {
  const lower = trend.toLowerCase();
  const isUp = lower.includes('improv') || lower.includes('up') || lower.includes('better');
  const isDown = lower.includes('declin') || lower.includes('down') || lower.includes('worse');
  return (
    <Badge
      variant="outline"
      className={cn(
        'text-xs capitalize',
        isUp && 'bg-success/10 border-success/20 text-success',
        isDown && 'bg-destructive/10 border-destructive/20 text-destructive',
        !isUp && !isDown && 'bg-muted text-muted-foreground'
      )}
    >
      {isUp ? '↑' : isDown ? '↓' : '→'} {trend}
    </Badge>
  );
}

export function AIDailySummary() {
  const [summary, setSummary] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[] | null>(null);
  const [moodTrend, setMoodTrend] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showAllRecs, setShowAllRecs] = useState(false);
  const { toast } = useToast();

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/ai/summary');
      if (!res.ok) throw new Error('Failed to fetch summary');
      const data: SummaryResponse = await res.json();
      setSummary(data.summary);
      setRecommendations(data.recommendations ?? []);
      setMoodTrend(data.moodTrend);
      setCached(data.cached ?? false);
      setLastUpdated(new Date());
    } catch {
      setError(true);
      toast({ title: 'Could not load AI summary', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/summary', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to generate summary');
      await fetchSummary();
      toast({ title: 'AI Briefing generated!' });
    } catch {
      toast({ title: 'Could not generate summary', variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const visibleRecs = recommendations
    ? showAllRecs
      ? recommendations
      : recommendations.slice(0, 3)
    : [];

  return (
    <Card aria-label="AI Daily Briefing">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <HugeiconsIcon icon={SparklesIcon} className="size-4 text-primary" />
          AI Daily Briefing
          {!loading && summary !== null && (
            <Badge
              variant="outline"
              className={cn(
                'ml-1 text-[10px] py-0 h-4',
                cached
                  ? 'text-muted-foreground border-border/60'
                  : 'text-primary border-primary/30 bg-primary/5'
              )}
            >
              {cached ? 'Cached' : 'Fresh'}
            </Badge>
          )}
        </CardTitle>
        <CardAction className="flex items-center gap-1">
          {!loading && !error && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleGenerate}
              disabled={generating}
              aria-label="Regenerate summary"
              title="Regenerate"
            >
              <HugeiconsIcon
                icon={Refresh01Icon}
                className={cn('size-3.5', generating && 'animate-spin')}
              />
            </Button>
          )}
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col gap-2.5" aria-busy="true" aria-label="Loading summary">
            <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
            <div className="h-3 w-11/12 animate-pulse rounded-full bg-muted" />
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-muted" />
            <div className="mt-1 h-3 w-3/5 animate-pulse rounded-full bg-muted" />
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-start gap-3 py-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <HugeiconsIcon icon={InformationCircleIcon} className="size-4 shrink-0" />
              Could not load your AI briefing
            </div>
            <Button variant="outline" size="sm" onClick={fetchSummary}>
              Try again
            </Button>
          </div>
        )}

        {/* Empty state — no summary yet */}
        {!loading && !error && summary === null && (
          <div className="flex flex-col items-start gap-3 py-1">
            <p className="text-sm text-muted-foreground leading-relaxed">
              No briefing yet. Generate your first AI insight to get personalised
              wellness recommendations based on your activity.
            </p>
            <Button size="sm" onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <>
                  <HugeiconsIcon icon={SparklesIcon} className="mr-1.5 size-3.5 animate-pulse" />
                  Generating…
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={SparklesIcon} className="mr-1.5 size-3.5" />
                  Generate first insight
                </>
              )}
            </Button>
          </div>
        )}

        {/* Main content */}
        {!loading && !error && summary !== null && (
          <>
            <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>

            {visibleRecs.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                  Recommendations
                </p>
                <ol className="flex flex-col gap-2">
                  {visibleRecs.map((rec, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm animate-in fade-in duration-200"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3" />
                      </div>
                      <span className="text-foreground/90 leading-snug">{rec}</span>
                    </li>
                  ))}
                </ol>
                {recommendations && recommendations.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-7 px-1 text-xs text-muted-foreground"
                    onClick={() => setShowAllRecs((v) => !v)}
                  >
                    {showAllRecs
                      ? 'Show less'
                      : `+${recommendations.length - 3} more`}
                  </Button>
                )}
              </div>
            )}

            {moodTrend && <TrendBadge trend={moodTrend} />}

            {lastUpdated && (
              <p className="border-t border-border/40 pt-2 text-xs text-muted-foreground/60">
                Updated{' '}
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
