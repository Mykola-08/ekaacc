/**
 * @file Payment Service - Supabase Implementation
 * @description Service for managing payment requests (Bizum and Cash) using Supabase.
 * Replaces Firebase Firestore with Supabase for production-grade backend integration.
 */

import type { PaymentRequest, PaymentMethod, PaymentStatus } from '@/lib/wallet-types';
import { supabase, supabaseAdmin } from '@/lib/supabase';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

/**
 * Payment Service Interface
 */
export interface IPaymentService {
  requestPayment(options: {
    userId: string;
    amount: number;
    method: PaymentMethod;
    description: string;
  }): Promise<{ proof: string }>;

  markAsPaid(requestId: string): Promise<void>;
  // Payment Requests
  createPaymentRequest(
    userId: string,
    amount: number,
    method: PaymentMethod,
    description: string,
    proofImageUrl?: string,
    proofText?: string,
    metadata?: any
  ): Promise<PaymentRequest>;
  
  getPaymentRequest(requestId: string): Promise<PaymentRequest | null>;
  getUserPaymentRequests(userId: string): Promise<PaymentRequest[]>;
  getPendingPaymentRequests(): Promise<PaymentRequest[]>;
  
  confirmPaymentRequest(
    requestId: string,
    confirmedBy: string,
    confirmedByName: string,
    confirmedByRole: 'Admin' | 'Therapist'
  ): Promise<PaymentRequest>;
  
  rejectPaymentRequest(
    requestId: string,
    confirmedBy: string,
    confirmedByName: string,
    confirmedByRole: 'Admin' | 'Therapist',
    reason: string
  ): Promise<PaymentRequest>;
  
  cancelPaymentRequest(requestId: string, userId: string): Promise<PaymentRequest>;
}

/**
 * Supabase Payment Service Implementation
 */
class SupabasePaymentService implements IPaymentService {
  private static instance: SupabasePaymentService;

  static getInstance(): SupabasePaymentService {
    if (!SupabasePaymentService.instance) {
      SupabasePaymentService.instance = new SupabasePaymentService();
    }
    return SupabasePaymentService.instance;
  }

  async requestPayment(options: {
    userId: string;
    amount: number;
    method: PaymentMethod;
    description: string;
  }): Promise<{ proof: string }> {
    const { userId, amount, method, description } = options;
    
    // Generate a simple proof of payment request
    const proofText = `Payment request: ${description} - ${amount}€ via ${method} for user ${userId}`;
    
    // Create the payment request in Supabase
    await this.createPaymentRequest(
      userId,
      amount,
      method,
      description,
      undefined,
      proofText
    );
    
    return { proof: proofText };
  }

  async markAsPaid(requestId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('payment_requests')
      .update({ 
        status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (error) {
      throw new Error(`Failed to mark payment as paid: ${error.message}`);
    }
  }

  async createPaymentRequest(
    userId: string,
    amount: number,
    method: PaymentMethod,
    description: string,
    proofImageUrl?: string,
    proofText?: string,
    metadata?: any
  ): Promise<PaymentRequest> {
    // Get user information from profiles table
    let userName = 'Unknown User';
    let userEmail = '';

    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('full_name, email')
        .eq('id', userId)
        .single();

      if (!error && profile) {
        userName = profile.full_name || userName;
        userEmail = profile.email || userEmail;
      }
    } catch (error) {
      console.warn(`Unable to load user profile for payment request ${userId}`, error);
    }

    const requestData = {
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      amount,
      currency: 'EUR' as const,
      method,
      status: 'pending' as const,
      description,
      proof_image_url: proofImageUrl,
      proof_text: proofText,
      metadata: metadata ? JSON.stringify(metadata) : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    const { data, error } = await supabaseAdmin
      .from('payment_requests')
      .insert(requestData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create payment request: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      userEmail: data.user_email,
      amount: data.amount,
      currency: data.currency,
      method: data.method,
      status: data.status,
      description: data.description,
      proofImageUrl: data.proof_image_url,
      proofText: data.proof_text,
      metadata: data.metadata ? JSON.parse(data.metadata) : undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      expiresAt: data.expires_at,
      confirmedAt: data.confirmed_at,
      confirmedBy: data.confirmed_by,
      confirmedByName: data.confirmed_by_name,
      confirmedByRole: data.confirmed_by_role,
      rejectionReason: data.rejection_reason,
    } as PaymentRequest;
  }

  async getPaymentRequest(requestId: string): Promise<PaymentRequest | null> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      userEmail: data.user_email,
      amount: data.amount,
      currency: data.currency,
      method: data.method,
      status: data.status,
      description: data.description,
      proofImageUrl: data.proof_image_url,
      proofText: data.proof_text,
      metadata: data.metadata ? JSON.parse(data.metadata) : undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      expiresAt: data.expires_at,
      confirmedAt: data.confirmed_at,
      confirmedBy: data.confirmed_by,
      confirmedByName: data.confirmed_by_name,
      confirmedByRole: data.confirmed_by_role,
      rejectionReason: data.rejection_reason,
    } as PaymentRequest;
  }

