import type { User, VipData, VipPlan, Therapy } from '@/lib/types';
import {
  CalendarDays,
  Heart,
  TrendingUp,
  TrendingDown,
  Activity,
  Award
} from 'lucide-react';

export const allUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    phoneNumber: process.env.NEXT_PUBLIC_DEMO_PHONE_NUMBER, // Added for Square integration demo
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    role: 'VIP',
    initials: 'AD',
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

export const therapies: Omit<Therapy, 'id'>[] = [
    {
        name: "Massage Therapy",
        category: "Service",
        shortDescription: "Relieve muscle tension and improve circulation with a classic massage.",
        longDescription: "A comprehensive massage therapy session aimed at relieving deep-seated muscle tension, improving blood flow, and promoting overall relaxation. Ideal for stress relief and muscle recovery.",
        duration: 60,
        priceEUR: 80,
        benefits: ["Reduces muscle soreness", "Improves circulation", "Lowers stress levels"],
        recommendedFor: ["Stress relief", "Athletic recovery", "General wellness"],
        aiSummary: "A classic massage therapy that focuses on relieving muscle tension, enhancing circulation, and promoting relaxation. Best for stress and recovery.",
        availability: "Both",
        complexityLevel: 2
    },
    {
        name: "Feldenkrais Method",
        category: "Complex Therapy",
        shortDescription: "Improve movement patterns and body awareness through gentle guided exercises.",
        longDescription: "The Feldenkrais Method® is a unique approach to improving human movement and overall well-being. Through gentle, mindful movements, you can learn to move more easily, efficiently, and with less pain.",
        duration: 90,
        priceEUR: 120,
        benefits: ["Increases range of motion", "Improves posture and coordination", "Reduces chronic pain"],
        recommendedFor: ["Chronic pain", "Movement difficulties", "Postural issues"],
        aiSummary: "A gentle, movement-based therapy that improves body awareness, coordination, and reduces chronic pain through guided exercises.",
        availability: "In-Person",
        complexityLevel: 4
    },
    {
        name: "Kinesiology",
        category: "Complex Therapy",
        shortDescription: "A holistic approach to balance your body's energy systems.",
        longDescription: "Kinesiology uses muscle monitoring (biofeedback) to identify imbalances in the body's structural, chemical, emotional or other energy systems. By correcting these imbalances, it helps the body to heal itself.",
        duration: 75,
        priceEUR: 100,
        benefits: ["Identifies and clears energy blockages", "Addresses emotional stress", "Boosts vitality and wellness"],
        recommendedFor: ["Unexplained symptoms", "Emotional balancing", "Holistic wellness goals"],
        aiSummary: "A holistic therapy using muscle biofeedback to identify and correct imbalances in the body's energy systems for overall healing.",
        availability: "In-Person",
        complexityLevel: 5
    },
    {
        name: "360° Therapy",
        category: "Complex Therapy",
        shortDescription: "An integrated therapy program combining multiple techniques for comprehensive care.",
        longDescription: "Our signature 360° Therapy is a fully integrated and personalized program. It combines elements of physical therapy, mindfulness, and AI-driven progress tracking to provide a holistic and effective treatment plan.",
        duration: 120,
        priceEUR: 180,
        benefits: ["Personalized treatment plan", "Addresses multiple issues simultaneously", "AI-powered progress tracking"],
        recommendedFor: ["Complex or multiple issues", "Long-term wellness plans", "Performance optimization"],
        aiSummary: "A comprehensive, personalized therapy program integrating physical, mental, and AI-driven techniques for holistic treatment.",
        availability: "Both",
        complexityLevel: 5
    }
];

export const vipPlans: Omit<VipPlan, 'id'>[] = [
  {
    name: "Free",
    priceEUR: 0,
    benefits: [
      "Basic access to content",
      "Community forum access",
      "Standard email support"
    ]
  },
  {
    name: "Gold",
    priceEUR: 49,
    benefits: [
      "All Free benefits",
      "Access to premium articles",
      "1 monthly wellness report",
      "Priority email support"
    ]
  },
  {
    name: "Diamond",
    priceEUR: 99,
    benefits: [
      "All Gold benefits",
      "Unlimited AI wellness reports",
      "1 free monthly massage",
      "Priority booking",
      "2 guest session passes"
    ]
  }
];


export let currentUser: User = allUsers[0];

export const vipData: VipData = {
    active: true,
    tier: "Diamond",
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