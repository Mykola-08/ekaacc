import type { User, Session, Report, Therapy, JournalEntry, Exercise, CommunityPost } from './types';

// Mock current user
export const mockCurrentUser: User = {
  id: 'user-123',
  uid: 'user-123',
  email: 'demo@ekaacc.com',
  name: 'Demo User',
  displayName: 'Demo User',
  initials: 'DU',
  role: 'Patient',
  phoneNumber: '+1-555-0123',
  avatarUrl: 'https://i.pravatar.cc/150?u=demo',
  bio: 'Health enthusiast focused on improving flexibility and reducing back pain through therapy.',
  location: 'Dublin, Ireland',
  dateOfBirth: '1990-05-15',
  gender: 'prefer-not-to-say',
  emergencyContact: {
    name: 'Jane Doe',
    phone: '+1-555-0124',
    relationship: 'Spouse'
  },
  accountStatus: 'active',
  profileCompleteness: 85,
  lastLoginAt: new Date().toISOString(),
  profileVisibility: {
    showEmail: false,
    showPhone: false,
    showLocation: true,
    showBio: true,
    showToTherapists: true,
    showToAdmins: true,
    publicProfile: false
  },
  createdAt: new Date('2025-09-01').toISOString(),
  personalizationCompleted: true,
  personalization: {
    goals: 'Reduce back pain and improve flexibility',
    interests: 'Yoga, Physical Therapy, Mindfulness',
    values: 'Health, Wellness, Balance',
    preferences: 'Morning sessions, Calm environment'
  },
  goal: {
    targetSessions: 12,
    currentSessions: 8
  },
  dashboardWidgets: {
    goalProgress: true,
    quickActions: true,
    nextSession: true,
    recentActivity: true,
  },
  isVip: true,
  vipTier: 'Platinum',
  vipSince: '2025-01-01',
  vipExpiresAt: '2026-01-01',
  vipBenefits: {
    priorityBooking: true,
    discountPercentage: 30,
    freeSessionsPerMonth: 3,
    dedicatedTherapist: true,
  },
  isDonor: true,
  isDonationSeeker: false,
  totalDonated: 500,
  totalReceived: 0,
  linkedTherapist: 'therapist-123',
  squareCustomerId: 'sq-cust-123',
  preferredLanguage: 'en',
  timezone: 'Europe/Dublin',
};

// Mock therapist user
export const mockTherapistUser: User = {
  id: 'therapist-123',
  uid: 'therapist-123',
  email: 'therapist@ekaacc.com',
  name: 'Dr. Sarah Johnson',
  displayName: 'Dr. Sarah Johnson',
  initials: 'SJ',
  role: 'Therapist',
  phoneNumber: '+1-555-0456',
  avatarUrl: 'https://i.pravatar.cc/150?u=therapist',
  bio: 'Licensed physical therapist with 10+ years of experience specializing in sports injuries and chronic pain management.',
  location: 'Dublin, Ireland',
  dateOfBirth: '1985-03-20',
  gender: 'female',
  accountStatus: 'active',
  profileCompleteness: 100,
  lastLoginAt: new Date().toISOString(),
  therapistProfile: {
    specializations: ['Sports Injuries', 'Chronic Pain', 'Post-Surgery Rehabilitation', 'Geriatric Care'],
    certifications: [
      'Doctor of Physical Therapy (DPT)',
      'Certified Orthopedic Manual Therapist',
      'Sports Physical Therapy Certification'
    ],
    licenseNumber: 'PT-12345-IE',
    yearsOfExperience: 12,
    education: 'DPT, University College Dublin',
    languages: ['English', 'Irish', 'Spanish'],
    hourlyRate: 85,
    acceptingNewClients: true
  },
  profileVisibility: {
    showEmail: true,
    showPhone: true,
    showLocation: true,
    showBio: true,
    showToTherapists: true,
    showToAdmins: true,
    publicProfile: true
  },
  createdAt: new Date('2024-01-01').toISOString(),
  personalizationCompleted: true,
  isVip: false,
  isDonor: false,
  isDonationSeeker: false,
  preferredLanguage: 'en',
  timezone: 'Europe/Dublin',
};

