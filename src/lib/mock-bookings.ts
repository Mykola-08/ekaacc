// Mock data and flows for Stripe-like payments, booking, and AI interactions
import type { User, Session } from './types';

// --- Stripe-like Payment Mock ---
export const mockStripePayments = {
  createCheckoutSession: async (userId: string, amount: number) => {
    await new Promise(res => setTimeout(res, 600));
    return {
      id: 'cs_test_' + Math.random().toString(36).slice(2),
      url: '/mock-checkout-success',
      amount,
      status: 'open',
      userId,
    };
  },
  getSessionStatus: async (sessionId: string) => {
    await new Promise(res => setTimeout(res, 400));
    return {
      id: sessionId,
      status: 'complete',
    };
  },
};

// --- Booking Mock ---
export type Booking = {
  id: string;
  userId: string;
  therapistId: string;
  sessionId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
};

export const mockBookings: Booking[] = [
  {
    id: 'booking1',
    userId: 'user1',
    therapistId: 'therapist1',
    sessionId: 'session1',
    date: new Date(Date.now() + 86400000).toISOString(),
    status: 'confirmed',
    notes: 'Initial assessment',
  },
  {
    id: 'booking2',
    userId: 'user1',
    therapistId: 'therapist1',
    sessionId: 'session2',
    date: new Date(Date.now() + 3 * 86400000).toISOString(),
    status: 'pending',
  },
];

export const mockBookingAPI = {
  getBookingsForUser: async (userId: string) => {
    await new Promise(res => setTimeout(res, 300));
    return mockBookings.filter(b => b.userId === userId);
  },
  createBooking: async (userId: string, therapistId: string, date: string, notes?: string) => {
    await new Promise(res => setTimeout(res, 500));
    // availability check: therapist cannot have two bookings at same hour
    const requestedHour = new Date(date).getTime();
    const conflict = mockBookings.find(b => b.therapistId === therapistId && Math.abs(new Date(b.date).getTime() - requestedHour) < (1000 * 60 * 60));
    if (conflict) {
      throw new Error('Therapist not available at selected time');
    }

    const newBooking: Booking = {
      id: 'booking' + (mockBookings.length + 1),
      userId,
      therapistId,
      sessionId: 'session' + (mockBookings.length + 1),
      date,
      status: 'pending',
      notes,
    };
    mockBookings.push(newBooking);
    return newBooking;
  },
  cancelBooking: async (bookingId: string) => {
    await new Promise(res => setTimeout(res, 300));
    const idx = mockBookings.findIndex(b => b.id === bookingId);
    if (idx !== -1) mockBookings[idx].status = 'cancelled';
    return mockBookings[idx];
  },
  updateBooking: async (bookingId: string, updates: Record<string, any>) => {
    await new Promise(res => setTimeout(res, 200));
    const idx = mockBookings.findIndex(b => b.id === bookingId);
    if (idx === -1) throw new Error('Booking not found');
    mockBookings[idx] = { ...mockBookings[idx], ...updates };
    return mockBookings[idx];
  },
  getAllBookings: async () => {
    await new Promise(res => setTimeout(res, 200));
    return mockBookings.slice();
  },
};

// --- AI Mock ---
export type AIMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const mockChatHistory: Record<string, AIMessage[]> = {
  user1: [
    {
      id: 'msg-initial-assistant',
      role: 'assistant',
      content: 'Hello! How can I help you with your wellness journey today?'
    },
  ],
};

export const mockAIAPI = {
  getChatHistory: async (userId: string) => {
    await new Promise(res => setTimeout(res, 100));
    return mockChatHistory[userId] || [];
  },
  sendMessage: async (userId: string, content: string) => {
    await new Promise(res => setTimeout(res, 800));
    if (!mockChatHistory[userId]) mockChatHistory[userId] = [];

    const timestamp = Date.now();
    const userMessage: AIMessage = {
      id: `msg-${userId}-${timestamp}`,
      role: 'user',
      content,
    };
    mockChatHistory[userId].push(userMessage);

    const response: AIMessage = {
      id: `msg-${userId}-${timestamp + 1}`,
      role: 'assistant',
      content: `This is a mock AI response to: "${content}". In a real app, this would be a helpful, contextual reply.`,
    };
    mockChatHistory[userId].push(response);

    return [userMessage, response];
  },
  getAIChatResponse: async (prompt: string, history: any[]) => {
    await new Promise(res => setTimeout(res, 800));
    const responses = [
      "That's a very insightful question. Let's explore that a bit more.",
      "Thank you for sharing. It takes courage to open up about these things.",
      "Based on what you've told me, have you considered trying a mindfulness exercise?",
      "It sounds like you're making some real progress. How does that feel?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },
  getAIRecommendations: async () => {
    await new Promise(res => setTimeout(res, 1200));
    return [
      { id: 'rec-1', title: 'Practice Mindfulness Meditation', reasoning: 'Based on your recent journal entries about feeling stressed, a 5-minute daily mindfulness practice could help calm your nervous system.', type: 'meditation' },
      { id: 'rec-2', title: 'Read About Cognitive Restructuring', reasoning: 'You mentioned struggling with negative thought patterns. This article explains a technique to challenge and change them.', type: 'article' },
    ];
  },
  getAIReportSummary: async (reportId: string) => {
    await new Promise(res => setTimeout(res, 1500));
    return `This is a mock AI summary for report ${reportId}. It highlights a positive trend in mood and suggests focusing on social interactions next.`;
  },
};
