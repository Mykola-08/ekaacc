'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InvoiceRecord {
  id: string;
  created_at: string;
  amount_cents: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  description: string | null;
  stripe_invoice_id: string | null;
  stripe_invoice_url: string | null;
  period_start: string | null;
  period_end: string | null;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

export interface SubscriptionDetail {
  id: string;
  status: string;
  plan_name: string;
  plan_price: number;
  plan_currency: string;
  plan_interval: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_subscription_id: string | null;
}

// ─── Invoices ─────────────────────────────────────────────────────────────────

export async function getInvoices(): Promise<InvoiceRecord[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Try fetching from billing_invoices table
  const { data, error } = await supabase
    .from('billing_invoices')
    .select('id, created_at, amount_eur, currency, status, description, stripe_invoice_id, stripe_invoice_url, period_start, period_end')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching invoices:', error);
    // Fallback: derive from wallet transactions
    const { data: txData } = await supabase
      .from('wallet_transactions')
      .select('id, created_at, amount, type, description')
      .eq('user_id', user.id)
      .in('type', ['credit', 'debit', 'purchase', 'deposit'])
      .order('created_at', { ascending: false })
      .limit(20);

    return (txData || []).map((tx: any) => ({
      id: tx.id,
      created_at: tx.created_at,
      amount_cents: Math.abs(tx.amount || tx.amount_cents || 0),
      currency: 'EUR',
      status: 'paid' as const,
      description: tx.description,
      stripe_invoice_id: null,
      stripe_invoice_url: null,
      period_start: null,
      period_end: null,
    }));
  }

  return (data || []).map((inv: any) => ({
    id: inv.id,
    created_at: inv.created_at,
    amount_cents: Math.round((inv.amount_eur || 0) * 100),
    currency: inv.currency || 'EUR',
    status: inv.status || 'paid',
    description: inv.description,
    stripe_invoice_id: inv.stripe_invoice_id || null,
    stripe_invoice_url: inv.stripe_invoice_url || null,
    period_start: inv.period_start || null,
    period_end: inv.period_end || null,
  }));
}

// ─── Subscription ─────────────────────────────────────────────────────────────

export async function getSubscription(): Promise<SubscriptionDetail | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, tier:subscription_tiers(*)')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing'])
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    status: data.status,
    plan_name: data.tier?.name || 'Standard',
    plan_price: data.tier?.monthly_price || 0,
    plan_currency: data.tier?.currency || 'EUR',
    plan_interval: 'month',
    current_period_end: data.current_period_end,
    cancel_at_period_end: data.cancel_at_period_end || false,
    stripe_subscription_id: data.stripe_subscription_id || null,
  };
}

// ─── Payment Methods ──────────────────────────────────────────────────────────

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Fetch from Stripe via profile's customer ID
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_customer_id) return [];

  try {
    const { listCustomerPaymentMethods } = await import(
      '@/lib/platform/services/stripe-client'
    );
    const methods = await listCustomerPaymentMethods(profile.stripe_customer_id);

    // Get default payment method
    const { stripe } = await import('@/lib/platform/services/stripe-client');
    const customer = await stripe.customers.retrieve(profile.stripe_customer_id) as any;
    const defaultPm = customer?.invoice_settings?.default_payment_method;

    return methods.map((m) => ({
      id: m.id,
      brand: m.card?.brand || 'unknown',
      last4: m.card?.last4 || '****',
      exp_month: m.card?.exp_month || 0,
      exp_year: m.card?.exp_year || 0,
      is_default: m.id === defaultPm,
    }));
  } catch (err) {
    console.error('Error fetching payment methods:', err);
    return [];
  }
}

// ─── Download Invoice ─────────────────────────────────────────────────────────

export async function getInvoiceDownloadUrl(invoiceId: string): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Check the invoice belongs to this user
  const { data: invoice } = await supabase
    .from('billing_invoices')
    .select('stripe_invoice_id')
    .eq('id', invoiceId)
    .eq('client_id', user.id)
    .single();

  if (!invoice?.stripe_invoice_id) return null;

  try {
    const { stripe } = await import('@/lib/platform/services/stripe-client');
    const stripeInvoice = await stripe.invoices.retrieve(invoice.stripe_invoice_id);
    return stripeInvoice.invoice_pdf || stripeInvoice.hosted_invoice_url || null;
  } catch {
    return null;
  }
}