// Mock sessions
export const mockSessions: Session[] = [
  {
    id: 'session-1',
    therapist: 'Dr. Sarah Johnson',
    therapistAvatarUrl: 'https://i.pravatar.cc/150?u=therapist',
    date: new Date('2025-10-25T10:00:00').toISOString(),
    time: '10:00 AM',
    duration: 60,
    status: 'Upcoming',
    type: 'Physical Therapy',
    location: 'EKA Wellness Center',
    notes: 'Focus on lower back exercises'
  },
  {
    id: 'session-2',
    therapist: 'Dr. Sarah Johnson',
    therapistAvatarUrl: 'https://i.pravatar.cc/150?u=therapist',
    date: new Date('2025-11-01T14:00:00').toISOString(),
    time: '2:00 PM',
    duration: 60,
    status: 'Upcoming',
    type: 'Massage Therapy',
    location: 'EKA Wellness Center'
  },
  {
    id: 'session-3',
    therapist: 'Dr. Sarah Johnson',
    therapistAvatarUrl: 'https://i.pravatar.cc/150?u=therapist',
    date: new Date('2025-10-18T10:00:00').toISOString(),
    time: '10:00 AM',
    duration: 60,
    status: 'Completed',
    type: 'Physical Therapy',
    location: 'EKA Wellness Center'
  },
  {
    id: 'session-4',
    therapist: 'Dr. Sarah Johnson',
    therapistAvatarUrl: 'https://i.pravatar.cc/150?u=therapist',
    date: new Date('2025-10-11T10:00:00').toISOString(),
    time: '10:00 AM',
    duration: 60,
    status: 'Completed',
    type: 'Physical Therapy',
    location: 'EKA Wellness Center'
  },
  {
    id: 'session-5',
    therapist: 'Dr. Sarah Johnson',
    therapistAvatarUrl: 'https://i.pravatar.cc/150?u=therapist',
    date: new Date('2025-10-04T10:00:00').toISOString(),
    time: '10:00 AM',
    duration: 60,
    status: 'Completed',
    type: 'Massage Therapy',
    location: 'EKA Wellness Center'
  },
];

// Mock reports
export const mockReports: Report[] = [
  {
    id: 'report-1',
    sessionId: 'session-3',
    createdAt: new Date('2025-10-18').toISOString(),
    painLevel: 4,
    mobility: 75,
    notes: 'Good progress on lower back flexibility. Patient reported less morning stiffness.',
    exercises: ['Cat-Cow Stretch', 'Bird Dog', 'Pelvic Tilts']
  },
  {
    id: 'report-2',
    sessionId: 'session-4',
    createdAt: new Date('2025-10-11').toISOString(),
    painLevel: 5,
    mobility: 70,
    notes: 'Continued improvement. Introduced new core strengthening exercises.',
    exercises: ['Plank', 'Side Plank', 'Dead Bug']
  },
  {
    id: 'report-3',
    sessionId: 'session-5',
    createdAt: new Date('2025-10-04').toISOString(),
    painLevel: 6,
    mobility: 65,
    notes: 'Initial assessment. Moderate lower back pain with limited range of motion.',
    exercises: ['Gentle stretches', 'Walking']
  },
];

// Mock therapies
export const mockTherapies: Therapy[] = [
  {
    id: 'therapy-1',
    name: 'Physical Therapy',
    descriptionShort: 'Evidence-based exercises and manual therapy to restore function and reduce pain',
    descriptionLong: 'Comprehensive physical therapy program designed to address your specific needs',
    durationMinutes: 60,
    priceEUR: 120,
    category: 'Core',
    benefits: ['Pain reduction', 'Improved mobility', 'Strength building', 'Injury prevention'],
    tags: ['physical', 'rehabilitation', 'strength'],
    active: true,
  },
  {
    id: 'therapy-2',
    name: 'Massage Therapy',
    descriptionShort: 'Therapeutic massage to relax muscles, reduce tension, and improve circulation',
    descriptionLong: 'Professional massage therapy for muscle relaxation and stress relief',
    durationMinutes: 90,
    priceEUR: 150,
    category: 'Personalized',
    benefits: ['Muscle relaxation', 'Stress relief', 'Better circulation', 'Pain management'],
    tags: ['massage', 'relaxation', 'wellness'],
    active: true,
  },
  {
    id: 'therapy-3',
    name: 'Acupuncture',
    descriptionShort: 'Traditional Chinese medicine technique for pain relief and wellness',
    descriptionLong: 'Ancient healing practice for holistic wellness and pain management',
    durationMinutes: 45,
    priceEUR: 100,
    category: '360° Component',
    benefits: ['Pain relief', 'Stress reduction', 'Energy balance', 'Improved sleep'],
    tags: ['acupuncture', 'traditional', 'holistic'],
    active: true,
  },
  {
    id: 'therapy-4',
    name: 'Yoga Therapy',
    descriptionShort: 'Customized yoga practice for therapeutic benefits and mind-body wellness',
    descriptionLong: 'Personalized yoga sessions tailored to your therapeutic needs',
    durationMinutes: 75,
    priceEUR: 90,
    category: 'Personalized',
    benefits: ['Flexibility', 'Strength', 'Balance', 'Mental clarity'],
    tags: ['yoga', 'mindfulness', 'flexibility'],
    active: true,
  },
];

