"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useMemo, useEffect } from 'react';
import { TrendingUp, TrendingDown, HeartPulse, Target, Award, FileText, Bot, ArrowUp, Loader2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
// AI assistant removed from progress reports page
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { useToast } from '@/hooks/use-toast';
import type { Report } from '@/lib/types';
import { format } from 'date-fns';

// Mock progress data (replace with real data)
const progressData = {
  painReduction: {
    current: 3,
    baseline: 8,
    target: 2,
    history: [
      { date: '2025-09-20', level: 8 },
      { date: '2025-09-27', level: 7 },
      { date: '2025-10-04', level: 6 },
      { date: '2025-10-11', level: 4 },
      { date: '2025-10-18', level: 3 },
    ],
  },
  mobility: {
    current: 75,
    baseline: 50,
    target: 90,
    history: [
      { date: '2025-09-20', score: 50 },
      { date: '2025-09-27', score: 55 },
      { date: '2025-10-04', score: 62 },
      { date: '2025-10-11', score: 70 },
      { date: '2025-10-18', score: 75 },
    ],
  },
  sessionsCompleted: 8,
  sessionGoal: 12,
  streakDays: 14,
  achievements: [
    { id: '1', name: 'First Session', description: 'Completed your first therapy session', earned: true, date: '2025-09-20' },
    { id: '2', name: 'Consistent Week', description: 'Completed exercises 7 days in a row', earned: true, date: '2025-10-01' },
    { id: '3', name: 'Pain Progress', description: 'Reduced pain by 50%', earned: true, date: '2025-10-15' },
    { id: '4', name: 'Halfway There', description: 'Completed 50% of your session goal', earned: true, date: '2025-10-18' },
    { id: '5', name: 'Goal Achieved', description: 'Reached your wellness goal', earned: false, date: null },
  ],
};

const chartData = [
  { metric: "Pain", score: 4, fullMark: 10 },
  { metric: "Mood", score: 8, fullMark: 10 },
  { metric: "Energy", score: 7, fullMark: 10 },
  { metric: "Sleep", score: 6, fullMark: 10 },
  { metric: "Mobility", score: 9, fullMark: 10 },
];

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  }
};

function toDate(timestamp: string | number | Date | { toDate?: () => Date }) {
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === 'string' || typeof timestamp === 'number') return new Date(timestamp);
  if (timestamp && typeof (timestamp as any).toDate === 'function') return (timestamp as any).toDate();
  return new Date();
}

