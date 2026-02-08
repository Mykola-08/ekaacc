import React from 'react';
import { cn } from '@/lib/platform/utils/css-utils';
import { Crown, Star, Award } from 'lucide-react';
import type { VIPTier, LoyaltyTier } from '@/lib/platform/types/subscription-types';

export interface TierBadgeProps {
  tierType: 'vip' | 'loyalty';
  tierName: VIPTier | LoyaltyTier | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  animated?: boolean;
}

const tierConfig = {
  vip: {
    silver: {
      icon: Crown,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      borderColor: 'border-border',
      gradient: 'from-muted to-muted/80',
      label: 'VIP Silver',
    },
    gold: {
      icon: Crown,
      color: 'text-foreground',
      bgColor: 'bg-secondary',
      borderColor: 'border-primary/20',
      gradient: 'from-secondary to-secondary/80',
      label: 'VIP Gold',
    },
    platinum: {
      icon: Crown,
      color: 'text-primary-foreground',
      bgColor: 'bg-primary',
      borderColor: 'border-primary',
      gradient: 'from-primary to-primary/90',
      label: 'VIP Platinum',
    },
  },
  loyalty: {
    member: {
      icon: Star,
      color: 'text-muted-foreground',
      bgColor: 'bg-background',
      borderColor: 'border-border',
      gradient: 'from-background to-muted',
      label: 'Loyalty Member',
    },
    elite: {
      icon: Award,
      color: 'text-foreground',
      bgColor: 'bg-muted',
      borderColor: 'border-foreground',
      gradient: 'from-muted to-muted/80',
      label: 'Loyalty Elite',
    },
  },
};

const sizeConfig = {
  sm: {
    icon: 'h-3 w-3',
    text: 'text-xs',
    padding: 'px-2 py-1',
    gap: 'gap-1',
  },
  md: {
    icon: 'h-4 w-4',
    text: 'text-sm',
    padding: 'px-3 py-1.5',
    gap: 'gap-1.5',
  },
  lg: {
    icon: 'h-5 w-5',
    text: 'text-base',
    padding: 'px-4 py-2',
    gap: 'gap-2',
  },
};

export function TierBadge({
  tierType,
  tierName,
  size = 'md',
  showIcon = true,
  className,
  animated = false,
}: TierBadgeProps) {
  const config =
    tierType === 'vip'
      ? tierConfig.vip[tierName as VIPTier]
      : tierConfig.loyalty[tierName as LoyaltyTier];
  const sizeClasses = sizeConfig[size];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'hover:bg-muted/80 inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 hover:shadow-sm',
        config.bgColor,
        config.borderColor,
        sizeClasses.padding,
        sizeClasses.gap,
        sizeClasses.text,
        config.color,
        'border',
        animated && 'hover:bg-muted/90 hover:shadow-md',
        className
      )}
    >
      {showIcon && (
        <IconComponent
          className={cn(sizeClasses.icon, config.color, animated && 'animate-pulse')}
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
  animated = true,
}: TierBadgeProps) {
  const config = (tierConfig[tierType as 'vip' | 'loyalty'] as any)[
    tierName as VIPTier | LoyaltyTier
  ];
  const sizeClasses = sizeConfig[size];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl',
        'bg-linear-to-r',
        config.gradient,
        sizeClasses.padding,
        sizeClasses.gap,
        sizeClasses.text,
        animated && 'hover:bg-primary/90 animate-pulse hover:shadow-2xl',
        className
      )}
    >
      {showIcon && (
        <IconComponent
          className={cn(sizeClasses.icon, 'text-white', animated && 'animate-bounce')}
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
  animated = false,
}: Omit<TierBadgeProps, 'showIcon'>) {
  const config = (tierConfig[tierType as 'vip' | 'loyalty'] as any)[
    tierName as VIPTier | LoyaltyTier
  ];
  const sizeClasses = sizeConfig[size];

  return (
    <div
      className={cn(
        'hover:bg-muted/80 inline-flex items-center justify-center rounded-full transition-colors',
        config.bgColor,
        config.borderColor,
        sizeClasses.padding,
        'border',
        config.color,
        animated && 'hover:bg-muted/90 duration-200',
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
  className,
}: TierBadgeProps & { progress: number }) {
  const config = (tierConfig[tierType as 'vip' | 'loyalty'] as any)[
    tierName as VIPTier | LoyaltyTier
  ];
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
      <div className="absolute right-0 -bottom-1 left-0 h-1 overflow-hidden rounded-full bg-gray-200">
        <div
          className={cn('h-full transition-all duration-300', 'bg-linear-to-r', config.gradient)}
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
  className,
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
