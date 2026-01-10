'use server';

import { walletService } from '@/services/wallet-service';
import { stripeService } from '@/services/stripe-service';
import { createClient } from '@/lib/platform/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getWalletBalanceAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  try {
    const balance = await walletService.getBalance(user.id);
    return { success: true, balance };
  } catch (error) {
    return { error: 'Failed to fetch balance' };
  }
}

export async function createWalletTopUpIntentAction(amount: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  try {
    const intent = await stripeService.createWalletTopUpIntent(user.id, amount);
    return { success: true, clientSecret: intent.clientSecret };
  } catch (error) {
    console.error('Top-up intent creation failed:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create top-up intent' };
  }
}
