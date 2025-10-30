"use client";
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Bot, ArrowUp, Loader2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
// AI assistant removed from reports page
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/store/app-store';
import { collection, Timestamp, getFirestore } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Report } from '@/lib/types';
import { format } from 'date-fns';

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

function toDate(timestamp: Timestamp | Date | string): Date {
    if (timestamp instanceof Date) return timestamp;
    if (typeof timestamp === 'string') return new Date(timestamp);
    return (timestamp as Timestamp).toDate();
}

export default function ReportsPage() {
    const { appUser: currentUser } = useAuth();
    const { dataService, initDataService } = useAppStore();
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoadingReports, setIsLoadingReports] = useState(true);

    useEffect(() => {
        initDataService();
    }, [initDataService]);

    useEffect(() => {
        const fetchReports = async () => {
            if (dataService && currentUser) {
                setIsLoadingReports(true);
                try {
                    const userReports = await dataService.getReports(currentUser.id);
                    setReports(userReports);
                } catch (error) {
                    console.error("Failed to fetch reports:", error);
                    toast({
                        title: "Error",
                        description: "Could not load reports.",
                        variant: "destructive",
                    });
                } finally {
                    setIsLoadingReports(false);
                }
            }
        };
        fetchReports();
    }, [dataService, currentUser]);

    // Firebase is initialized in the app layout
    // const reportsRef = currentUser && currentUser.uid
    //     ? collection(getFirestore(), 'users', currentUser.uid, 'reports')
    //     : null;
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    
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
                userId: currentUser?.uid || '',
                startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
                endDate: new Date().toISOString(),
                healthHistory: "User has a history of chronic lower back pain and is currently focusing on improving mobility.",
                reports: JSON.stringify(reports.slice(0, 5).map(r => ({title: r.title, summary: r.summary, date: r.date}))),
                messages: "User has been feeling more positive about their progress and is motivated to continue with the therapy plan.",
            };
            const result = await generateMonthlyReport(input);
            const newReport: Omit<Report, 'id'> = {
                title: "Monthly AI Progress Summary",
                author: "AI Assistant",
                type: 'AI Summary',
                summary: result.report,
                createdAt: new Date().toISOString(),
                date: new Date().toISOString()
            };
            // TODO: Re-enable when reportsRef is properly set up
            // if (reportsRef) {
            //     await addDocumentNonBlocking(reportsRef, newReport);
            // }
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
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const sortedReports = useMemo(() => {
        if (!reports) return [];
        return [...reports].sort((a, b) => {
            const dateA = a.date ? toDate(a.date) : new Date(0);
            const dateB = b.date ? toDate(b.date) : new Date(0);
            return dateB.getTime() - dateA.getTime();
        });
    }, [reports]);

    return (
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
                                                <Badge variant={report.type === 'AI Summary' ? 'default' : 'secondary'} className="ml-2 shrink-0">{report.type}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{report.author} - {report.date ? format(toDate(report.date), 'MMMM d, yyyy') : 'No date'}</p>
                                            <p className="text-sm mt-1 break-words">{report.summary}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="shrink-0">
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
                <Button onClick={handleGenerateReport} disabled={isGenerating || isLoadingReports} className="w-full">
                    {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isGenerating ? 'Generating...' : 'Generate Monthly Report'}
                </Button>
            </div>
        </div>
    );
}
