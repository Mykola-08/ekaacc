"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
// Using Supabase - Date type instead of Firebase Timestamp
type Timestamp = Date;
import { FileText, Bot, ArrowUp, Loader2 } from "lucide-react";
import { PageContainer } from '@/components/eka/page-container';
import { PageHeader } from '@/components/eka/page-header';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

import type { Report } from '@/lib/types';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { useToast } from '@/hooks/use-toast';

import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';

// Helper function to convert various timestamp formats to a Date object
function toDate(timestamp: Timestamp | Date | string): Date {
    if (timestamp instanceof Date) return timestamp;
    if (typeof timestamp === 'string') return new Date(timestamp);
    if (timestamp && typeof (timestamp as any).toDate === 'function') {
        return (timestamp as any).toDate();
    }
    return new Date();
}

// --- Sub-components for better structure ---

function ReportListSkeleton() {
    return (
        <ul className="space-y-4 p-4">
            {[...Array(3)].map((_, i) => (
                <li key={i} className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </li>
            ))}
        </ul>
    );
}

function NoReportsEmptyState() {
    return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg m-4">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Reports Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Your session reports and summaries will appear here.</p>
        </div>
    );
}

function ReportListItem({ report }: { report: Report }) {
    return (
        <li className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="p-3 bg-muted rounded-full flex items-center justify-center shrink-0">
                {report.type === 'AI Summary' ? <Bot className="h-6 w-6 text-primary" /> : <FileText className="h-6 w-6 text-primary" />}
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                    <p className="font-semibold truncate">{report.title}</p>
                    <Badge variant={report.type === 'AI Summary' ? 'default' : 'secondary'} className="ml-2 shrink-0">{report.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{report.author} - {report.date ? format(toDate(report.date), 'MMMM d, yyyy') : 'No date'}</p>
                <p className="text-sm mt-1 break-words">{report.summary}</p>
            </div>
            <Button variant="outline" size="icon" className="shrink-0 self-center">
                <ArrowUp className="h-4 w-4 transform -rotate-45" />
            </Button>
        </li>
    );
}

const wellnessChartData = [
    { metric: "Pain", score: 4, fullMark: 10 },
    { metric: "Mood", score: 8, fullMark: 10 },
    { metric: "Energy", score: 7, fullMark: 10 },
    { metric: "Sleep", score: 6, fullMark: 10 },
    { metric: "Mobility", score: 9, fullMark: 10 },
];

const wellnessChartConfig = {
    score: { label: "Score", color: "hsl(var(--primary))" },
};

function WellnessSnapshotCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Wellness Snapshot</CardTitle>
                <CardDescription>Your current ratings across key metrics.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={wellnessChartConfig} className="mx-auto aspect-square h-full w-full max-h-[250px]">
                    <RadarChart data={wellnessChartData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                        <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

function GenerateReportCard({ onGenerate, isGenerating, isLoading }: { onGenerate: () => void; isGenerating: boolean; isLoading: boolean; }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Summary</CardTitle>
                <CardDescription>Let our AI analyze your recent progress and generate a monthly summary for you.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={onGenerate} disabled={isGenerating || isLoading} className="w-full">
                    {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isGenerating ? 'Generating...' : 'Generate Monthly Report'}
                </Button>
            </CardContent>
        </Card>
    );
}


// --- Main Page Component ---

export default function ReportsPage() {
  const { user: currentUser } = useAuth();
    const dataService = useAppStore((state) => state.dataService);
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoadingReports, setIsLoadingReports] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const fetchReports = useCallback(async () => {
        if (dataService && currentUser) {
            setIsLoadingReports(true);
            try {
                const userReports = await dataService.getReports(currentUser.id);
                setReports(userReports || []);
            } catch (error) {
                console.error("Failed to fetch reports:", error);
                toast({ title: "Error", description: "Could not load reports.", variant: "destructive" });
            } finally {
                setIsLoadingReports(false);
            }
        } else if (!currentUser) {
            setIsLoadingReports(false);
        }
    }, [dataService, currentUser, toast]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleGenerateReport = async () => {
        if (!currentUser || !reports) return;
        setIsGenerating(true);
        toast({
            title: "Generating Report...",
            description: "The AI is analyzing your data to create a monthly summary.",
        });
        try {
            const { generateMonthlyReport } = await import('@/ai/flows/generate-monthly-report');
            const input = {
                userId: currentUser?.id || '',
                startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
                endDate: new Date().toISOString(),
                healthHistory: "User has a history of chronic lower back pain and is currently focusing on improving mobility.",
                reports: JSON.stringify(reports.slice(0, 5).map((r: Report) => ({title: r.title, summary: r.summary, date: r.date}))),
                messages: JSON.stringify([]), // Empty messages array
            };
            const result = await generateMonthlyReport(input);
            toast({
                title: "Report Generated",
                description: "Your monthly report is ready!",
            });
            // Refresh reports list
            await fetchReports();
        } catch (error) {
            console.error('Failed to generate report:', error);
            toast({
                title: "Error",
                description: "Could not generate report. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <PageContainer>
            <PageHeader
                icon={FileText}
                title="Reports"
                description="View your wellness journey reports and insights"
                badge={reports && reports.length > 0 ? {
                    variant: "secondary",
                    children: `${reports.length} report${reports.length > 1 ? 's' : ''}`
                } : undefined}
                actions={
                    <Button onClick={handleGenerateReport} disabled={isGenerating}>
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Bot className="mr-2 h-4 w-4" />
                                Generate New Report
                            </>
                        )}
                    </Button>
                }
            />

            <Card>
                <CardHeader>
                    <CardTitle>Your Reports</CardTitle>
                    <CardDescription>AI-powered insights into your mental health progress</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingReports ? (
                        <ReportListSkeleton />
                    ) : reports && reports.length > 0 ? (
                        <ul className="space-y-4">
                            {reports.map((report) => (
                                <li key={report.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                    <FileText className="h-10 w-10 text-primary shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h3 className="font-semibold text-base truncate">{report.title}</h3>
                                            <Badge variant="outline">{report.date ? format(toDate(report.date), 'MMM d, yyyy') : 'N/A'}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{report.summary}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No reports available yet.</p>
                            <p className="text-sm text-muted-foreground mt-1">Generate your first report to get started!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </PageContainer>
    );
}
