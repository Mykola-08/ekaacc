import type { User, VipData, Service, VipPlan } from '@/lib/types';

export const allUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    phoneNumber: process.env.NEXT_PUBLIC_DEMO_PHONE_NUMBER, // Added for Square integration demo
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    role: 'Gold Elite',
    initials: 'AD',
    personalizationCompleted: true,
    dashboardWidgets: {
        goalProgress: true,
        quickActions: true,
        nextSession: true,
        recentActivity: true,
    }
  },
  {
    id: 'user-2',
    name: 'Dr. Emily Carter',
    email: 'emily.carter@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    role: 'Therapist',
    initials: 'EC',
  },
  {
    id: 'user-3',
    name: 'Jane Donor',
    email: 'jane.donor@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    role: 'Donor',
    initials: 'JD',
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
