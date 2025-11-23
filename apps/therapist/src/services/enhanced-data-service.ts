/**
 * Enhanced Data Access Layer (DAL) with comprehensive error handling, logging, and transaction support
 * This service extends the existing data service with advanced features for the new tables
 */

import { supabase, supabaseAdmin } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import type { IDataService } from './data-service'
import { supabaseDataService } from './supabase-data-service'
import { logger } from '@/lib/logging'
import { 
  safeSupabaseQuery, 
  safeSupabaseInsert, 
  safeSupabaseUpdate, 
  safeSupabaseDelete,
  safeSupabaseSelectSingle,
  safeSupabaseQueryBuilder
} from '@/lib/supabase-utils'

// Enhanced database types
export type DbService = Database['public']['Tables']['services']['Row']
export type DbUserPreference = Database['public']['Tables']['user_preferences']['Row']
export type DbSubscription = Database['public']['Tables']['subscriptions']['Row']
export type DbSubscriptionTier = Database['public']['Tables']['subscription_tiers']['Row']
export type DbSubscriptionUsage = Database['public']['Tables']['subscription_usage']['Row']
export type DbCommunityPost = Database['public']['Tables']['community_posts']['Row']

// Enhanced interfaces for new functionality
export interface IEnhancedDataService extends IDataService {
  // Services Management
  getServiceById(serviceId: string): Promise<DbService | null>
  getServicesByCategory(category: string): Promise<DbService[]>
  getActiveServices(): Promise<DbService[]>
  createServiceWithValidation(service: Omit<DbService, 'id' | 'created_at' | 'updated_at'>): Promise<DbService>
  updateServiceWithValidation(serviceId: string, updates: Partial<DbService>): Promise<DbService>
  deleteService(serviceId: string): Promise<void>