export default function ProgressReportsPage() {
  const { user: currentUser } = useAuth();
  const { dataService, initDataService } = useAppStore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  useEffect(() => {
    initDataService();
  }, [initDataService]);

  useEffect(() => {
    if (dataService) {
      setIsLoadingReports(true);
      dataService.getReports().then(fetchedReports => {
        setReports(fetchedReports || []);
        setIsLoadingReports(false);
      }).catch(error => {
        console.error("Failed to fetch reports", error);
        setIsLoadingReports(false);
        toast({
          title: "Error fetching reports",
          description: "Could not load your progress reports. Please try again later.",
          variant: "destructive",
        });
      });
    }
  }, [dataService, toast]);

  const painReduction = ((progressData.painReduction.baseline - progressData.painReduction.current) / progressData.painReduction.baseline) * 100;
  const mobilityImprovement = ((progressData.mobility.current - progressData.mobility.baseline) / (progressData.mobility.target - progressData.mobility.baseline)) * 100;

  const sortedReports = useMemo(() => {
    if (!reports) return [];
    return [...reports].sort((a, b) => {
      const dateA = a.date ? toDate(a.date) : new Date(0);
      const dateB = b.date ? toDate(b.date) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [reports]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Progress & Reports</h1>
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="progress" className="space-y-8">
          {/* Key Metrics Overview */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pain Reduction</CardTitle>
                <TrendingDown className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{painReduction.toFixed(0)}%</div>
                <p className="text-xs text-muted-foreground">From level {progressData.painReduction.baseline} to {progressData.painReduction.current}</p>
                <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300" 
                    style={{ width: `${painReduction}%` }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mobility Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-info" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progressData.mobility.current}%</div>
                <p className="text-xs text-muted-foreground">Target: {progressData.mobility.target}%</p>
                <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300" 
                    style={{ width: `${mobilityImprovement}%` }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Therapies</CardTitle>
                <HeartPulse className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progressData.sessionsCompleted}/{progressData.sessionGoal}</div>
                <p className="text-xs text-muted-foreground">{((progressData.sessionsCompleted / progressData.sessionGoal) * 100).toFixed(0)}% Complete</p>
                <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300" 
                    style={{ width: `${(progressData.sessionsCompleted / progressData.sessionGoal) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <Target className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progressData.streakDays} days</div>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </CardContent>
            </Card>
          </div>
          {/* Progress Details Tabs */}
          <Tabs defaultValue="pain" className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pain">Pain Levels</TabsTrigger>
              <TabsTrigger value="mobility">Mobility</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            <TabsContent value="pain" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pain Level Tracker</CardTitle>
                  <CardDescription>Monitor your pain levels over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progressData.painReduction.history.map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-24 text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                        <div className="flex-1">
                          <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 transition-all duration-300" 
                              style={{ width: `${(10 - entry.level) * 10}%` }}
                            />
                          </div>
                        </div>
                        <div className="w-16 text-right font-medium">Level {entry.level}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="mobility" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mobility Score</CardTitle>
                  <CardDescription>Track your mobility improvements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progressData.mobility.history.map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-24 text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                        <div className="flex-1">
                          <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 transition-all duration-300" 
                              style={{ width: `${entry.score / progressData.mobility.target * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="w-16 text-right font-medium">{entry.score}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="achievements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your earned badges and milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {progressData.achievements.map((ach) => (
                      <Card key={ach.id} className={ach.earned ? 'border-green-500' : 'border-muted'}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-yellow-500" />
                            {ach.name}
                          </CardTitle>
                          <CardDescription>{ach.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {ach.earned ? (
                            <Badge variant="default">Earned</Badge>
                          ) : (
                            <Badge variant="default">Locked</Badge>
                          )}
                          {ach.date && <div className="text-xs text-muted-foreground mt-2">{new Date(ach.date).toLocaleDateString()}</div>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value="reports" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>My Reports</CardTitle>
                  <CardDescription>View all your session summaries and progress reports.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingReports && (
                    <ul className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <li key={i} className="flex items-start gap-4 p-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!isLoadingReports && sortedReports && sortedReports.length > 0 && (
                    <ul className="space-y-1">
                      {sortedReports.map((report) => (
                        <li key={report.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="p-3 bg-muted rounded-full flex items-center justify-center shrink-0">
                            {report.type === 'AI Summary' ? <Bot className="h-6 w-6 text-primary" /> : <FileText className="h-6 w-6 text-primary" />}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center">
                              <p className="font-semibold truncate">{report.title}</p>
                              <Badge variant="default" className="ml-2 shrink-0">{report.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{report.author} - {report.date ? format(toDate(report.date), 'MMMM d, yyyy') : 'No date'}</p>
                            <p className="text-sm mt-1 break-words">{report.summary}</p>
                          </div>
                          <Button variant="outline" size="sm" className="shrink-0">
                            <ArrowUp className="h-4 w-4 transform -rotate-45" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!isLoadingReports && (!sortedReports || sortedReports.length === 0) && (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No Reports Yet</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Your session reports and summaries will appear here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-8">
              {/* AI assistant removed */}
              <Card>
                <CardHeader>
                  <CardTitle>Wellness Snapshot</CardTitle>
                  <CardDescription>Your current ratings across key metrics.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Pain</span>
                      <Badge variant="default">{progressData.painReduction.current}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Mobility</span>
                      <Badge variant="default">{progressData.mobility.current}%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Streak</span>
                      <Badge variant="default">{progressData.streakDays} days</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
