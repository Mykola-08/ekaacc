/**
 * @file Referral Service
 * @description Service for managing referral codes, tracking referrals, and distributing rewards.
 * Supports both mock data (for development) and Firestore (for production).
 */

import type {
  Referral,
  ReferralCode,
  ReferralSettings,
  ReferralStatus,
} from '@/lib/wallet-types';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

// Default referral settings
const DEFAULT_REFERRAL_SETTINGS: ReferralSettings = {
  isEnabled: true,
  referrerRewardAmount: parseFloat(process.env.NEXT_PUBLIC_REFERRER_REWARD_EUR || '10'),
  referrerRewardPoints: parseInt(process.env.NEXT_PUBLIC_REFERRER_REWARD_POINTS || '100'),
  refereeRewardAmount: parseFloat(process.env.NEXT_PUBLIC_REFEREE_REWARD_EUR || '5'),
  refereeRewardPoints: parseInt(process.env.NEXT_PUBLIC_REFEREE_REWARD_POINTS || '50'),
  requiresCompletion: true,
  completionRequirement: 'Complete first therapy session',
  codePrefix: process.env.NEXT_PUBLIC_REFERRAL_CODE_PREFIX || 'EKA',
  codeLength: parseInt(process.env.NEXT_PUBLIC_REFERRAL_CODE_LENGTH || '8'),
  allowCustomCodes: false,
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
};

/**
 * Referral Service Interface
 */
export interface IReferralService {
  // Settings
  getReferralSettings(): Promise<ReferralSettings>;
  updateReferralSettings(settings: Partial<ReferralSettings>, adminId: string): Promise<ReferralSettings>;
  
  // Referral Codes
  generateReferralCode(userId: string, userName: string, customCode?: string): Promise<ReferralCode>;
  getReferralCode(userId: string): Promise<ReferralCode | null>;
  getReferralCodeByCode(code: string): Promise<ReferralCode | null>;
  validateReferralCode(code: string): Promise<{ valid: boolean; error?: string; referralCode?: ReferralCode }>;
  
  // Referrals
  createReferral(referralCode: string, refereeId: string, refereeName: string, refereeEmail: string): Promise<Referral>;
  getReferral(referralId: string): Promise<Referral | null>;
  getUserReferrals(userId: string): Promise<Referral[]>; // Referrals where user is referrer
  markReferralComplete(referralId: string): Promise<Referral>;
  
  // Statistics
  getReferralStats(userId: string): Promise<{
    totalReferrals: number;
    completedReferrals: number;
    pendingReferrals: number;
    totalRewardsEarned: number;
    totalPointsEarned: number;
  }>;
}

/**
 * Helper function to generate random referral code
 */
