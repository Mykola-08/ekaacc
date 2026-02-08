'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { stripe } from '@/lib/platform/services/stripe-client';

export type PlanUsage = {
  id: string;
  user_id: string;
  name: string;
  credits_total: number;
  credits_used: number;
  credits_remaining: number;
  expires_at: string | null;
  status: 'active' | 'exhausted' | 'expired' | 'cancelled';
};

export type PlanUsageLog = {
  id: string;
  created_at: string;
  change_amount: number;
  balance_after: number;
  reason: string;
  performed_by: string;
};

export async function getUserPlanUsages(userId?: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    throw new Error('Not authenticated');
  }

  // If userId is not provided, use current user (client view)
  // If userId is provided, ensure caller is Admin/Therapist
  const targetUserId = userId || user.data.user.id;

  if (userId && userId !== user.data.user.id) {
    // Check role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.data.user.id);

    const isAdminOrTherapist = roles?.some((r) =>
      ['admin', 'super_admin', 'therapist'].includes(r.role)
    );
    if (!isAdminOrTherapist) {
      throw new Error('Unauthorized');
    }
  }

  const { data, error } = await supabase
    .from('user_plan_usage')
    .select('*')
    .eq('user_id', targetUserId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching plan usage:', error);
    return [];
  }

  return data as PlanUsage[];
}

export async function getAllActivePlanUsages() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) throw new Error('Not authenticated');

  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.data.user.id);

  const isAdminOrTherapist = roles?.some((r) =>
    ['admin', 'super_admin', 'therapist'].includes(r.role)
  );
  if (!isAdminOrTherapist) throw new Error('Unauthorized');

  // Join with auth.users to get email? Supabase direct query to auth schemas is tricky via API sometimes.
  // Ideally we use a public profile table.
  // For now let's just get the IDs and names.
  const { data, error } = await supabase
    .from('user_plan_usage')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50); // Pagination needed in real app

  if (error) {
    console.error('Error fetching all plans:', error);
    return [];
  }

  return data as PlanUsage[];
}

export async function getPlanUsageLogs(usageId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('plan_usage_log')
    .select('*')
    .eq('user_plan_usage_id', usageId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching logs:', error);
    return [];
  }

  return data as PlanUsageLog[];
}

export async function adjustPlanCredits(usageId: string, amount: number, reason: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) throw new Error('Not authenticated');

  // Role check
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.data.user.id);

  const canEdit = roles?.some((r) => ['admin', 'super_admin', 'therapist'].includes(r.role));
  if (!canEdit) throw new Error('Unauthorized');

  const { data, error } = await supabase.rpc('adjust_plan_credits', {
    p_usage_id: usageId,
    p_change_amount: amount,
    p_reason: reason,
    p_performed_by: user.data.user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/console/subscriptions');
  revalidatePath('/dashboard');
  return data;
}

export type PlanDefinition = {
  id: string;
  name: string;
  description: string | null;
  credits_total: number;
  validity_days: number | null;
  price_cents: number;
  currency: string;
  active: boolean;
};

export async function getPlanDefinitions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('plan_definition')
    .select('*')
    .eq('active', true)
    .order('price_cents', { ascending: true });

  if (error) {
    console.error('Error fetching plan definitions:', error);
    return [];
  }
  return data as PlanDefinition[];
}

export async function assignPlanToUser(userId: string, planId: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) throw new Error('Not authenticated');

  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.data.user.id);

  const canEdit = roles?.some((r) => ['admin', 'super_admin', 'therapist'].includes(r.role));
  if (!canEdit) throw new Error('Unauthorized');

  const { data, error } = await supabase.rpc('assign_plan_to_user', {
    p_user_id: userId,
    p_plan_id: planId,
    p_performed_by: user.data.user.id,
  });

  if (error) {
    console.error('Error assigning plan:', error);
    throw new Error(error.message);
  }

  revalidatePath('/console/subscriptions');
  revalidatePath('/dashboard');
  return data;
}

export async function createPlanCheckoutSession(planId: string, returnUrl: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    throw new Error('Authenticated user required');
  }

  // 1. Fetch Plan Definition
  const { data: plan, error } = await supabase
    .from('plan_definition')
    .select('*')
    .eq('id', planId)
    .single();

  if (error || !plan) {
    throw new Error('Plan not found');
  }

  // 2. Create Stripe Session
  // Prefer using stripe_price_id if available, else construct ad-hoc price
  let lineItem;

  if (plan.stripe_price_id) {
    lineItem = {
      price: plan.stripe_price_id,
      quantity: 1,
    };
  } else {
    // Ad-hoc price
    lineItem = {
      price_data: {
        currency: plan.currency || 'eur',
        product_data: {
          name: plan.name,
          description: plan.description || undefined,
          metadata: {
            plan_id: plan.id,
          },
        },
        unit_amount: plan.price_cents || 0,
      },
      quantity: 1,
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // Most packs are one-time payments. Subscriptions would use 'subscription'
      customer_email: user.data.user.email,
      client_reference_id: user.data.user.id,
      metadata: {
        planDefinitionId: plan.id,
        userId: user.data.user.id,
      },
      line_items: [lineItem],
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?canceled=true`,
    });

    if (!session.url) throw new Error('Failed to create checkout session URL');
    return { url: session.url };
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    throw new Error(`Payment processing failed: ${err.message}`);
  }
}

export async function createPlanDefinition(data: Partial<PlanDefinition>) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error('Not authenticated');

  // Admin Check
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.data.user.id);
  const isAdmin = roles?.some((r) => ['admin', 'super_admin'].includes(r.role));
  if (!isAdmin) throw new Error('Unauthorized');

  const { data: newPlan, error } = await supabase
    .from('plan_definition')
    .insert({
      name: data.name,
      description: data.description,
      credits_total: data.credits_total,
      validity_days: data.validity_days,
      price_cents: data.price_cents,
      currency: data.currency || 'EUR',
      active: data.active ?? true,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/console/subscriptions');
  return newPlan;
}

export async function updatePlanDefinition(id: string, data: Partial<PlanDefinition>) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error('Not authenticated');

  // Admin Check
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.data.user.id);
  const isAdmin = roles?.some((r) => ['admin', 'super_admin'].includes(r.role));
  if (!isAdmin) throw new Error('Unauthorized');

  const { data: updated, error } = await supabase
    .from('plan_definition')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/console/subscriptions');
  return updated;
}

export async function getPlanOverallMetrics() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error('Not authenticated');

  // Admin Check
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.data.user.id);
  if (!roles?.some((r) => ['admin', 'super_admin'].includes(r.role)))
    throw new Error('Unauthorized');

  // Aggregate metrics
  // 1. Total Active Plans
  const { count: activeCount } = await supabase
    .from('user_plan_usage')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // 2. Credits Distributed vs Used (Requires Summing, Supabase doesn't have easy sum via API without RPC, but we can fetch all or use RPC)
  // Let's use RPC for efficiency
  const { data: stats, error } = await supabase.rpc('get_plan_usage_stats');
  // I need to create this RPC (get_plan_usage_stats)

  if (error) {
    // Fallback if RPC doesn't exist yet
    console.warn('RPC get_plan_usage_stats not found, returning basic count');
    return { activeCount };
  }

  return { activeCount, ...stats };
}
