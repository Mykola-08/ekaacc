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
  date: string; // ISO string
  isAnonymous: boolean;
};

export type Report = {
  id: string;
  sessionId?: string;
  title?: string;
  author?: string;
  patientName?: string;
  date?: string; // ISO string
  type?: 'Therapist Report' | 'User Report' | 'AI Summary';
  summary?: string;
  painLevel?: number;
  mobility?: number;
  notes?: string;
  exercises?: string[];
  createdAt?: Timestamp | string;
  mood?: number; // Mood score
  overallScore?: number; // Overall score
  trend?: 'improving' | 'stable' | 'declining'; // Trend indicator
  goalProgress?: number; // Goal completion progress
};

export type StatCard = {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: React.ElementType;
  trend?: string;
  index?: number;
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
  userType?: string; // User type (Patient, Therapist, Admin, etc.)
  initials: string;
  createdAt?: string;
  lastActive?: string; // Last activity timestamp
  
  // Supabase user_metadata compatibility
  user_metadata?: {
    displayName?: string;
    name?: string;
    activityData?: any;
    donationSeekerApproved?: boolean;
    totalReceived?: number;
    totalDonated?: number;
    isDonationSeeker?: boolean;
    isDonor?: boolean;
    [key: string]: any; // Allow any additional metadata
  };
  
  // Profile Information
  bio?: string;
  location?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other';
  mood?: number; // Current mood score
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };

  // Additional Profile Info
  birthday?: string; // ISO date string
  preferences?: {
    likesTea?: boolean;
    likesCoffee?: boolean;
    favoriteDrink?: string;
    hobbies?: string[];
    favoriteActivities?: string[];
    dietaryRestrictions?: string;
    sleepPattern?: string;
    exerciseFrequency?: string;
    notes?: string;
  };

  settings?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
      marketing?: boolean;
    };
    privacy?: {
      profileVisibility?: boolean;
      activityStatus?: boolean;
      dataSharing?: boolean;
    };
    appPreferences?: {
      soundEffects?: boolean;
      autoSave?: boolean;
      compactView?: boolean;
    };
  };

  // Therapist-only visible fields
  therapistVisible?: {
      birthday?: string;
      preferences?: {
        likesTea?: boolean;
        likesCoffee?: boolean;
        favoriteDrink?: string;
        hobbies?: string[];
        favoriteActivities?: string[];
        dietaryRestrictions?: string;
        sleepPattern?: string;
        exerciseFrequency?: string;
        notes?: string;
      };
      additionalNotes?: string;
    };
  
    // Therapist notes and reminders
    therapistNotes?: Array<{
      therapistId: string;
      note: string;
      createdAt: string;
      updatedAt?: string;
    }>;
  
    followUpReminders?: Array<{
      therapistId: string;
      reminder: string;
      dueDate: string;
      completed?: boolean;
      completedAt?: string;
    }>;
  // Therapist-specific fields
  therapistProfile?: {
    specializations?: string[]; // e.g., ['anxiety', 'depression', 'trauma']
    certifications?: string[]; // e.g., ['Licensed Clinical Social Worker', 'CBT Certified']
    licenseNumber?: string;
    yearsOfExperience?: number;
    education?: string;
    languages?: string[];
    availability?: {
      monday?: { start: string; end: string }[];
      tuesday?: { start: string; end: string }[];
      wednesday?: { start: string; end: string }[];
      thursday?: { start: string; end: string }[];
      friday?: { start: string; end: string }[];
      saturday?: { start: string; end: string }[];
      sunday?: { start: string; end: string }[];
    };
    hourlyRate?: number;
    acceptingNewClients?: boolean;
  };
  
  // Privacy & Visibility Settings
  profileVisibility?: {
    showEmail?: boolean;
    showPhone?: boolean;
    showLocation?: boolean;
    showBio?: boolean;
    showToTherapists?: boolean;
    showToAdmins?: boolean;
    publicProfile?: boolean;
  };
  
  // Account Status
  accountStatus?: 'active' | 'suspended' | 'pending' | 'deactivated';
  suspendedReason?: string;
  suspendedUntil?: string;
  lastLoginAt?: string;
  profileCompleteness?: number; // 0-100
  
  goal?: {
    description?: string;
    targetSessions: number;
    currentSessions?: number;
  };
  personalizationCompleted?: boolean;
  personalization?: {
    // Core Identity & Background
    fullName?: string;
    age?: number;
    occupation?: string;
    occupationType?: 'student' | 'employed' | 'self-employed' | 'unemployed' | 'retired' | 'other';
    livingSituation?: string; // e.g., "alone", "with family", "with roommates"
    
    // Primary Goals & Challenges
    therapeuticGoals?: string[]; // Main reasons for using EKA
    currentChallenges?: string[]; // Current problems/pain points
    painAreas?: string[]; // Physical pain locations
    mentalHealthGoals?: string[]; // Mental wellness objectives
    primaryGoal?: string; // Main focus goal
    secondaryGoals?: string[]; // Additional goals
    
    // Lifestyle & Context
    lifestyleFactors?: {
      workStressLevel?: 1 | 2 | 3 | 4 | 5;
      sleepQuality?: 1 | 2 | 3 | 4 | 5;
      exerciseFrequency?: 'never' | 'rarely' | 'weekly' | 'daily';
      dietQuality?: 1 | 2 | 3 | 4 | 5;
      socialSupport?: 1 | 2 | 3 | 4 | 5;
    };
    
    // Sports & Physical Activity
    sportsActivities?: string[]; // e.g., "running", "yoga", "swimming", "gym"
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
    fitnessGoals?: string[];
    
    // Hobbies & Interests
    hobbies?: string[]; // e.g., "reading", "music", "art", "gaming"
    interests?: string[]; // Broader interests
    favoriteActivities?: string[];
    leisureTime?: 'none' | 'little' | 'moderate' | 'plenty';
    
    // Preferences & Approaches
    preferredApproaches?: string[]; // e.g., "mindfulness", "physical therapy", "talk therapy"
    communicationStyle?: 'formal' | 'casual' | 'empathetic' | 'direct';
    motivations?: string[]; // What drives them
    expectations?: string; // What they expect from EKA
    
    // Personality & Traits
    personalityTraits?: string[]; // e.g., "introverted", "analytical", "creative"
    copingMechanisms?: string[]; // How they currently cope with challenges
    emotionalState?: 'stable' | 'fluctuating' | 'challenged';
    
    // Previous Experience
    previousTherapyExperience?: boolean;
    previousTherapyTypes?: string[];
    whatWorkedBefore?: string;
    whatDidntWork?: string;
    
    // Additional Context
    culturalBackground?: string;
    languagePreference?: string;
    religiousBeliefs?: string;
    importantValues?: string[];
    
    // AI-Generated Insights
    aiPersonaProfile?: string; // AI-generated summary of user personality
    aiRecommendedApproaches?: string[]; // AI-recommended therapy types
    aiPredictedNeeds?: string[]; // AI-predicted future needs
    aiPersonalizationScore?: number; // 0-100, how well we know the user
    aiPersonalizedGreeting?: string; // Personalized welcome message
    aiMotivationalQuotes?: string[]; // Curated motivational messages
    
    // Legacy fields (keeping for backward compatibility)
    goals?: string;
    values?: string;
    preferences?: string;
    stressors?: string[];
    preferredTherapyApproach?: string;
    lifeStage?: string;
    supportSystem?: string;
  };
  
  // User Activity Tracking & Behavioral Data
  activityData?: {
    // Session Patterns
    preferredSessionTimes?: string[]; // e.g., ["morning", "afternoon"]
    sessionFrequency?: 'rare' | 'monthly' | 'bi-weekly' | 'weekly' | 'multiple-weekly';
    averageSessionDuration?: number; // in minutes
    completedSessions?: number;
    canceledSessions?: number;
    lastSessionDate?: string;
    
    // App Usage Patterns
    mostVisitedPages?: string[]; // Track which pages user visits most
    featureUsage?: {
      journal?: number; // times used
      progress?: number;
      exercises?: number;
      community?: number;
      aiInsights?: number;
    };
    loginStreak?: number; // consecutive days logged in
    totalLogins?: number;
    lastActiveDate?: string;
    averageTimeSpent?: number; // minutes per session
    
    // Engagement Metrics
    completedExercises?: number;
    journalEntries?: number;
    goalsAchieved?: number;
    milestones?: Array<{
      title: string;
      date: string;
      type: 'goal' | 'streak' | 'session' | 'exercise';
    }>;
    
    // Preferences Learned from Behavior
    preferredExerciseTypes?: string[];
    preferredTherapistGender?: 'male' | 'female' | 'no-preference';
    preferredCommunicationMethod?: 'chat' | 'video' | 'phone' | 'in-person';
    responseTimePreference?: 'immediate' | 'same-day' | 'flexible';
    
    // Progress Indicators
    progressTrend?: 'improving' | 'stable' | 'declining' | 'fluctuating';
    wellnessScoreHistory?: Array<{
      date: string;
      score: number;
    }>;
    moodHistory?: Array<{
      date: string;
      mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
      note?: string;
    }>;
  };
  
  // Personalized Recommendations
  recommendations?: {
    sessions?: Array<{
      title: string;
      description: string;
      type: string;
      reason: string; // Why this is recommended
      priority: 'high' | 'medium' | 'low';
    }>;
    exercises?: Array<{
      name: string;
      type: string;
      duration: number;
      reason: string;
    }>;
    articles?: Array<{
      title: string;
      url: string;
      relevance: string;
    }>;
    therapists?: string[]; // IDs of recommended therapists
    nextSteps?: string[]; // Suggested actions
  };
  
  // Personalized Messages & Feedback
  personalizedContent?: {
    welcomeMessage?: string; // Custom greeting based on user data
    motivationalMessages?: string[]; // Tailored encouragement
    celebrationMessages?: string[]; // For achievements
    checkInMessages?: string[]; // Periodic check-ins
    feedbackMessages?: Array<{
      message: string;
      type: 'encouragement' | 'tip' | 'reminder' | 'celebration';
      date: string;
      read: boolean;
    }>;
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
  isDonationSeekerApplicationPending?: boolean;
  totalDonated?: number; // in EUR
  totalReceived?: number; // in EUR
  donationSeekerApproved?: boolean;
  donationSeekerReason?: string;
  
  // Loyalty Points
  loyaltyPoints?: {
    current?: number;
    lifetime?: number;
    tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
    lastUpdated?: string;
  };
  
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
    therapistNotes?: Array<{
      therapistId: string;
      note: string;
      createdAt: string;
      updatedAt?: string;
    }>;

    followUpReminders?: Array<{
      therapistId: string;
      reminder: string;
      dueDate: string;
      completed?: boolean;
      completedAt?: string;
    }>;
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
  date: string; // ISO string
  mood: number; // 1-5
  painLevel: number; // 1-10
  energyLevel: number; // 1-10
  notes?: string;
  tags?: string[];
  userId: string;
};

export type Goal = {
  id: string;
  userId: string;
  description: string;
  targetDate: string; // ISO string
  isCompleted: boolean;
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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  lastLogin: string;
  subscriptionTier: 'free' | 'loyal' | 'vip';
}

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type TherapyRecommendation = {
  id: string;
  title: string;
  reasoning: string;
  type: 'exercise' | 'article' | 'meditation';
};