// Sample patients and therapists lists for testing
export const mockPatients: User[] = [
  mockCurrentUser,
  {
    id: 'user-456',
    uid: 'user-456',
    email: 'jane.smith@example.com',
    displayName: 'Jane Smith',
    initials: 'JS',
    role: 'Patient',
    createdAt: new Date('2025-08-15').toISOString(),
    personalizationCompleted: false,
  } as any,
  {
    id: 'user-789',
    uid: 'user-789',
    email: 'mark.wilson@example.com',
    displayName: 'Mark Wilson',
    initials: 'MW',
    role: 'Patient',
    createdAt: new Date('2025-07-01').toISOString(),
    personalizationCompleted: true,
  } as any,
];

export const mockTherapists: User[] = [
  mockTherapistUser,
  {
    id: 'therapist-456',
    uid: 'therapist-456',
    email: 'therapist2@ekaacc.com',
    displayName: 'Dr. Alex Reed',
    initials: 'AR',
    role: 'Therapist',
    createdAt: new Date('2023-05-01').toISOString(),
    personalizationCompleted: true,
  } as any,
];

// Mock journal entries
export const mockJournalEntries: JournalEntry[] = [
  {
    id: 'journal-1',
    date: new Date('2025-10-20').toISOString(),
    mood: 'Good',
    painLevel: 3,
    energy: 7,
    notes: 'Feeling much better today. Morning stretches helped a lot.',
    activities: ['Morning yoga', 'Walking 30min'],
  },
  {
    id: 'journal-2',
    date: new Date('2025-10-19').toISOString(),
    mood: 'Okay',
    painLevel: 4,
    energy: 6,
    notes: 'Some stiffness in the morning, but improved after exercises.',
    activities: ['Exercises from therapy'],
  },
  {
    id: 'journal-3',
    date: new Date('2025-10-18').toISOString(),
    mood: 'Great',
    painLevel: 2,
    energy: 8,
    notes: 'Best day this week! Therapy session was very helpful.',
    activities: ['Physical therapy', 'Swimming'],
  },
];

// Mock exercises
export const mockExercises: Exercise[] = [
  {
    id: 'exercise-1',
    name: 'Cat-Cow Stretch',
    category: 'Stretching',
    difficulty: 'Beginner',
    duration: 5,
    description: 'A gentle flow between two poses that warms up the spine and relieves back tension.',
    benefits: ['Improves spinal flexibility', 'Relieves back tension', 'Improves posture'],
    instructions: [
      'Start on hands and knees in tabletop position',
      'Inhale, drop belly, lift chest and tailbone (Cow)',
      'Exhale, round spine, tuck chin to chest (Cat)',
      'Repeat for 10-15 breaths'
    ],
    videoUrl: 'https://example.com/cat-cow',
    completed: false,
  },
  {
    id: 'exercise-2',
    name: 'Bird Dog',
    category: 'Strength',
    difficulty: 'Intermediate',
    duration: 10,
    description: 'A core stability exercise that strengthens the back and improves balance.',
    benefits: ['Strengthens core', 'Improves balance', 'Stabilizes spine'],
    instructions: [
      'Start in tabletop position',
      'Extend right arm forward and left leg back',
      'Hold for 5-10 seconds',
      'Return to start and switch sides',
      'Repeat 10 times each side'
    ],
    completed: true,
  },
  {
    id: 'exercise-3',
    name: 'Hip Flexor Stretch',
    category: 'Stretching',
    difficulty: 'Beginner',
    duration: 8,
    description: 'Targets tight hip flexors, common in people who sit for extended periods.',
    benefits: ['Reduces hip pain', 'Improves posture', 'Increases flexibility'],
    instructions: [
      'Kneel on one knee with other foot flat on floor',
      'Push hips forward gently',
      'Hold for 30 seconds',
      'Switch sides and repeat'
    ],
    completed: false,
  },
];

