import type { User, Session, StatCard, Report } from '@/lib/types';
import {
  CalendarDays,
  Heart,
  TrendingUp,
  Wallet,
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

export const sessions: Session[] = [
  {
    id: 'session-1',
    therapist: 'Dr. Emily Carter',
    therapistAvatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    date: '2024-08-15',
    time: '10:00 AM',
    duration: 50,
    status: 'Upcoming',
    type: 'Physical Therapy',
  },
  {
    id: 'session-2',
    therapist: 'Dr. John Smith',
    therapistAvatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    date: '2024-07-28',
    time: '2:00 PM',
    duration: 50,
    status: 'Completed',
    type: 'Mental Wellness',
  },
];

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
    title: 'Total Sessions',
    value: '28',
    change: '+2 this month',
    changeType: 'increase',
    icon: CalendarDays,
  },
  {
    title: 'Wellness Score',
    value: '82/100',
    change: '+5',
    changeType: 'increase',
    icon: TrendingUp,
  },
  {
    title: 'Donations Made',
    value: '$150',
    change: '-$25',
    changeType: 'decrease',
    icon: Heart,
  },
  {
    title: 'Account Balance',
    value: '$50',
    change: '+$50',
    changeType: 'increase',
    icon: Wallet,
  },
];