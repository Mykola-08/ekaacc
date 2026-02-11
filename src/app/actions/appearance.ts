'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ThemeCustomization } from '@/store/theme-store';

// ─── Appearance / Theme Preferences ──────────────────────────────────────────

export async function getAppearancePreferences(): Promise<Partial<ThemeCustomization> | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const meta = user.user_metadata?.appearance;
  return meta || null;
}

export async function saveAppearancePreferences(
  prefs: Partial<ThemeCustomization>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      data: { appearance: prefs },
    });

    if (error) throw error;

    revalidatePath('/settings');
    return { success: true };
  } catch (err: any) {
    console.error('saveAppearancePreferences error:', err);
    return {
      success: false,
      error: err.message || 'Failed to save appearance preferences',
    };
  }
}

// ─── Subscription check (simplified) ─────────────────────────────────────────

export async function getUserSubscriptionStatus(): Promise<{
  isSubscribed: boolean;
  plan: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isSubscribed: false, plan: null };
  }

  // Check saas_subscriptions table
  const { data: subscription } = await supabase
    .from('saas_subscriptions')
    .select('status, plan_id')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing'])
    .limit(1)
    .single();

  if (subscription) {
    return { isSubscribed: true, plan: subscription.plan_id };
  }

  // Fallback: check user metadata
  const meta = user.user_metadata;
  if (meta?.subscription_status === 'active' || meta?.is_premium) {
    return { isSubscribed: true, plan: meta?.plan || 'premium' };
  }

  return { isSubscribed: false, plan: null };
}
