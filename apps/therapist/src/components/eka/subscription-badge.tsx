'use client';

import type { SubscriptionType } from '@/lib/subscription-types';
import { LoyalBadge } from '@/components/eka/loyal-badge';
import { VipSubscriptionBadge } from '@/components/eka/vip-subscription-badge';

interface SubscriptionBadgeProps {
  type: SubscriptionType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * Main subscription badge component that renders the appropriate badge
 * based on subscription type (loyalty or vip)
 */
export function SubscriptionBadge({ 
  type, 
  size = 'md', 
  showLabel = true,
  className = '' 
}: SubscriptionBadgeProps) {
  if (type === 'loyalty') {
    return <LoyalBadge size={size} showLabel={showLabel} className={className} />;
  }
  
  if (type === 'vip') {
    return <VipSubscriptionBadge size={size} showLabel={showLabel} className={className} />;
  }
  
  return null;
}
