import type { User, VipData, Service, VipPlan, LoyalPlan } from '@/lib/types';

export const allUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    phoneNumber: process.env.NEXT_PUBLIC_DEMO_PHONE_NUMBER, // Added for Square integration demo
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    role: 'Patient',
    initials: 'AD',
    personalizationCompleted: true,
    dashboardWidgets: {
        goalProgress: true,
        quickActions: true,
        nextSession: true,
        recentActivity: true,
    },
    // Subscription - Change these for testing
    subscriptionType: 'Loyal', // 'Free' | 'Loyal' | 'VIP'
    isLoyal: true,
    loyalTier: 'Plus', // 'Normal' | 'Plus' | 'Pro' | 'ProMax'
    loyalSince: '2024-06-01',
    loyalExpiresAt: '2025-06-01',
    loyalBenefits: {
      discountPercentage: 10,
      sessionCreditsPerMonth: 2,
      prioritySupport: true,
      groupSessionAccess: true,
      advancedAIFeatures: true,
    },
    isVip: false, // Set to true for VIP testing
    vipTier: undefined,
    isDonor: false,
    isDonationSeeker: false,
    totalDonated: 0,
    totalReceived: 0,
    linkedTherapist: 'user-2',
    preferredLanguage: 'en',
    timezone: 'Europe/Dublin',
  },
  {
    id: 'user-2',
    name: 'Dr. Emily Carter',
    email: 'emily.carter@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    role: 'Therapist',
    initials: 'EC',
    isVip: false,
    isDonor: false,
    isDonationSeeker: false,
    preferredLanguage: 'en',
    timezone: 'Europe/Dublin',
  },
  {
    id: 'user-3',
    name: 'Jane Donor',
    email: 'jane.donor@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    role: 'Patient',
    initials: 'JD',
    isVip: false,
    vipTier: undefined,
    isDonor: true,
    isDonationSeeker: false,
    totalDonated: 2500,
    totalReceived: 0,
    preferredLanguage: 'en',
    timezone: 'Europe/Dublin',
  }
]

export const services: Omit<Service, 'id'>[] = [
    // Core Services
    {
        name: "Therapeutic Massage",
        category: "Core",
        descriptionShort: "Massages to reduce pain, stress and stiffness.",
        descriptionLong: "A decontracting massage designed to alleviate chronic pain, reduce accumulated stress, and release muscle stiffness for improved well-being.",
        durationMinutes: 90,
        priceEUR: 95,
        benefits: ["Contracture relief", "Improved circulation", "Deep relaxation"],
        tags: ["massage", "pain relief", "stress reduction", "holistic"],
        active: true,
    },
    {
        name: "Holistic Kinesiology",
        category: "Core",
        descriptionShort: "Neuromuscular assessment and corrections to improve posture and energy.",
        descriptionLong: "Utilizes neuromuscular testing to identify and correct imbalances in the body, enhancing posture, energy flow, and overall vitality.",
        durationMinutes: 60,
        priceEUR: 75,
        benefits: ["Unblock energy", "Improve posture", "Reduce stress", "Boost energy"],
        tags: ["kinesiology", "holistic", "energy work", "posture"],
        active: true,
    },
    {
        name: "Conscious Nutrition",
        category: "Core",
        descriptionShort: "Personalised nutritional counselling for energy and long-term health.",
        descriptionLong: "Receive personalized nutritional guidance to cultivate healthy eating habits, manage weight effectively, boost your energy levels, and ensure long-term health.",
        durationMinutes: 60,
        priceEUR: 85,
        benefits: ["Healthy habits", "Weight management", "More energy", "Long-term health"],
        tags: ["nutrition", "health", "wellness", "coaching"],
        active: true,
    },
    {
        name: "360 Review",
        category: "Core",
        descriptionShort: "A comprehensive assessment to provide a personalised action plan.",
        descriptionLong: "A complete and holistic journey through your body—physical, emotional, structural, and energetic—to create a fully personalized action plan.",
        durationMinutes: 60,
        priceEUR: 150,
        benefits: ["Holistic assessment", "Personalized plan", "Identify root causes"],
        tags: ["360-review", "assessment", "holistic", "personalized"],
        active: true,
    },
    // 360° Components
    {
        name: "Consulta Profunda (Deep Consultation)",
        category: "360° Component",
        descriptionShort: "45 minutes of listening to the body’s story.",
        descriptionLong: "The first step in the 360° journey, this session is dedicated to deeply listening to and understanding your body's history and current state.",
        durationMinutes: 45,
        priceEUR: 60,
        benefits: ["In-depth analysis", "Understand body's history", "Foundation for plan"],
        tags: ["360-component", "consultation", "assessment"],
        active: true,
    },
    {
        name: "Mapeig Corporal 360 (Body Mapping)",
        category: "360° Component",
        descriptionShort: "60 minutes of full physical/emotional/structural/energetic assessment.",
        descriptionLong: "A comprehensive mapping of your physical, emotional, structural, and energetic systems to get a complete picture of your health.",
        durationMinutes: 60,
        priceEUR: 90,
        benefits: ["Full-body assessment", "Identify imbalances", "Holistic overview"],
        tags: ["360-component", "body-mapping", "assessment"],
        active: true,
    },
    {
        name: "Sessió Integrada (Integrated Session)",
        category: "360° Component",
        descriptionShort: "90 minutes of manual therapy addressing all dimensions simultaneously.",
        descriptionLong: "A powerful manual therapy session that works on the physical, emotional, structural, and energetic dimensions at the same time for integrated healing.",
        durationMinutes: 90,
        priceEUR: 135,
        benefits: ["Simultaneous multi-level healing", "Deep manual therapy", "Integrative treatment"],
        tags: ["360-component", "manual-therapy", "integrative"],
        active: true,
    },
    {
        name: "Pla d’Integració (Integration Plan)",
        category: "360° Component",
        descriptionShort: "30 minutes designing a take-home roadmap.",
        descriptionLong: "A concluding session to design a practical, personalized roadmap for you to continue your integration and progress at home.",
        durationMinutes: 30,
        priceEUR: 50,
        benefits: ["Personalized roadmap", "Actionable steps", "Long-term integration"],
        tags: ["360-component", "planning", "roadmap"],
        active: true,
    },
];

