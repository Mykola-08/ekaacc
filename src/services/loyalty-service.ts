/**
 * @file Loyalty Service
 * @description Service for managing loyalty program enrollment, points, tiers, and rewards.
 * Supports both mock data (for development) and Firestore (for production).
 */

import type {
  LoyaltyProgram,
  LoyaltyTier,
  LoyaltyPointsTransaction,
  LoyaltyReward,
  LoyaltyPointAction,
  LOYALTY_TIERS as LoyaltyTiersType,
} from '@/lib/wallet-types';
import { LOYALTY_TIERS } from '@/lib/wallet-types';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';
const POINTS_PER_EUR = parseInt(process.env.NEXT_PUBLIC_LOYALTY_POINTS_PER_EUR || '10');

/**
 * Loyalty Service Interface
 */
export interface ILoyaltyService {
  // Program Management
  getLoyaltyProgram(userId: string): Promise<LoyaltyProgram | null>;
  enrollInProgram(userId: string): Promise<LoyaltyProgram>;
  unenrollFromProgram(userId: string): Promise<LoyaltyProgram>;
  
  // Points Management
  getPointsBalance(userId: string): Promise<number>;
  getPointsTransactions(userId: string, limit?: number): Promise<LoyaltyPointsTransaction[]>;
  awardPoints(
    userId: string,
    points: number,
    action: LoyaltyPointAction,
    description: string,
    metadata?: any
  ): Promise<LoyaltyPointsTransaction>;
  deductPoints(
    userId: string,
    points: number,
    action: LoyaltyPointAction,
    description: string,
    metadata?: any
  ): Promise<LoyaltyPointsTransaction>;
  
  // Tier Management
  getCurrentTier(userId: string): Promise<LoyaltyTier>;
  getPointsToNextTier(userId: string): Promise<number>;
  calculateTierDiscount(userId: string): Promise<number>;
  
  // Rewards
  getRewards(minTier?: LoyaltyTier): Promise<LoyaltyReward[]>;
  getReward(rewardId: string): Promise<LoyaltyReward | null>;
  redeemReward(userId: string, rewardId: string): Promise<{ success: boolean; walletCredit?: number; error?: string }>;
}

/**
 * Helper function to calculate tier from points
 */
function calculateTier(points: number): LoyaltyTier {
  for (let i = LOYALTY_TIERS.length - 1; i >= 0; i--) {
    const tier = LOYALTY_TIERS[i];
    if (points >= tier.minPoints) {
      return tier.tier;
    }
  }
  return 'Bronze';
}

/**
 * Helper function to calculate points to next tier
 */
function calculatePointsToNextTier(points: number): number {
  const currentTierIndex = LOYALTY_TIERS.findIndex(t => points >= t.minPoints && (t.maxPoints === null || points <= t.maxPoints));
  
  if (currentTierIndex === -1 || currentTierIndex === LOYALTY_TIERS.length - 1) {
    return 0; // Already at highest tier
  }
  
  const nextTier = LOYALTY_TIERS[currentTierIndex + 1];
  return nextTier.minPoints - points;
}

/**
 * Mock Loyalty Service Implementation
 */
class MockLoyaltyService implements ILoyaltyService {
  private static instance: MockLoyaltyService;
  private programs: Map<string, LoyaltyProgram> = new Map();
  private transactions: Map<string, LoyaltyPointsTransaction[]> = new Map();
  private rewards: LoyaltyReward[] = [];

  private constructor() {
    this.initializeMockData();
  }

  static getInstance(): MockLoyaltyService {
    if (!MockLoyaltyService.instance) {
      MockLoyaltyService.instance = new MockLoyaltyService();
    }
    return MockLoyaltyService.instance;
  }

