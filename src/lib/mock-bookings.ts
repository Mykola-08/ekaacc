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
};

// --- AI Interactions Mock ---
export type AIMessage = {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

export const mockAIChatHistory: AIMessage[] = [
  {
    id: 'msg1',
    userId: 'user1',
    role: 'user',
    content: 'How can I improve my mobility?',
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'msg2',
    userId: 'user1',
    role: 'assistant',
    content: 'Try daily stretching and track your progress in the app!',
    createdAt: new Date(Date.now() - 599000).toISOString(),
  },
];

export const mockAIAPI = {
  getChatHistory: async (userId: string) => {
    await new Promise(res => setTimeout(res, 200));
    return mockAIChatHistory.filter(m => m.userId === userId);
  },
  sendMessage: async (userId: string, content: string) => {
    await new Promise(res => setTimeout(res, 700));
    const userMsg: AIMessage = {
      id: 'msg' + (mockAIChatHistory.length + 1),
      userId,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    mockAIChatHistory.push(userMsg);
    // Simulate AI reply
    const aiMsg: AIMessage = {
      id: 'msg' + (mockAIChatHistory.length + 1),
      userId,
      role: 'assistant',
      content: 'This is a helpful AI reply to: ' + content,
      createdAt: new Date(Date.now() + 1000).toISOString(),
    };
    mockAIChatHistory.push(aiMsg);
    return [userMsg, aiMsg];
  },
};
