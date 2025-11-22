export type SubscriptionType = 'loyal' | 'vip';

const subscriptionManager = {
  async hasActiveSubscription(_userId: string, _type: SubscriptionType): Promise<boolean> {
    return false;
  },
  async getAvailablePlans(): Promise<Array<{ id: string; type: SubscriptionType; tier: string; name: string }>> {
    return [
      { id: 'loyal-plus', type: 'loyal', tier: 'Plus', name: 'Loyal Plus' },
      { id: 'vip-gold', type: 'vip', tier: 'Gold', name: 'VIP Gold' },
    ];
  },
};

export default subscriptionManager;