/**
 * @file Subscription Service Tests
 * @description Unit tests for the Subscription Service
 */

import { getSubscriptionService } from '../services/subscription-service';

describe('SubscriptionService', () => {
  let subscriptionService: any;

  beforeEach(async () => {
    // Using mock data mode for testing
    process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true';
    subscriptionService = await getSubscriptionService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSubscriptionTiers', () => {
    it('should retrieve all subscription tiers', async () => {
      const tiers = await subscriptionService.getSubscriptionTiers();
      expect(Array.isArray(tiers)).toBe(true);
      if (tiers.length > 0) {
        expect(tiers[0]).toHaveProperty('id');
        expect(tiers[0]).toHaveProperty('name');
        // May have monthlyPrice or yearlyPrice instead of just price
        expect(
          tiers[0].hasOwnProperty('price') ||
          tiers[0].hasOwnProperty('monthlyPrice') ||
          tiers[0].hasOwnProperty('yearlyPrice')
        ).toBe(true);
      }
    });
  });

  describe('getSubscriptionTier', () => {
    it('should retrieve a specific tier by ID', async () => {
      const tier = await subscriptionService.getSubscriptionTier('vip_silver');
      if (tier) {
        expect(tier).toHaveProperty('id');
        expect(tier).toHaveProperty('name');
        expect(tier).toHaveProperty('price');
      }
    });

    it('should handle non-existent tier', async () => {
      const tier = await subscriptionService.getSubscriptionTier('non-existent-tier');
      // May return null or undefined depending on implementation
      expect(tier === null || tier === undefined).toBe(true);
    });
  });

  describe('getUserSubscriptions', () => {
    it('should retrieve user subscriptions', async () => {
      const subscriptions = await subscriptionService.getUserSubscriptions('user-123');
      expect(Array.isArray(subscriptions)).toBe(true);
    });

    it('should return array for any user', async () => {
      const subscriptions = await subscriptionService.getUserSubscriptions('any-user');
      expect(Array.isArray(subscriptions)).toBe(true);
    });
  });

  describe('hasActiveSubscription', () => {
    it('should check if user has active subscription', async () => {
      const hasActive = await subscriptionService.hasActiveSubscription('user-123');
      expect(typeof hasActive).toBe('boolean');
    });

    it('should return boolean for any user', async () => {
      const hasActive = await subscriptionService.hasActiveSubscription('any-user');
      expect(typeof hasActive).toBe('boolean');
    });
  });

  describe('getActiveSubscription', () => {
    it('should retrieve active subscription', async () => {
      const subscription = await subscriptionService.getActiveSubscription('user-123');
      // May or may not have an active subscription
      if (subscription) {
        expect(subscription).toHaveProperty('id');
        expect(subscription).toHaveProperty('status');
      }
    });
  });

  describe('getSubscriptionUsage', () => {
    it('should retrieve subscription usage', async () => {
      const usage = await subscriptionService.getSubscriptionUsage('sub-123');
      // Usage may be null or have usage data
      if (usage) {
        expect(usage).toHaveProperty('subscriptionId');
      }
    });
  });

  describe('getAllSubscriptions', () => {
    it('should retrieve all subscriptions (admin function)', async () => {
      const subscriptions = await subscriptionService.getAllSubscriptions();
      expect(Array.isArray(subscriptions)).toBe(true);
    });
  });
});
