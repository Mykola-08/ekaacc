// Production-grade billing service with Supabase integration

import { supabase } from '@/lib/platform/supabase';

import {
  safeSupabaseInsert,
  safeSupabaseUpdate,
  safeSupabaseQuery,
} from '@/lib/platform/supabase/utils';

export const billingService = {
  async getBalanceForClient(clientId: string) {
    try {
      const { data: transactions, error } = await supabase

        .from('billing_transactions')

        .select('*')

        .eq('client_id', clientId)

        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching billing transactions:', error);

        throw new Error('Failed to fetch client balance');
      }

      const balance =
        transactions?.reduce((acc: number, t: any) => acc + (t.amount_eur || 0), 0) || 0;

      return { balance, transactions: transactions || [] };
    } catch (error) {
      console.error('Error in getBalanceForClient:', error);

      throw error;
    }
  },

  async applyAdjustment(clientId: string, amountEUR: number, note?: string) {
    try {
      const { data, error } = await safeSupabaseInsert<any>(
        'billing_transactions',

        {
          client_id: clientId,

          amount_eur: amountEUR,

          note: note || null,

          type: 'adjustment',

          created_at: new Date().toISOString(),
        }
      );

      if (error) {
        console.error('Error applying adjustment:', error);

        throw new Error('Failed to apply billing adjustment');
      }

      return data;
    } catch (error) {
      console.error('Error in applyAdjustment:', error);

      throw error;
    }
  },

  async createChargeForSession(
    clientId: string,
    sessionId: string,
    amountEUR: number,
    note?: string
  ) {
    try {
      const { data, error } = await safeSupabaseInsert<any>(
        'billing_transactions',

        {
          client_id: clientId,

          session_id: sessionId,

          amount_eur: -Math.abs(amountEUR),

          note: note || null,

          type: 'session_charge',

          created_at: new Date().toISOString(),
        }
      );

      if (error) {
        console.error('Error creating session charge:', error);

        throw new Error('Failed to create session charge');
      }

      return data;
    } catch (error) {
      console.error('Error in createChargeForSession:', error);

      throw error;
    }
  },

  async createCheckoutSessionForPackage(clientId: string, packageId: string, amountEUR: number) {
    try {
      // Create a pending transaction for the package purchase

      const { data: transaction, error: txError } = await safeSupabaseInsert<any>(
        'billing_transactions',

        {
          client_id: clientId,

          package_id: packageId,

          amount_eur: amountEUR,

          type: 'package_purchase_pending',

          status: 'pending',

          created_at: new Date().toISOString(),
        }
      );

      if (txError) {
        console.error('Error creating package transaction:', txError);

        throw new Error('Failed to create package purchase transaction');
      }

      // In a real implementation, you would integrate with a payment processor here

      // For now, we'll return the transaction ID for further processing

      return {
        transactionId: transaction.id,

        status: 'pending',

        amountEUR,

        nextStep: 'payment_processing_required',
      };
    } catch (error) {
      console.error('Error in createCheckoutSessionForPackage:', error);

      throw error;
    }
  },

  async getInvoicesForClient(clientId: string) {
    try {
      const { data: invoices, error } = await safeSupabaseQuery<any[]>(
        supabase

          .from('billing_invoices')

          .select('*')

          .eq('client_id', clientId)

          .order('created_at', { ascending: false })
      );

      if (error) {
        console.error('Error fetching invoices:', error);

        throw new Error('Failed to fetch client invoices');
      }

      return invoices || [];
    } catch (error) {
      console.error('Error in getInvoicesForClient:', error);

      throw error;
    }
  },

  async createInvoice(clientId: string, amountEUR: number, description?: string) {
    try {
      const { data, error } = await safeSupabaseInsert<any>(
        'billing_invoices',

        {
          client_id: clientId,

          amount_eur: amountEUR,

          description: description || null,

          status: 'open',

          created_at: new Date().toISOString(),
        }
      );

      if (error) {
        console.error('Error creating invoice:', error);

        throw new Error('Failed to create invoice');
      }

      return data;
    } catch (error) {
      console.error('Error in createInvoice:', error);

      throw error;
    }
  },

  async markInvoicePaid(invoiceId: string) {
    try {
      // Update invoice status

      const { data: invoice, error: invoiceError } = await safeSupabaseUpdate<any>(
        'billing_invoices',

        { status: 'paid', paid_at: new Date().toISOString() },

        { id: invoiceId }
      );

      if (invoiceError) {
        console.error('Error updating invoice status:', invoiceError);

        throw new Error('Failed to update invoice status');
      }

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // Create payment transaction

      const { data: transaction, error: txError } = await safeSupabaseInsert<any>(
        'billing_transactions',

        {
          client_id: invoice.client_id,

          invoice_id: invoiceId,

          amount_eur: -Math.abs(invoice.amount_eur || 0),

          note: `Invoice ${invoiceId} paid`,

          type: 'invoice_payment',

          created_at: new Date().toISOString(),
        }
      );

      if (txError) {
        console.error('Error creating payment transaction:', txError);

        // Rollback invoice status update if transaction fails

        await safeSupabaseUpdate<any>(
          'billing_invoices',

          { status: 'open' },

          { id: invoiceId }
        );

        throw new Error('Failed to create payment transaction');
      }

      return {
        invoiceId,

        transactionId: transaction.id,

        amountPaid: invoice.amount_eur,

        paidAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in markInvoicePaid:', error);

      throw error;
    }
  },

  async createWalletTopUpIntent(userId: string, amount: number) {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_mock') {
      return { clientSecret: null, error: 'Stripe not configured' };
    }

    try {
      const { stripe } = await import('@/lib/platform/services/stripe-client');

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'eur',
        metadata: { userId, type: 'wallet_topup' },
      });
      return { clientSecret: paymentIntent.client_secret, error: null };
    } catch (error) {
      console.error('Stripe createWalletTopUpIntent error:', error);
      return { clientSecret: null, error: 'Failed to create payment intent' };
    }
  },
};

export default billingService;

export const fxBilling = billingService;
