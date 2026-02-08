'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function buyPlan(planId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  // 1. Fetch Plan Details
  const { data: plan } = await supabase
    .from('plan_definition')
    .select('*')
    .eq('id', planId)
    .single();

  if (!plan) return { error: 'Plan not found' };

  // 2. Fetch Wallet Balance
  // We'll use a transaction block (RPC) ideally, but for now we do optimistic check + DB Constraint
  // Actually, let's create a dedicated RPC for "purchase_plan" to make it atomic.
  // However, writing a new migration just for this takes time.
  // Let's use the robust wallet tables directly if we have access, or call a simplified flow.

  // We will do a direct SQL call via RPC to a new function we'll define in a migration,
  // OR we can try to do it via JS logic if row locking isn't critical for MVP.
  // Given the request for "robustness", an SQL function `purchase_plan_via_wallet` is best.

  // Changing approach: I will create a Migration for `purchase_plan_via_wallet` function first.
  // But to save turn time, I will include the SQL execution here if possible? No, I must use migration file.

  // Wait, I can try to do it in JS with optimistic locking if traffic is low.
  // 1. Get Wallet. 2. Check Balance. 3. Decrement Balance. 4. Assign Plan.
  // If step 3 fails (balance check constraint), we abort.

  const { data: wallet } = await supabase
    .from('wallets')
    .select('id, balance_cents')
    .eq('user_id', user.id)
    .single();

  if (!wallet || wallet.balance_cents < plan.price_cents) {
    return { error: 'Insufficient balance' };
  }

  // Perform Transaction
  // 1. Deduct Balance
  const { error: deductionError } = await supabase.rpc('deduct_wallet_balance', {
    p_user_id: user.id,
    p_amount_cents: plan.price_cents,
    p_description: `Purchase: ${plan.name}`,
    p_reference_id: plan.id,
  });

  // Note: deduct_wallet_balance might not exist yet if not in previous migration.
  // The previous migration file `robust_wallet.sql` had `top_up_wallet`.
  // It did NOT have deduct. I need to add `deduct_wallet_balance` migration.

  // I will write the migration for deduction and purchase transaction now.
  return { error: 'Migration needed for atomic purchase' };
}
