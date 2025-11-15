'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InView, AnimatedNumber } from '@/components/motion-primitives';
import { TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend: string;
  index: number;
}

export function StatCard({ title, value, icon: Icon, trend, index }: StatCardProps) {
  return (
    <InView
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="glass-effect hover-lift h-full border-none">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className="w-5 h-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground mb-2">
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
