'use client';

import { useEffect, useState } from 'react';
import { AITherapyRecommendations } from '@/components/eka/ai-therapy-recommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, TrendingUp, TrendingDown, Activity } from 'lucide-react';

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // This service method will be created next
        const result = await fxService.getAIAnalysis();
        setAnalysis(result);
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
  }, []);

  const renderTrendCard = (trend: Trend) => {
    const TrendIcon = trend.type === 'improvement' ? TrendingUp : TrendingDown;
    const color = trend.type === 'improvement' ? 'text-green-500' : 'text-red-500';

    return (
      <Card key={trend.title}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{trend.title}</CardTitle>
          <TrendIcon className={`h-4 w-4 ${color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{trend.value}</div>
          <p className="text-xs text-muted-foreground">
            <span className={color}>{trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%</span> from last week
          </p>
        </CardContent>
      </Card>
    );
  };
  
  if (isLoading) {
      return <div>Loading insights...</div>
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
