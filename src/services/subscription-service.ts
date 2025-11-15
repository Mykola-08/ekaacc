// Subscription management service with Stripe integration

import {
  Subscription,
  SubscriptionTier,
  SubscriptionType,
  SubscriptionInterval,
  SubscriptionStatus,
  SubscriptionUsage,
  UserSubscriptionSummary,
  SubscriptionAction,
  DEFAULT_SUBSCRIPTION_TIERS,
  Theme,
  UserThemePreference,
  DEFAULT_THEMES,
} from '@/lib/subscription-types';
// Firebase removed; integrate Supabase-backed subscription service here

// ============================================================================
// Service Interface
// ============================================================================

export interface ISubscriptionService {
  // Subscription management
  getUserSubscriptions(userId: string): Promise<Subscription[]>;
  getActiveSubscription(userId: string, type: SubscriptionType): Promise<Subscription | null>;
  hasActiveSubscription(userId: string, type: SubscriptionType): Promise<boolean>;
  getUserSubscriptionSummary(userId: string): Promise<UserSubscriptionSummary>;
  
  // Subscription CRUD
  createSubscription(
    userId: string,
    tierId: string,
    interval: SubscriptionInterval,
    stripeSubscriptionId?: string
  ): Promise<Subscription>;
  cancelSubscription(subscriptionId: string, immediate: boolean): Promise<Subscription>;
  renewSubscription(subscriptionId: string): Promise<Subscription>;
  
  // Tiers
  getSubscriptionTiers(): Promise<SubscriptionTier[]>;
  getSubscriptionTier(id: string): Promise<SubscriptionTier | null>;
  
  // Usage tracking
  getSubscriptionUsage(subscriptionId: string): Promise<SubscriptionUsage | null>;
  updateUsage(subscriptionId: string, usage: Partial<SubscriptionUsage>): Promise<void>;
  
  // Admin operations
  grantSubscription(
    userId: string,
    type: SubscriptionType,
    duration: number,
    adminId: string,
    reason?: string
  ): Promise<Subscription>;
  revokeSubscription(subscriptionId: string, adminId: string, reason?: string): Promise<void>;
  getAllSubscriptions(status?: SubscriptionStatus): Promise<Subscription[]>;
}

// ============================================================================
// Mock Implementation
// ============================================================================