function generateCode(prefix: string, length: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding ambiguous characters
  const codeLength = length - prefix.length;
  let code = prefix;
  
  for (let i = 0; i < codeLength; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}

/**
 * Mock Referral Service Implementation
 */
class MockReferralService implements IReferralService {
  private static instance: MockReferralService;
  private settings: ReferralSettings;
  private referralCodes: Map<string, ReferralCode> = new Map();
  private referrals: Map<string, Referral> = new Map();
  private codesByCode: Map<string, ReferralCode> = new Map();

  private constructor() {
    this.settings = { ...DEFAULT_REFERRAL_SETTINGS };
    this.initializeMockData();
  }

  static getInstance(): MockReferralService {
    if (!MockReferralService.instance) {
      MockReferralService.instance = new MockReferralService();
    }
    return MockReferralService.instance;
  }

  private initializeMockData() {
    // Create sample referral code
    const sampleCode: ReferralCode = {
      id: 'ref_code_1',
      code: 'EKA2024ABC',
      userId: 'test-user',
      userName: 'Test User',
      isActive: true,
      usageCount: 2,
      usageLimit: undefined,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      updatedAt: new Date().toISOString(),
    };
    this.referralCodes.set('test-user', sampleCode);
    this.codesByCode.set('EKA2024ABC', sampleCode);

    // Create sample referrals
    const completedReferral: Referral = {
      id: 'ref_1',
      referralCode: 'EKA2024ABC',
      referrerId: 'test-user',
      referrerName: 'Test User',
      refereeId: 'referee-1',
      refereeName: 'Jane Smith',
      refereeEmail: 'jane@example.com',
      status: 'completed',
      referrerRewardAmount: 10,
      referrerRewardPoints: 100,
      refereeRewardAmount: 5,
      refereeRewardPoints: 50,
      referrerRewardPaid: true,
      refereeRewardPaid: true,
      rewardsPaidAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      completionRequirement: 'Complete first therapy session',
      completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      registeredAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const pendingReferral: Referral = {
      id: 'ref_2',
      referralCode: 'EKA2024ABC',
      referrerId: 'test-user',
      referrerName: 'Test User',
      refereeId: 'referee-2',
      refereeName: 'John Doe',
      refereeEmail: 'john@example.com',
      status: 'registered',
      referrerRewardAmount: 10,
      referrerRewardPoints: 100,
      refereeRewardAmount: 5,
      refereeRewardPoints: 50,
      referrerRewardPaid: false,
      refereeRewardPaid: false,
      completionRequirement: 'Complete first therapy session',
      registeredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    };

    this.referrals.set('ref_1', completedReferral);
    this.referrals.set('ref_2', pendingReferral);
  }

  async getReferralSettings(): Promise<ReferralSettings> {
    return { ...this.settings };
  }

  async updateReferralSettings(updates: Partial<ReferralSettings>, adminId: string): Promise<ReferralSettings> {
    this.settings = {
      ...this.settings,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: adminId,
    };
    return { ...this.settings };
  }

  async generateReferralCode(userId: string, userName: string, customCode?: string): Promise<ReferralCode> {
    // Check if user already has a code
    const existing = this.referralCodes.get(userId);
    if (existing) {
      throw new Error('User already has a referral code');
    }

    // Generate or validate custom code
    let code: string;
    if (customCode && this.settings.allowCustomCodes) {
      // Validate custom code
      if (this.codesByCode.has(customCode)) {
        throw new Error('Code already in use');
      }
      code = customCode.toUpperCase();
    } else {
      // Generate unique code
      do {
        code = generateCode(this.settings.codePrefix, this.settings.codeLength);
      } while (this.codesByCode.has(code));
    }

    const referralCode: ReferralCode = {
      id: `ref_code_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      code,
      userId,
      userName,
      isActive: true,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.referralCodes.set(userId, referralCode);
    this.codesByCode.set(code, referralCode);

    return referralCode;
  }

  async getReferralCode(userId: string): Promise<ReferralCode | null> {
    return this.referralCodes.get(userId) || null;
  }

  async getReferralCodeByCode(code: string): Promise<ReferralCode | null> {
    return this.codesByCode.get(code.toUpperCase()) || null;
  }

  async validateReferralCode(code: string): Promise<{ valid: boolean; error?: string; referralCode?: ReferralCode }> {
    if (!this.settings.isEnabled) {
      return { valid: false, error: 'Referral program is currently disabled' };
    }

    const referralCode = await this.getReferralCodeByCode(code);

    if (!referralCode) {
      return { valid: false, error: 'Invalid referral code' };
    }

    if (!referralCode.isActive) {
      return { valid: false, error: 'Referral code is no longer active' };
    }

    if (referralCode.usageLimit && referralCode.usageCount >= referralCode.usageLimit) {
      return { valid: false, error: 'Referral code has reached its usage limit' };
    }

    if (referralCode.expiresAt && new Date(referralCode.expiresAt as string) < new Date()) {
      return { valid: false, error: 'Referral code has expired' };
    }

    return { valid: true, referralCode };
  }

  async createReferral(
    referralCode: string,
    refereeId: string,
    refereeName: string,
    refereeEmail: string
  ): Promise<Referral> {
    const validation = await this.validateReferralCode(referralCode);
    
    if (!validation.valid || !validation.referralCode) {
      throw new Error(validation.error || 'Invalid referral code');
    }

    const code = validation.referralCode;

    // Create referral
    const referral: Referral = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      referralCode: code.code,
      referrerId: code.userId,
      referrerName: code.userName,
      refereeId,
      refereeName,
      refereeEmail,
      status: 'registered',
      referrerRewardAmount: this.settings.referrerRewardAmount,
      referrerRewardPoints: this.settings.referrerRewardPoints,
      refereeRewardAmount: this.settings.refereeRewardAmount,
      refereeRewardPoints: this.settings.refereeRewardPoints,
      referrerRewardPaid: false,
      refereeRewardPaid: false,
      completionRequirement: this.settings.requiresCompletion ? this.settings.completionRequirement : undefined,
      registeredAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.referrals.set(referral.id, referral);

    // Update code usage count
    code.usageCount++;
    code.updatedAt = new Date().toISOString();

    // If no completion required, mark as completed and pay rewards immediately
    if (!this.settings.requiresCompletion) {
      await this.markReferralComplete(referral.id);
    }

    return referral;
  }

  async getReferral(referralId: string): Promise<Referral | null> {
    return this.referrals.get(referralId) || null;
  }

  async getUserReferrals(userId: string): Promise<Referral[]> {
    return Array.from(this.referrals.values())
      .filter(r => r.referrerId === userId)
      .sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
  }

  async markReferralComplete(referralId: string): Promise<Referral> {
    const referral = this.referrals.get(referralId);
    
    if (!referral) {
      throw new Error('Referral not found');
    }

    if (referral.status === 'completed') {
      throw new Error('Referral already completed');
    }

    referral.status = 'completed';
    referral.completedAt = new Date().toISOString();
    referral.referrerRewardPaid = true;
    referral.refereeRewardPaid = true;
    referral.rewardsPaidAt = new Date().toISOString();
    referral.updatedAt = new Date().toISOString();

    // In real implementation, this would trigger Cloud Function to:
    // 1. Credit both wallets
    // 2. Award loyalty points to both users
    // 3. Send notifications
    console.log(`Referral ${referralId} completed. Would credit:`);
    console.log(`- Referrer ${referral.referrerId}: €${referral.referrerRewardAmount} + ${referral.referrerRewardPoints} points`);
    console.log(`- Referee ${referral.refereeId}: €${referral.refereeRewardAmount} + ${referral.refereeRewardPoints} points`);

    return referral;
  }

  async getReferralStats(userId: string): Promise<{
    totalReferrals: number;
    completedReferrals: number;
    pendingReferrals: number;
    totalRewardsEarned: number;
    totalPointsEarned: number;
  }> {
    const userReferrals = await this.getUserReferrals(userId);
    
    const stats = {
      totalReferrals: userReferrals.length,
      completedReferrals: userReferrals.filter(r => r.status === 'completed').length,
      pendingReferrals: userReferrals.filter(r => r.status === 'registered' || r.status === 'pending').length,
      totalRewardsEarned: 0,
      totalPointsEarned: 0,
    };

    userReferrals.forEach(r => {
      if (r.referrerRewardPaid) {
        stats.totalRewardsEarned += r.referrerRewardAmount;
        stats.totalPointsEarned += r.referrerRewardPoints;
      }
    });

    return stats;
  }
}

/**
 * Firestore Referral Service Implementation
 */
class FirestoreReferralService implements IReferralService {
  private static instance: FirestoreReferralService;

  private constructor() {}

  static getInstance(): FirestoreReferralService {
    if (!FirestoreReferralService.instance) {
      FirestoreReferralService.instance = new FirestoreReferralService();
    }
    return FirestoreReferralService.instance;
  }

  async getReferralSettings(): Promise<ReferralSettings> {
    const firestoreModule = 'firebase/firestore' as string;
    const { getFirestore, doc, getDoc } = await import(firestoreModule as any);
    const db = getFirestore();
    const settingsRef = doc(db, 'settings', 'referralSettings');
    const settingsSnap = await getDoc(settingsRef);
    
    if (!settingsSnap.exists()) {
      return DEFAULT_REFERRAL_SETTINGS;
    }

    const data = settingsSnap.data();
    return {
      ...data,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
    } as ReferralSettings;
  }

  async updateReferralSettings(updates: Partial<ReferralSettings>, adminId: string): Promise<ReferralSettings> {
    const firestoreModule1 = 'firebase/firestore' as string;
    const { getFirestore, doc, setDoc, serverTimestamp, getDoc } = await import(firestoreModule1 as any);
    const db = getFirestore();
    const settingsRef = doc(db, 'settings', 'referralSettings');
    
    const current = await this.getReferralSettings();
    
    await setDoc(settingsRef, {
      ...current,
      ...updates,
      updatedAt: serverTimestamp(),
      updatedBy: adminId,
    });

    const updated = await getDoc(settingsRef);
    const data = updated.data()!;
    return {
      ...data,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
    } as ReferralSettings;
  }

  async generateReferralCode(userId: string, userName: string, customCode?: string): Promise<ReferralCode> {
    const firestoreModule2 = 'firebase/firestore' as string;
    const { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } = await import(firestoreModule2 as any);
    const db = getFirestore();
    
    // Check if user already has a code
    const codesRef = collection(db, 'referralCodes');
    const q = query(codesRef, where('userId', '==', userId));
    const existing = await getDocs(q);
    
    if (!existing.empty) {
      throw new Error('User already has a referral code');
    }

    const settings = await this.getReferralSettings();
    
    let code: string;
    if (customCode && settings.allowCustomCodes) {
      const codeQuery = query(codesRef, where('code', '==', customCode.toUpperCase()));
      const codeExists = await getDocs(codeQuery);
      
      if (!codeExists.empty) {
        throw new Error('Code already in use');
      }
      
      code = customCode.toUpperCase();
    } else {
      // Generate unique code
      let attempts = 0;
      do {
        code = generateCode(settings.codePrefix, settings.codeLength);
        const codeQuery = query(codesRef, where('code', '==', code));
        const codeExists = await getDocs(codeQuery);
        
        if (codeExists.empty) break;
        
        attempts++;
        if (attempts > 10) {
          throw new Error('Failed to generate unique code');
        }
      // eslint-disable-next-line no-constant-condition
      } while (true);
    }

    const codeData = {
      code,
      userId,
      userName,
      isActive: true,
      usageCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(codesRef, codeData);
    
    return {
      ...codeData,
      id: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as ReferralCode;
  }

  async getReferralCode(userId: string): Promise<ReferralCode | null> {
    const firestoreModule3 = 'firebase/firestore' as string;
    const { getFirestore, collection, query, where, getDocs } = await import(firestoreModule3 as any);
    const db = getFirestore();
    const codesRef = collection(db, 'referralCodes');
    const q = query(codesRef, where('userId', '==', userId));
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      expiresAt: data.expiresAt?.toDate?.()?.toISOString() || data.expiresAt,
    } as ReferralCode;
  }

  async getReferralCodeByCode(code: string): Promise<ReferralCode | null> {
    const firestoreModule4 = 'firebase/firestore' as string;
    const { getFirestore, collection, query, where, getDocs } = await import(firestoreModule4 as any);
    const db = getFirestore();
    const codesRef = collection(db, 'referralCodes');
    const q = query(codesRef, where('code', '==', code.toUpperCase()));
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      expiresAt: data.expiresAt?.toDate?.()?.toISOString() || data.expiresAt,
    } as ReferralCode;
  }

  async validateReferralCode(code: string): Promise<{ valid: boolean; error?: string; referralCode?: ReferralCode }> {
    const settings = await this.getReferralSettings();
    
    if (!settings.isEnabled) {
      return { valid: false, error: 'Referral program is currently disabled' };
    }

    const referralCode = await this.getReferralCodeByCode(code);

    if (!referralCode) {
      return { valid: false, error: 'Invalid referral code' };
    }

    if (!referralCode.isActive) {
      return { valid: false, error: 'Referral code is no longer active' };
    }

    if (referralCode.usageLimit && referralCode.usageCount >= referralCode.usageLimit) {
      return { valid: false, error: 'Referral code has reached its usage limit' };
    }

    if (referralCode.expiresAt && new Date(referralCode.expiresAt as string) < new Date()) {
      return { valid: false, error: 'Referral code has expired' };
    }

    return { valid: true, referralCode };
  }

  async createReferral(
    referralCode: string,
    refereeId: string,
    refereeName: string,
    refereeEmail: string
  ): Promise<Referral> {
    // Should be done via Cloud Function during user registration
    throw new Error('Referral creation must be done via Cloud Functions during registration.');
  }

  async getReferral(referralId: string): Promise<Referral | null> {
    const firestoreModule5 = 'firebase/firestore' as string;
    const { getFirestore, doc, getDoc } = await import(firestoreModule5 as any);
    const db = getFirestore();
    const referralRef = doc(db, 'referrals', referralId);
    const referralSnap = await getDoc(referralRef);
    
    if (!referralSnap.exists()) {
      return null;
    }

    const data = referralSnap.data();
    return {
      ...data,
      id: referralSnap.id,
      registeredAt: data.registeredAt?.toDate?.()?.toISOString() || data.registeredAt,
      completedAt: data.completedAt?.toDate?.()?.toISOString() || data.completedAt,
      rewardsPaidAt: data.rewardsPaidAt?.toDate?.()?.toISOString() || data.rewardsPaidAt,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
    } as Referral;
  }

  async getUserReferrals(userId: string): Promise<Referral[]> {
    const firestoreModule6 = 'firebase/firestore' as string;
    const { getFirestore, collection, query, where, orderBy, getDocs } = await import(firestoreModule6 as any);
    const db = getFirestore();
    const referralsRef = collection(db, 'referrals');
    const q = query(referralsRef, where('referrerId', '==', userId), orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d: any) => ({
      ...d.data(),
      id: d.id,
      registeredAt: d.data().registeredAt?.toDate?.()?.toISOString() || d.data().registeredAt,
      completedAt: d.data().completedAt?.toDate?.()?.toISOString() || d.data().completedAt,
      rewardsPaidAt: d.data().rewardsPaidAt?.toDate?.()?.toISOString() || d.data().rewardsPaidAt,
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() || d.data().createdAt,
      updatedAt: d.data().updatedAt?.toDate?.()?.toISOString() || d.data().updatedAt,
    } as Referral));
  }

  async markReferralComplete(referralId: string): Promise<Referral> {
    // Should be done via Cloud Function when completion requirement is met
    throw new Error('Referral completion must be handled via Cloud Functions.');
  }

  async getReferralStats(userId: string): Promise<{
    totalReferrals: number;
    completedReferrals: number;
    pendingReferrals: number;
    totalRewardsEarned: number;
    totalPointsEarned: number;
  }> {
    const referrals = await this.getUserReferrals(userId);
    
    const stats = {
      totalReferrals: referrals.length,
      completedReferrals: referrals.filter(r => r.status === 'completed').length,
      pendingReferrals: referrals.filter(r => r.status === 'registered' || r.status === 'pending').length,
      totalRewardsEarned: 0,
      totalPointsEarned: 0,
    };

    referrals.forEach(r => {
      if (r.referrerRewardPaid) {
        stats.totalRewardsEarned += r.referrerRewardAmount;
        stats.totalPointsEarned += r.referrerRewardPoints;
      }
    });

    return stats;
  }
}

/**
 * Get the active referral service implementation
 */
export async function getReferralService(): Promise<IReferralService> {
  if (USE_MOCK_DATA) {
    return MockReferralService.getInstance();
  } else {
    return FirestoreReferralService.getInstance();
  }
}

// Export default for convenience
const referralService = USE_MOCK_DATA
  ? MockReferralService.getInstance()
  : FirestoreReferralService.getInstance();

export default referralService;
