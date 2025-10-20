export type Session = {
  id: string;
  date: string;
  time: string;
  type: string;
  therapist: string;
  therapistAvatarUrl?: string;
  location?: string;
  status: 'Upcoming' | 'Completed' | 'Canceled';
  notes?: string;
  duration: number;
  userId?: string;
  squareAppointmentId?: string;
};
export type Service = {
  id?: string;
  name: string;
  category: 'Core' | 'Personalized' | '360° Component';
  descriptionShort: string;
  descriptionLong: string;
  durationMinutes: number;
  priceEUR: number;
  benefits: string[];
  tags: string[];
  active: boolean;
};

import type { FieldValue, Timestamp } from 'firebase/firestore';

// Duplicate removed. See below for unified User type.

// Duplicate removed. Use the definition below.

export type Donation = {
  id: string;
  donorId: string;
  receiverId: string;
  amount: number;
  date: Timestamp;
  isAnonymous: boolean;
};

export type Report = {
  id: string;
  sessionId?: string;
  title?: string;
  author?: string;
  date?: string; // ISO string
  type?: 'Therapist Report' | 'User Report' | 'AI Summary';
  summary?: string;
  painLevel?: number;
  mobility?: number;
  notes?: string;
  exercises?: string[];
  createdAt?: Timestamp | string;
};

export type StatCard = {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: React.ElementType;
};

export type UserRole = "Patient" | "Therapist" | "Admin";

export type VipTier = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
export type LoyalTier = "Normal" | "Plus" | "Pro" | "ProMax";
export type SubscriptionType = "Free" | "Loyal" | "VIP";

export type User = {
  id: string;
  uid?: string;
  name?: string;
  displayName?: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: UserRole;
  initials: string;
  createdAt?: string;
  goal?: {
    description?: string;
    targetSessions: number;
    currentSessions?: number;
  };
  personalizationCompleted?: boolean;
  personalization?: {
    goals: string;
    interests: string;
    values: string;
    preferences: string;
    // AI Learning Fields
    communicationStyle?: 'formal' | 'casual' | 'empathetic' | 'direct';
    motivationFactors?: string[];
    stressors?: string[];
    copingMechanisms?: string[];
    preferredTherapyApproach?: string;
    languagePreference?: string;
    culturalBackground?: string;
    lifeStage?: string;
    supportSystem?: string;
  };
  dashboardWidgets?: {
    goalProgress: boolean;
    quickActions: boolean;
    nextSession: boolean;
    recentActivity: boolean;
  };
  // Subscription Status
  subscriptionType?: SubscriptionType;
  // Loyal Subscription
  isLoyal?: boolean;
  loyalTier?: LoyalTier;
  loyalSince?: string; // ISO date string
  loyalExpiresAt?: string; // ISO date string
  loyalBenefits?: {
    discountPercentage?: number;
    sessionCreditsPerMonth?: number;
    prioritySupport?: boolean;
    groupSessionAccess?: boolean;
    advancedAIFeatures?: boolean;
  };
  // VIP Status
  isVip?: boolean;
  vipTier?: VipTier;
  vipSince?: string; // ISO date string
  vipExpiresAt?: string; // ISO date string
  vipBenefits?: {
    priorityBooking?: boolean;
    discountPercentage?: number;
    freeSessionsPerMonth?: number;
    dedicatedTherapist?: boolean;
  };
  // Donation Related
  isDonor?: boolean;
  isDonationSeeker?: boolean;
  totalDonated?: number; // in EUR
  totalReceived?: number; // in EUR
  donationSeekerApproved?: boolean;
  donationSeekerReason?: string;
  // Relationships
  linkedChildren?: string[]; // Array of user IDs
  linkedParent?: string; // User ID of parent
  linkedTherapist?: string; // User ID of assigned therapist
  // Additional metadata
  squareCustomerId?: string;
  preferredLanguage?: string;
  timezone?: string;
};

export type TriageResult = {
    top: {
        therapyId: string;
        reason: string;
        plan: {
            sessions: number;
            freq: string;
        };
    };
    alts: {
        therapyId: string;
    }[];
    square: {
        serviceId: string;
        locationId: string;
        bookingLink: string;
    };
}


export type VipBenefit = {
  id: string;
  name: string;
  limit: string | number;
  used: number;
  status: 'available' | 'used' | 'expires';
}

export type VipHistoryItem = {
    benefitId: string;
    at: string;
    value: string;
}

export type VipData = {
    active: boolean;
    tier: string;
    renewal: string;
    since: string;
    benefits: VipBenefit[];
    history: VipHistoryItem[];
    insights: {
        savingsEUR: number;
        monthUses: number;
    }
}

export type VipPlan = {
  id: string;
  tier: "Bronze Elite" | "Silver Elite" | "Gold Elite";
  pricePerMonthEUR: number;
  sessionsPerMonth: number;
  sessionDurationMinutes: number;
  perks: string[];
  active: boolean;
};

export type LoyalPlan = {
  id: string;
  tier: LoyalTier;
  name: string;
  pricePerMonthEUR: number;
  sessionCreditsPerMonth: number;
  discountPercentage: number;
  features: string[];
  aiFeatures?: string[];
  active: boolean;
  popular?: boolean;
};

export type Therapy = Service;

export type JournalEntry = {
  id: string;
  date: string;
  mood: 'Great' | 'Good' | 'Okay' | 'Bad' | 'Terrible';
  painLevel: number;
  energy: number;
  notes?: string;
  activities?: string[];
};

export type Exercise = {
  id: string;
  name: string;
  category: 'Strength' | 'Stretching' | 'Balance' | 'Cardio';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  description: string;
  benefits: string[];
  instructions: string[];
  videoUrl?: string;
  completed?: boolean;
};

export type CommunityPost = {
  id: string;
  author: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  replies: number;
  createdAt: string;
  tags?: string[];
};
    