'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Bot, ArrowUp, Loader2 } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { AiAssistant } from "@/components/eka/dashboard/ai-assistant";
import { useCollection, useUser, useFirestore, addDocumentNonBlocking, collection, serverTimestamp } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { generateMonthlyReport } from '@/ai/flows/generate-monthly-report';
import { useToast } from '@/hooks/use-toast';
import { Report } from '@/lib/types';

const chartData = [
    { metric: "Pain", score: 4, fullMark: 10 },
    { metric: "Mood", score: 8, fullMark: 10 },
    { metric: "Energy", score: 7, fullMark: 10 },
    { metric: "Sleep", score: 6, fullMark: 10 },
    { metric: "Mobility", score: 9, fullMark: 10 },
]

const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--primary))",
    },
}

export default function ReportsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const reportsRef = user ? collection(firestore, 'users', user.uid, 'reports') : null;
  const { data: reports, isLoading: isLoadingReports } = useCollection<Report>(reportsRef);
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
      if (!user) return;
      setIsGenerating(true);
      toast({
          title: "Generating Report...",
          description: "The AI is analyzing your data to create a monthly summary.",
      });
      try {
          // In a real app, you would fetch real data. Here we use mock data for the AI flow.
          const input = {
              userId: user.uid,
              startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
              endDate: new Date().toISOString(),
              healthHistory: "User has a history of chronic lower back pain.",
              reports: JSON.stringify(reports?.slice(0, 5) || []),
              messages: "User has been feeling more positive about their progress.",
          };
          const result = await generateMonthlyReport(input);

          const newReport: Omit<Report, 'id'> = {
              title: "Monthly AI Progress Summary",
              author: "AI Assistant",
              date: new Date().toISOString(),
              type: 'AI Summary',
              summary: result.report,
              createdAt: serverTimestamp(),
          };

          if (reportsRef) {
              addDocumentNonBlocking(reportsRef, newReport);
          }

          toast({
              title: "Report Generated!",
              description: "Your new monthly summary is ready.",
          });
      } catch (error) {
          console.error("Failed to generate report:", error);
          toast({
              variant: "destructive",
              title: "Generation Failed",
              description: "There was an error generating your report. Please try again."
          })
      } finally {
          setIsGenerating(false);
      }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
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
                    {!isLoadingReports && reports && reports.length > 0 && (
                        <ul className="space-y-4">
                            {reports.map((report) => (
                                <li key={report.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="p-3 bg-muted rounded-full flex items-center justify-center">
                                        {report.type === 'AI Summary' ? <Bot className="h-6 w-6 text-primary" /> : <FileText className="h-6 w-6 text-primary" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold">{report.title}</p>
                                            <Badge variant={report.type === 'AI Summary' ? 'default' : 'secondary'}>{report.type}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{report.author} - {new Date(report.date).toLocaleDateString()}</p>
                                        <p className="text-sm mt-1">{report.summary}</p>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <ArrowUp className="h-4 w-4 transform -rotate-45" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                    {!isLoadingReports && (!reports || reports.length === 0) && (
                        <div className="text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No Reports Yet</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Your session reports and summaries will appear here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <AiAssistant />
            <Card>
                <CardHeader>
                    <CardTitle>Wellness Snapshot</CardTitle>
                    <CardDescription>Your current ratings across key metrics.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full w-full">
                        <RadarChart data={chartData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="metric" />
                            <PolarRadiusAxis angle={30} domain={[0, 10]} />
                            <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                        </RadarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isGenerating ? 'Generating...' : 'Generate Monthly Report'}
            </Button>
        </div>
    </div>
  );
}
