'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap, Crown } from 'lucide-react';

export function PlanUsageCard({ usage, compact }: { usage: any; compact?: boolean }) {
  if (!usage) return null;

  const total = usage.credits_total;
  const used = usage.credits_used;
  const remaining = total - used;
  const percent = (remaining / total) * 100;
  const isVIP = usage.name?.includes('VIP');

  if (compact) {
    return (
      <Card className="bg-background border-border group overflow-hidden rounded-lg p-5 shadow-sm transition-all hover:shadow-md">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-foreground h-4 w-4" strokeWidth={2.5} />
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Credits
            </span>
          </div>
          <span className="text-foreground text-sm font-semibold">
            {remaining}/{total}
          </span>
        </div>
        <Progress value={percent} className="bg-card h-2 rounded-full" />
      </Card>
    );
  }

  return (
    <Card className="bg-background border-border relative overflow-hidden rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
      <div className="from-primary/10 pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-tr-[32px] bg-linear-to-bl to-transparent" />

      <div className="relative z-10 mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg shadow-sm ${isVIP ? 'bg-warning/10 text-warning' : 'bg-card text-foreground'}`}
          >
            {isVIP ? (
              <Crown className="h-6 w-6 fill-current" />
            ) : (
              <Zap className="h-6 w-6" strokeWidth={2.5} />
            )}
          </div>
          <div>
            <div className="text-foreground text-lg leading-tight font-semibold tracking-tight">
              {usage.name}
            </div>
            <div className="text-muted-foreground mt-0.5 text-xs font-medium">Active Plan</div>
          </div>
        </div>
        <div className="text-foreground text-3xl font-semibold tracking-tight">
          {remaining}
          <span className="text-muted-foreground ml-1 text-base font-medium">/{total}</span>
        </div>
      </div>

      <div className="relative z-10 space-y-2">
        <div className="text-muted-foreground flex justify-between text-xs font-semibold tracking-wider uppercase">
          <span>Usage</span>
          <span>{Math.round(percent)}%</span>
        </div>
        <Progress
          value={percent}
          className={`bg-card border-border h-3 rounded-full border`}
          indicatorClassName={`${isVIP ? 'bg-warning shadow-sm' : 'bg-foreground shadow-sm'}`}
        />
      </div>

      <div className="border-border relative z-10 mt-6 border-t pt-4">
        <p className="text-muted-foreground bg-secondary rounded-lg py-2 text-center text-xs font-medium">
          Expires on{' '}
          <span className="text-foreground font-semibold">
            {new Date(usage.expires_at).toLocaleDateString()}
          </span>
        </p>
      </div>
    </Card>
  );
}
