'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { reports } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Bot, ArrowUp } from "lucide-react";
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
  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>My Reports</CardTitle>
                    <CardDescription>View all your session summaries and progress reports.</CardDescription>
                </CardHeader>
                <CardContent>
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
                                    <p className="text-sm text-muted-foreground">{report.author} - {report.date}</p>
                                    <p className="text-sm mt-1">{report.summary}</p>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <ArrowUp className="h-4 w-4 transform -rotate-45" />
                                </Button>
                            </li>
                        ))}
                    </ul>
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
            <Button>Generate Monthly Report</Button>
        </div>
    </div>
  );
}
