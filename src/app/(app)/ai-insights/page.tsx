'use client';

import { useEffect, useState } from 'react';
import { AITherapyRecommendations } from '@/components/eka/ai-therapy-recommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/store/app-store';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from '@/lib/types';

// Define types for the analysis data
type Trend = {
  title: string;
  value: string;
  change: number; // percentage
  // allow string to be more flexible when data comes from external/mock sources
  type: 'improvement' | 'decline' | 'neutral' | string;
};

type ChartData = {
  name: string;
  value: number;
};

type AnalysisResult = {
  keyTrends: Trend[];
  moodChart: ChartData[];
  painChart: ChartData[];
  recommendations: any[]; // Using 'any' for now, should be TherapyRecommendation
};

export default function AIInsightsPage() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { appUser: currentUser, refreshAppUser } = useAuth();
  const dataService = useAppStore((state) => state.dataService);

  const updateUser = async (data: Partial<User>) => {
    if (dataService && currentUser?.id) {
      await dataService.updateUser(currentUser.id, data);
      await refreshAppUser();
    }
  };

  // Track page visit for personalization
  useEffect(() => {
    // TODO: Re-implement personalization tracking
    // Previously tracked page visit to /ai-insights
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (!dataService) return;
      setIsLoading(true);
      setError(null);
      try {
        // This service method will be created next
        // For now, using a mock response
        const result = await dataService.getAIRecommendations(); // This is a placeholder
        
        // Mock analysis generation
        const mockAnalysis: AnalysisResult = {
          keyTrends: [
            { title: 'Mood', value: 'Improving', change: 15, type: 'improvement' },
            { title: 'Pain Level', value: 'Decreasing', change: -10, type: 'improvement' },
            { title: 'Activity', value: 'Consistent', change: 2, type: 'neutral' },
          ],
          moodChart: [
            { name: 'Week 1', value: 3.2 },
            { name: 'Week 2', value: 3.8 },
            { name: 'Week 3', value: 4.1 },
            { name: 'This Week', value: 4.5 },
          ],
          painChart: [
            { name: 'Week 1', value: 7 },
            { name: 'Week 2', value: 6 },
            { name: 'Week 3', value: 5 },
            { name: 'This Week', value: 4 },
          ],
          recommendations: result,
        };
        setAnalysis(mockAnalysis);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Failed to load AI Insights',
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dataService, toast]);

  const renderTrendCard = (trend: Trend) => {
    const TrendIcon = trend.type === 'improvement' ? TrendingUp : TrendingDown;
    const colorClass = trend.type === 'improvement' ? 'text-success' : 'text-destructive';

    return (
      <Card key={trend.title}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{trend.title}</CardTitle>
          <TrendIcon className={`h-4 w-4 ${colorClass}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{trend.value}</div>
          <p className="text-xs text-muted-foreground">
            <span className={colorClass}>{trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%</span> from last week
          </p>
        </CardContent>
      </Card>
    );
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }
  
  if (error) {
      return <div className="text-destructive">Could not load insights: {error}</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analysis?.keyTrends.map(renderTrendCard)}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Mood Trend</CardTitle>
            <CardDescription>Based on your journal entries.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analysis?.moodChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[1, 5]} tickFormatter={(val) => ['😔', '😕', '😐', '😊', '😁'][val-1]}/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" name="Mood Level" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pain Level Over Time</CardTitle>
            <CardDescription>Based on your session reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analysis?.painChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]}/>
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Pain Level" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <AITherapyRecommendations />

    </div>
  );
}
