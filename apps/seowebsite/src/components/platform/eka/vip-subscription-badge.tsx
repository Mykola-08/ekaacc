'use client';

import { Crown } from 'lucide-react';
import { cn } from '@/lib/platform/utils';

interface VipSubscriptionBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
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
 * VIP subscription badge with purple gradient background, crown icon, and optional pulse animation
 */
export function VipSubscriptionBadge({ 
  size = 'md', 
  showLabel = true,
  animated = true,
  className = '' 
}: VipSubscriptionBadgeProps) {
  const config = sizeConfig[size];
  
  return (
    <div 
      className={cn(
        'inline-flex items-center rounded-full font-semibold',
        'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0',
        'shadow-md hover:shadow-lg transition-all',
        animated && 'animate-pulse-subtle',
        config.container,
        className
      )}
      title="VIP Member"
    >
      <Crown className={cn(config.icon, 'fill-current')} />
      {showLabel && <span>VIP</span>}
    </div>
  );
}
