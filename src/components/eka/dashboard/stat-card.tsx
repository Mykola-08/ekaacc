'use client';

<<<<<<< HEAD
;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/keep';
import { cn } from '@/lib/utils';
import type { StatCard as StatCardType } from '@/lib/types';
import { TrendingUp, TrendingDown } from 'lucide-react';
=======
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
>>>>>>> bbef2937e86dbdff133c47e33ad42e2cfa65c958
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
      <Card className="bg-white dark:bg-gray-800/50 border-none shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
          <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
          </div>
          <p className="text-xs text-green-500 dark:text-green-400 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </p>
        </CardContent>
      </Card>
    </InView>
  );
}