// Mock community posts
export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'John Smith',
    authorAvatar: 'https://i.pravatar.cc/150?u=john',
    title: 'My journey with lower back pain recovery',
    content: 'After 3 months of consistent physical therapy, I\'m finally pain-free! Here\'s what worked for me...',
    category: 'Success Stories',
    likes: 45,
    replies: 12,
    createdAt: new Date('2025-10-18').toISOString(),
    tags: ['back-pain', 'recovery', 'success'],
  },
  {
    id: 'post-2',
    author: 'Emily Chen',
    authorAvatar: 'https://i.pravatar.cc/150?u=emily',
    title: 'Best exercises for morning stiffness?',
    content: 'Looking for recommendations for gentle exercises to do first thing in the morning...',
    category: 'Questions',
    likes: 23,
    replies: 8,
    createdAt: new Date('2025-10-19').toISOString(),
    tags: ['exercises', 'morning-routine'],
  },
  {
    id: 'post-3',
    author: 'Mike Wilson',
    authorAvatar: 'https://i.pravatar.cc/150?u=mike',
    title: 'Yoga vs Physical Therapy - My experience',
    content: 'I\'ve tried both and here\'s what I learned about which works best for different situations...',
    category: 'Tips & Advice',
    likes: 67,
    replies: 19,
    createdAt: new Date('2025-10-17').toISOString(),
    tags: ['yoga', 'physical-therapy', 'comparison'],
  },
];

// Mock AI insights
export const mockAIInsights = {
  trends: [
    {
      type: 'improvement',
      title: 'Pain Levels Decreasing',
      description: 'Your pain levels have decreased by 40% over the last month',
      confidence: 0.92,
    },
    {
      type: 'success',
      title: 'Consistent Exercise Routine',
      description: 'You\'ve maintained a consistent exercise routine for 14 days',
      confidence: 0.98,
    },
    {
      type: 'warning',
      title: 'Sleep Pattern Disruption',
      description: 'Your sleep quality has varied more than usual this week',
      confidence: 0.75,
    },
  ],
  recommendations: [
    'Continue with current exercise routine - showing excellent results',
    'Consider adding gentle yoga in the evening for better sleep',
    'Schedule a follow-up session to review progress',
  ],
  nextSteps: [
    'Book your next physical therapy session',
    'Complete daily mobility exercises',
    'Update your wellness journal',
  ],
};

