'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlanUsage } from '@/app/actions/plans'; // Ensure exported
import { formatDistanceToNow } from 'date-fns';
import { Package, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PlanUsageStatsProps {
  plans: PlanUsage[];
  loading?: boolean;
}

export function PlanUsageStats({ plans, loading }: PlanUsageStatsProps) {
  if (loading) {
    return <div className="animate-pulse space-y-4">Loading Plans...</div>;
  }

  const activePlans = plans.filter((p) => p.status === 'active');

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
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
                <CardHeader className="bg-linear-to-r from-info/10 to-accent/10 pb-2 dark:from-card dark:to-card">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">{plan.name}</CardTitle>
                    <Badge variant="secondary" className="bg-card/50 backdrop-blur">
                      {remaining} Left
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="text-muted-foreground flex justify-between text-xs">
                      <span>
                        Used {used} of {total} credits
                      </span>
                      <span>{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-2" />

                    {plan.expires_at && (
                      <p className="text-muted-foreground pt-2 text-xs">
                        Expires{' '}
                        {formatDistanceToNow(new Date(plan.expires_at), { addSuffix: true })}
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
