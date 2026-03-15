import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  icon?: IconSvgElement;
  label: string;
  value: ReactNode;
  colorClass?: string;
  className?: string;
  action?: ReactNode;
  accent?: boolean;
}

export function StatsCard({ icon, label, value, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        {icon && <HugeiconsIcon icon={icon} className="text-muted-foreground size-4" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