  // User Preferences Management
  getUserPreferences(userId: string): Promise<DbUserPreference | null>
  createUserPreferences(userId: string, preferences: Omit<DbUserPreference, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<DbUserPreference>
  updateUserPreferences(userId: string, preferences: Partial<DbUserPreference>): Promise<DbUserPreference>
  deleteUserPreferences(userId: string): Promise<void>

  // Subscription Management
  getSubscriptionById(subscriptionId: string): Promise<DbSubscription | null>
  getUserSubscription(userId: string): Promise<DbSubscription | null>
  getActiveSubscriptions(): Promise<DbSubscription[]>
  createSubscriptionWithValidation(subscription: Omit<DbSubscription, 'id' | 'created_at' | 'updated_at'>): Promise<DbSubscription>
  updateSubscriptionStatus(subscriptionId: string, status: DbSubscription['status']): Promise<DbSubscription>
  cancelSubscription(subscriptionId: string): Promise<DbSubscription>

  // Subscription Tiers Management
  getSubscriptionTiers(): Promise<DbSubscriptionTier[]>
  getSubscriptionTierById(tierId: string): Promise<DbSubscriptionTier | null>
  getSubscriptionTierByType(type: 'loyalty' | 'vip'): Promise<DbSubscriptionTier | null>
  createSubscriptionTier(tier: Omit<DbSubscriptionTier, 'id' | 'created_at' | 'updated_at'>): Promise<DbSubscriptionTier>
  updateSubscriptionTier(tierId: string, updates: Partial<DbSubscriptionTier>): Promise<DbSubscriptionTier>

  // Subscription Usage Management
  getSubscriptionUsage(subscriptionId: string): Promise<DbSubscriptionUsage | null>
  getUserSubscriptionUsage(userId: string): Promise<DbSubscriptionUsage | null>
  createSubscriptionUsage(usage: Omit<DbSubscriptionUsage, 'id' | 'last_updated'>): Promise<DbSubscriptionUsage>
  updateSubscriptionUsage(usageId: string, updates: Partial<DbSubscriptionUsage>): Promise<DbSubscriptionUsage>
  incrementSessionUsage(subscriptionId: string, userId: string): Promise<DbSubscriptionUsage>

  // Community Posts Management
  getCommunityPostById(postId: string): Promise<DbCommunityPost | null>
  getPublishedCommunityPosts(limit?: number, offset?: number): Promise<DbCommunityPost[]>
  getUserCommunityPosts(userId: string): Promise<DbCommunityPost[]>
  getFeaturedCommunityPosts(): Promise<DbCommunityPost[]>
  createCommunityPostWithValidation(post: Omit<DbCommunityPost, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count' | 'views_count'>): Promise<DbCommunityPost>
  updateCommunityPost(postId: string, updates: Partial<DbCommunityPost>): Promise<DbCommunityPost>
  deleteCommunityPost(postId: string): Promise<void>
  incrementPostViews(postId: string): Promise<void>
  incrementPostLikes(postId: string): Promise<void>
  decrementPostLikes(postId: string): Promise<void>

  // Transaction Support
  executeTransaction<T>(operation: () => Promise<T>): Promise<T>
  
  // Batch Operations
  batchUpdateServices(updates: Array<{id: string, data: Partial<DbService>}>): Promise<void>
  batchCreateCommunityPosts(posts: Array<Omit<DbCommunityPost, 'id' | 'created_at' | 'updated_at'>>): Promise<DbCommunityPost[]>
}

export class EnhancedDataService implements IEnhancedDataService {
  private baseService: IDataService;

  constructor(baseService: IDataService = supabaseDataService) {
    this.baseService = baseService;
  }

  get isMock() {
    return this.baseService.isMock;
  }

  // Transaction Support
  async executeTransaction<T>(operation: () => Promise<T>): Promise<T> {
    logger.info('Starting database transaction');
    try {
      const result = await operation();
      logger.info('Transaction completed successfully');
      return result;
    } catch (error) {
      logger.error('Transaction failed', error as Error);
      throw error;
    }
  }

  // Services Management
  async getServiceById(serviceId: string): Promise<DbService | null> {
    try {
      logger.info('Fetching service by ID', { serviceId });
      const { data, error } = await safeSupabaseQueryBuilder<DbService>(
        supabase.from('services').select('*').eq('id', serviceId).single()
      );

      if (error) {
        logger.error('Error fetching service', error as Error, { serviceId });
        throw error;
      }

      logger.info('Service fetched successfully', { serviceId });
      return data as any;
    } catch (error) {
      logger.error('Failed to fetch service', error as Error, { serviceId });
      throw error;
    }
  }

  async getServicesByCategory(category: string): Promise<DbService[]> {
    try {
      logger.info('Fetching services by category', { category });
      const { data, error } = await safeSupabaseQueryBuilder<DbService[]>(
        supabase.from('services').select('*').eq('category', category).eq('is_active', true).order('name')
      );

      if (error) {
        logger.error('Error fetching services by category', error as Error, { category });
        throw error;
      }

      logger.info('Services fetched successfully', { category, count: data?.length });
      return data || [];

      if (error) {
        logger.error('Error fetching services by category', error as Error, { category });
        throw error;
      }

      logger.info('Services fetched successfully', { category, count: data?.length });
      return data || [];
    } catch (error) {
      logger.error('Failed to fetch services by category', error as Error, { category });
      throw error;
    }
  }

  async getActiveServices(): Promise<DbService[]> {
    try {
      logger.info('Fetching active services');
      const { data, error } = await safeSupabaseQueryBuilder<DbService[]>(
        supabase.from('services').select('*').eq('is_active', true).order('name')
      );

      if (error) {
        logger.error('Error fetching active services', error as Error);
        throw error;
      }

      logger.info('Active services fetched successfully', { count: data?.length });
      return data || [];

      if (error) {
        logger.error('Error fetching active services', error as Error);
        throw error;
      }

      logger.info('Active services fetched successfully', { count: data?.length });
      return data || [];
    } catch (error) {
      logger.error('Failed to fetch active services', error as Error);
      throw error;
    }
  }

  async createServiceWithValidation(service: Omit<DbService, 'id' | 'created_at' | 'updated_at'>): Promise<DbService> {
    try {
      logger.info('Creating service with validation', { service });
      
      // Validation
      if (!service.name || service.name.trim().length === 0) {
        throw new Error('Service name is required');
      }
      if (service.price < 0) {
        throw new Error('Service price cannot be negative');
      }

      const { data, error } = await safeSupabaseInsert<DbService>(
        'services', service
      );

      if (error) {
        logger.error('Error creating service', error as Error, { service });
        throw error;
      }

      logger.info('Service created successfully', { serviceId: (data as any).id });
      return data as any;
    } catch (error) {
      logger.error('Failed to create service', error as Error, { service });
      throw error;
    }
  }

  async updateServiceWithValidation(serviceId: string, updates: Partial<DbService>): Promise<DbService> {
    try {
      logger.info('Updating service with validation', { serviceId, updates });
      
      // Validation
      if (updates.price !== undefined && updates.price < 0) {
        throw new Error('Service price cannot be negative');
      }

      const { data, error } = await safeSupabaseUpdate<DbService>(
        'services', updates, { id: serviceId }
      );

      if (error) {
        logger.error('Error updating service', error as Error, { serviceId, updates });
        throw error;
      }

      logger.info('Service updated successfully', { serviceId });
      return data as any;
    } catch (error) {
      logger.error('Failed to update service', error as Error, { serviceId, updates });
      throw error;
    }
  }

  async deleteService(serviceId: string): Promise<void> {
    try {
      logger.info('Deleting service', { serviceId });
      const { error } = await safeSupabaseDelete(
        'services', { id: serviceId }
      );

      if (error) {
        logger.error('Error deleting service', error as Error, { serviceId });
        throw error;
      }

      logger.info('Service deleted successfully', { serviceId });
    } catch (error) {
      logger.error('Failed to delete service', error as Error, { serviceId });
      throw error;
    }
  }

  // User Preferences Management
  async getUserPreferences(userId: string): Promise<DbUserPreference | null> {
    try {
      logger.info('Fetching user preferences', { userId });
      const { data, error } = await safeSupabaseQueryBuilder<DbUserPreference>(
        supabase.from('user_preferences').select('*').eq('user_id', userId).single()
      );

      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          logger.info('No preferences found for user', { userId });
          return null;
        }
        logger.error('Error fetching user preferences', error as Error, { userId });
        throw error;
      }

      logger.info('User preferences fetched successfully', { userId });
      return data as any;
    } catch (error) {
      logger.error('Failed to fetch user preferences', error as Error, { userId });
      throw error;
    }
  }

