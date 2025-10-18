import { StatCard } from '@/components/eka/dashboard/stat-card';
import { userStats } from '@/lib/data';
import { QuickActions } from '@/components/eka/dashboard/quick-actions';
import { AiAssistant } from '@/components/eka/dashboard/ai-assistant';
import { NextSession } from '@/components/eka/dashboard/next-session';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { currentUser, reports } from '@/lib/data';
import { Activity, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
    ChartContainer,
    ChartTooltipContent,
  } from "@/components/ui/chart"

export default function HomePage() {
  const chartData = [
    { month: 'Jan', mood: 7 },
    { month: 'Feb', mood: 6 },
    { month: 'Mar', mood: 8 },
    { month: 'Apr', mood: 7 },
    { month: 'May', mood: 9 },
    { month: 'Jun', mood: 8 },
  ];

  const chartConfig = {
    mood: {
      label: "Mood",
      color: "hsl(var(--primary))",
    },
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {userStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-5 grid gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Mood Over Time</CardTitle>
                    <CardDescription>Your average mood rating over the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            />
                            <YAxis tickLine={false} axisLine={false} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="mood" fill="var(--color-mood)" radius={8} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
                <QuickActions />
                <AiAssistant />
            </div>
        </div>
        <div className="lg:col-span-2 flex flex-col gap-4">
            <NextSession />
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {reports.slice(0, 3).map((report) => (
                            <li key={report.id} className="text-sm">
                                <p className="font-medium">{report.title}</p>
                                <p className="text-muted-foreground">{report.author} - {report.date}</p>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
