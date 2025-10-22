/**
 * Firebase/Firestore implementation of subscription service
 * Uses the Firestore helper functions for all database operations
 */

import {
  Subscription,
  SubscriptionTier,
  SubscriptionType,
  SubscriptionInterval,
  SubscriptionUsage,
  UserSubscriptionSummary,
  DEFAULT_SUBSCRIPTION_TIERS,
} from '@/lib/subscription-types';
import {
  createFirestoreSubscription,
  getFirestoreSubscription,
  getUserFirestoreSubscriptions,
  updateFirestoreSubscription,
  deleteFirestoreSubscription,
  createFirestoreUsage,
  getFirestoreUsage,
  updateFirestoreUsage,
  getAllActiveSubscriptions,
  getSubscriptionsByType,
} from '@/firebase/firestore/subscriptions';
import type { ISubscriptionService } from '@/services/subscription-service';

export class FirebaseSubscriptionService implements ISubscriptionService {
  private tiers: SubscriptionTier[] = DEFAULT_SUBSCRIPTION_TIERS.map((tier, index) => ({
    ...tier,
    id: tier.name.toLowerCase().replace(/\s+/g, '-'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  async getAllSubscriptions(): Promise<Subscription[]> {
    return await getAllActiveSubscriptions();
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return await getUserFirestoreSubscriptions(userId);
  }

  async getActiveSubscription(userId: string, type: SubscriptionType): Promise<Subscription | null> {
    const subscriptions = await this.getUserSubscriptions(userId);
    return subscriptions.find(s => s.type === type && s.status === 'active') || null;
  }

  async hasActiveSubscription(userId: string, type: SubscriptionType): Promise<boolean> {
    const subscription = await this.getActiveSubscription(userId, type);
    return subscription !== null;
  }

  async getUserSubscriptionSummary(userId: string): Promise<UserSubscriptionSummary> {
    const subscriptions = await this.getUserSubscriptions(userId);
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
    
    const loyaltySub = activeSubscriptions.find(s => s.type === 'loyalty');
    const vipSub = activeSubscriptions.find(s => s.type === 'vip');

    return {
      userId,
      hasLoyalty: !!loyaltySub,
      hasVIP: !!vipSub,
      hasBoth: !!loyaltySub && !!vipSub,
      loyaltySubscription: loyaltySub,
      vipSubscription: vipSub,
      totalBenefits: {}, // TODO: Calculate combined benefits
      combinedBadges: [], // TODO: Generate badges
      availableThemes: [], // TODO: Get available themes
      usageSummary: {
        loyalty: loyaltySub ? (await this.getSubscriptionUsage(loyaltySub.id) || undefined) : undefined,
        vip: vipSub ? (await this.getSubscriptionUsage(vipSub.id) || undefined) : undefined,
      },
    };
  }

  async createSubscription(
    userId: string,
    tierId: string,
    interval: SubscriptionInterval,
    stripeSubscriptionId?: string
  ): Promise<Subscription> {
    const tier = await this.getSubscriptionTier(tierId);
    if (!tier) {
      throw new Error('Tier not found');
    }

    const now = new Date();
    const endDate = new Date(now.getTime() + (interval === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000);
    const subscription: Subscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: tier.type,
      status: 'active',
      interval,
      price: interval === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice,
      currency: 'EUR',
      stripeCustomerId: undefined,
      stripeSubscriptionId,
      stripePriceId: undefined,
      startDate: now,
      endDate: endDate,
      currentPeriodStart: now,
      currentPeriodEnd: endDate,
      cancelAtPeriodEnd: false,
      createdAt: now,
      updatedAt: now,
    };

    await createFirestoreSubscription(subscription);

    // Initialize usage tracking
    const usage: SubscriptionUsage = {
      subscriptionId: subscription.id,
      userId,
      type: tier.type,
      currentPeriodStart: now,
      currentPeriodEnd: endDate,
      loyaltyPointsEarned: 0,
      loyaltyPointsSpent: 0,
      loyaltyDiscountUsed: 0,
      themesUsed: [],
      sessionsUsed: 0,
      reportsGenerated: 0,
      lastUpdated: now,
    };
    await createFirestoreUsage(usage);

    return subscription;
  }

  async cancelSubscription(subscriptionId: string, immediate: boolean): Promise<Subscription> {
    const subscription = await getFirestoreSubscription(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const updates: Partial<Subscription> = {
      status: immediate ? 'cancelled' : subscription.status,
      cancelAtPeriodEnd: !immediate,
      cancelledAt: immediate ? new Date() : undefined,
    };

    await updateFirestoreSubscription(subscriptionId, updates);

    return { ...subscription, ...updates };
  }

  async renewSubscription(subscriptionId: string): Promise<Subscription> {
    const subscription = await getFirestoreSubscription(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const now = new Date();
    const updates: Partial<Subscription> = {
      status: 'active',
      cancelAtPeriodEnd: false,
      cancelledAt: undefined,
      currentPeriodStart: now,
      currentPeriodEnd: new Date(
        now.getTime() + 
        (subscription.interval === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
      ),
    };

    await updateFirestoreSubscription(subscriptionId, updates);

    return { ...subscription, ...updates };
  }

  async getSubscriptionTiers(): Promise<SubscriptionTier[]> {
    return this.tiers;
  }

  async getSubscriptionTier(id: string): Promise<SubscriptionTier | null> {
    return this.tiers.find(t => t.id === id) || null;
  }

  async getSubscriptionUsage(subscriptionId: string): Promise<SubscriptionUsage | null> {
    return await getFirestoreUsage(subscriptionId);
  }

  async updateUsage(subscriptionId: string, usage: Partial<SubscriptionUsage>): Promise<void> {
    await updateFirestoreUsage(subscriptionId, usage);
  }

  async grantSubscription(
    userId: string,
    type: SubscriptionType,
    durationMonths: number
  ): Promise<Subscription> {
    const tier = this.tiers.find(t => t.type === type);
    if (!tier || !tier.id) {
      throw new Error('Tier not found');
    }

    return await this.createSubscription(
      userId,
      tier.id,
      durationMonths === 12 ? 'yearly' : 'monthly'
    );
  }

  async revokeSubscription(subscriptionId: string): Promise<void> {
    await this.cancelSubscription(subscriptionId, true);
  }

  // Admin methods
  async getAllActiveSubscriptions(limitCount?: number): Promise<Subscription[]> {
    return await getAllActiveSubscriptions(limitCount);
  }

  async getSubscriptionsByType(type: SubscriptionType, limitCount?: number): Promise<Subscription[]> {
    return await getSubscriptionsByType(type, limitCount);
  }
}