  async getUserPaymentRequests(userId: string): Promise<PaymentRequest[]> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get user payment requests: ${error.message}`);
    }

    return (data || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      userName: item.user_name,
      userEmail: item.user_email,
      amount: item.amount,
      currency: item.currency,
      method: item.method,
      status: item.status,
      description: item.description,
      proofImageUrl: item.proof_image_url,
      proofText: item.proof_text,
      metadata: item.metadata ? JSON.parse(item.metadata) : undefined,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      expiresAt: item.expires_at,
      confirmedAt: item.confirmed_at,
      confirmedBy: item.confirmed_by,
      confirmedByName: item.confirmed_by_name,
      confirmedByRole: item.confirmed_by_role,
      rejectionReason: item.rejection_reason,
    } as PaymentRequest));
  }

  async getPendingPaymentRequests(): Promise<PaymentRequest[]> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to get pending payment requests: ${error.message}`);
    }

    return (data || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      userName: item.user_name,
      userEmail: item.user_email,
      amount: item.amount,
      currency: item.currency,
      method: item.method,
      status: item.status,
      description: item.description,
      proofImageUrl: item.proof_image_url,
      proofText: item.proof_text,
      metadata: item.metadata ? JSON.parse(item.metadata) : undefined,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      expiresAt: item.expires_at,
      confirmedAt: item.confirmed_at,
      confirmedBy: item.confirmed_by,
      confirmedByName: item.confirmed_by_name,
      confirmedByRole: item.confirmed_by_role,
      rejectionReason: item.rejection_reason,
    } as PaymentRequest));
  }

  async confirmPaymentRequest(
    requestId: string,
    confirmedBy: string,
    confirmedByName: string,
    confirmedByRole: 'Admin' | 'Therapist'
  ): Promise<PaymentRequest> {
    // Get current request
    const currentRequest = await this.getPaymentRequest(requestId);
    if (!currentRequest) {
      throw new Error('Payment request not found');
    }

    if (currentRequest.status !== 'pending') {
      throw new Error('Can only confirm pending payment requests');
    }

    const { data, error } = await supabaseAdmin
      .from('payment_requests')
      .update({ 
        status: 'confirmed',
        confirmed_by: confirmedBy,
        confirmed_by_name: confirmedByName,
        confirmed_by_role: confirmedByRole,
        confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to confirm payment request: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      userEmail: data.user_email,
      amount: data.amount,
      currency: data.currency,
      method: data.method,
      status: data.status,
      description: data.description,
      proofImageUrl: data.proof_image_url,
      proofText: data.proof_text,
      metadata: data.metadata ? JSON.parse(data.metadata) : undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      expiresAt: data.expires_at,
      confirmedAt: data.confirmed_at,
      confirmedBy: data.confirmed_by,
      confirmedByName: data.confirmed_by_name,
      confirmedByRole: data.confirmed_by_role,
      rejectionReason: data.rejection_reason,
    } as PaymentRequest;
  }

  async rejectPaymentRequest(
    requestId: string,
    confirmedBy: string,
    confirmedByName: string,
    confirmedByRole: 'Admin' | 'Therapist',
    reason: string
  ): Promise<PaymentRequest> {
    const currentRequest = await this.getPaymentRequest(requestId);
    if (!currentRequest) {
      throw new Error('Payment request not found');
    }

    if (currentRequest.status !== 'pending') {
      throw new Error('Can only reject pending payment requests');
    }

    const { data, error } = await supabaseAdmin
      .from('payment_requests')
      .update({ 
        status: 'rejected',
        confirmed_by: confirmedBy,
        confirmed_by_name: confirmedByName,
        confirmed_by_role: confirmedByRole,
        rejection_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to reject payment request: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      userEmail: data.user_email,
      amount: data.amount,
      currency: data.currency,
      method: data.method,
      status: data.status,
      description: data.description,
      proofImageUrl: data.proof_image_url,
      proofText: data.proof_text,
      metadata: data.metadata ? JSON.parse(data.metadata) : undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      expiresAt: data.expires_at,
      confirmedAt: data.confirmed_at,
      confirmedBy: data.confirmed_by,
      confirmedByName: data.confirmed_by_name,
      confirmedByRole: data.confirmed_by_role,
      rejectionReason: data.rejection_reason,
    } as PaymentRequest;
  }

  async cancelPaymentRequest(requestId: string, userId: string): Promise<PaymentRequest> {
    const currentRequest = await this.getPaymentRequest(requestId);
    if (!currentRequest) {
      throw new Error('Payment request not found');
    }

    if (currentRequest.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (currentRequest.status !== 'pending') {
      throw new Error('Can only cancel pending payment requests');
    }

    const { data, error } = await supabaseAdmin
      .from('payment_requests')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to cancel payment request: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      userEmail: data.user_email,
      amount: data.amount,
      currency: data.currency,
      method: data.method,
      status: data.status,
      description: data.description,
      proofImageUrl: data.proof_image_url,
      proofText: data.proof_text,
      metadata: data.metadata ? JSON.parse(data.metadata) : undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      expiresAt: data.expires_at,
      confirmedAt: data.confirmed_at,
      confirmedBy: data.confirmed_by,
      confirmedByName: data.confirmed_by_name,
      confirmedByRole: data.confirmed_by_role,
      rejectionReason: data.rejection_reason,
    } as PaymentRequest;
  }
}

/**
 * Mock Payment Service Implementation
 */
class MockPaymentService implements IPaymentService {
  private static instance: MockPaymentService;
  private paymentRequests: Map<string, PaymentRequest> = new Map();

  static getInstance(): MockPaymentService {
    if (!MockPaymentService.instance) {
      MockPaymentService.instance = new MockPaymentService();
    }
    return MockPaymentService.instance;
  }

  async requestPayment(options: {
    userId: string;
    amount: number;
    method: PaymentMethod;
    description: string;
  }): Promise<{ proof: string }> {
    const { userId, amount, method, description } = options;
    const proofText = `Payment request: ${description} - ${amount}€ via ${method} for user ${userId}`;
    
    await this.createPaymentRequest(
      userId,
      amount,
      method,
      description,
      undefined,
      proofText
    );
    
    return { proof: proofText };
  }

  async markAsPaid(requestId: string): Promise<void> {
    const request = this.paymentRequests.get(requestId);
    if (request) {
      request.status = 'pending';
      request.updatedAt = new Date().toISOString();
    }
  }

  async createPaymentRequest(
    userId: string,
    amount: number,
    method: PaymentMethod,
    description: string,
    proofImageUrl?: string,
    proofText?: string,
    metadata?: any
  ): Promise<PaymentRequest> {
    const request: PaymentRequest = {
      id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName: 'Mock User',
      userEmail: 'mock@example.com',
      amount,
      currency: 'EUR',
      method,
      status: 'pending',
      description,
      proofImageUrl,
      proofText,
      metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    this.paymentRequests.set(request.id, request);
    return request;
  }

  async getPaymentRequest(requestId: string): Promise<PaymentRequest | null> {
    return this.paymentRequests.get(requestId) || null;
  }

  async getUserPaymentRequests(userId: string): Promise<PaymentRequest[]> {
    return Array.from(this.paymentRequests.values())
      .filter(request => request.userId === userId && request.status === 'pending');
  }

  async getPendingPaymentRequests(): Promise<PaymentRequest[]> {
    return Array.from(this.paymentRequests.values())
      .filter(request => request.status === 'pending')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async confirmPaymentRequest(
    requestId: string,
    confirmedBy: string,
    confirmedByName: string,
    confirmedByRole: 'Admin' | 'Therapist'
  ): Promise<PaymentRequest> {
    const request = this.paymentRequests.get(requestId);
    if (!request) {
      throw new Error('Payment request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Can only confirm pending payment requests');
    }

    request.status = 'confirmed';
    request.confirmedBy = confirmedBy;
    request.confirmedByName = confirmedByName;
    request.confirmedByRole = confirmedByRole;
    request.confirmedAt = new Date().toISOString();
    request.updatedAt = new Date().toISOString();

    return request;
  }

  async rejectPaymentRequest(
    requestId: string,
    confirmedBy: string,
    confirmedByName: string,
    confirmedByRole: 'Admin' | 'Therapist',
    reason: string
  ): Promise<PaymentRequest> {
    const request = this.paymentRequests.get(requestId);
    if (!request) {
      throw new Error('Payment request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Can only reject pending payment requests');
    }

    request.status = 'rejected';
    request.confirmedBy = confirmedBy;
    request.confirmedByName = confirmedByName;
    request.confirmedByRole = confirmedByRole;
    request.rejectionReason = reason;
    request.updatedAt = new Date().toISOString();

    return request;
  }

  async cancelPaymentRequest(requestId: string, userId: string): Promise<PaymentRequest> {
    const request = this.paymentRequests.get(requestId);
    if (!request) {
      throw new Error('Payment request not found');
    }

    if (request.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (request.status !== 'pending') {
      throw new Error('Can only cancel pending payment requests');
    }

    request.status = 'cancelled';
    request.updatedAt = new Date().toISOString();

    return request;
  }
}

/**
 * Get the active payment service implementation
 */
export async function getPaymentService(): Promise<IPaymentService> {
  if (USE_MOCK_DATA) {
    return MockPaymentService.getInstance();
  } else {
    return SupabasePaymentService.getInstance();
  }
}

// Export default for convenience
const paymentService = USE_MOCK_DATA
  ? MockPaymentService.getInstance()
  : SupabasePaymentService.getInstance();

export default paymentService;
