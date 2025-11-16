import React from 'react';
import { cn } from '@/lib/utils';
import { Crown, Star, Award } from 'lucide-react';
import type { VIPTier, LoyaltyTier } from '@/lib/subscription-types';

export interface TierBadgeProps {
  tierType: 'vip' | 'loyalty';
  tierName: VIPTier | LoyaltyTier;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  animated?: boolean;
}

const tierConfig = {
  vip: {
    silver: {
      icon: Crown,
      color: 'text-gray-400',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-300',
      gradient: 'from-gray-400 to-gray-600',
      label: 'VIP Silver'
    },
    gold: {
      icon: Crown,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-400',
      gradient: 'from-yellow-400 to-yellow-600',
      label: 'VIP Gold'
    },
    platinum: {
      icon: Crown,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-400',
      gradient: 'from-purple-400 to-purple-600',
      label: 'VIP Platinum'
    }
  },
  loyalty: {
    member: {
      icon: Star,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-400',
      gradient: 'from-blue-400 to-blue-600',
      label: 'Loyalty Member'
    },
    elite: {
      icon: Award,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      gradient: 'from-red-400 to-red-600',
      label: 'Loyalty Elite'
    }
  }
};

const sizeConfig = {
  sm: {
    icon: 'h-3 w-3',
    text: 'text-xs',
    padding: 'px-2 py-1',
    gap: 'gap-1'
  },
  md: {
    icon: 'h-4 w-4',
    text: 'text-sm',
    padding: 'px-3 py-1.5',
    gap: 'gap-1.5'
  },
  lg: {
    icon: 'h-5 w-5',
    text: 'text-base',
    padding: 'px-4 py-2',
    gap: 'gap-2'
  }
};

export function TierBadge({
  tierType,
  tierName,
  size = 'md',
  showIcon = true,
  className,
  animated = false
}: TierBadgeProps) {
  const config = tierConfig[tierType][tierName as VIPTier | LoyaltyTier];
  const sizeClasses = sizeConfig[size];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200',
        config.bgColor,
        config.borderColor,
        sizeClasses.padding,
        sizeClasses.gap,
        sizeClasses.text,
        config.color,
        'border',
        animated && 'hover:scale-105 hover:shadow-md',
        className
      )}
    >
      {showIcon && (
        <IconComponent
          className={cn(
            sizeClasses.icon,
            config.color,
            animated && 'animate-pulse'
          )}
        />
      )}
      <span className="font-semibold">{config.label}</span>
    </div>
  );
}

export function TierBadgeGradient({
  tierType,
  tierName,
  size = 'md',
  showIcon = true,
  className,
  animated = true
}: TierBadgeProps) {
  const config = tierConfig[tierType][tierName as VIPTier | LoyaltyTier];
  const sizeClasses = sizeConfig[size];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full font-bold text-white shadow-lg transition-all duration-300',
        'bg-gradient-to-r',
        config.gradient,
        sizeClasses.padding,
        sizeClasses.gap,
        sizeClasses.text,
        animated && 'hover:scale-105 hover:shadow-xl animate-pulse',
        className
      )}
    >
      {showIcon && (
        <IconComponent
          className={cn(
            sizeClasses.icon,
            'text-white',
            animated && 'animate-bounce'
          )}
        />
      )}
      <span>{config.label}</span>
    </div>
  );
}

export function TierBadgeMinimal({
  tierType,
  tierName,
  size = 'sm',
  className,
  animated = false
}: Omit<TierBadgeProps, 'showIcon'>) {
  const config = tierConfig[tierType][tierName as VIPTier | LoyaltyTier];
  const sizeClasses = sizeConfig[size];

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        config.bgColor,
        config.borderColor,
        sizeClasses.padding,
        'border',
        config.color,
        animated && 'hover:scale-105 transition-transform duration-200',
        className
      )}
    >
      <span className={cn('font-medium', sizeClasses.text)}>
        {tierName.charAt(0).toUpperCase() + tierName.slice(1)}
      </span>
    </div>
  );
}

export function TierBadgeWithProgress({
  tierType,
  tierName,
  progress,
  size = 'md',
  showIcon = true,
  className
}: TierBadgeProps & { progress: number }) {
  const config = tierConfig[tierType][tierName as VIPTier | LoyaltyTier];
  const sizeClasses = sizeConfig[size];
  const IconComponent = config.icon;

  return (
    <div className={cn('relative inline-flex', className)}>
      <div
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium',
          config.bgColor,
          config.borderColor,
          sizeClasses.padding,
          sizeClasses.gap,
          sizeClasses.text,
          config.color,
          'border'
        )}
      >
        {showIcon && <IconComponent className={cn(sizeClasses.icon, config.color)} />}
        <span className="font-semibold">{config.label}</span>
      </div>
      
      {/* Progress indicator */}
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300',
            'bg-gradient-to-r',
            config.gradient
          )}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

export function TierBadgeGroup({
  tiers,
  size = 'md',
  showIcon = true,
  className
}: {
  tiers: Array<{ tierType: 'vip' | 'loyalty'; tierName: VIPTier | LoyaltyTier }>;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}) {
  if (!tiers || tiers.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tiers.map((tier, index) => (
        <TierBadge
          key={`${tier.tierType}-${tier.tierName}-${index}`}
          tierType={tier.tierType}
          tierName={tier.tierName}
          size={size}
          showIcon={showIcon}
        />
      ))}
    </div>
  );
}