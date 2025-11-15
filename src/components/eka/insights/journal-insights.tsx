"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/keep';
import { useCallback, useMemo } from 'react';
;
import { StatCard } from '@/components/eka/dashboard/stat-card';
import { Smile, TrendingUp } from 'lucide-react';
import { useFeatureData } from '@/hooks/use-feature-data';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { useEffect } from 'react';
import type { JournalEntry, StatCard as StatCardType } from '@/lib/types';

type JournalInsightsData = {
  entries: number;
  avgMood: number;
  bestDay: string;
  stats: StatCardType[];
};

const mockJournalData = async (): Promise<JournalInsightsData> => ({
  entries: 24,
  avgMood: 3.8,
  bestDay: '2025-10-19',
  stats: [
    { title: 'Entries', value: '24', change: '+4', changeType: 'increase', icon: TrendingUp },
    { title: 'Avg. Mood', value: '3.8 / 5', change: '+0.2', changeType: 'increase', icon: Smile },
    { title: 'Best Day', value: '2025-10-19', change: undefined, changeType: undefined, icon: Smile },
  ],
});

function buildJournalInsights(entries: JournalEntry[]): JournalInsightsData {
  if (!entries.length) {
    return {
      entries: 0,
      avgMood: 0,
      bestDay: '—',
      stats: [
        { title: 'Entries', value: '0', icon: TrendingUp },
        { title: 'Avg. Mood', value: '—', icon: Smile },
        { title: 'Best Day', value: '—', icon: Smile },
      ],
    };
  }

  const now = new Date();
  let totalMood = 0;
  let last7Mood = 0;
  let prev7Mood = 0;
  let last7Entries = 0;
  let prev7Entries = 0;

  let bestEntry: JournalEntry | null = null;
  let bestScore = -Infinity;

  for (const entry of entries) {
    const score = entry.mood ?? 0;
    totalMood += score;

    const entryDate = parseEntryDate(entry.date);
    if (entryDate) {
      const diffDays = (now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays <= 7) {
        last7Entries += 1;
        last7Mood += score;
      } else if (diffDays <= 14) {
        prev7Entries += 1;
        prev7Mood += score;
      }
    }

    if (!bestEntry || score > bestScore) {
      bestEntry = entry;
      bestScore = score;
    } else if (score === bestScore && entryDate) {
      const bestDate = parseEntryDate(bestEntry.date);
      if (bestDate && entryDate > bestDate) {
        bestEntry = entry;
      }
    }
  }

  const avgMood = totalMood / entries.length;
  const entriesChange = last7Entries - prev7Entries;
  const avgMoodLast7 = last7Entries ? last7Mood / last7Entries : 0;
  const avgMoodPrev7 = prev7Entries ? prev7Mood / prev7Entries : 0;
  const avgMoodChange = avgMoodLast7 - avgMoodPrev7;

  const bestEntryDate = parseEntryDate(bestEntry?.date);
  const bestDayLabel = formatDate(bestEntryDate) ?? '—';

  const stats: StatCardType[] = [
    {
      title: 'Entries',
      value: entries.length.toString(),
      change: formatSignedChange(entriesChange) ?? undefined,
      changeType: entriesChange > 0 ? 'increase' : entriesChange < 0 ? 'decrease' : undefined,
      icon: TrendingUp,
    },
    {
      title: 'Avg. Mood',
      value: `${avgMood.toFixed(1)} / 5`,
      change: formatSignedChange(avgMoodChange, 1) ?? undefined,
      changeType: avgMoodChange > 0 ? 'increase' : avgMoodChange < 0 ? 'decrease' : undefined,
      icon: Smile,
    },
    {
      title: 'Best Day',
      value: bestDayLabel,
      change: undefined,
      changeType: undefined,
      icon: Smile,
    },
  ];

  return {
    entries: entries.length,
    avgMood,
    bestDay: bestDayLabel,
    stats,
  };
}

export function JournalInsights({ source: initialSource }: { source?: 'mock' | 'firebase' }) {
  const { appUser: currentUser } = useAuth();
  const { dataService, initDataService, dataSource } = useAppStore();

  // Determine the source, defaulting to the store's data source
  const source = initialSource || dataSource;

  useEffect(() => {
    initDataService();
  }, [initDataService]);

  const waitingForUser = source === 'firebase' && !currentUser;

  const fetchJournalDataFirebase = useCallback(async () => {
    if (!currentUser || !dataService) {
      throw new Error('User context or data service unavailable');
    }
    const journalEntries = await dataService.getJournalEntries(currentUser.id);
    const entries = filterEntriesForUser(journalEntries, currentUser.id);
    return buildJournalInsights(entries);
  }, [currentUser, dataService]);

  const { data, loading, error } = useFeatureData(
    mockJournalData,
    fetchJournalDataFirebase,
    source,
    { enabled: source === 'firebase' ? Boolean(currentUser) : true }
  );

  const insights = useMemo(() => data, [data]);

  if (waitingForUser || loading || !insights) {
    return (
      <Card>
        <CardContent>Loading journal insights...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-sm text-red-600">
          Unable to load journal insights: {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal Insights</CardTitle>
        <CardDescription>Summary of your wellness journal activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.entries === 0 ? (
          <p className="text-sm text-muted-foreground">
            Start logging your daily reflections to unlock personalised insights.
          </p>
        ) : null}
        <div className="grid grid-cols-3 gap-4">
          {insights.stats.map((stat, i) => (
            <StatCard
              key={`${stat.title}-${i}`}
              {...stat}
              changeType={stat.changeType as 'increase' | 'decrease' | undefined}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function formatSignedChange(value: number, decimals = 0): string | null {
  if (!Number.isFinite(value) || Math.abs(value) < 1e-6) {
    return null;
  }
  const formatted = Math.abs(value).toFixed(decimals);
  return `${value > 0 ? '+' : '-'}${formatted}`;
}

function parseEntryDate(entryDate: string | Date | undefined): Date | null {
  if (!entryDate) {
    return null;
  }
  const date = typeof entryDate === 'string' ? new Date(entryDate) : entryDate;
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date: Date | null | undefined): string | undefined {
  if (!date) return undefined;
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function filterEntriesForUser(entries: JournalEntry[], userId: string): JournalEntry[] {
  return entries.filter(entry => {
    if (!entry) return false;
    if (!('userId' in entry) || typeof (entry as any).userId === 'undefined') {
      return true;
    }
    return (entry as any).userId === userId;
  });
}
