"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, HeartPulse, Target, Award, FileText, Bot, ArrowUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/store/app-store';
import { personalizationEngine } from '@/firebase/personalizationEngine';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Report, User } from '@/lib/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function toDate(timestamp: any): Date {
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === 'string') return new Date(timestamp);
  if (timestamp && typeof timestamp.toDate === 'function') return timestamp.toDate();
  // Fallback for Firestore Timestamps that might not have toDate() in some contexts
  if (timestamp && typeof timestamp.seconds === 'number') {
    return new Date(timestamp.seconds * 1000);
  }
  return new Date(); // Fallback
}

export default function ProgressPage() {
  const { appUser: currentUser, user, refreshAppUser, loading: authLoading } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  const { toast } = useToast();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (dataService && user?.uid) {
      setIsLoading(true);
      dataService.getReports(user.uid)
        .then(userReports => {
          setReports(userReports || []);
        })
        .finally(() => setIsLoading(false));
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [dataService, user, authLoading]);

  const updateUser = async (data: Partial<User>) => {
    if (dataService && currentUser?.id) {
      await dataService.updateUser(currentUser.id, data);
      await refreshAppUser();
    }
  };

  const progressStats = useMemo(() => {
    if (!reports || reports.length === 0) {
      return {
        painReduction: { percent: 0, trend: 'neutral' },
        mobilityImprovement: { percent: 0, trend: 'neutral' },
        chartData: [],
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

    return {
      painReduction: {
        percent: Math.round(painReductionPercent),
        trend: painReductionPercent > 0 ? 'improving' : painReductionPercent < 0 ? 'declining' : 'neutral',
      },
      mobilityImprovement: {
        percent: Math.round(mobilityImprovementPercent),
        trend: mobilityImprovementPercent > 0 ? 'improving' : mobilityImprovementPercent < 0 ? 'declining' : 'neutral',
      },
      chartData,
    };
  }, [reports]);

  const sortedReports = useMemo(() => {
    return [...reports].sort((a, b) => toDate(b.date).getTime() - toDate(a.date).getTime());
  }, [reports]);

  // Track page visit for personalization
  useEffect(() => {
    if (currentUser) {
      const updates = personalizationEngine.trackActivity(currentUser, {
        type: 'page-visit',
        data: { page: '/progress' }
      });
      updateUser({ activityData: { ...(currentUser.activityData || {}), ...updates } });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  if (isLoading || authLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid w-full grid-cols-2 mb-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Progress & Reports</h1>
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="progress">Progress Overview</TabsTrigger>
          <TabsTrigger value="reports">My Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pain Reduction</CardTitle>
                <TrendingDown className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progressStats.painReduction.percent}%</div>
                <p className="text-xs text-muted-foreground">
                  {progressStats.painReduction.percent >= 0 ? 'Reduction' : 'Increase'} since starting
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mobility Improvement</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{progressStats.mobilityImprovement.percent} pts</div>
                <p className="text-xs text-muted-foreground">
                  Improvement in mobility score
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessions Completed</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentUser?.activityData?.completedSessions || 0} / {currentUser?.goal?.targetSessions || 10}
                </div>
                <p className="text-xs text-muted-foreground">
                  Towards your current goal
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Wellness Trends</CardTitle>
              <CardDescription>Your pain and mobility scores over time.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] w-full">
              <ResponsiveContainer>
                <LineChart data={progressStats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" label={{ value: 'Pain Level', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Mobility Score', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="Pain" stroke="#ef4444" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="Mobility" stroke="#22c55e" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>My Reports</CardTitle>
              <CardDescription>
                View and download your session reports and AI-generated summaries.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sortedReports.length > 0 ? (
                sortedReports.map((report) => (
                  <Card key={report.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{report.title || `Report for ${format(toDate(report.date), 'MMMM d, yyyy')}`}</p>
                        <p className="text-sm text-muted-foreground">
                          {report.type || 'User Report'} - Created on {format(toDate(report.createdAt || report.date), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium">No reports found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your session reports will appear here after they are created.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