export class MockSubscriptionService implements ISubscriptionService {
  private subscriptions: Map<string, Subscription> = new Map();
  private tiers: SubscriptionTier[] = [];
  private usageData: Map<string, SubscriptionUsage> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize tiers
    this.tiers = DEFAULT_SUBSCRIPTION_TIERS.map((tier, index) => ({
      ...tier,
      id: `tier-${tier.type}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Create sample subscriptions
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const loyaltySub: Subscription = {
      id: 'sub-loyalty-1',
      userId: 'test-user',
      type: 'loyalty',
      status: 'active',
      interval: 'monthly',
      price: 9.99,
      currency: 'EUR',
      stripeSubscriptionId: 'sub_mock_loyal',
      startDate: now.toISOString(),
      endDate: nextMonth.toISOString(),
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: nextMonth.toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    this.subscriptions.set(loyaltySub.id, loyaltySub);

    // Create usage tracking
    const loyaltyUsage: SubscriptionUsage = {
      subscriptionId: loyaltySub.id,
      userId: 'test-user',
      type: 'loyalty',
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: nextMonth.toISOString(),
      loyaltyPointsEarned: 250,
      loyaltyPointsSpent: 100,
      loyaltyDiscountUsed: 15.5,
      themesUsed: ['default', 'ocean'],
      currentTheme: 'ocean',
      rewardsClaimed: [],
      totalRewardsValue: 0,
      lastUpdated: now.toISOString(),
    };

    this.usageData.set(loyaltySub.id, loyaltyUsage);

    console.log('📦 Mock Subscription Service initialized with sample data');
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(sub => sub.userId === userId);
  }

  async getActiveSubscription(userId: string, type: SubscriptionType): Promise<Subscription | null> {
    const subscription = Array.from(this.subscriptions.values()).find(
      sub => sub.userId === userId && sub.type === type && sub.status === 'active'
    );
    return subscription || null;
  }

  async hasActiveSubscription(userId: string, type: SubscriptionType): Promise<boolean> {
    const sub = await this.getActiveSubscription(userId, type);
    return sub !== null;
  }

  async getUserSubscriptionSummary(userId: string): Promise<UserSubscriptionSummary> {
    const userSubs = await this.getUserSubscriptions(userId);
    const loyaltySub = userSubs.find(s => s.type === 'loyalty' && s.status === 'active');
    const vipSub = userSubs.find(s => s.type === 'vip' && s.status === 'active');

    const loyaltyTier = this.tiers.find(t => t.type === 'loyalty');
    const vipTier = this.tiers.find(t => t.type === 'vip');

    // Combine features from both subscriptions
    const totalBenefits = {
      ...loyaltyTier?.features,
      ...vipTier?.features,
      loyaltyPointsMultiplier: Math.max(
        loyaltyTier?.features.loyaltyPointsMultiplier || 1,
        vipTier?.features.loyaltyPointsMultiplier || 1
      ),
    };

    const badges = [];
    if (loyaltySub && loyaltyTier) badges.push(loyaltyTier.badge);
    if (vipSub && vipTier) badges.push(vipTier.badge);

    return {
      userId,
      hasLoyalty: !!loyaltySub,
      hasVIP: !!vipSub,
      hasBoth: !!loyaltySub && !!vipSub,
      loyaltySubscription: loyaltySub,
      vipSubscription: vipSub,
      totalBenefits,
      combinedBadges: badges,
      availableThemes: [], // Will be populated by theme service
      usageSummary: {
        loyalty: loyaltySub ? this.usageData.get(loyaltySub.id) : undefined,
        vip: vipSub ? this.usageData.get(vipSub.id) : undefined,
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
    if (!tier) throw new Error('Subscription tier not found');

    const now = new Date();
    const endDate = new Date(now);
    if (interval === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription: Subscription = {
      id: `sub-${Date.now()}`,
      userId,
      type: tier.type,
      status: 'active',
      interval,
      price: interval === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice,
      currency: tier.currency,
      stripeSubscriptionId,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: endDate.toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    this.subscriptions.set(subscription.id, subscription);

    // Initialize usage tracking
    const usage: SubscriptionUsage = {
      subscriptionId: subscription.id,
      userId,
      type: tier.type,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: endDate.toISOString(),
      loyaltyPointsEarned: 0,
      loyaltyPointsSpent: 0,
      loyaltyDiscountUsed: 0,
      sessionsUsed: 0,
      sessionsRemaining: tier.features.unlimitedSessions ? 999 : tier.features.sessionLimit || 0,
      themesUsed: [],
      rewardsClaimed: [],
      totalRewardsValue: 0,
      lastUpdated: now.toISOString(),
    };

    this.usageData.set(subscription.id, usage);

    console.log(`✅ Created ${tier.type} subscription for user ${userId}`);
    return subscription;
  }

  async cancelSubscription(subscriptionId: string, immediate: boolean): Promise<Subscription> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) throw new Error('Subscription not found');

    subscription.cancelledAt = new Date().toISOString();
    subscription.updatedAt = new Date().toISOString();

    if (immediate) {
      subscription.status = 'cancelled';
      subscription.endDate = new Date().toISOString();
    } else {
      subscription.cancelAtPeriodEnd = true;
    }

    this.subscriptions.set(subscriptionId, subscription);
    console.log(`❌ Cancelled subscription ${subscriptionId} (immediate: ${immediate})`);
    return subscription;
  }

  async renewSubscription(subscriptionId: string): Promise<Subscription> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) throw new Error('Subscription not found');

    const now = new Date();
    const endDate = new Date(subscription.endDate as string);
    
    if (subscription.interval === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    subscription.status = 'active';
    subscription.currentPeriodStart = now.toISOString();
    subscription.currentPeriodEnd = endDate.toISOString();
    subscription.endDate = endDate.toISOString();
    subscription.cancelAtPeriodEnd = false;
    subscription.cancelledAt = undefined;
    subscription.updatedAt = now.toISOString();

    this.subscriptions.set(subscriptionId, subscription);
    console.log(`🔄 Renewed subscription ${subscriptionId}`);
    return subscription;
  }

  async getSubscriptionTiers(): Promise<SubscriptionTier[]> {
    return this.tiers.filter(t => t.isActive);
  }

  async getSubscriptionTier(id: string): Promise<SubscriptionTier | null> {
    return this.tiers.find(t => t.id === id) || null;
  }

  async getSubscriptionUsage(subscriptionId: string): Promise<SubscriptionUsage | null> {
    return this.usageData.get(subscriptionId) || null;
  }

  async updateUsage(subscriptionId: string, usage: Partial<SubscriptionUsage>): Promise<void> {
    const existing = this.usageData.get(subscriptionId);
    if (!existing) throw new Error('Usage data not found');

    const updated = {
      ...existing,
      ...usage,
      lastUpdated: new Date().toISOString(),
    };

    this.usageData.set(subscriptionId, updated);
    console.log(`📊 Updated usage for subscription ${subscriptionId}`);
  }

  async grantSubscription(
    userId: string,
    type: SubscriptionType,
    duration: number,
    adminId: string,
    reason?: string
  ): Promise<Subscription> {
    const tier = this.tiers.find(t => t.type === type);
    if (!tier) throw new Error('Tier not found');

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + duration);

    const subscription: Subscription = {
      id: `sub-admin-${Date.now()}`,
      userId,
      type,
      status: 'active',
      interval: 'monthly',
      price: 0,
      currency: 'EUR',
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: endDate.toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      createdBy: adminId,
      notes: reason,
    };

    this.subscriptions.set(subscription.id, subscription);
    console.log(`🎁 Admin granted ${type} subscription to user ${userId} for ${duration} days`);
    return subscription;
  }

  async revokeSubscription(subscriptionId: string, adminId: string, reason?: string): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) throw new Error('Subscription not found');

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date().toISOString();
    subscription.endDate = new Date().toISOString();
    subscription.updatedAt = new Date().toISOString();
    subscription.notes = `Revoked by admin: ${reason || 'No reason provided'}`;

    this.subscriptions.set(subscriptionId, subscription);
    console.log(`🚫 Admin revoked subscription ${subscriptionId}`);
  }

  async getAllSubscriptions(status?: SubscriptionStatus): Promise<Subscription[]> {
    let subs = Array.from(this.subscriptions.values());
    if (status) {
      subs = subs.filter(s => s.status === status);
    }
    return subs;
  }
}

// ============================================================================
// Firestore Implementation (requires Cloud Functions)
// ============================================================================

export class FirestoreSubscriptionService implements ISubscriptionService {
  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async getActiveSubscription(userId: string, type: SubscriptionType): Promise<Subscription | null> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async hasActiveSubscription(userId: string, type: SubscriptionType): Promise<boolean> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async getUserSubscriptionSummary(userId: string): Promise<UserSubscriptionSummary> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async createSubscription(): Promise<Subscription> {
    throw new Error('Use Stripe Checkout to create subscriptions');
  }

  async cancelSubscription(subscriptionId: string, immediate: boolean): Promise<Subscription> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async renewSubscription(subscriptionId: string): Promise<Subscription> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async getSubscriptionTiers(): Promise<SubscriptionTier[]> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async getSubscriptionTier(id: string): Promise<SubscriptionTier | null> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async getSubscriptionUsage(subscriptionId: string): Promise<SubscriptionUsage | null> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async updateUsage(subscriptionId: string, usage: Partial<SubscriptionUsage>): Promise<void> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async grantSubscription(): Promise<Subscription> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async revokeSubscription(subscriptionId: string, adminId: string, reason?: string): Promise<void> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async getAllSubscriptions(status?: SubscriptionStatus): Promise<Subscription[]> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }
}

// ============================================================================
// Service Singleton
// ============================================================================

let subscriptionServiceInstance: ISubscriptionService | null = null;

export async function getSubscriptionService(): Promise<ISubscriptionService> {
  if (!subscriptionServiceInstance) {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
    subscriptionServiceInstance = useMock
      ? new MockSubscriptionService()
      : new FirestoreSubscriptionService();
  }
  return subscriptionServiceInstance as any;
}
