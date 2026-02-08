// Payment Service - Payment Request Management
import { supabaseAdmin } from '@/lib/platform/supabase';

export interface PaymentRequest {
  id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
  description?: string;
}

export interface PaymentServiceResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

const paymentService = {
  confirmPaymentRequest: async (requestId: string): Promise<PaymentServiceResult> => {
    try {
      const { error } = await supabaseAdmin
        .from('payment_requests')
        .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to confirm payment' };
    }
  },

  rejectPaymentRequest: async (
    requestId: string,
    reason?: string
  ): Promise<PaymentServiceResult> => {
    try {
      const { error } = await supabaseAdmin
        .from('payment_requests')
        .update({ status: 'rejected', rejection_reason: reason })
        .eq('id', requestId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to reject payment' };
    }
  },

  getUserPaymentRequests: async (userId: string): Promise<PaymentRequest[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('payment_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return [];
      return (data || []) as PaymentRequest[];
    } catch {
      return [];
    }
  },

  createPaymentRequest: async (
    userId: string,
    amount: number,
    description?: string,
    status?: string,
    proof?: string,
    userName?: string
  ): Promise<PaymentServiceResult> => {
    try {
      const { error, data } = await supabaseAdmin
        .from('payment_requests')
        .insert({
          user_id: userId,
          amount,
          description,
          status: 'pending',
        })
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch {
      return { success: false, error: 'Failed to create payment request' };
    }
  },

  getPendingPaymentRequests: async (): Promise<PaymentRequest[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('payment_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) return [];
      return (data || []) as PaymentRequest[];
    } catch {
      return [];
    }
  },
};

export const getPaymentService = async () => paymentService;
