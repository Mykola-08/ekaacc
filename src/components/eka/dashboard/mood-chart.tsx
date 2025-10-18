'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export function MoodChart() {
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
      label: 'Mood',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Over Time</CardTitle>
        <CardDescription>
          Your average mood rating over the last 6 months.
        </CardDescription>
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="mood" fill="var(--color-mood)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
