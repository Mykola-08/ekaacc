'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoyalBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    container: 'px-2 py-1 text-xs gap-1',
    icon: 'w-3 h-3',
  },
  md: {
    container: 'px-2.5 py-1.5 text-sm gap-1.5',
    icon: 'w-4 h-4',
  },
  lg: {
    container: 'px-3 py-2 text-base gap-2',
    icon: 'w-5 h-5',
  },
};

/**
 * Loyal membership badge with amber background and star icon
 */
export function LoyalBadge({ 
  size = 'md', 
  showLabel = true,
  className = '' 
}: LoyalBadgeProps) {
  const config = sizeConfig[size];
  
  return (
    <div 
      className={cn(
        'inline-flex items-center rounded-full font-semibold',
        'bg-amber-500 text-white border-0',
        'shadow-sm hover:shadow-md transition-shadow',
        config.container,
        className
      )}
      title="Loyal Member"
    >
      <Star className={cn(config.icon, 'fill-current')} />
      {showLabel && <span>Loyal</span>}
    </div>
  );
}
