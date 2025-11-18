'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { format } from 'date-fns';
import type { Report } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, HeartPulse, Award, Activity, Target } from 'lucide-react';

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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon}
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{description}</p>
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

function ProgressPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="space-y-8">
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </Card>
      </div>
    </div>
  );
}

function MinimalProgressChart({ data }: { data: any[] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Over Time</h3>
      <div className="space-y-4">
        {data.map((point, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{format(new Date(point.date), 'MMM d, yyyy')}</p>
              <p className="text-sm text-gray-600">{point.notes || 'Session completed'}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{point.score || point.mood || 8}/10</p>
              <div className="flex items-center gap-1">
                {point.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                {point.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                {point.trend === 'stable' && <div className="w-4 h-4 bg-gray-400 rounded-full"></div>}
                <span className="text-sm text-gray-600">{point.trend || 'stable'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function MinimalProgressPage() {
  const { user, loading: authLoading } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    if (dataService && user?.uid) {
      setIsLoading(true);
      try {
        const userReports = await dataService.getReports(user.uid);
        setReports(userReports || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [dataService, user?.uid]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const progressData = useMemo(() => {
    return reports.map(report => ({
      date: report.createdAt,
      mood: report.mood || 8,
      score: report.overallScore,
      notes: report.notes,
      trend: report.trend || 'stable'
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [reports]);

  const stats = useMemo(() => {
    const totalSessions = reports.length;
    const avgMood = totalSessions > 0 
      ? reports.reduce((sum, report) => sum + (report.mood || 8), 0) / totalSessions 
      : 0;
    const completedGoals = reports.filter(report => report.goalProgress === 'completed').length;
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

  if (authLoading || isLoading) {
    return <ProgressPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Overview</h1>
          <p className="text-gray-600">Track your wellness journey over time</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MinimalStatCard
            title="Total Sessions"
            value={stats.totalSessions.toString()}
            icon={<Activity className="h-5 w-5 text-gray-600" />}
            description="Completed therapy sessions"
          />
          <MinimalStatCard
            title="Average Mood"
            value={`${stats.avgMood}/10`}
            icon={<HeartPulse className="h-5 w-5 text-gray-600" />}
            description="Overall mood rating"
            trend={stats.recentTrend}
          />
          <MinimalStatCard
            title="Goals Completed"
            value={stats.completedGoals.toString()}
            icon={<Award className="h-5 w-5 text-gray-600" />}
            description="Therapy goals achieved"
          />
          <MinimalStatCard
            title="Progress Trend"
            value={stats.recentTrend === 'improving' ? 'Improving' : stats.recentTrend === 'declining' ? 'Declining' : 'Stable'}
            icon={<Target className="h-5 w-5 text-gray-600" />}
            description="Recent session trend"
          />
        </div>

        {/* Progress Chart */}
        {progressData.length > 0 && <MinimalProgressChart data={progressData} />}

        {/* Empty State */}
        {progressData.length === 0 && (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Progress Data Yet</h3>
              <p className="text-gray-600 mb-6">
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
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            variant="outline" 
            size="default"
            onClick={() => window.location.href = '/progress-reports'}
          >
            View Detailed Reports
          </Button>
          <Button 
            variant="outline" 
            size="default"
            onClick={() => window.location.href = '/goals'}
          >
            Manage Goals
          </Button>
        </div>
      </div>
    </div>
  );
}