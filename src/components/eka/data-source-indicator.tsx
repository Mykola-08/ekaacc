/**
 * Data Source Indicator
 * 
 * Shows which data source is currently active (mock or Firebase)
 * Useful during development to know which backend you're using
 */

'use client';

import { useAppStore } from '@/store/app-store';
import { Badge } from '@/components/ui/badge';
import { Database, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataSourceIndicatorProps {
  className?: string;
  showIcon?: boolean;
}

export function DataSourceIndicator({ 
  className, 
  showIcon = true 
}: DataSourceIndicatorProps) {
  const dataService = useAppStore((state) => state.dataService);
  
  const isMock = dataService?.isMock ?? true;
  
  return (
    <Badge 
      variant={isMock ? 'secondary' : 'default'}
      className={cn('text-xs', className)}
    >
      {showIcon && (
        isMock ? (
          <HardDrive className="h-3 w-3 mr-1" />
        ) : (
          <Database className="h-3 w-3 mr-1" />
        )
      )}
      {isMock ? 'Mock Data' : 'Firebase'}
    </Badge>
  );
}
