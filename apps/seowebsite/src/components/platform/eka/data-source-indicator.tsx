/**
 * Data Source Indicator
 * 
 * Shows which data source is currently active (mock or Firebase)
 * Useful during development to know which backend you're using
 */

'use client';

import { Badge } from '@/components/platform/ui/badge';
import { useAppStore } from '@/store/platform/app-store';
import { Database, HardDrive } from 'lucide-react';
import { cn } from '@/lib/platform/utils';

interface DataSourceIndicatorProps {
  className?: string;
  showIcon?: boolean;
}

export function DataSourceIndicator({ 
  className, 
  showIcon = true 
}: DataSourceIndicatorProps) {
  const dataService = useAppStore((state) => state.dataService);
  
  // Since we removed mock data, always show Supabase
  return (
    <Badge 
      variant="secondary"
      className={cn('text-xs', className)}
    >
      {showIcon && (
        <Database className="h-3 w-3 mr-1" />
      )}
      Supabase
    </Badge>
  );
}
