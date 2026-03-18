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

interface SummaryResponse {
  summary: string | null;
  recommendations: string[];
  moodTrend: string | null;
  cached: boolean;
}

export function AIDailySummary() {
  const [summary, setSummary] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[] | null>(null);
  const [moodTrend, setMoodTrend] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [generating, setGenerating] = useState(false);
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

  const handleRefresh = () => {
    fetchSummary();
  };

  return (
    <Card aria-label="AI Daily Briefing">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={SparklesIcon} className="size-4 text-primary" />
          AI Daily Briefing
        </CardTitle>
        {!loading && !error && summary !== null && (
          <CardAction>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleRefresh}
              aria-label="Refresh summary"
            >
              <HugeiconsIcon icon={Refresh01Icon} className="size-4" />
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading summary">
            <div className="h-3.5 w-full animate-pulse rounded-full bg-muted" />
            <div className="h-3.5 w-4/5 animate-pulse rounded-full bg-muted" />
            <div className="h-3.5 w-3/5 animate-pulse rounded-full bg-muted" />
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <HugeiconsIcon icon={InformationCircleIcon} className="size-4 shrink-0" />
              Could not load summary
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              Try again
            </Button>
          </div>
        )}

        {/* Empty state — no summary yet */}
        {!loading && !error && summary === null && (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-muted-foreground">
              No briefing generated yet. Generate your first insight to get started.
            </p>
            <Button size="sm" onClick={handleGenerate} disabled={generating}>
              {generating ? 'Generating…' : 'Generate your first insight'}
            </Button>
          </div>
        )}

        {/* Main content */}
        {!loading && !error && summary !== null && (
          <>
            <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>

            {recommendations && recommendations.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {recommendations.slice(0, 3).map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <HugeiconsIcon
                      icon={CheckmarkCircle01Icon}
                      className="mt-0.5 size-3.5 shrink-0 text-primary"
                    />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            )}

            {moodTrend && (
              <div>
                <Badge variant="secondary">Trend: {moodTrend}</Badge>
              </div>
            )}

            {lastUpdated && (
              <p className="text-xs text-muted-foreground border-t border-border/50 pt-2 mt-1">
                Last updated{' '}
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
