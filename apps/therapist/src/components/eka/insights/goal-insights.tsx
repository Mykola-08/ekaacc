"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCallback, useMemo } from 'react';
import { StatCard } from '@/components/eka/dashboard/stat-card';
import { Target, TrendingUp } from 'lucide-react';
import { useFeatureData } from '@/hooks/use-feature-data';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { useEffect } from 'react';
import type { Session, StatCard as StatCardType, User } from '@/lib/types';

type GoalInsightsData = {
  sessionsCompleted: number;
  targetSessions: number;
  goal: string;
  progress: number;
  stats: StatCardType[];
};

const mockGoalData = async (): Promise<GoalInsightsData> => ({
  sessionsCompleted: 7,
  targetSessions: 10,
  goal: 'Complete initial therapy plan',
  progress: 70,
  stats: [
    { title: 'Sessions Completed', value: '7', change: '+2', changeType: 'increase', icon: TrendingUp },
    { title: 'Goal Progress', value: '70%', change: '+10%', changeType: 'increase', icon: Target },
  ],
});

const FALLBACK_GOAL = 'Complete initial therapy plan';

function formatSignedChange(
  value: number,
  { isPercent = false, decimals }: { isPercent?: boolean; decimals?: number } = {}
): string | null {
  if (!Number.isFinite(value) || Math.abs(value) < 1e-6) {
    return null;
  }

  const precision = decimals ?? (isPercent ? 1 : 0);
  const abs = Math.abs(value);
  const formatted = abs.toFixed(precision);
  const suffix = isPercent ? '%' : '';
  return `${value > 0 ? '+' : '-'}${formatted}${suffix}`;
}

function parseSessionDate(sessionDate: string | Date | undefined): Date | null {
  if (!sessionDate) return null;
  const date = typeof sessionDate === 'string' ? new Date(sessionDate) : sessionDate;
  return Number.isNaN(date.getTime()) ? null : date;
}

function getSessionsForUser(sessions: Session[], userId: string): Session[] {
  return sessions.filter((session) => {
    if (!session) return false;
    if (!session.userId) return true;
    return session.userId === userId;
  });
}

function buildGoalInsights(user: User, sessions: Session[]): GoalInsightsData {
  const targetSessions = Math.max(user.goal?.targetSessions ?? 10, 1);
  const goalDescription =
    user.goal?.description || user.personalization?.goals || FALLBACK_GOAL;

  const relevantSessions = getSessionsForUser(sessions, user.id);
  const completedSessions = relevantSessions.filter(session => session.status === 'Completed');
  const sessionsCompleted = completedSessions.length;

  const progress = Math.min(100, Math.round((sessionsCompleted / targetSessions) * 100));

  const now = new Date();
  let last30 = 0;
  let previous30 = 0;

  for (const session of completedSessions) {
    const date = parseSessionDate(session.date);
    if (!date) continue;
    const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays <= 30) {
      last30 += 1;
    } else if (diffDays <= 60) {
      previous30 += 1;
    }
  }

  const sessionChange = last30 - previous30;
  const progressChange = (sessionChange / targetSessions) * 100;

  const sessionChangeLabel = formatSignedChange(sessionChange, { decimals: 0 });
  const progressChangeLabel = formatSignedChange(progressChange, { isPercent: true });

  const stats: StatCardType[] = [
    {
      title: 'Sessions Completed',
      value: sessionsCompleted.toString(),
      change: sessionChangeLabel ?? undefined,
      changeType: sessionChangeLabel
        ? sessionChange >= 0
          ? 'increase'
          : 'decrease'
        : undefined,
      icon: TrendingUp,
      trend: sessionChangeLabel || '0',
      index: 0
    },
    {
      title: 'Goal Progress',
      value: `${progress}%`,
      change: progressChangeLabel ?? undefined,
      changeType: progressChangeLabel
        ? progressChange >= 0
          ? 'increase'
          : 'decrease'
        : undefined,
      icon: Target,
      trend: progressChangeLabel || '0%',
      index: 1
    },
  ];

  return {
    sessionsCompleted,
    targetSessions,
    goal: goalDescription,
    progress,
    stats,
  };
}

export function GoalInsights({ source: initialSource }: { source?: 'mock' | 'firebase' | 'supabase' }) {
  const { user: currentUser } = useAuth();
  const { dataService, initDataService, dataSource } = useAppStore();

  // Determine the source, defaulting to the store's data source
  const source = initialSource || dataSource;

  useEffect(() => {
    initDataService();
  }, [initDataService]);

  const waitingForUser = source === 'firebase' && !currentUser;

  const fetchGoalDataFirebase = useCallback(async () => {
    if (!currentUser || !dataService) {
      throw new Error('User context or data service unavailable');
    }
    const sessions = await dataService.getSessions(currentUser.id);
    return buildGoalInsights(currentUser as unknown as User, sessions);
  }, [currentUser, dataService]);

  const fetchGoalDataSupabase = useCallback(async () => {
    if (!currentUser || !dataService) {
      throw new Error('User context or data service unavailable');
    }
    const sessions = await dataService.getSessions(currentUser.id);
    return buildGoalInsights(currentUser as unknown as User, sessions);
  }, [currentUser, dataService]);

  const { data, loading, error } = useFeatureData(
    mockGoalData,
    source === 'supabase' ? fetchGoalDataSupabase : fetchGoalDataFirebase,
    source,
    { enabled: (source === 'firebase' || source === 'supabase') ? Boolean(currentUser) : true }
  );

  const insights = useMemo(() => data, [data]);

  if (waitingForUser || loading || !insights) {
    return (
      <Card>
        <CardContent>Loading goal insights...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-sm text-red-600">
          Unable to load goal insights: {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Insights</CardTitle>
        <CardDescription>Your progress towards your main therapy goal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {insights.goal}
          </p>
          <p className="text-xs text-muted-foreground">
            Target: {insights.targetSessions} sessions • Completed: {insights.sessionsCompleted}
          </p>
        </div>
        {/* Progress component removed - Keep React doesn't have Progress */}
        <div className="grid grid-cols-2 gap-4">
          {insights.stats.map((stat, i) => (
            <StatCard
              key={`${stat.title}-${i}`}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.change || '0'}
              index={i}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
