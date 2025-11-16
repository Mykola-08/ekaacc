'use client';
1
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InView, AnimatedNumber } from '@/components/motion-primitives';
import { TrendingUp } from 'lucide-react';
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend: string;
  index: number;
}

export function StatCard({ title, value, icon: Icon, trend, index }: StatCardProps) {
  return (
    <InView
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full border-0 bg-muted/20 rounded-2xl hover:bg-muted/30 transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="p-2 bg-muted/30 rounded-lg">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-light text-foreground mb-3">
            {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </p>
        </CardContent>
      </Card>
    </InView>
  );
}
