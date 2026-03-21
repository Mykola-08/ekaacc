import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  icon?: IconSvgElement;
  label: string;
  value: ReactNode;
  colorClass?: string;
  className?: string;
  action?: ReactNode;
  accent?: boolean;
  /** e.g. "+12%" or "-3%" */
  trend?: string;
  /** true = positive (green), false = negative (red), undefined = neutral */
  trendPositive?: boolean;
  subLabel?: string;
}

export function StatsCard({
  icon,
  label,
  value,
  colorClass,
  className,
  action,
  accent,
  trend,
  trendPositive,
  subLabel,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-200 hover:-translate-y-px',
        accent && 'border-primary/20 bg-gradient-to-br from-primary/5 to-card',
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground truncate text-xs font-medium uppercase tracking-wider">
              {label}
            </p>
            <div className="mt-1.5 text-2xl font-bold tracking-tight tabular-nums">
              {value}
            </div>
            {subLabel && (
              <p className="text-muted-foreground mt-1 text-xs">{subLabel}</p>
            )}
            {trend && (
              <span
                className={cn(
                  'mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
                  trendPositive === true && 'bg-success/10 text-success',
                  trendPositive === false && 'bg-destructive/10 text-destructive',
                  trendPositive === undefined && 'bg-muted text-muted-foreground'
                )}
              >
                {trend}
              </span>
            )}
          </div>
          {icon && (
            <div
              className={cn(
                'pf-icon-well-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius)]',
                colorClass
              )}
            >
              <HugeiconsIcon icon={icon} className="size-5" />
            </div>
          )}
        </div>
        {action && <div className="mt-3 border-t border-border/50 pt-3">{action}</div>}
      </CardContent>
    </Card>
  );
}
