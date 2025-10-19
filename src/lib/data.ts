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

    