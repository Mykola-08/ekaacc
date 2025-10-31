'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { StatCard as StatCardType } from '@/lib/types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { InView, AnimatedNumber } from '@/components/motion-primitives';

export function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
}: StatCardType) {
  // Extract numeric value if it's a string like "75%"
  const numericValue = typeof value === 'string' 
    ? parseFloat(value.replace(/[^0-9.-]/g, '')) 
    : value;
  const isNumeric = !isNaN(numericValue);
  const suffix = typeof value === 'string' ? value.replace(/[0-9.-]/g, '') : '';

  return (
    <InView
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isNumeric ? (
              <>
                <AnimatedNumber value={numericValue} />
                {suffix}
              </>
            ) : (
              value
            )}
          </div>
          {change && (
            <p className="text-xs text-muted-foreground flex items-center">
              <span
                className={cn(
                  'mr-1 flex items-center gap-1',
                  changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                )}
              >
                {changeType === 'increase' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {change}
              </span>
              vs last month
            </p>
          )}
        </CardContent>
      </Card>
    </InView>
  );
}
