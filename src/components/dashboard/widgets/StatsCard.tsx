import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  icon?: LucideIcon;
  label: string;
  value: ReactNode;
  colorClass?: string;
  className?: string;
  action?: ReactNode;
  accent?: boolean;
}

export function StatsCard({ icon: Icon, label, value, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        {Icon && <Icon className="text-muted-foreground h-4 w-4" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
