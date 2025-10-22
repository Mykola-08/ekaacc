/**
 * @file Payment Service
 * @description Service for managing payment requests (Bizum and Cash).
 * Supports both mock data (for development) and Firestore (for production).
 */

import type { PaymentRequest, PaymentMethod, PaymentStatus } from '@/lib/wallet-types';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

/**
 * Payment Service Interface
 */
export interface IPaymentService {
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
 * Mock Payment Service Implementation
 */
class MockPaymentService implements IPaymentService {
  private static instance: MockPaymentService;
  private paymentRequests: Map<string, PaymentRequest> = new Map();

  private constructor() {
    this.initializeMockData();
  }

  static getInstance(): MockPaymentService {
    if (!MockPaymentService.instance) {
      MockPaymentService.instance = new MockPaymentService();
    }
    return MockPaymentService.instance;
  }

  private initializeMockData() {
    // Create some sample payment requests
    const sampleRequests: PaymentRequest[] = [
      {
        id: 'pay_1',
        userId: 'test-user',
        userName: 'Test User',
        userEmail: 'test@example.com',
        amount: 50,
        currency: 'EUR',
        method: 'bizum',
        status: 'pending',
        description: 'Payment for therapy session',
        proofText: 'REF123456',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'pay_2',
        userId: 'test-user',
        userName: 'Test User',
        userEmail: 'test@example.com',
        amount: 100,
        currency: 'EUR',
        method: 'cash',
        status: 'confirmed',
        description: 'Cash deposit',
        confirmedBy: 'admin-1',
        confirmedByName: 'Admin User',
        confirmedByRole: 'Admin',
        confirmedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    sampleRequests.forEach(req => {
      this.paymentRequests.set(req.id, req);
    });
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
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName: 'Mock User', // Would come from user service
      userEmail: 'mock@example.com', // Would come from user service
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
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    this.paymentRequests.set(request.id, request);
    return request;
  }

  async getPaymentRequest(requestId: string): Promise<PaymentRequest | null> {
    return this.paymentRequests.get(requestId) || null;
  }

  async getUserPaymentRequests(userId: string): Promise<PaymentRequest[]> {
    return Array.from(this.paymentRequests.values())
      .filter(req => req.userId === userId)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt as string).getTime();
        const dateB = new Date(b.createdAt as string).getTime();
        return dateB - dateA;
      });
  }

