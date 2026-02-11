'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReferralCode {
  id: string;
  code: string;
  owner_id: string;
  is_active: boolean;
  created_at: string;
}

export interface ReferralUsage {
  id: string;
  code: string;
  referred_user_id: string;
  status: 'pending' | 'completed' | 'expired';
  created_at: string;
  referred_user?: {
    email: string;
    full_name: string;
  };
}

export interface ReferralStats {
  totalReferred: number;
  pendingRewards: number;
  completedRewards: number;
  totalEarnings: number;
}

// ─── Get or Create Referral Code ──────────────────────────────────────────────

export async function getOrCreateReferralCode() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Try to get existing code
    const { data: existing } = await supabase
      .from('referral_code')
      .select('*')
      .eq('owner_id', user.id)
      .single();

    if (existing) {
      return { success: true, referralCode: existing as ReferralCode };
    }

    // Create new one
    const code = nanoid(8).toUpperCase();
    const { data: created, error } = await supabase
      .from('referral_code')
      .insert({
        code,
        owner_id: user.id,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, referralCode: created as ReferralCode };
  } catch (err: any) {
    console.error('getOrCreateReferralCode error:', err);
    return { success: false, error: err.message || 'Failed to get referral code' };
  }
}

// ─── Get Referral Stats ──────────────────────────────────────────────────────

export async function getReferralStats(): Promise<ReferralStats> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { totalReferred: 0, pendingRewards: 0, completedRewards: 0, totalEarnings: 0 };
  }

  try {
    // Get the user's referral code
    const { data: refCode } = await supabase
      .from('referral_code')
      .select('code')
      .eq('owner_id', user.id)
      .single();

    if (!refCode) {
      return { totalReferred: 0, pendingRewards: 0, completedRewards: 0, totalEarnings: 0 };
    }

    // Get usage stats
    const { data: usages } = await supabase
      .from('referral_usage')
      .select('*')
      .eq('code', refCode.code);

    const all = usages || [];
    const pending = all.filter((u) => u.status === 'pending');
    const completed = all.filter((u) => u.status === 'completed');

    return {
      totalReferred: all.length,
      pendingRewards: pending.length,
      completedRewards: completed.length,
      totalEarnings: completed.length * 10, // €10 per completed referral
    };
  } catch {
    return { totalReferred: 0, pendingRewards: 0, completedRewards: 0, totalEarnings: 0 };
  }
}

// ─── Get Referral History ─────────────────────────────────────────────────────

export async function getReferralHistory() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized', history: [] };
  }

  try {
    const { data: refCode } = await supabase
      .from('referral_code')
      .select('code')
      .eq('owner_id', user.id)
      .single();

    if (!refCode) {
      return { success: true, history: [] };
    }

    const { data: usages, error } = await supabase
      .from('referral_usage')
      .select('*')
      .eq('code', refCode.code)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, history: (usages || []) as ReferralUsage[] };
  } catch (err: any) {
    console.error('getReferralHistory error:', err);
    return { success: false, error: err.message, history: [] };
  }
}

// ─── Apply Referral Code (during signup) ──────────────────────────────────────

export async function applyReferralCode(code: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Validate code
    const { data: refCode } = await supabase
      .from('referral_code')
      .select('owner_id, is_active')
      .eq('code', code.toUpperCase())
      .single();

    if (!refCode || !refCode.is_active) {
      return { success: false, error: 'Invalid or expired referral code' };
    }

    if (refCode.owner_id === user.id) {
      return { success: false, error: 'You cannot use your own referral code' };
    }

    // Check if already used
    const { data: existing } = await supabase
      .from('referral_usage')
      .select('id')
      .eq('referred_user_id', user.id)
      .single();

    if (existing) {
      return { success: false, error: 'You have already used a referral code' };
    }

    // Record usage
    const { error } = await supabase.from('referral_usage').insert({
      code: code.toUpperCase(),
      referred_user_id: user.id,
      status: 'pending',
    });

    if (error) throw error;

    // Store in user metadata
    await supabase.auth.updateUser({
      data: { referred_by: code.toUpperCase() },
    });

    revalidatePath('/settings');
    return { success: true };
  } catch (err: any) {
    console.error('applyReferralCode error:', err);
    return { success: false, error: err.message || 'Failed to apply referral code' };
  }
}

// ─── Validate Referral Code (public, for signup form) ─────────────────────────

export async function validateReferralCode(code: string) {
  const supabase = await createClient();

  try {
    const { data } = await supabase
      .from('referral_code')
      .select('code, is_active')
      .eq('code', code.toUpperCase())
      .single();

    if (!data || !data.is_active) {
      return { valid: false };
    }

    return { valid: true };
  } catch {
    return { valid: false };
  }
}
