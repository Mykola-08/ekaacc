import { Subscription } from '@/lib/platform/subscription-types';

export const getSubscriptionService = async () => {
    return {
        getUserSubscriptions: async (userId: string): Promise<Subscription[]> => [],
        getSubscriptionTier: async (tierId: string) => ({ id: tierId, name: 'Tier Name' }),
    };
};
