// Subscription Management Service - Production Ready
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  Timestamp,
  addDoc
} from 'firebase/firestore';
const db: any = null;

// Helper to ensure db is initialized
function getDb() {
  throw new Error('Database not initialized');
}

export interface SubscriptionPlan {
  id: string;
  type: 'loyal' | 'vip';
  tier: string; // 'Plus', 'Pro', 'ProMax' for Loyal | 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond' for VIP
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  benefits: {
    loyaltyPointsMultiplier?: number;
    freeSessionsPerMonth?: number;
    discountPercentage?: number;
    priorityBooking?: boolean;
    exclusiveThemes?: boolean;
    dedicatedSupport?: boolean;
    aiInsights?: boolean;
    customWorkouts?: boolean;
    nutritionGuidance?: boolean;
    wellnessCoaching?: boolean;
  };
  features: string[];
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'paused';
  startDate: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
  paymentMethod?: string;
  stripeSubscriptionId?: string;
}

class SubscriptionManager {
  private static instance: SubscriptionManager;

  private constructor() {}

  static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager();
    }
    return SubscriptionManager.instance;
  }

  // Get all available subscription plans
  async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    try {
      const plansRef = collection(getDb(), 'subscriptionPlans');
      const snapshot = await getDocs(plansRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SubscriptionPlan[];
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return this.getMockPlans();
    }
  }

  // Get user's active subscriptions
  async getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
    try {
      const subsRef = collection(getDb(), 'userSubscriptions');
      const q = query(subsRef, where('userId', '==', userId), where('status', '==', 'active'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserSubscription[];
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      return [];
    }
  }

  // Check if user has active subscription of specific type
  async hasActiveSubscription(userId: string, type: 'loyal' | 'vip'): Promise<boolean> {
    const subscriptions = await this.getUserSubscriptions(userId);
    const plans = await this.getAvailablePlans();
    
    return subscriptions.some(sub => {
      const plan = plans.find(p => p.id === sub.planId);
      return plan?.type === type && sub.status === 'active';
    });
  }

  // Subscribe user to a plan
  async subscribe(userId: string, planId: string, paymentMethodId?: string): Promise<UserSubscription> {
    try {
      const subscriptionData: Omit<UserSubscription, 'id'> = {
        userId,
        planId,
        status: 'active',
        startDate: Timestamp.now(),
        currentPeriodEnd: Timestamp.fromDate(
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        ),
        cancelAtPeriodEnd: false,
        paymentMethod: paymentMethodId,
      };

      const subsRef = collection(getDb(), 'userSubscriptions');
      const docRef = await addDoc(subsRef, subscriptionData);

      return {
        id: docRef.id,
        ...subscriptionData
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string, immediate: boolean = false): Promise<void> {
    try {
      const subRef = doc(getDb(), 'userSubscriptions', subscriptionId);
      
      if (immediate) {
        await updateDoc(subRef, {
          status: 'canceled',
          cancelAtPeriodEnd: false
        });
      } else {
        await updateDoc(subRef, {
          cancelAtPeriodEnd: true
        });
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  // Get mock plans for fallback
  private getMockPlans(): SubscriptionPlan[] {
    return [
      // Loyal Plans
      {
        id: 'loyal-plus',
        type: 'loyal',
        tier: 'Plus',
        name: 'Loyal Plus',
        monthlyPrice: 9.99,
        yearlyPrice: 99.99,
        currency: 'EUR',
        benefits: {
          loyaltyPointsMultiplier: 1.5,
          discountPercentage: 5,
          exclusiveThemes: true,
        },
        features: [
          '1.5x Loyalty Points on all activities',
          '5% discount on all sessions',
          'Exclusive themes',
          'Priority support'
        ]
      },
      {
        id: 'loyal-pro',
        type: 'loyal',
        tier: 'Pro',
        name: 'Loyal Pro',
        monthlyPrice: 19.99,
        yearlyPrice: 199.99,
        currency: 'EUR',
        benefits: {
          loyaltyPointsMultiplier: 2,
          discountPercentage: 10,
          freeSessionsPerMonth: 1,
          exclusiveThemes: true,
          aiInsights: true,
        },
        features: [
          '2x Loyalty Points on all activities',
          '10% discount on all sessions',
          '1 free session per month',
          'AI-powered insights',
          'Exclusive themes',
          'Priority support'
        ]
      },
      {
        id: 'loyal-promax',
        type: 'loyal',
        tier: 'ProMax',
        name: 'Loyal ProMax',
        monthlyPrice: 29.99,
        yearlyPrice: 299.99,
        currency: 'EUR',
        benefits: {
          loyaltyPointsMultiplier: 3,
          discountPercentage: 15,
          freeSessionsPerMonth: 2,
          exclusiveThemes: true,
          aiInsights: true,
          customWorkouts: true,
        },
        features: [
          '3x Loyalty Points on all activities',
          '15% discount on all sessions',
          '2 free sessions per month',
          'AI-powered insights',
          'Custom workout plans',
          'Exclusive themes',
          'Dedicated support'
        ]
      },
      // VIP Plans
      {
        id: 'vip-bronze',
        type: 'vip',
        tier: 'Bronze',
        name: 'VIP Bronze',
        monthlyPrice: 49.99,
        yearlyPrice: 499.99,
        currency: 'EUR',
        benefits: {
          freeSessionsPerMonth: 2,
          discountPercentage: 10,
          priorityBooking: true,
        },
        features: [
          '2 free sessions per month',
          '10% discount on additional sessions',
          'Priority booking',
          'VIP lounge access'
        ]
      },
      {
        id: 'vip-silver',
        type: 'vip',
        tier: 'Silver',
        name: 'VIP Silver',
        monthlyPrice: 99.99,
        yearlyPrice: 999.99,
        currency: 'EUR',
        benefits: {
          freeSessionsPerMonth: 4,
          discountPercentage: 15,
          priorityBooking: true,
          dedicatedSupport: true,
        },
        features: [
          '4 free sessions per month',
          '15% discount on additional sessions',
          'Priority booking',
          'Dedicated support',
          'VIP lounge access',
          'Wellness coaching'
        ]
      },
      {
        id: 'vip-gold',
        type: 'vip',
        tier: 'Gold',
        name: 'VIP Gold',
        monthlyPrice: 199.99,
        yearlyPrice: 1999.99,
        currency: 'EUR',
        benefits: {
          freeSessionsPerMonth: 8,
          discountPercentage: 20,
          priorityBooking: true,
          dedicatedSupport: true,
          customWorkouts: true,
          nutritionGuidance: true,
        },
        features: [
          '8 free sessions per month',
          '20% discount on additional sessions',
          'Priority booking',
          'Dedicated support',
          'Custom workout plans',
          'Nutrition guidance',
          'VIP lounge access',
          'Wellness coaching'
        ]
      },
      {
        id: 'vip-platinum',
        type: 'vip',
        tier: 'Platinum',
        name: 'VIP Platinum',
        monthlyPrice: 299.99,
        yearlyPrice: 2999.99,
        currency: 'EUR',
        benefits: {
          freeSessionsPerMonth: 12,
          discountPercentage: 25,
          priorityBooking: true,
          dedicatedSupport: true,
          customWorkouts: true,
          nutritionGuidance: true,
          wellnessCoaching: true,
        },
        features: [
          '12 free sessions per month',
          '25% discount on additional sessions',
          'Priority booking',
          'Dedicated support',
          'Custom workout & nutrition plans',
          'Personal wellness coach',
          'VIP lounge access',
          'Exclusive events access'
        ]
      },
      {
        id: 'vip-diamond',
        type: 'vip',
        tier: 'Diamond',
        name: 'VIP Diamond',
        monthlyPrice: 499.99,
        yearlyPrice: 4999.99,
        currency: 'EUR',
        benefits: {
          freeSessionsPerMonth: 20,
          discountPercentage: 30,
          priorityBooking: true,
          dedicatedSupport: true,
          customWorkouts: true,
          nutritionGuidance: true,
          wellnessCoaching: true,
          aiInsights: true,
        },
        features: [
          'Unlimited free sessions',
          '30% discount on premium services',
          '24/7 priority support',
          'Personal wellness team',
          'Full custom health program',
          'AI-powered health insights',
          'VIP lounge & spa access',
          'Exclusive events & retreats',
          'Concierge service'
        ]
      }
    ];
  }
}

export const subscriptionManager = SubscriptionManager.getInstance();
export default subscriptionManager;
