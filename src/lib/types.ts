import type { FieldValue, Timestamp } from 'firebase/firestore';

export type UserRole =
  | 'User'
  | 'Therapist'
  | 'Donor'
  | 'Donation Receiver'
  | 'VIP'
  | 'Admin'
  | 'Student'
  | 'Corporate'
  | 'Affiliate'
  | 'Free'
  | 'Gold'
  | 'Diamond';

export type User = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatarUrl: string;
  role: UserRole;
  initials: string;
  goal?: {
    description: string;
    targetSessions: number;
  };
  personalizationCompleted?: boolean;
  personalization?: {
    goals: string;
    interests: string;
  };
  squareCustomerId?: string;
  dashboardWidgets?: {
    goalProgress: boolean;
    quickActions: boolean;
    nextSession: boolean;
    recentActivity: boolean;
  };
};

export type Session = {
  id: string;
  therapist: string;
  therapistAvatarUrl: string;
  date: string; // ISO String
  time: string;
  duration: number; // in minutes
  status: 'Upcoming' | 'Completed' | 'Canceled';
  type: string;
  userId?: string;
};

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
  title: string;
  author: string;
  date: string; // ISO string
  type: 'Therapist Report' | 'User Report' | 'AI Summary';
  summary: string;
  createdAt?: Timestamp;
};

export type StatCard = {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: React.ElementType;
};

export type TherapyCategory = 'Service' | 'Complex Therapy';
export type Availability = 'Online' | 'In-Person' | 'Both';

export type Therapy = {
  id: string;
  name: string;
  category: TherapyCategory;
  shortDescription: string;
  longDescription: string;
  duration: number;
  priceEUR: number;
  benefits: string[];
  recommendedFor: string[];
aiSummary: string;
  availability: Availability;
  complexityLevel: 1 | 2 | 3 | 4 | 5;
};

export type TherapyPackage = {
  id: string;
  name: string;
  includedTherapies: string[];
  duration: string; // e.g., "4 weeks", "8 sessions"
  priceEUR: number;
  aiSummary: string;
};


export type TriageInput = {
    mode: 'freeText' | 'form';
    text?: string;
    tags?: string[];
    intensity?: {
        pain?: number;
        mobility?: number;
        energy?: number;
        stress?: number;
    };
    duration?: 'days' | 'weeks' | 'months';
    context?: string[];
    preferences?: {
        length?: 30 | 60 | 90;
        therapistGender?: 'male' | 'female' | 'any';
        time?: 'weekday' | 'evening' | 'weekend';
    };
}

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
    name: string;
    priceEUR: number;
    benefits: string[];
}

    