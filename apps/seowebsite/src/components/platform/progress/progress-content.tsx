'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import type { Report } from '@/lib/platform/types/types';
import { Card } from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { Badge } from '@/components/platform/ui/badge';
import { TrendingUp, TrendingDown, HeartPulse, Award, Activity, Target } from 'lucide-react';
import { PageContainer } from '@/components/platform/eka/page-container';
import { PageHeader } from '@/components/platform/eka/page-header';

function MinimalStatCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend 
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend?: 'improving' | 'declining' | 'neutral';
}) {
  const trendInfo = {
    improving: { icon: <TrendingUp className="h-4 w-4 text-green-600" />, color: 'text-green-600' },
    declining: { icon: <TrendingDown className="h-4 w-4 text-red-600" />, color: 'text-red-600' },
    neutral: { icon: null, color: '' },
  }[trend || 'neutral'];

  return (
    <Card className="p-6 animate-slide-up bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon}
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
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
    <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Progress Over Time</h3>
      <div className="space-y-4">
        {data.map((point, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">{format(new Date(point.date), 'MMM d, yyyy')}</p>
              <p className="text-sm text-muted-foreground">{point.notes || 'Session completed'}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">{point.score || point.mood || 8}/10</p>
              <div className="flex items-center gap-1">
                {point.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                {point.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                {point.trend === 'stable' && <div className="w-4 h-4 bg-gray-400 rounded-full"></div>}
                <span className="text-sm text-muted-foreground">{point.trend || 'stable'}</span>
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
    return reports.map(report => ({
      date: report.createdAt || new Date(),
      mood: report.mood || 8,
      score: report.overallScore || 0,
      notes: report.notes || '',
      trend: report.trend || 'stable'
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [reports]);

  const stats = useMemo(() => {
    const totalSessions = reports.length;
    const avgMood = totalSessions > 0 
      ? reports.reduce((sum, report) => sum + (report.mood || 8), 0) / totalSessions 
      : 0;
    const completedGoals = reports.filter(report => report.goalProgress === 100).length;
    const recentReports = reports.slice(-5);
    const recentTrend: 'improving' | 'declining' | 'neutral' = recentReports.length > 1 
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
      recentTrend
    };
  }, [reports]);

  return (
    <PageContainer>
      <PageHeader
        icon={Activity}
        title="Progress Overview"
        description="Track your wellness journey over time"
        badge={stats.totalSessions > 0 ? (
          <Badge variant="secondary">{stats.totalSessions} session{stats.totalSessions > 1 ? 's' : ''}</Badge>
        ) as React.ReactNode : undefined}
      />

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MinimalStatCard
            title="Total Sessions"
            value={stats.totalSessions.toString()}
            icon={<Activity className="h-5 w-5 text-muted-foreground" />}
            description="Completed therapy sessions"
          />
          <MinimalStatCard
            title="Average Mood"
            value={`${stats.avgMood}/10`}
            icon={<HeartPulse className="h-5 w-5 text-muted-foreground" />}
            description="Overall mood rating"
            trend={stats.recentTrend}
          />
          <MinimalStatCard
            title="Goals Completed"
            value={stats.completedGoals.toString()}
            icon={<Award className="h-5 w-5 text-muted-foreground" />}
            description="Therapy goals achieved"
          />
          <MinimalStatCard
            title="Progress Trend"
            value={stats.recentTrend === 'improving' ? 'Improving' : stats.recentTrend === 'declining' ? 'Declining' : 'Stable'}
            icon={<Target className="h-5 w-5 text-muted-foreground" />}
            description="Recent session trend"
          />
        </div>

        {/* Progress Chart */}
        {progressData.length > 0 && <MinimalProgressChart data={progressData} />}

        {/* Empty State */}
        {progressData.length === 0 && (
          <Card className="p-12 text-center animate-slide-up bg-white/50 backdrop-blur-sm border-dashed">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Progress Data Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start your wellness journey by completing sessions. Your progress will appear here as you continue.
              </p>
              <Button 
                variant="default" 
                size="default"
                onClick={() => window.location.href = '/sessions/booking'}
              >
                Book Your First Session
              </Button>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center py-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button 
            variant="outline" 
            size="default"
            className="hover:bg-white/60"
            onClick={() => window.location.href = '/progress-reports'}
          >
            View Detailed Reports
          </Button>
          <Button 
            variant="outline" 
            size="default"
             className="hover:bg-white/60"
            onClick={() => window.location.href = '/goals'}
          >
            Manage Goals
          </Button>
        </div>
    </PageContainer>
  );
}
