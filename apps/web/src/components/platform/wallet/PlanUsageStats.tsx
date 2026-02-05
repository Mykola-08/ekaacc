'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/platform/ui/card';
import { Progress } from '@/components/platform/ui/progress';
import { Badge } from '@/components/platform/ui/badge';
import { Button } from '@/components/platform/ui/button';
import { PlanUsage } from '@/app/actions/plans'; // Ensure exported
import { formatDistanceToNow } from 'date-fns';
import { Package, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/platform/ui/alert';

interface PlanUsageStatsProps {
  plans: PlanUsage[];
  loading?: boolean;
}

export function PlanUsageStats({ plans, loading }: PlanUsageStatsProps) {
  if (loading) {
    return <div className="space-y-4 animate-pulse">Loading Plans...</div>;
  }

  const activePlans = plans.filter(p => p.status === 'active');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Package className="h-5 w-5" />
        Your Plans
      </h3>
      
      {activePlans.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have any active plans. Purchase a package to save on bookings.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {activePlans.map((plan) => {
            const used = plan.credits_used;
            const total = plan.credits_total;
            const remaining = total - used;
            const percent = Math.round((used / total) * 100);

            return (
              <Card key={plan.id} className="overflow-hidden">
                <CardHeader className="pb-2 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-medium">{plan.name}</CardTitle>
                    <Badge variant="secondary" className="bg-card/50 backdrop-blur">
                      {remaining} Left
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Used {used} of {total} credits</span>
                      <span>{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                    
                    {plan.expires_at && (
                      <p className="text-xs text-muted-foreground pt-2">
                        Expires {formatDistanceToNow(new Date(plan.expires_at), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
