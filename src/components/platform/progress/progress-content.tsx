'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import type { Report } from '@/lib/platform/types/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, HeartPulse, Award, Activity, Target } from 'lucide-react';
import { PageContainer } from '@/components/platform/eka/page-container';
import { PageHeader } from '@/components/platform/eka/page-header';

function MinimalStatCard({
  title,
  value,
  icon,
  description,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend?: 'improving' | 'declining' | 'neutral';
}) {
  const trendInfo = {
    improving: { icon: <TrendingUp className="h-4 w-4 text-success" />, color: 'text-success' },
    declining: { icon: <TrendingDown className="h-4 w-4 text-destructive" />, color: 'text-destructive' },
    neutral: { icon: null, color: '' },
  }[trend || 'neutral'];

  return (
    <Card className="animate-slide-up bg-card/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="space-y-2">
        <p className="text-foreground text-2xl font-semibold">{value}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
        {trend && trend !== 'neutral' && (
          <div className={`flex items-center text-sm ${trendInfo.color}`}>
            {trendInfo.icon}
            <span className="ml-1">{trend === 'improving' ? 'Improving' : 'Declining'}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

function MinimalProgressChart({ data }: { data: any[] }) {
  return (
    <Card className="animate-slide-up p-6" style={{ animationDelay: '0.1s' }}>
      <h3 className="text-foreground mb-4 text-lg font-semibold">Progress Over Time</h3>
      <div className="space-y-4">
        {data.map((point, index) => (
          <div key={index} className="bg-muted/30 flex items-center justify-between rounded-lg p-3">
            <div>
              <p className="text-foreground font-medium">
                {format(new Date(point.date), 'MMM d, yyyy')}
              </p>
              <p className="text-muted-foreground text-sm">{point.notes || 'Session completed'}</p>
            </div>
            <div className="text-right">
              <p className="text-foreground font-semibold">{point.score || point.mood || 8}/10</p>
              <div className="flex items-center gap-1">
                {point.trend === 'up' && <TrendingUp className="h-4 w-4 text-success" />}
                {point.trend === 'down' && <TrendingDown className="h-4 w-4 text-destructive" />}
                {point.trend === 'stable' && (
                  <div className="h-4 w-4 rounded-full bg-muted-foreground"></div>
                )}
                <span className="text-muted-foreground text-sm">{point.trend || 'stable'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

interface ProgressContentProps {
  reports: Report[];
}

export function ProgressContent({ reports }: ProgressContentProps) {
  const progressData = useMemo(() => {
    return reports
      .map((report) => ({
        date: report.createdAt || new Date(),
        mood: report.mood || 8,
        score: report.overallScore || 0,
        notes: report.notes || '',
        trend: report.trend || 'stable',
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [reports]);

  const stats = useMemo(() => {
    const totalSessions = reports.length;
    const avgMood =
      totalSessions > 0
        ? reports.reduce((sum, report) => sum + (report.mood || 8), 0) / totalSessions
        : 0;
    const completedGoals = reports.filter((report) => report.goalProgress === 100).length;
    const recentReports = reports.slice(-5);
    const recentTrend: 'improving' | 'declining' | 'neutral' =
      recentReports.length > 1
        ? (recentReports[recentReports.length - 1].mood || 0) > (recentReports[0].mood || 0)
          ? 'improving'
          : (recentReports[recentReports.length - 1].mood || 0) < (recentReports[0].mood || 0)
            ? 'declining'
            : 'neutral'
        : 'neutral';

    return {
      totalSessions,
      avgMood: avgMood.toFixed(1),
      completedGoals,
      recentTrend,
    };
  }, [reports]);

  return (
    <PageContainer>
      <PageHeader
        icon={Activity}
        title="Progress Overview"
        description="Track your wellness journey over time"
        badge={
          stats.totalSessions > 0
            ? ((
                <Badge variant="secondary">
                  {stats.totalSessions} session{stats.totalSessions > 1 ? 's' : ''}
                </Badge>
              ) as React.ReactNode)
            : undefined
        }
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MinimalStatCard
          title="Total Sessions"
          value={stats.totalSessions.toString()}
          icon={<Activity className="text-muted-foreground h-5 w-5" />}
          description="Completed therapy sessions"
        />
        <MinimalStatCard
          title="Average Mood"
          value={`${stats.avgMood}/10`}
          icon={<HeartPulse className="text-muted-foreground h-5 w-5" />}
          description="Overall mood rating"
          trend={stats.recentTrend}
        />
        <MinimalStatCard
          title="Goals Completed"
          value={stats.completedGoals.toString()}
          icon={<Award className="text-muted-foreground h-5 w-5" />}
          description="Therapy goals achieved"
        />
        <MinimalStatCard
          title="Progress Trend"
          value={
            stats.recentTrend === 'improving'
              ? 'Improving'
              : stats.recentTrend === 'declining'
                ? 'Declining'
                : 'Stable'
          }
          icon={<Target className="text-muted-foreground h-5 w-5" />}
          description="Recent session trend"
        />
      </div>

      {/* Progress Chart */}
      {progressData.length > 0 && <MinimalProgressChart data={progressData} />}

      {/* Empty State */}
      {progressData.length === 0 && (
        <Card className="animate-slide-up bg-card/50 border-dashed p-12 text-center backdrop-blur-sm">
          <div className="mx-auto max-w-md">
            <div className="bg-muted/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Target className="text-muted-foreground/80 h-8 w-8" />
            </div>
            <h3 className="text-foreground mb-2 text-xl font-semibold">No Progress Data Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start your wellness journey by completing sessions. Your progress will appear here as
              you continue.
            </p>
            <Button
              variant="default"
              size="default"
              onClick={() => (window.location.href = '/sessions/booking')}
            >
              Book Your First Session
            </Button>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div
        className="animate-slide-up flex flex-wrap justify-center gap-4 py-6"
        style={{ animationDelay: '0.2s' }}
      >
        <Button
          variant="outline"
          size="default"
          className="hover:bg-card/60"
          onClick={() => (window.location.href = '/wellness?tab=progress')}
        >
          View Detailed Reports
        </Button>
        <Button
          variant="outline"
          size="default"
          className="hover:bg-card/60"
          onClick={() => (window.location.href = '/goals')}
        >
          Manage Goals
        </Button>
      </div>
    </PageContainer>
  );
}
