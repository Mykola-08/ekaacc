// Supabase-backed subscription service implementation

import {
  Subscription,
  SubscriptionTier,
  SubscriptionType,
  SubscriptionInterval,
  SubscriptionStatus,
  SubscriptionUsage,
  UserSubscriptionSummary,
  DEFAULT_SUBSCRIPTION_TIERS,
} from '@/lib/subscription-types';
import { ISubscriptionService } from './subscription-service';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { safeSupabaseAdminInsert, safeSupabaseAdminUpdate } from '@/lib/supabase-utils';
import { Database } from '@/types/supabase';

// Database types
type DbSubscription = Database['public']['Tables']['subscriptions']['Row'];
type DbSubscriptionTier = Database['public']['Tables']['subscription_tiers']['Row'];
type DbSubscriptionUsage = Database['public']['Tables']['subscription_usage']['Row'];

export class SupabaseSubscriptionService implements ISubscriptionService {
  
  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ? data.map(this.mapDbSubscriptionToApp) : [];
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      return [];
    }
  }

  async getActiveSubscription(userId: string, type: SubscriptionType): Promise<Subscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('type', type)
        .eq('status', 'active')
        .single();

      if (error) return null;
      return data ? this.mapDbSubscriptionToApp(data) : null;
    } catch (error) {
      console.error('Error fetching active subscription:', error);
      return null;
    }
  }

  async hasActiveSubscription(userId: string, type: SubscriptionType): Promise<boolean> {
    const subscription = await this.getActiveSubscription(userId, type);
    return subscription !== null;
  }

  async getUserSubscriptionSummary(userId: string): Promise<UserSubscriptionSummary> {
    try {
      const subscriptions = await this.getUserSubscriptions(userId);
      const loyaltySub = subscriptions.find(s => s.type === 'loyalty' && s.status === 'active');
      const vipSub = subscriptions.find(s => s.type === 'vip' && s.status === 'active');

      const tiers = await this.getSubscriptionTiers();
      const loyaltyTier = tiers.find(t => t.type === 'loyalty');
      const vipTier = tiers.find(t => t.type === 'vip');

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
        availableThemes: [],
        usageSummary: {
          loyalty: loyaltySub ? (await this.getSubscriptionUsage(loyaltySub.id) || undefined) : undefined,
          vip: vipSub ? (await this.getSubscriptionUsage(vipSub.id) || undefined) : undefined,
        },
      };
    } catch (error) {
      console.error('Error fetching subscription summary:', error);
      return {
        userId,
        hasLoyalty: false,
        hasVIP: false,
        hasBoth: false,
        totalBenefits: {},
        combinedBadges: [],
        availableThemes: [],
        usageSummary: {},
      };
    }
  }

  async createSubscription(
    userId: string,
    tierId: string,
    interval: SubscriptionInterval,
    stripeSubscriptionId?: string
  ): Promise<Subscription> {
    try {
      const tier = await this.getSubscriptionTier(tierId);
      if (!tier) throw new Error('Subscription tier not found');

      const now = new Date();
      const endDate = new Date(now);
      if (interval === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      const subscriptionData = {
        user_id: userId,
        type: tier.type,
        status: 'active' as const,
        interval,
        price: interval === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice,
        currency: tier.currency,
        stripe_subscription_id: stripeSubscriptionId,
        start_date: now.toISOString(),
        end_date: endDate.toISOString(),
        current_period_start: now.toISOString(),
        current_period_end: endDate.toISOString(),
        cancel_at_period_end: false,
      };

      const { data, error } = await safeSupabaseAdminInsert<DbSubscription>(
        'subscriptions',
        [subscriptionData]
      );

      if (error) throw error;
      
      // Initialize usage tracking
      await this.initializeUsage((data as any).id, userId, tier.type);
      
      console.log(`✅ Created ${tier.type} subscription for user ${userId}`);
      return this.mapDbSubscriptionToApp(data);
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string, immediate: boolean): Promise<Subscription> {
    try {
      const now = new Date().toISOString();
      
      const updateData = {
        status: 'cancelled' as const,
        cancelled_at: now,
        updated_at: now,
        ...(immediate ? { end_date: now } : { cancel_at_period_end: true }),
      };

      const { data, error } = await safeSupabaseAdminUpdate<DbSubscription>(
        'subscriptions',
        updateData,
        { id: subscriptionId }
      );

      if (error) throw error;
      
      console.log(`❌ Cancelled subscription ${subscriptionId} (immediate: ${immediate})`);
      return this.mapDbSubscriptionToApp(data);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  async renewSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const subscription = await this.getSubscriptionById(subscriptionId);
      if (!subscription) throw new Error('Subscription not found');

      const now = new Date();
      const endDate = new Date(subscription.endDate);
      
      if (subscription.interval === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      const updateData = {
        status: 'active' as const,
        current_period_start: now.toISOString(),
        current_period_end: endDate.toISOString(),
        end_date: endDate.toISOString(),
        cancel_at_period_end: false,
        cancelled_at: null,
        updated_at: now.toISOString(),
      };

      const { data, error } = await safeSupabaseAdminUpdate<DbSubscription>(
        'subscriptions',
        updateData,
        { id: subscriptionId }
      );

      if (error) throw error;
      
      console.log(`🔄 Renewed subscription ${subscriptionId}`);
      return this.mapDbSubscriptionToApp(data);
    } catch (error) {
      console.error('Error renewing subscription:', error);
      throw error;
    }
  }

  async getSubscriptionTiers(): Promise<SubscriptionTier[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // If no tiers in database, return defaults
      if (!data || data.length === 0) {
        return DEFAULT_SUBSCRIPTION_TIERS.map(t => ({
          ...t,
          id: `tier-${t.type}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
      }
      
      return data.map(this.mapDbTierToApp);
    } catch (error) {
      console.error('Error fetching subscription tiers:', error);
      return DEFAULT_SUBSCRIPTION_TIERS.map(t => ({
        ...t,
        id: `tier-${t.type}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }
  }

  async getSubscriptionTier(id: string): Promise<SubscriptionTier | null> {
    try {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return null;
      return data ? this.mapDbTierToApp(data) : null;
    } catch (error) {
      console.error('Error fetching subscription tier:', error);
      return null;
    }
  }

  async getSubscriptionUsage(subscriptionId: string): Promise<SubscriptionUsage | null> {
    try {
      const { data, error } = await supabase
        .from('subscription_usage')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .single();

      if (error) return null;
      return data ? this.mapDbUsageToApp(data) : null;
    } catch (error) {
      console.error('Error fetching subscription usage:', error);
      return null;
    }
  }

  async updateUsage(subscriptionId: string, usage: Partial<SubscriptionUsage>): Promise<void> {
    try {
      const existing = await this.getSubscriptionUsage(subscriptionId);
      
      const updateData = {
        ...usage,
        last_updated: new Date().toISOString(),
      };

      if (existing) {
        await safeSupabaseAdminUpdate<Database['public']['Tables']['subscription_usage']['Row']>(
          'subscription_usage', updateData, { subscription_id: subscriptionId }
        );
      } else {
        await safeSupabaseAdminInsert<Database['public']['Tables']['subscription_usage']['Row']>(
          'subscription_usage', {
            subscription_id: subscriptionId,
            ...updateData,
          }
        );
      }
      
      console.log(`📊 Updated usage for subscription ${subscriptionId}`);
    } catch (error) {
      console.error('Error updating usage:', error);
      throw error;
    }
  }

  async grantSubscription(
    userId: string,
    type: SubscriptionType,
    duration: number,
    adminId: string,
    reason?: string
  ): Promise<Subscription> {
    try {
      const tier = (await this.getSubscriptionTiers()).find(t => t.type === type);
      if (!tier) throw new Error('Tier not found');

      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + duration);

      const subscriptionData = {
        user_id: userId,
        type,
        status: 'active' as const,
        interval: 'monthly' as const,
        price: 0,
        currency: tier.currency,
        start_date: now.toISOString(),
        end_date: endDate.toISOString(),
        current_period_start: now.toISOString(),
        current_period_end: endDate.toISOString(),
        cancel_at_period_end: false,
        created_by: adminId,
        notes: reason,
      };

      const { data, error } = await safeSupabaseAdminInsert<DbSubscription>(
        'subscriptions',
        [subscriptionData]
      );

      if (error) throw error;
      
      console.log(`🎁 Admin granted ${type} subscription to user ${userId} for ${duration} days`);
      return this.mapDbSubscriptionToApp(data);
    } catch (error) {
      console.error('Error granting subscription:', error);
      throw error;
    }
  }

  async revokeSubscription(subscriptionId: string, adminId: string, reason?: string): Promise<void> {
    try {
      const updateData = {
        status: 'cancelled' as const,
        cancelled_at: new Date().toISOString(),
        end_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notes: `Revoked by admin: ${reason || 'No reason provided'}`,
      };

      const { error } = await safeSupabaseAdminUpdate(
        'subscriptions',
        updateData,
        { id: subscriptionId }
      );

      if (error) throw error;
      
      console.log(`🚫 Admin revoked subscription ${subscriptionId}`);
    } catch (error) {
      console.error('Error revoking subscription:', error);
      throw error;
    }
  }

  async getAllSubscriptions(status?: SubscriptionStatus): Promise<Subscription[]> {
    try {
      let query = supabase.from('subscriptions').select('*');
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data ? data.map(this.mapDbSubscriptionToApp) : [];
    } catch (error) {
      console.error('Error fetching all subscriptions:', error);
      return [];
    }
  }

  // Helper methods
  private async getSubscriptionById(id: string): Promise<Subscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return null;
      return data ? this.mapDbSubscriptionToApp(data) : null;
    } catch (error) {
      console.error('Error fetching subscription by ID:', error);
      return null;
    }
  }

  private async initializeUsage(subscriptionId: string, userId: string, type: SubscriptionType): Promise<void> {
    try {
      const tier = (await this.getSubscriptionTiers()).find(t => t.type === type);
      const now = new Date().toISOString();
      
      const usageData = {
        subscription_id: subscriptionId,
        user_id: userId,
        type,
        current_period_start: now,
        current_period_end: now, // Will be updated with actual period end
        loyalty_points_earned: 0,
        loyalty_points_spent: 0,
        loyalty_discount_used: 0,
        sessions_used: 0,
        sessions_remaining: tier?.features.unlimitedSessions ? 999 : tier?.features.sessionLimit || 0,
        themes_used: [],
        rewards_claimed: [],
        total_rewards_value: 0,
        last_updated: now,
      };

      await safeSupabaseAdminInsert('subscription_usage', [usageData]);
    } catch (error) {
      console.error('Error initializing usage:', error);
    }
  }

  private mapDbSubscriptionToApp(db: any): Subscription {
    return {
      id: db.id,
      userId: db.user_id,
      type: db.type as SubscriptionType,
      status: db.status as SubscriptionStatus,
      interval: db.interval as SubscriptionInterval,
      price: db.price,
      currency: db.currency,
      stripeSubscriptionId: db.stripe_subscription_id ?? undefined,
      startDate: db.start_date,
      endDate: db.end_date,
      currentPeriodStart: db.current_period_start || db.start_date,
      currentPeriodEnd: db.current_period_end || db.end_date,
      cancelAtPeriodEnd: db.cancel_at_period_end,
      cancelledAt: db.cancelled_at || undefined,
      createdAt: db.created_at,
      updatedAt: db.updated_at,
      createdBy: db.created_by ?? undefined,
      notes: db.notes ?? undefined,
    };
  }

  private mapDbTierToApp(db: DbSubscriptionTier): SubscriptionTier {
    const features = typeof db.features === 'string' ? JSON.parse(db.features) : db.features;
    
    return {
      id: db.id,
      type: db.type as SubscriptionType,
      name: db.name,
      displayName: db.name, // Use name as displayName
      description: db.description,
      monthlyPrice: db.monthly_price,
      yearlyPrice: db.yearly_price,
      currency: db.currency,
      benefits: features.benefits || [], // Extract benefits from features
      features,
      badge: (db.badge as any) ?? {
        text: 'TIER',
        bgColor: 'bg-primary',
        textColor: 'text-primary-foreground',
        icon: 'star',
        gradient: false,
        pulse: false,
      },
      color: features.color || 'zinc', // Default color
      isActive: db.is_active,
      order: features.order || 0, // Default order
      createdAt: db.created_at,
      updatedAt: db.updated_at,
    };
  }

  private mapDbUsageToApp(db: DbSubscriptionUsage): SubscriptionUsage {
    return {
      subscriptionId: db.subscription_id,
      userId: db.user_id,
      type: db.type as SubscriptionType,
      currentPeriodStart: db.current_period_start,
      currentPeriodEnd: db.current_period_end,
      loyaltyPointsEarned: db.loyalty_points_earned,
      loyaltyPointsSpent: db.loyalty_points_spent,
      loyaltyDiscountUsed: db.loyalty_discount_used,
      sessionsUsed: db.sessions_used,
      sessionsRemaining: db.sessions_remaining,
      themesUsed: db.themes_used || [],
      rewardsClaimed: Array.isArray(db.rewards_claimed) ? (db.rewards_claimed as any) : [],
      totalRewardsValue: db.total_rewards_value,
      lastUpdated: db.last_updated,
    };
  }
}