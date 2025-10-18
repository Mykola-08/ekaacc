export type UserRole =
  | 'User'
  | 'Therapist'
  | 'Donor'
  | 'Donation Receiver'
  | 'VIP'
  | 'Admin'
  | 'Student'
  | 'Corporate'
  | 'Affiliate';

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  initials: string;
};

export type Session = {
  id: string;
  therapist: string;
  therapistAvatarUrl: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: 'Upcoming' | 'Completed' | 'Canceled';
  type: string;
};

export type Donation = {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  receiverName: string;
};

export type Report = {
  id: string;
  title: string;
  author: string;
  date: string;
  type: 'Therapist Report' | 'User Report' | 'AI Summary';
  summary: string;
};

export type Message = {
  id: string;
  sender: string;
  senderAvatarUrl: string;
  recipient: string;
  text: string;
  timestamp: string;
  isRead: boolean;
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
  priceUSD: number;
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
  priceUSD: number;
  aiSummary: string;
};