  async getPendingPaymentRequests(): Promise<PaymentRequest[]> {
    return Array.from(this.paymentRequests.values())
      .filter(req => req.status === 'pending')
      .sort((a, b) => {
        const dateA = new Date(a.createdAt as string).getTime();
        const dateB = new Date(b.createdAt as string).getTime();
        return dateA - dateB;
      });
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

    // In real implementation, this would trigger:
    // 1. Wallet credit via Cloud Function
    // 2. Transaction record creation
    // 3. Notification to user
    
    console.log(`Payment request ${requestId} confirmed. Would credit ${request.amount} EUR to user ${request.userId}'s wallet.`);

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
 * Firestore Payment Service Implementation
 */
class FirestorePaymentService implements IPaymentService {
  private static instance: FirestorePaymentService;

  private constructor() {}

  static getInstance(): FirestorePaymentService {
    if (!FirestorePaymentService.instance) {
      FirestorePaymentService.instance = new FirestorePaymentService();
    }
    return FirestorePaymentService.instance;
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
    const { getFirestore, collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const db = getFirestore();
    
    // Would need to get user data from users collection
    const requestData = {
      userId,
      userName: 'User Name', // TODO: Get from user document
      userEmail: 'user@example.com', // TODO: Get from user document
      amount,
      currency: 'EUR' as const,
      method,
      status: 'pending' as const,
      description,
      proofImageUrl,
      proofText,
      metadata,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    const docRef = await addDoc(collection(db, 'paymentRequests'), requestData);
    
    return {
      ...requestData,
      id: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: requestData.expiresAt.toISOString(),
    } as PaymentRequest;
  }

  async getPaymentRequest(requestId: string): Promise<PaymentRequest | null> {
    const { getFirestore, doc, getDoc } = await import('firebase/firestore');
    const db = getFirestore();
    const requestRef = doc(db, 'paymentRequests', requestId);
    const requestSnap = await getDoc(requestRef);
    
    if (!requestSnap.exists()) {
      return null;
    }

    const data = requestSnap.data();
    return {
      ...data,
      id: requestSnap.id,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      confirmedAt: data.confirmedAt?.toDate?.()?.toISOString() || data.confirmedAt,
      expiresAt: data.expiresAt?.toDate?.()?.toISOString() || data.expiresAt,
    } as PaymentRequest;
  }

  async getUserPaymentRequests(userId: string): Promise<PaymentRequest[]> {
    const { getFirestore, collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
    const db = getFirestore();
    const requestsRef = collection(db, 'paymentRequests');
    const q = query(requestsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
      confirmedAt: doc.data().confirmedAt?.toDate?.()?.toISOString() || doc.data().confirmedAt,
      expiresAt: doc.data().expiresAt?.toDate?.()?.toISOString() || doc.data().expiresAt,
    } as PaymentRequest));
  }

  async getPendingPaymentRequests(): Promise<PaymentRequest[]> {
    const { getFirestore, collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
    const db = getFirestore();
    const requestsRef = collection(db, 'paymentRequests');
    const q = query(requestsRef, where('status', '==', 'pending'), orderBy('createdAt', 'asc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
      confirmedAt: doc.data().confirmedAt?.toDate?.()?.toISOString() || doc.data().confirmedAt,
      expiresAt: doc.data().expiresAt?.toDate?.()?.toISOString() || doc.data().expiresAt,
    } as PaymentRequest));
  }

  async confirmPaymentRequest(
    requestId: string,
    confirmedBy: string,
    confirmedByName: string,
    confirmedByRole: 'Admin' | 'Therapist'
  ): Promise<PaymentRequest> {
    const { getFirestore, doc, updateDoc, serverTimestamp, getDoc } = await import('firebase/firestore');
    const db = getFirestore();
    const requestRef = doc(db, 'paymentRequests', requestId);
    
    // Get current request
    const requestSnap = await getDoc(requestRef);
    if (!requestSnap.exists()) {
      throw new Error('Payment request not found');
    }

    const currentData = requestSnap.data();
    if (currentData.status !== 'pending') {
      throw new Error('Can only confirm pending payment requests');
    }

    // Update request
    await updateDoc(requestRef, {
      status: 'confirmed',
      confirmedBy,
      confirmedByName,
      confirmedByRole,
      confirmedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // In production, this would trigger a Cloud Function to:
    // 1. Credit the user's wallet
    // 2. Create transaction record
    // 3. Send notification
    
    // Return updated request
    const updated = await getDoc(requestRef);
    const data = updated.data()!;
    return {
      ...data,
      id: updated.id,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      confirmedAt: data.confirmedAt?.toDate?.()?.toISOString() || data.confirmedAt,
      expiresAt: data.expiresAt?.toDate?.()?.toISOString() || data.expiresAt,
    } as PaymentRequest;
  }

  async rejectPaymentRequest(
    requestId: string,
    confirmedBy: string,
    confirmedByName: string,
    confirmedByRole: 'Admin' | 'Therapist',
    reason: string
  ): Promise<PaymentRequest> {
    const { getFirestore, doc, updateDoc, serverTimestamp, getDoc } = await import('firebase/firestore');
    const db = getFirestore();
    const requestRef = doc(db, 'paymentRequests', requestId);
    
    const requestSnap = await getDoc(requestRef);
    if (!requestSnap.exists()) {
      throw new Error('Payment request not found');
    }

    const currentData = requestSnap.data();
    if (currentData.status !== 'pending') {
      throw new Error('Can only reject pending payment requests');
    }

    await updateDoc(requestRef, {
      status: 'rejected',
      confirmedBy,
      confirmedByName,
      confirmedByRole,
      rejectionReason: reason,
      updatedAt: serverTimestamp(),
    });

    const updated = await getDoc(requestRef);
    const data = updated.data()!;
    return {
      ...data,
      id: updated.id,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      confirmedAt: data.confirmedAt?.toDate?.()?.toISOString() || data.confirmedAt,
      expiresAt: data.expiresAt?.toDate?.()?.toISOString() || data.expiresAt,
    } as PaymentRequest;
  }

  async cancelPaymentRequest(requestId: string, userId: string): Promise<PaymentRequest> {
    const { getFirestore, doc, updateDoc, serverTimestamp, getDoc } = await import('firebase/firestore');
    const db = getFirestore();
    const requestRef = doc(db, 'paymentRequests', requestId);
    
    const requestSnap = await getDoc(requestRef);
    if (!requestSnap.exists()) {
      throw new Error('Payment request not found');
    }

    const currentData = requestSnap.data();
    if (currentData.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (currentData.status !== 'pending') {
      throw new Error('Can only cancel pending payment requests');
    }

    await updateDoc(requestRef, {
      status: 'cancelled',
      updatedAt: serverTimestamp(),
    });

    const updated = await getDoc(requestRef);
    const data = updated.data()!;
    return {
      ...data,
      id: updated.id,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      confirmedAt: data.confirmedAt?.toDate?.()?.toISOString() || data.confirmedAt,
      expiresAt: data.expiresAt?.toDate?.()?.toISOString() || data.expiresAt,
    } as PaymentRequest;
  }
}

/**
 * Get the active payment service implementation
 */
export async function getPaymentService(): Promise<IPaymentService> {
  if (USE_MOCK_DATA) {
    return MockPaymentService.getInstance();
  } else {
    return FirestorePaymentService.getInstance();
  }
}

// Export default for convenience
const paymentService = USE_MOCK_DATA
  ? MockPaymentService.getInstance()
  : FirestorePaymentService.getInstance();

export default paymentService;
