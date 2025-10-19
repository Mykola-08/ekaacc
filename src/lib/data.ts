import type { User, StatCard, Report, Therapy, VipData, VipPlan } from '@/lib/types';
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


export let currentUser: User = allUsers[0];

export const reports: Report[] = [
    {
        id: 'report-1',
        title: 'Monthly Progress Summary',
        author: 'AI Assistant',
        date: '2024-08-01',
        type: 'AI Summary',
        summary: 'Significant improvement in mobility and mood noted over the past month. Pain levels have decreased by 20%.'
    },
    {
        id: 'report-2',
        title: 'Session Notes: July 28',
        author: 'Dr. John Smith',
        date: '2024-07-28',
        type: 'Therapist Report',
        summary: 'Patient reported feeling less anxious. Discussed coping strategies for stress management.'
    },
    {
        id: 'report-3',
        title: 'My Weekly Reflection',
        author: 'Alex Doe',
        date: '2024-07-25',
        type: 'User Report',
        summary: 'Felt energetic this week. I was able to complete all my exercises without much difficulty.'
    }
];


export const userStats: StatCard[] = [
  {
    title: 'Pain Reduction',
    value: '20%',
    change: '5%',
    changeType: 'increase',
    icon: TrendingDown,
  },
  {
    title: 'Mobility',
    value: '15%',
    change: '3%',
    changeType: 'increase',
    icon: Activity,
  },
  {
    title: 'Sessions',
    value: '8/10',
    change: '+2',
    changeType: 'increase',
    icon: CalendarDays,
  },
  {
    title: 'Milestones',
    value: '3/5',
    change: '+1',
    changeType: 'increase',
    icon: Award,
  },
];

export const therapies: Therapy[] = [
  {
    id: 'therapy-1',
    name: 'Massage Therapy',
    category: 'Service',
    shortDescription: 'A hands-on treatment that involves manipulating soft tissues to release tension and improve circulation.',
    longDescription: 'Massage Therapy is a proven method for reducing muscle soreness, improving circulation, and promoting overall relaxation. It is ideal for individuals with chronic tension, sports injuries, or those seeking stress relief.',
    duration: 60,
    priceEUR: 120,
    benefits: ['Reduces muscle pain', 'Improves circulation', 'Lowers stress levels', 'Increases relaxation'],
    recommendedFor: ['Chronic back pain', 'Sports injuries', 'Stress relief'],
    aiSummary: 'A manual therapy focused on soft tissue manipulation to alleviate pain and stress.',
    availability: 'In-Person',
    complexityLevel: 2,
  },
  {
    id: 'therapy-2',
    name: 'Feldenkrais Method',
    category: 'Complex Therapy',
    shortDescription: 'A somatic educational system that helps people reconnect with their bodies and learn new ways of moving.',
    longDescription: 'The Feldenkrais Method uses gentle movement and directed attention to help you improve your movement, reduce pain, and enhance overall functioning. It is excellent for those with chronic pain or neurological issues.',
    duration: 90,
    priceEUR: 180,
    benefits: ['Improves posture', 'Increases flexibility', 'Reduces chronic pain', 'Enhances body awareness'],
    recommendedFor: ['Posture correction', 'Chronic pain', 'Neurological conditions'],
    aiSummary: 'A movement-based learning system to improve posture, flexibility, and body awareness.',
    availability: 'Both',
    complexityLevel: 4,
  },
  {
    id: 'therapy-3',
    name: 'Kinesiology',
    category: 'Complex Therapy',
    shortDescription: 'A holistic approach that uses muscle monitoring to identify imbalances in the body\'s structural, chemical, and emotional energy.',
    longDescription: 'Kinesiology combines principles of traditional Chinese medicine with modern Western techniques to promote physical, emotional, and mental well-being. It is highly effective for a wide range of conditions, from allergies to learning difficulties.',
    duration: 75,
    priceEUR: 150,
    benefits: ['Identifies nutritional deficiencies', 'Reduces emotional stress', 'Improves learning ability', 'Boosts energy levels'],
    recommendedFor: ['Allergies', 'Emotional stress', 'Learning disabilities'],
    aiSummary: 'A holistic therapy using muscle feedback to address structural, chemical, and emotional imbalances.',
    availability: 'Both',
    complexityLevel: 5,
  },
  {
    id: 'therapy-4',
    name: '360° Therapy',
    category: 'Complex Therapy',
    shortDescription: 'A comprehensive, multi-disciplinary approach combining physical, mental, and emotional therapies.',
    longDescription: '360° Therapy is our most advanced offering, creating a personalized plan that integrates multiple modalities to address complex health issues from every angle. It includes a dedicated team of therapists to guide your journey.',
    duration: 120,
    priceEUR: 300,
    benefits: ['Holistic issue resolution', 'Personalized treatment plan', 'Access to multiple specialists', 'Addresses root causes'],
    recommendedFor: ['Complex chronic conditions', 'Holistic wellness goals', 'Performance optimization'],
    aiSummary: 'An integrated, multi-modal approach for complex conditions, providing a complete, personalized care plan.',
    availability: 'Both',
    complexityLevel: 5,
  }
];


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

export const vipPlans: VipPlan[] = [
    { id: "free", name: "Free", priceEUR: 0, benefits: ["Standard booking", "Basic reports", "Community access"] },
    { id: "gold", name: "Gold", priceEUR: 49, benefits: ["1 Free Monthly Service", "Advanced AI Reports", "Priority Support", "5% off all therapies"] },
    { id: "diamond", name: "Diamond", priceEUR: 99, benefits: ["2 Free Monthly Services", "Unlimited AI Reports", "24/7 Priority Support", "15% off all therapies", "2 Guest Passes"] }
]