// Helper function to simulate async data fetching
export const mockFetch = <T>(data: T, delay: number = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Mock authentication
export const mockAuth = {
  currentUser: mockCurrentUser,
  login: async (email: string, password: string) => {
    await mockFetch(null, 1000);
    if (email === 'therapist@ekaacc.com') {
      return mockTherapistUser;
    }
    return mockCurrentUser;
  },
  logout: async () => {
    await mockFetch(null, 500);
    return true;
  },
  signup: async (email: string, password: string, name: string) => {
    await mockFetch(null, 1000);
    return {
      ...mockCurrentUser,
      email,
      displayName: name,
      personalizationCompleted: false,
    };
  },
};

// Mock users for admin user management
export const mockUsers: User[] = [
  mockCurrentUser,
  mockTherapistUser,
  {
    id: 'user-456',
    email: 'john.smith@example.com',
    name: 'John Smith',
    displayName: 'John Smith',
    initials: 'JS',
    role: 'Patient',
    phoneNumber: '+1-555-0789',
    avatarUrl: 'https://i.pravatar.cc/150?u=john',
    bio: 'Software developer dealing with repetitive strain injury.',
    location: 'Cork, Ireland',
    accountStatus: 'active',
    profileCompleteness: 70,
    profileVisibility: {
      showEmail: false,
      showPhone: false,
      showLocation: true,
      showBio: true,
      showToTherapists: true,
      showToAdmins: true,
      publicProfile: false
    },
    createdAt: new Date('2025-08-15').toISOString(),
    personalizationCompleted: true,
    isVip: false,
    isDonor: false,
    isDonationSeeker: false,
    preferredLanguage: 'en',
    timezone: 'Europe/Dublin',
  },
  {
    id: 'therapist-456',
    email: 'michael.chen@ekaacc.com',
    name: 'Dr. Michael Chen',
    displayName: 'Dr. Michael Chen',
    initials: 'MC',
    role: 'Therapist',
    phoneNumber: '+1-555-0321',
    avatarUrl: 'https://i.pravatar.cc/150?u=michael',
    bio: 'Specialized in sports medicine and athletic performance.',
    location: 'Galway, Ireland',
    accountStatus: 'active',
    profileCompleteness: 95,
    therapistProfile: {
      specializations: ['Sports Medicine', 'Athletic Performance', 'Injury Prevention'],
      certifications: ['Certified Strength and Conditioning Specialist', 'Sports Medicine Certification'],
      licenseNumber: 'PT-67890-IE',
      yearsOfExperience: 8,
      education: 'MSc Sports Medicine, Trinity College Dublin',
      languages: ['English', 'Mandarin'],
      hourlyRate: 75,
      acceptingNewClients: true
    },
    profileVisibility: {
      showEmail: true,
      showPhone: true,
      showLocation: true,
      showBio: true,
      showToTherapists: true,
      showToAdmins: true,
      publicProfile: true
    },
    createdAt: new Date('2024-06-01').toISOString(),
    personalizationCompleted: true,
    isVip: false,
    isDonor: false,
    isDonationSeeker: false,
    preferredLanguage: 'en',
    timezone: 'Europe/Dublin',
  },
  {
    id: 'user-789',
    email: 'mary.oconnor@example.com',
    name: "Mary O'Connor",
    displayName: "Mary O'Connor",
    initials: 'MO',
    role: 'Patient',
    phoneNumber: '+1-555-0654',
    bio: 'Retired teacher recovering from knee surgery.',
    location: 'Limerick, Ireland',
    accountStatus: 'active',
    profileCompleteness: 60,
    profileVisibility: {
      showEmail: false,
      showPhone: false,
      showLocation: true,
      showBio: true,
      showToTherapists: true,
      showToAdmins: true,
      publicProfile: false
    },
    createdAt: new Date('2025-07-20').toISOString(),
    personalizationCompleted: true,
    isVip: true,
    vipTier: 'Gold',
    isDonor: true,
    isDonationSeeker: false,
    totalDonated: 200,
    preferredLanguage: 'en',
    timezone: 'Europe/Dublin',
  },
  {
    id: 'admin-001',
    email: 'admin@ekaacc.com',
    name: 'System Administrator',
    displayName: 'Admin',
    initials: 'SA',
    role: 'Admin',
    phoneNumber: '+1-555-0000',
    avatarUrl: 'https://i.pravatar.cc/150?u=admin',
    bio: 'System administrator managing the EKA platform.',
    location: 'Dublin, Ireland',
    accountStatus: 'active',
    profileCompleteness: 100,
    profileVisibility: {
      showEmail: false,
      showPhone: false,
      showLocation: false,
      showBio: false,
      showToTherapists: false,
      showToAdmins: true,
      publicProfile: false
    },
    createdAt: new Date('2024-01-01').toISOString(),
    personalizationCompleted: true,
    isVip: false,
    isDonor: false,
    isDonationSeeker: false,
    preferredLanguage: 'en',
    timezone: 'Europe/Dublin',
  },
  {
    id: 'user-suspended',
    email: 'suspended@example.com',
    name: 'Suspended User',
    displayName: 'Suspended User',
    initials: 'SU',
    role: 'Patient',
    accountStatus: 'suspended',
    suspendedReason: 'Violation of community guidelines',
    suspendedUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    profileCompleteness: 40,
    profileVisibility: {
      showEmail: false,
      showPhone: false,
      showLocation: false,
      showBio: false,
      showToTherapists: false,
      showToAdmins: true,
      publicProfile: false
    },
    createdAt: new Date('2025-09-01').toISOString(),
    personalizationCompleted: false,
    isVip: false,
    isDonor: false,
    isDonationSeeker: false,
    preferredLanguage: 'en',
    timezone: 'Europe/Dublin',
  },
];
