"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/store/app-store';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import type { Report } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';
import { TrendingUp, TrendingDown, HeartPulse, Award, Activity, Accessibility } from 'lucide-react';

function toDate(timestamp: any): Date {
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === 'string') return new Date(timestamp);
  if (timestamp && typeof timestamp.toDate === 'function') return timestamp.toDate();
  if (timestamp && typeof timestamp.seconds === 'number') {
    return new Date(timestamp.seconds * 1000);
  }
  return new Date();
}

function StatCard({ title, value, icon, description, trend, children }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend?: 'improving' | 'declining' | 'neutral';
  children?: React.ReactNode;
}) {
  const trendInfo = {
    improving: { icon: <TrendingUp className="h-4 w-4 text-green-500" />, color: 'text-green-500' },
    declining: { icon: <TrendingDown className="h-4 w-4 text-red-500" />, color: 'text-red-500' },
    neutral: { icon: null, color: '' },
  }[trend || 'neutral'];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && trend !== 'neutral' && (
          <div className={`mt-2 flex items-center text-xs ${trendInfo.color}`}>
            {trendInfo.icon}
            <span className="ml-1">{trend === 'improving' ? 'Improving' : 'Declining'}</span>
          </div>
        )}
        {children && <div className="mt-4">{children}</div>}
      </CardContent>
    </Card>
  );
}

function ProgressPageSkeleton() {
  return (
    <SettingsShell>
      <SettingsHeader title="Progress Overview" description="Track your recovery journey over time." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent className="h-[300px] w-full">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    </SettingsShell>
  );
}

export default function ProgressPage() {
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
        console.error("Failed to fetch reports", error);
      } finally {
        setIsLoading(false);
      }
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [dataService, user, authLoading]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const { painReduction, mobilityImprovement, chartData, overallProgress, consistency } = useMemo(() => {
    if (!reports || reports.length < 2) {
      return {
        painReduction: { percent: 0, trend: 'neutral' as const },
        mobilityImprovement: { percent: 0, trend: 'neutral' as const },
        chartData: [],
        overallProgress: 0,
        consistency: 0,
      };
    }

    const sorted = reports.map(r => ({ ...r, date: toDate(r.date) })).sort((a, b) => a.date.getTime() - b.date.getTime());
    const firstReport = sorted[0];
    const lastReport = sorted[sorted.length - 1];

    const baselinePain = firstReport.painLevel ?? 5;
    const currentPain = lastReport.painLevel ?? 5;
    const painReductionPercent = baselinePain > 0 ? ((baselinePain - currentPain) / baselinePain) * 100 : 0;

    const baselineMobility = firstReport.mobility ?? 50;
    const currentMobility = lastReport.mobility ?? 50;
    const mobilityImprovementPercent = currentMobility - baselineMobility;

    const chartData = sorted.map(r => ({
      date: format(r.date, 'MMM dd'),
      Pain: r.painLevel,
      Mobility: r.mobility,
    }));

    const overallProgress = (painReductionPercent + mobilityImprovementPercent) / 2;

    const totalDays = (lastReport.date.getTime() - firstReport.date.getTime()) / (1000 * 3600 * 24) + 1;
    const consistency = reports.length / totalDays * 100;

    return {
      painReduction: {
        percent: Math.round(painReductionPercent),
        trend: painReductionPercent > 0 ? 'improving' as const : painReductionPercent < 0 ? 'declining' as const : 'neutral' as const,
      },
      mobilityImprovement: {
        percent: Math.round(mobilityImprovementPercent),
        trend: mobilityImprovementPercent > 0 ? 'improving' as const : mobilityImprovementPercent < 0 ? 'declining' as const : 'neutral' as const,
      },
      chartData,
      overallProgress: Math.max(0, Math.min(100, Math.round(overallProgress))),
      consistency: Math.min(100, Math.round(consistency)),
    };
  }, [reports]);

  if (isLoading) {
    return <ProgressPageSkeleton />;
  }
  
  if (reports.length < 2) {
    return (
      <SettingsShell>
        <SettingsHeader title="Progress Overview" description="Track your recovery journey over time." />
        <Card className="flex flex-col items-center justify-center text-center p-8 border-dashed">
          <TrendingUp className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Not Enough Data</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You need at least two reports to start seeing your progress. Keep up the great work!
          </p>
        </Card>
      </SettingsShell>
    );
  }

  return (
    <SettingsShell>
      <SettingsHeader title="Progress Overview" description="Track your recovery journey over time." />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Overall Progress"
          value={`${overallProgress}%`}
          icon={<Award className="h-4 w-4 text-muted-foreground" />}
          description="Combined score of all metrics."
        >
          <Progress value={overallProgress} className="h-2" />
        </StatCard>
        <StatCard
          title="Pain Reduction"
          value={`${painReduction.percent}%`}
          icon={<HeartPulse className="h-4 w-4 text-muted-foreground" />}
          trend={painReduction.trend}
          description="Decrease in reported pain levels."
        />
        <StatCard
          title="Mobility Improvement"
          value={`${mobilityImprovement.percent > 0 ? '+' : ''}${mobilityImprovement.percent}%`}
          icon={<Accessibility className="h-4 w-4 text-muted-foreground" />}
          trend={mobilityImprovement.trend}
          description="Improvement in mobility score."
        />
        <StatCard
          title="Consistency"
          value={`${consistency}%`}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          description="How often you submit reports."
        >
          <Progress value={consistency} className="h-2" />
        </StatCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pain & Mobility Trends</CardTitle>
          <CardDescription>Visualize your progress over the last reports.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] w-full">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Pain" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Mobility" stroke="hsl(var(--secondary-foreground))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </SettingsShell>
  );
}
