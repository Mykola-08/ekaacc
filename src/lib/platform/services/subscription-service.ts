// Subscription Service - User Subscription Management
import { supabaseAdmin } from '@/lib/platform/supabase';
import { Subscription } from '@/lib/platform/types/subscription-types';

export interface SubscriptionTier {
  id: string;
  name: string;
  price?: number;
  features?: string[];
}

const subscriptionService = {
  getUserSubscriptions: async (userId: string): Promise<Subscription[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return [];
      return (data || []) as Subscription[];
    } catch {
      return [];
    }
  },

  getSubscriptionTier: async (tierId: string): Promise<SubscriptionTier | null> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('subscription_tiers')
        .select('id, name, price, features')
        .eq('id', tierId)
        .single();

      if (error || !data) return null;
      return data as SubscriptionTier;
    } catch {
      return null;
    }
  },

  getActiveTiers: async (): Promise<SubscriptionTier[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('subscription_tiers')
        .select('id, name, price, features')
        .eq('active', true)
        .order('price', { ascending: true });

      if (error) return [];
      return (data || []) as SubscriptionTier[];
    } catch {
      return [];
    }
  },

  updateSubscription: async (
    userId: string,
    tierId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabaseAdmin.from('subscriptions').upsert(
        {
          user_id: userId,
          tier_id: tierId,
          status: 'active',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: message };
    }
  },
};

export const getSubscriptionService = async () => subscriptionService;