export const vipPlans: Omit<VipPlan, 'id'>[] = [
  {
    tier: "Bronze Elite",
    pricePerMonthEUR: 390,
    sessionsPerMonth: 2,
    sessionDurationMinutes: 90,
    perks: [
      "Two 90-min sessions per month",
      "Integral health checks",
      "Included transport",
      "Personalised follow-up",
      "Priority access",
      "Premium materials"
    ],
    active: true
  },
  {
    tier: "Silver Elite",
    pricePerMonthEUR: 690,
    sessionsPerMonth: 3,
    sessionDurationMinutes: 90,
    perks: [
      "Three 90-min sessions per month",
      "Advanced health control",
      "Premium transport",
      "Family discounts",
      "Transferable sessions",
      "Nutritional consulting",
      "VIP hotline"
    ],
    active: true
  },
  {
    tier: "Gold Elite",
    pricePerMonthEUR: 990,
    sessionsPerMonth: 4,
    sessionDurationMinutes: 90,
    perks: [
      "Four 90-min sessions per month",
      "Premium health control",
      "24/7 transport",
      "Unlimited transferable sessions",
      "Free family access",
      "Personal health concierge",
      "Access to exclusive events"
    ],
    active: true
  }
];

export const loyalPlans: Omit<LoyalPlan, 'id'>[] = [
  {
    tier: "Normal",
    name: "Loyal Normal",
    pricePerMonthEUR: 49,
    sessionCreditsPerMonth: 1,
    discountPercentage: 5,
    features: [
      "1 session credit per month",
      "5% discount on all services",
      "Email support",
      "Access to wellness library",
      "Monthly wellness newsletter"
    ],
    active: true
  },
  {
    tier: "Plus",
    name: "Loyal Plus",
    pricePerMonthEUR: 89,
    sessionCreditsPerMonth: 2,
    discountPercentage: 10,
    features: [
      "2 session credits per month",
      "10% discount on all services",
      "Priority email support",
      "Access to group sessions",
      "Personalized wellness tips",
      "AI mood tracking",
      "Progress reports"
    ],
    aiFeatures: [
      "AI mood tracking",
      "Weekly AI wellness insights"
    ],
    active: true,
    popular: true
  },
  {
    tier: "Pro",
    name: "Loyal Pro",
    pricePerMonthEUR: 139,
    sessionCreditsPerMonth: 3,
    discountPercentage: 15,
    features: [
      "3 session credits per month",
      "15% discount on all services",
      "Priority booking access",
      "Advanced group sessions",
      "AI-powered personalization",
      "Bi-weekly AI check-ins",
      "Custom therapy recommendations",
      "Family account sharing (up to 2 members)"
    ],
    aiFeatures: [
      "AI-powered personalization",
      "Bi-weekly AI wellness check-ins",
      "Smart therapy recommendations"
    ],
    active: true
  },
  {
    tier: "ProMax",
    name: "Loyal Pro Max",
    pricePerMonthEUR: 199,
    sessionCreditsPerMonth: 4,
    discountPercentage: 20,
    features: [
      "4 session credits per month",
      "20% discount on all services",
      "Highest priority booking",
      "Unlimited group sessions",
      "Advanced AI therapy assistant",
      "Daily AI mood & wellness tracking",
      "Personalized AI therapy plans",
      "24/7 AI chat support",
      "Family account sharing (up to 4 members)",
      "Rollover unused credits (1 month)"
    ],
    aiFeatures: [
      "Advanced AI therapy assistant",
      "Daily AI wellness monitoring",
      "Personalized AI therapy plans",
      "24/7 AI chat support",
      "Predictive wellness insights"
    ],
    active: true
  }
];

export let currentUser: User = allUsers[0];

export const vipData: VipData = {
    active: true,
    tier: "Gold Elite",
    renewal: "2024-09-15",
    since: "2023-09-15",
    benefits: [
        { id: "b1", name: "Free Monthly Massages", limit: 1, used: 1, status: 'used' },
        { id: "b2", name: "AI Wellness Reports", limit: 2, used: 1, status: 'available' },
        { id: "b3", name: "Priority Booking", limit: 10, used: 4, status: 'available' },
        { id: "b4", name: "Guest Session Passes", limit: 2, used: 0, status: 'expires' }
    ],
    history: [
        { benefitId: "b1", at: "2024-08-05", value: "Redeemed: 60-min Massage" },
        { benefitId: "b2", at: "2024-08-01", value: "Generated: Monthly AI Report" },
        { benefitId: "b3", at: "2024-07-28", value: "Used: Priority Booking for PT" }
    ],
    insights: {
        savingsEUR: 250,
        monthUses: 3
    }
};
