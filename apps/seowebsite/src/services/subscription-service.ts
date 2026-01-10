import { Subscription } from '@/lib/platform/subscription-types';

export const getSubscriptionService = async () => {
    return {
        getUserSubscriptions: async (userId: string): Promise<Subscription[]> => [],
    };
};