  async createUserPreferences(userId: string, preferences: Omit<DbUserPreference, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<DbUserPreference> {
    try {
      logger.info('Creating user preferences', { userId, preferences });
      const { data, error } = await safeSupabaseInsert<DbUserPreference>(
        'user_preferences', { user_id: userId, ...preferences }
      );

      if (error) {
        logger.error('Error creating user preferences', error as Error, { userId, preferences });
        throw error;
      }

      logger.info('User preferences created successfully', { userId });
      return data as any;
    } catch (error) {
      logger.error('Failed to create user preferences', error as Error, { userId, preferences });
      throw error;
    }
  }

  async updateUserPreferences(userId: string, preferences: Partial<DbUserPreference>): Promise<DbUserPreference> {
    try {
      logger.info('Updating user preferences', { userId, preferences });
      const { data, error } = await safeSupabaseUpdate<DbUserPreference>(
        'user_preferences', preferences, { user_id: userId }
      );

      if (error) {
        logger.error('Error updating user preferences', error as Error, { userId, preferences });
        throw error;
      }

      logger.info('User preferences updated successfully', { userId });
      return data as any;
    } catch (error) {
      logger.error('Failed to update user preferences', error as Error, { userId, preferences });
      throw error;
    }
  }

  async deleteUserPreferences(userId: string): Promise<void> {
    try {
      logger.info('Deleting user preferences', { userId });
      const { error } = await safeSupabaseDelete(
        'user_preferences', { user_id: userId }
      );

      if (error) {
        logger.error('Error deleting user preferences', error as Error, { userId });
        throw error;
      }

      logger.info('User preferences deleted successfully', { userId });
    } catch (error) {
      logger.error('Failed to delete user preferences', error as Error, { userId });
      throw error;
    }
  }

  // Subscription Management
  async getSubscriptionById(subscriptionId: string): Promise<DbSubscription | null> {
    try {
      logger.info('Fetching subscription by ID', { subscriptionId });
      const { data, error } = await safeSupabaseQueryBuilder<DbSubscription>(
        supabase.from('subscriptions').select('*').eq('id', subscriptionId).single()
      );

      if (error) {
        logger.error('Error fetching subscription', error as Error, { subscriptionId });
        throw error;
      }

      logger.info('Subscription fetched successfully', { subscriptionId });
      return data as any;
    } catch (error) {
      logger.error('Failed to fetch subscription', error as Error, { subscriptionId });
      throw error;
    }
  }

  async getUserSubscription(userId: string): Promise<DbSubscription | null> {
    try {
      logger.info('Fetching user subscription', { userId });
      const { data, error } = await safeSupabaseQueryBuilder<DbSubscription>(
        supabase.from('subscriptions').select('*').eq('user_id', userId).in('status', ['active', 'pending']).single()
      );

      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          logger.info('No active subscription found for user', { userId });
          return null;
        }
        logger.error('Error fetching user subscription', error as Error, { userId });
        throw error;
      }

      logger.info('User subscription fetched successfully', { userId });
      return data as any;
    } catch (error) {
      logger.error('Failed to fetch user subscription', error as Error, { userId });
      throw error;
    }
  }

  async getActiveSubscriptions(): Promise<DbSubscription[]> {
    try {
      logger.info('Fetching active subscriptions');
      const { data, error } = await safeSupabaseQueryBuilder<DbSubscription[]>(
        supabase.from('subscriptions').select('*').eq('status', 'active').order('created_at', { ascending: false })
      );

      if (error) {
        logger.error('Error fetching active subscriptions', error as Error);
        throw error;
      }

      logger.info('Active subscriptions fetched successfully', { count: data?.length });
      return data || [];

      if (error) {
        logger.error('Error fetching active subscriptions', error as Error);
        throw error;
      }

      logger.info('Active subscriptions fetched successfully', { count: data?.length });
      return data || [];
    } catch (error) {
      logger.error('Failed to fetch active subscriptions', error as Error);
      throw error;
    }
  }

  async createSubscriptionWithValidation(subscription: Omit<DbSubscription, 'id' | 'created_at' | 'updated_at'>): Promise<DbSubscription> {
    try {
      logger.info('Creating subscription with validation', { subscription });
      
      // Validation
      if (!subscription.user_id) {
        throw new Error('User ID is required');
      }
      if (!subscription.type || !['loyalty', 'vip'].includes(subscription.type)) {
        throw new Error('Valid subscription type is required (loyalty or vip)');
      }
      if (subscription.price < 0) {
        throw new Error('Subscription price cannot be negative');
      }

      const { data, error } = await safeSupabaseInsert<DbSubscription>(
        'subscriptions', subscription
      );

      if (error) {
        logger.error('Error creating subscription', error as Error, { subscription });
        throw error;
      }

      logger.info('Subscription created successfully', { subscriptionId: data?.id });
      return data as any;
    } catch (error) {
      logger.error('Failed to create subscription', error as Error, { subscription });
      throw error;
    }
  }

  async updateSubscriptionStatus(subscriptionId: string, status: DbSubscription['status']): Promise<DbSubscription> {
    try {
      logger.info('Updating subscription status', { subscriptionId, status });
      const { data, error } = await safeSupabaseUpdate<DbSubscription>(
        'subscriptions', { status }, { id: subscriptionId }
      );

      if (error) {
        logger.error('Error updating subscription status', error as Error, { subscriptionId, status });
        throw error;
      }

      logger.info('Subscription status updated successfully', { subscriptionId, status });
      return data as any;
    } catch (error) {
      logger.error('Failed to update subscription status', error as Error, { subscriptionId, status });
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<DbSubscription> {
    try {
      logger.info('Cancelling subscription', { subscriptionId });
      const { data, error } = await safeSupabaseUpdate<DbSubscription>(
        'subscriptions', 
        { 
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        }, 
        { id: subscriptionId }
      );

      if (error) {
        logger.error('Error cancelling subscription', error as Error, { subscriptionId });
        throw error;
      }

      logger.info('Subscription cancelled successfully', { subscriptionId });
      return data as any;
    } catch (error) {
      logger.error('Failed to cancel subscription', error as Error, { subscriptionId });
      throw error;
    }
  }

  // Subscription Tiers Management
  async getSubscriptionTiers(): Promise<DbSubscriptionTier[]> {
    try {
      logger.info('Fetching subscription tiers');
      const { data, error } = await safeSupabaseQueryBuilder<DbSubscriptionTier[]>(
        supabase.from('subscription_tiers').select('*').eq('is_active', true).eq('is_public', true).order('sort_order', { ascending: true })
      );

      if (error) {
        logger.error('Error fetching subscription tiers', error as Error);
        throw error;
      }

      logger.info('Subscription tiers fetched successfully', { count: data?.length });
      return data || [];

      if (error) {
        logger.error('Error fetching subscription tiers', error as Error);
        throw error;
      }

      logger.info('Subscription tiers fetched successfully', { count: data?.length });
      return data || [];
    } catch (error) {
      logger.error('Failed to fetch subscription tiers', error as Error);
      throw error;
    }
  }

  async getSubscriptionTierById(tierId: string): Promise<DbSubscriptionTier | null> {
    try {
      logger.info('Fetching subscription tier by ID', { tierId });
      const { data, error } = await safeSupabaseQueryBuilder<DbSubscriptionTier>(
        supabase.from('subscription_tiers').select('*').eq('id', tierId).single()
      );

      if (error) {
        logger.error('Error fetching subscription tier', error as Error, { tierId });
        throw error;
      }

      logger.info('Subscription tier fetched successfully', { tierId });
      return data as any;
    } catch (error) {
      logger.error('Failed to fetch subscription tier', error as Error, { tierId });
      throw error;
    }
  }

  async getSubscriptionTierByType(type: 'loyalty' | 'vip'): Promise<DbSubscriptionTier | null> {
    try {
      logger.info('Fetching subscription tier by type', { type });
      const { data, error } = await safeSupabaseQueryBuilder<DbSubscriptionTier>(
        supabase.from('subscription_tiers').select('*').eq('type', type).eq('is_active', true).single()
      );

      if (error) {
        logger.error('Error fetching subscription tier by type', error as Error, { type });
        throw error;
      }

      logger.info('Subscription tier fetched successfully', { type });
      return data as any;
    } catch (error) {
      logger.error('Failed to fetch subscription tier by type', error as Error, { type });
      throw error;
    }
  }

  async createSubscriptionTier(tier: Omit<DbSubscriptionTier, 'id' | 'created_at' | 'updated_at'>): Promise<DbSubscriptionTier> {
    try {
      logger.info('Creating subscription tier', { tier });
      const { data, error } = await safeSupabaseInsert<DbSubscriptionTier>(
        'subscription_tiers', tier
      );

      if (error) {
        logger.error('Error creating subscription tier', error as Error, { tier });
        throw error;
      }

      logger.info('Subscription tier created successfully', { tierId: data?.id });
      return data as any;
    } catch (error) {
      logger.error('Failed to create subscription tier', error as Error, { tier });
      throw error;
    }
  }

  async updateSubscriptionTier(tierId: string, updates: Partial<DbSubscriptionTier>): Promise<DbSubscriptionTier> {
    try {
      logger.info('Updating subscription tier', { tierId, updates });
      const { data, error } = await safeSupabaseUpdate<DbSubscriptionTier>(
        'subscription_tiers', updates as any, { id: tierId }
      );

      if (error) {
        logger.error('Error updating subscription tier', error as Error, { tierId, updates });
        throw error;
      }

      logger.info('Subscription tier updated successfully', { tierId });
      return data as any;
    } catch (error) {
      logger.error('Failed to update subscription tier', error as Error, { tierId, updates });
      throw error;
    }
  }

  // Subscription Usage Management
  async getSubscriptionUsage(subscriptionId: string): Promise<DbSubscriptionUsage | null> {
    try {
      logger.info('Fetching subscription usage', { subscriptionId });
      const { data, error } = await safeSupabaseQueryBuilder<DbSubscriptionUsage>(
        supabase.from('subscription_usage').select('*').eq('subscription_id', subscriptionId).single()
      );

      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          logger.info('No usage found for subscription', { subscriptionId });
          return null;
        }
        logger.error('Error fetching subscription usage', error as Error, { subscriptionId });
        throw error;
      }

      logger.info('Subscription usage fetched successfully', { subscriptionId });
      return data as any;
    } catch (error) {
      logger.error('Failed to fetch subscription usage', error as Error, { subscriptionId });
      throw error;
    }
  }

  async getUserSubscriptionUsage(userId: string): Promise<DbSubscriptionUsage | null> {
    try {
      logger.info('Fetching user subscription usage', { userId });
      const { data, error } = await safeSupabaseQueryBuilder<DbSubscriptionUsage>(
        supabase.from('subscription_usage').select('*').eq('user_id', userId).single()
      );

      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          logger.info('No usage found for user', { userId });
          return null;
        }
        logger.error('Error fetching user subscription usage', error as Error, { userId });
        throw error;
      }

      logger.info('User subscription usage fetched successfully', { userId });
      return data as any;
    } catch (error) {
      logger.error('Failed to fetch user subscription usage', error as Error, { userId });
      throw error;
    }
  }

  async createSubscriptionUsage(usage: Omit<DbSubscriptionUsage, 'id' | 'last_updated'>): Promise<DbSubscriptionUsage> {
    try {
      logger.info('Creating subscription usage', { usage });
      const { data, error } = await safeSupabaseInsert<DbSubscriptionUsage>(
        'subscription_usage', usage
      );

      if (error) {
        logger.error('Error creating subscription usage', error as Error, { usage });
        throw error;
      }

      logger.info('Subscription usage created successfully', { usageId: data?.id });
      return data as any;
    } catch (error) {
      logger.error('Failed to create subscription usage', error as Error, { usage });
      throw error;
    }
  }

  async updateSubscriptionUsage(usageId: string, updates: Partial<DbSubscriptionUsage>): Promise<DbSubscriptionUsage> {
    try {
      logger.info('Updating subscription usage', { usageId, updates });
      const { data, error } = await safeSupabaseUpdate<DbSubscriptionUsage>(
        'subscription_usage', updates as any, { id: usageId }
      );

      if (error) {
        logger.error('Error updating subscription usage', error as Error, { usageId, updates });
        throw error;
      }

      logger.info('Subscription usage updated successfully', { usageId });
      return data as any;
    } catch (error) {
      logger.error('Failed to update subscription usage', error as Error, { usageId, updates });
      throw error;
    }
  }

  async incrementSessionUsage(subscriptionId: string, userId: string): Promise<DbSubscriptionUsage> {
    try {
      logger.info('Incrementing session usage', { subscriptionId, userId });
      
      return await this.executeTransaction(async () => {
        const currentUsage = await this.getSubscriptionUsage(subscriptionId);
        
        if (!currentUsage) {
          // Create new usage record
          const newUsage = await this.createSubscriptionUsage({
            subscription_id: subscriptionId,
            user_id: userId,
            type: 'loyalty',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            loyalty_points_earned: 0,
            loyalty_points_spent: 0,
            loyalty_discount_used: 0,
            personal_therapist_assigned: false,
            sessions_used: 1,
            sessions_remaining: 0,
            group_sessions_attended: 0,
            reports_generated: 0,
            themes_used: [],
            current_theme: null,
            rewards_claimed: [],
            total_rewards_value: 0
          });
          return newUsage;
        }

        // Update existing usage
        const updatedUsage = await this.updateSubscriptionUsage(currentUsage.id, {
          sessions_used: currentUsage.sessions_used + 1,
          sessions_remaining: Math.max(0, currentUsage.sessions_remaining - 1)
        });
        
        return updatedUsage;
      });
    } catch (error) {
      logger.error('Failed to increment session usage', error as Error, { subscriptionId, userId });
      throw error;
    }
  }

  // Community Posts Management
  async getCommunityPostById(postId: string): Promise<DbCommunityPost | null> {
    try {
      logger.info('Fetching community post by ID', { postId });
      const { data, error } = await safeSupabaseQueryBuilder<DbCommunityPost>(
        supabase.from('community_posts').select('*').eq('id', postId).single()
      );

      if (error) {
      logger.error('Error fetching community post', error as Error, { postId });
        throw error;
      }

      logger.info('Community post fetched successfully', { postId });
      return data as any;
    } catch (error) {
      logger.error('Failed to fetch community post', error as Error, { postId });
      throw error;
    }
  }

  async getPublishedCommunityPosts(limit = 50, offset = 0): Promise<DbCommunityPost[]> {
    try {
      logger.info('Fetching published community posts', { limit, offset });
      const { data, error } = await safeSupabaseQueryBuilder<DbCommunityPost[]>(
        supabase.from('community_posts').select('*').eq('is_published', true).order('published_at', { ascending: false }).range(offset, offset + limit - 1)
      );

      if (error) {
        logger.error('Error fetching published community posts', error as Error, { limit, offset });
        throw error;
      }

      logger.info('Published community posts fetched successfully', { limit, offset, count: data?.length });
      return data || [];

      if (error) {
      logger.error('Error fetching published community posts', error as Error, { limit, offset });
        throw error;
      }

      logger.info('Published community posts fetched successfully', { limit, offset, count: data?.length });
      return data || [];
    } catch (error) {
      logger.error('Failed to fetch published community posts', error as Error, { limit, offset });
      throw error;
    }
  }

  async getUserCommunityPosts(userId: string): Promise<DbCommunityPost[]> {
    try {
      logger.info('Fetching user community posts', { userId });
      const { data, error } = await safeSupabaseQueryBuilder<DbCommunityPost[]>(
        supabase.from('community_posts').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      );

      if (error) {
        logger.error('Error fetching user community posts', error as Error, { userId });
        throw error;
      }

      logger.info('User community posts fetched successfully', { userId, count: data?.length });
      return data || [];

      if (error) {
      logger.error('Error fetching user community posts', error as Error, { userId });
        throw error;
      }

      logger.info('User community posts fetched successfully', { userId, count: data?.length });
      return data || [];
    } catch (error) {
      logger.error('Failed to fetch user community posts', error as Error, { userId });
      throw error;
    }
  }

  async getFeaturedCommunityPosts(): Promise<DbCommunityPost[]> {
    try {
      logger.info('Fetching featured community posts');
      const { data, error } = await safeSupabaseQueryBuilder<DbCommunityPost[]>(
        supabase.from('community_posts').select('*').eq('is_published', true).eq('is_featured', true).order('published_at', { ascending: false })
      );

      if (error) {
        logger.error('Error fetching featured community posts', error as Error);
        throw error;
      }

      logger.info('Featured community posts fetched successfully', { count: data?.length });
      return data || [];

      if (error) {
      logger.error('Error fetching featured community posts', error as Error);
        throw error;
      }

      logger.info('Featured community posts fetched successfully', { count: data?.length });
      return data || [];
    } catch (error) {
      logger.error('Failed to fetch featured community posts', error as Error);
      throw error;
    }
  }

  async createCommunityPostWithValidation(post: Omit<DbCommunityPost, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count' | 'views_count'>): Promise<DbCommunityPost> {
    try {
      logger.info('Creating community post with validation', { post });
      
      // Validation
      if (!post.title || post.title.trim().length === 0) {
        throw new Error('Post title is required');
      }
      if (!post.content || post.content.trim().length === 0) {
        throw new Error('Post content is required');
      }
      if (!post.user_id) {
        throw new Error('User ID is required');
      }

      const { data, error } = await safeSupabaseInsert<DbCommunityPost>(
        'community_posts', {
          ...post,
          likes_count: 0,
          comments_count: 0,
          views_count: 0
        }
      );

      if (error) {
      logger.error('Error creating community post', error as Error, { post });
        throw error;
      }

      logger.info('Community post created successfully', { postId: data?.id });
      return data as any;
    } catch (error) {
      logger.error('Failed to create community post', error as Error, { post });
      throw error;
    }
  }

  async updateCommunityPost(postId: string, updates: Partial<DbCommunityPost>): Promise<DbCommunityPost> {
    try {
      logger.info('Updating community post', { postId, updates });
      const { data, error } = await safeSupabaseUpdate<DbCommunityPost>(
        'community_posts', updates as any, { id: postId }
      );

      if (error) {
      logger.error('Error updating community post', error as Error, { postId, updates });
        throw error;
      }

      logger.info('Community post updated successfully', { postId });
      return data as any;
    } catch (error) {
      logger.error('Failed to update community post', error as Error, { postId, updates });
      throw error;
    }
  }

  async deleteCommunityPost(postId: string): Promise<void> {
    try {
      logger.info('Deleting community post', { postId });
      const { error } = await safeSupabaseDelete(
        'community_posts', { id: postId }
      );

      if (error) {
      logger.error('Error deleting community post', error as Error, { postId });
        throw error;
      }

      logger.info('Community post deleted successfully', { postId });
    } catch (error) {
      logger.error('Failed to delete community post', error as Error, { postId });
      throw error;
    }
  }

  async incrementPostViews(postId: string): Promise<void> {
    try {
      logger.info('Incrementing post views', { postId });
      const { data: current, error: fetchError } = await safeSupabaseQueryBuilder<{ views_count: number }>(
        supabase.from('community_posts').select('views_count').eq('id', postId).single()
      );

      if (fetchError) {
        logger.error('Error fetching current views_count', fetchError as Error, { postId });
        throw fetchError;
      }

      const nextCount = (current?.views_count ?? 0) + 1;

      const { error } = await safeSupabaseUpdate(
        'community_posts', { views_count: nextCount }, { id: postId }
      );

      if (error) {
        logger.error('Error incrementing post views', error as Error, { postId });
        throw error;
      }

      logger.info('Post views incremented successfully', { postId });
    } catch (error) {
      logger.error('Failed to increment post views', error as Error, { postId });
      throw error;
    }
  }

  async incrementPostLikes(postId: string): Promise<void> {
    try {
      logger.info('Incrementing post likes', { postId });
      const { data: current, error: fetchError } = await safeSupabaseQueryBuilder<{ likes_count: number }>(
        supabase.from('community_posts').select('likes_count').eq('id', postId).single()
      );

      if (fetchError) {
        logger.error('Error fetching current likes_count', fetchError as Error, { postId });
        throw fetchError;
      }

      const nextCount = (current?.likes_count ?? 0) + 1;

      const { error } = await safeSupabaseUpdate(
        'community_posts', { likes_count: nextCount }, { id: postId }
      );

      if (error) {
        logger.error('Error incrementing post likes', error as Error, { postId });
        throw error;
      }

      logger.info('Post likes incremented successfully', { postId });
    } catch (error) {
      logger.error('Failed to increment post likes', error as Error, { postId });
      throw error;
    }
  }

  async decrementPostLikes(postId: string): Promise<void> {
    try {
      logger.info('Decrementing post likes', { postId });
      const { data: current, error: fetchError } = await safeSupabaseQueryBuilder<{ likes_count: number }>(
        supabase.from('community_posts').select('likes_count').eq('id', postId).single()
      );

      if (fetchError) {
        logger.error('Error fetching current likes_count', fetchError as Error, { postId });
        throw fetchError;
      }

      const nextCount = Math.max(0, (current?.likes_count ?? 0) - 1);

      const { error } = await safeSupabaseUpdate(
        'community_posts', { likes_count: nextCount }, { id: postId }
      );

      if (error) {
        logger.error('Error decrementing post likes', error as Error, { postId });
        throw error;
      }

      logger.info('Post likes decremented successfully', { postId });
    } catch (error) {
      logger.error('Failed to decrement post likes', error as Error, { postId });
      throw error;
    }
  }

  // Batch Operations
  async batchUpdateServices(updates: Array<{id: string, data: Partial<DbService>}>): Promise<void> {
    try {
      logger.info('Batch updating services', { count: updates.length });
      
      await this.executeTransaction(async () => {
        for (const update of updates) {
          await this.updateServiceWithValidation(update.id, update.data);
        }
      });

      logger.info('Services batch updated successfully', { count: updates.length });
    } catch (error) {
      logger.error('Failed to batch update services', error as Error);
      throw error;
    }
  }

  async batchCreateCommunityPosts(posts: Array<Omit<DbCommunityPost, 'id' | 'created_at' | 'updated_at'>>): Promise<DbCommunityPost[]> {
    try {
      logger.info('Batch creating community posts', { count: posts.length });
      
      const createdPosts: DbCommunityPost[] = [];
      
      await this.executeTransaction(async () => {
        for (const post of posts) {
          const createdPost = await this.createCommunityPostWithValidation(post);
          createdPosts.push(createdPost);
        }
      });

      logger.info('Community posts batch created successfully', { count: posts.length });
      return createdPosts;
    } catch (error) {
      logger.error('Failed to batch create community posts', error as Error);
      throw error;
    }
  }

  // Delegate base service methods
  async getCurrentUser() {
    return this.baseService.getCurrentUser();
  }

  async getAllUsers() {
    return this.baseService.getAllUsers();
  }

  async updateUser(userId: string, updates: any) {
    return this.baseService.updateUser(userId, updates);
  }

  async login(email: string, password: string) {
    return this.baseService.login(email, password);
  }

  async logout() {
    return this.baseService.logout();
  }

  async getSessions(userId?: string) {
    return this.baseService.getSessions(userId);
  }

  async createSession(session: any) {
    return this.baseService.createSession(session);
  }

  async updateSession(sessionId: string, updates: any) {
    return this.baseService.updateSession(sessionId, updates);
  }

  async cancelSession(sessionId: string) {
    return this.baseService.cancelSession(sessionId);
  }

  async getReports(userId?: string) {
    return this.baseService.getReports(userId);
  }

  async createReport(report: any) {
    return this.baseService.createReport(report);
  }

  async getServices() {
    return this.baseService.getServices();
  }

  async createService(service: any) {
    return this.baseService.createService(service);
  }

  async updateService(serviceId: string, updates: any) {
    return this.baseService.updateService(serviceId, updates);
  }

  async getJournalEntries(userId?: string) {
    return this.baseService.getJournalEntries(userId);
  }

  async createJournalEntry(entry: any) {
    return this.baseService.createJournalEntry(entry);
  }

  async getGoals(userId?: string) {
    return this.baseService.getGoals(userId);
  }

  async createGoal(goal: any) {
    return this.baseService.createGoal(goal);
  }

  async deleteGoal(goalId: string) {
    return this.baseService.deleteGoal(goalId);
  }

  async getExercises() {
    return this.baseService.getExercises();
  }

  async getCommunityPosts() {
    return this.baseService.getCommunityPosts();
  }

  async createCommunityPost(post: any) {
    return this.baseService.createCommunityPost(post);
  }

  async getAIChatResponse(prompt: string, history: any[]) {
    return this.baseService.getAIChatResponse(prompt, history);
  }

  async getAIRecommendations() {
    return this.baseService.getAIRecommendations();
  }

  async getAIReportSummary(reportId: string) {
    return this.baseService.getAIReportSummary(reportId);
  }

  async getDonations(userId?: string) {
    return this.baseService.getDonations(userId);
  }

  async addDonation(donation: any) {
    return this.baseService.addDonation(donation);
  }

  async getMessages(conversationId: string) {
    return this.baseService.getMessages(conversationId);
  }

  async sendMessage(conversationId: string, message: any) {
    return this.baseService.sendMessage(conversationId, message);
  }

  async isReady() {
    return this.baseService.isReady();
  }
}

export const enhancedDataService = new EnhancedDataService();