  private initializeMockData() {
    // Mock rewards catalog
    this.rewards = [
      {
        id: 'reward_1',
        name: '€5 Wallet Credit',
        description: 'Redeem 500 points for €5 wallet credit',
        pointsCost: 500,
        walletValue: 5,
        isActive: true,
        category: 'credit',
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'reward_2',
        name: '€10 Wallet Credit',
        description: 'Redeem 900 points for €10 wallet credit (10% bonus!)',
        pointsCost: 900,
        walletValue: 10,
        isActive: true,
        category: 'credit',
        sortOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'reward_3',
        name: 'Free AI Therapy Report',
        description: 'Get a comprehensive AI therapy report (€15 value)',
        pointsCost: 1200,
        walletValue: 15,
        minTier: 'Silver',
        isActive: true,
        category: 'service',
        sortOrder: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'reward_4',
        name: 'Free Therapy Session',
        description: 'Redeem for one free therapy session (€60 value)',
        pointsCost: 5000,
        walletValue: 60,
        minTier: 'Gold',
        isActive: true,
        category: 'service',
        sortOrder: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'reward_5',
        name: 'VIP Event Access',
        description: 'Exclusive invitation to VIP wellness events',
        pointsCost: 3000,
        walletValue: 0,
        minTier: 'Platinum',
        isActive: true,
        category: 'exclusive',
        sortOrder: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private getOrCreateProgram(userId: string): LoyaltyProgram {
    if (!this.programs.has(userId)) {
      const program: LoyaltyProgram = {
        id: userId,
        userId,
        isEnrolled: false,
        currentTier: 'Bronze',
        totalPoints: 0,
        lifetimePoints: 0,
        pointsToNextTier: LOYALTY_TIERS[1].minPoints,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.programs.set(userId, program);
    }
    return this.programs.get(userId)!;
  }

  async getLoyaltyProgram(userId: string): Promise<LoyaltyProgram | null> {
    return this.getOrCreateProgram(userId);
  }

  async enrollInProgram(userId: string): Promise<LoyaltyProgram> {
    const program = this.getOrCreateProgram(userId);
    
    if (program.isEnrolled) {
      throw new Error('Already enrolled in loyalty program');
    }

    program.isEnrolled = true;
    program.enrolledAt = new Date().toISOString();
    program.updatedAt = new Date().toISOString();

    // Give welcome bonus
    await this.awardPoints(userId, 100, 'admin_bonus', 'Welcome to the loyalty program!');

    return program;
  }

  async unenrollFromProgram(userId: string): Promise<LoyaltyProgram> {
    const program = this.getOrCreateProgram(userId);
    
    if (!program.isEnrolled) {
      throw new Error('Not enrolled in loyalty program');
    }

    program.isEnrolled = false;
    program.updatedAt = new Date().toISOString();

    return program;
  }

  async getPointsBalance(userId: string): Promise<number> {
    const program = this.getOrCreateProgram(userId);
    return program.totalPoints;
  }

  async getPointsTransactions(userId: string, limit: number = 50): Promise<LoyaltyPointsTransaction[]> {
    const txs = this.transactions.get(userId) || [];
    return txs.slice(0, limit);
  }

  async awardPoints(
    userId: string,
    points: number,
    action: LoyaltyPointAction,
    description: string,
    metadata?: any
  ): Promise<LoyaltyPointsTransaction> {
    const program = this.getOrCreateProgram(userId);

    if (!program.isEnrolled) {
      throw new Error('User not enrolled in loyalty program');
    }

    // Apply tier multiplier
    const tierConfig = LOYALTY_TIERS.find(t => t.tier === program.currentTier)!;
    const actualPoints = Math.floor(points * tierConfig.pointsMultiplier);

    program.totalPoints += actualPoints;
    program.lifetimePoints += actualPoints;
    program.lastActivityAt = new Date().toISOString();
    program.updatedAt = new Date().toISOString();

    // Recalculate tier
    const newTier = calculateTier(program.totalPoints);
    const tierChanged = newTier !== program.currentTier;
    program.currentTier = newTier;
    program.pointsToNextTier = calculatePointsToNextTier(program.totalPoints);

    const transaction: LoyaltyPointsTransaction = {
      id: `lp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      action,
      points: actualPoints,
      balanceAfter: program.totalPoints,
      description,
      metadata: {
        ...metadata,
        tierMultiplier: tierConfig.pointsMultiplier,
        tierChanged,
        newTier: tierChanged ? newTier : undefined,
      },
      createdAt: new Date().toISOString(),
    };

    const userTxs = this.transactions.get(userId) || [];
    this.transactions.set(userId, [transaction, ...userTxs]);

    if (tierChanged) {
      console.log(`🎉 User ${userId} upgraded to ${newTier} tier!`);
    }

    return transaction;
  }

  async deductPoints(
    userId: string,
    points: number,
    action: LoyaltyPointAction,
    description: string,
    metadata?: any
  ): Promise<LoyaltyPointsTransaction> {
    const program = this.getOrCreateProgram(userId);

    if (!program.isEnrolled) {
      throw new Error('User not enrolled in loyalty program');
    }

    if (program.totalPoints < points) {
      throw new Error('Insufficient loyalty points');
    }

    program.totalPoints -= points;
    program.lastActivityAt = new Date().toISOString();
    program.updatedAt = new Date().toISOString();

    // Recalculate tier (might downgrade)
    const newTier = calculateTier(program.totalPoints);
    const tierChanged = newTier !== program.currentTier;
    program.currentTier = newTier;
    program.pointsToNextTier = calculatePointsToNextTier(program.totalPoints);

    const transaction: LoyaltyPointsTransaction = {
      id: `lp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      action,
      points: -points,
      balanceAfter: program.totalPoints,
      description,
      metadata: {
        ...metadata,
        tierChanged,
        newTier: tierChanged ? newTier : undefined,
      },
      createdAt: new Date().toISOString(),
    };

    const userTxs = this.transactions.get(userId) || [];
    this.transactions.set(userId, [transaction, ...userTxs]);

    return transaction;
  }

  async getCurrentTier(userId: string): Promise<LoyaltyTier> {
    const program = this.getOrCreateProgram(userId);
    return program.currentTier;
  }

  async getPointsToNextTier(userId: string): Promise<number> {
    const program = this.getOrCreateProgram(userId);
    return program.pointsToNextTier;
  }

  async calculateTierDiscount(userId: string): Promise<number> {
    const program = this.getOrCreateProgram(userId);
    
    if (!program.isEnrolled) {
      return 0;
    }

    const tierConfig = LOYALTY_TIERS.find(t => t.tier === program.currentTier);
    return tierConfig?.discountPercentage || 0;
  }

  async getRewards(minTier?: LoyaltyTier): Promise<LoyaltyReward[]> {
    let filtered = this.rewards.filter(r => r.isActive);

    if (minTier) {
      const tierIndex = LOYALTY_TIERS.findIndex(t => t.tier === minTier);
      filtered = filtered.filter(r => {
        if (!r.minTier) return true;
        const rewardTierIndex = LOYALTY_TIERS.findIndex(t => t.tier === r.minTier);
        return tierIndex >= rewardTierIndex;
      });
    }

    return filtered.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getReward(rewardId: string): Promise<LoyaltyReward | null> {
    return this.rewards.find(r => r.id === rewardId) || null;
  }

  async redeemReward(userId: string, rewardId: string): Promise<{ success: boolean; walletCredit?: number; error?: string }> {
    const program = this.getOrCreateProgram(userId);
    const reward = await this.getReward(rewardId);

    if (!reward) {
      return { success: false, error: 'Reward not found' };
    }

    if (!program.isEnrolled) {
      return { success: false, error: 'Not enrolled in loyalty program' };
    }

    if (program.totalPoints < reward.pointsCost) {
      return { success: false, error: 'Insufficient points' };
    }

    // Check tier requirement
    if (reward.minTier) {
      const userTierIndex = LOYALTY_TIERS.findIndex(t => t.tier === program.currentTier);
      const requiredTierIndex = LOYALTY_TIERS.findIndex(t => t.tier === reward.minTier);
      
      if (userTierIndex < requiredTierIndex) {
        return { success: false, error: `Requires ${reward.minTier} tier or higher` };
      }
    }

    // Deduct points
    await this.deductPoints(
      userId,
      reward.pointsCost,
      'points_redeemed',
      `Redeemed: ${reward.name}`,
      { rewardId, rewardName: reward.name }
    );

    // In real implementation, this would:
    // 1. Credit wallet if category is 'credit'
    // 2. Create service voucher if category is 'service'
    // 3. Send notification
    console.log(`User ${userId} redeemed reward: ${reward.name}`);

    return { 
      success: true, 
      walletCredit: reward.category === 'credit' ? reward.walletValue : undefined 
    };
  }
}

/**
 * Firestore Loyalty Service Implementation
 */
class FirestoreLoyaltyService implements ILoyaltyService {
  private static instance: FirestoreLoyaltyService;

  private constructor() {}

  static getInstance(): FirestoreLoyaltyService {
    if (!FirestoreLoyaltyService.instance) {
      FirestoreLoyaltyService.instance = new FirestoreLoyaltyService();
    }
    return FirestoreLoyaltyService.instance;
  }

  async getLoyaltyProgram(userId: string): Promise<LoyaltyProgram | null> {
    const { getFirestore, doc, getDoc } = await import('firebase/firestore');
    const db = getFirestore();
    const programRef = doc(db, 'loyaltyPrograms', userId);
    const programSnap = await getDoc(programRef);
    
    if (!programSnap.exists()) {
      return null;
    }

    const data = programSnap.data();
    return {
      ...data,
      id: programSnap.id,
      enrolledAt: data.enrolledAt?.toDate?.()?.toISOString() || data.enrolledAt,
      lastActivityAt: data.lastActivityAt?.toDate?.()?.toISOString() || data.lastActivityAt,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
    } as LoyaltyProgram;
  }

  async enrollInProgram(userId: string): Promise<LoyaltyProgram> {
    const { getFirestore, doc, updateDoc, serverTimestamp, getDoc } = await import('firebase/firestore');
    const db = getFirestore();
    const programRef = doc(db, 'loyaltyPrograms', userId);
    
    const programSnap = await getDoc(programRef);
    if (!programSnap.exists()) {
      throw new Error('Loyalty program not initialized');
    }

    const currentData = programSnap.data();
    if (currentData.isEnrolled) {
      throw new Error('Already enrolled in loyalty program');
    }

    await updateDoc(programRef, {
      isEnrolled: true,
      enrolledAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Welcome bonus would be handled by Cloud Function
    
    const updated = await getDoc(programRef);
    const data = updated.data()!;
    return {
      ...data,
      id: updated.id,
      enrolledAt: data.enrolledAt?.toDate?.()?.toISOString() || data.enrolledAt,
      lastActivityAt: data.lastActivityAt?.toDate?.()?.toISOString() || data.lastActivityAt,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
    } as LoyaltyProgram;
  }

  async unenrollFromProgram(userId: string): Promise<LoyaltyProgram> {
    const { getFirestore, doc, updateDoc, serverTimestamp, getDoc } = await import('firebase/firestore');
    const db = getFirestore();
    const programRef = doc(db, 'loyaltyPrograms', userId);
    
    await updateDoc(programRef, {
      isEnrolled: false,
      updatedAt: serverTimestamp(),
    });

    const updated = await getDoc(programRef);
    const data = updated.data()!;
    return {
      ...data,
      id: updated.id,
      enrolledAt: data.enrolledAt?.toDate?.()?.toISOString() || data.enrolledAt,
      lastActivityAt: data.lastActivityAt?.toDate?.()?.toISOString() || data.lastActivityAt,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
    } as LoyaltyProgram;
  }

  async getPointsBalance(userId: string): Promise<number> {
    const program = await this.getLoyaltyProgram(userId);
    return program?.totalPoints || 0;
  }

  async getPointsTransactions(userId: string, limit: number = 50): Promise<LoyaltyPointsTransaction[]> {
    const { getFirestore, collection, query, orderBy, limit: fbLimit, getDocs } = await import('firebase/firestore');
    const db = getFirestore();
    const txRef = collection(db, 'loyaltyPrograms', userId, 'pointsTransactions');
    const q = query(txRef, orderBy('createdAt', 'desc'), fbLimit(limit));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
    } as LoyaltyPointsTransaction));
  }

  async awardPoints(userId: string, points: number, action: LoyaltyPointAction, description: string, metadata?: any): Promise<LoyaltyPointsTransaction> {
    // Should be done via Cloud Function in production
    throw new Error('Points modification must be done via Cloud Functions.');
  }

  async deductPoints(userId: string, points: number, action: LoyaltyPointAction, description: string, metadata?: any): Promise<LoyaltyPointsTransaction> {
    // Should be done via Cloud Function in production
    throw new Error('Points modification must be done via Cloud Functions.');
  }

  async getCurrentTier(userId: string): Promise<LoyaltyTier> {
    const program = await this.getLoyaltyProgram(userId);
    return program?.currentTier || 'Bronze';
  }

  async getPointsToNextTier(userId: string): Promise<number> {
    const program = await this.getLoyaltyProgram(userId);
    return program?.pointsToNextTier || 0;
  }

  async calculateTierDiscount(userId: string): Promise<number> {
    const program = await this.getLoyaltyProgram(userId);
    
    if (!program?.isEnrolled) {
      return 0;
    }

    const tierConfig = LOYALTY_TIERS.find(t => t.tier === program.currentTier);
    return tierConfig?.discountPercentage || 0;
  }

  async getRewards(minTier?: LoyaltyTier): Promise<LoyaltyReward[]> {
    const { getFirestore, collection, query, where, getDocs } = await import('firebase/firestore');
    const db = getFirestore();
    const rewardsRef = collection(db, 'loyaltyRewards');
    const q = query(rewardsRef, where('isActive', '==', true));
    
    const snapshot = await getDocs(q);
    let rewards = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    } as LoyaltyReward));

    // Filter by tier client-side
    if (minTier) {
      const tierIndex = LOYALTY_TIERS.findIndex(t => t.tier === minTier);
      rewards = rewards.filter(r => {
        if (!r.minTier) return true;
        const rewardTierIndex = LOYALTY_TIERS.findIndex(t => t.tier === r.minTier);
        return tierIndex >= rewardTierIndex;
      });
    }

    return rewards.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getReward(rewardId: string): Promise<LoyaltyReward | null> {
    const { getFirestore, doc, getDoc } = await import('firebase/firestore');
    const db = getFirestore();
    const rewardRef = doc(db, 'loyaltyRewards', rewardId);
    const rewardSnap = await getDoc(rewardRef);
    
    if (!rewardSnap.exists()) {
      return null;
    }

    const data = rewardSnap.data();
    return {
      ...data,
      id: rewardSnap.id,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
    } as LoyaltyReward;
  }

  async redeemReward(userId: string, rewardId: string): Promise<{ success: boolean; walletCredit?: number; error?: string }> {
    // Should be done via Cloud Function in production to ensure atomic transaction
    throw new Error('Reward redemption must be done via Cloud Functions.');
  }
}

/**
 * Get the active loyalty service implementation
 */
export async function getLoyaltyService(): Promise<ILoyaltyService> {
  if (USE_MOCK_DATA) {
    return MockLoyaltyService.getInstance();
  } else {
    return FirestoreLoyaltyService.getInstance();
  }
}

// Export default for convenience
const loyaltyService = USE_MOCK_DATA
  ? MockLoyaltyService.getInstance()
  : FirestoreLoyaltyService.getInstance();

export default loyaltyService;
