'use client';

import { Badge } from '@/components/keep';
import { Crown, Gem, Award, Star } from 'lucide-react';
;
import { cn } from '@/lib/utils';
import type { VipTier } from '@/lib/types';

interface VipBadgeProps {
  tier: VipTier;
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
}

const tierConfig = {
  Bronze: {
    icon: Award,
    color: 'bg-gradient-to-r from-amber-700 to-amber-500',
    textColor: 'text-amber-100',
    borderColor: 'border-amber-600',
  },
  Silver: {
    icon: Star,
    color: 'bg-gradient-to-r from-gray-400 to-gray-300',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-400',
  },
  Gold: {
    icon: Crown,
    color: 'bg-gradient-to-r from-yellow-500 to-yellow-300',
    textColor: 'text-yellow-900',
    borderColor: 'border-yellow-500',
  },
  Platinum: {
    icon: Gem,
    color: 'bg-gradient-to-r from-cyan-400 to-blue-400',
    textColor: 'text-white',
    borderColor: 'border-cyan-400',
  },
  Diamond: {
    icon: Gem,
    color: 'bg-gradient-to-r from-purple-600 to-pink-500',
    textColor: 'text-white',
    borderColor: 'border-purple-500',
  },
};

export function VipBadge({ tier, variant = 'default', className }: VipBadgeProps) {
  const config = tierConfig[tier];
  const Icon = config.icon;

  if (variant === 'icon-only') {
    return (
      <div className={cn('inline-flex items-center justify-center', className)}>
        <Icon className={cn('h-4 w-4', config.textColor)} />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'inline-flex items-center gap-1 border-2',
          config.color,
          config.textColor,
          config.borderColor,
          className
        )}
      >
        <Icon className="h-3 w-3" />
        <span className="text-xs font-semibold">{tier}</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 border-2',
        config.color,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-semibold">{tier} VIP</span>
    </Badge>
  );
}
