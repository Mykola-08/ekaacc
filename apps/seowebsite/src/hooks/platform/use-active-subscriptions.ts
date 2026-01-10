'use client';

import { useEffect, useState } from 'react';
import { getSubscriptionService } from '@/services/subscription-service';
import type { Subscription, SubscriptionType } from '@/lib/platform/subscription-types';

interface UseActiveSubscriptionsResult {
  subscriptions: Subscription[];
  hasLoyalty: boolean;
  hasVip: boolean;
  activeTypes: SubscriptionType[];
  loading: boolean;
}

/**
 * Hook to fetch and track user's active subscriptions
 * Returns subscription status for loyalty and VIP memberships
 */
export function useActiveSubscriptions(userId: string | undefined): UseActiveSubscriptionsResult {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubscriptions = async () => {
      if (!userId) {
        setSubscriptions([]);
        setLoading(false);
        return;
      }

      try {
        const service = await getSubscriptionService();
        const userSubs = await service.getUserSubscriptions(userId);
        const activeSubs = userSubs.filter(sub => sub.status === 'active');
        setSubscriptions(activeSubs);
      } catch (error) {
        console.error('Failed to load subscriptions:', error);
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptions();
  }, [userId]);

  const hasLoyalty = subscriptions.some(sub => sub.type === 'loyalty');
  const hasVip = subscriptions.some(sub => sub.type === 'vip');
  const activeTypes = subscriptions.map(sub => sub.type);

  return {
    subscriptions,
    hasLoyalty,
    hasVip,
    activeTypes,
    loading,
  };
}
