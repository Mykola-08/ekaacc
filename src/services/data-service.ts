/**
 * Data Service Abstraction Layer
 * 
 * This service provides a unified interface for accessing user data,
 * making it easy to switch between mock data (for development/demo)
 * and Supabase (for production).
 * 
 * To switch between implementations:
 * 1. Change USE_MOCK_DATA in this file
 * 2. Restart your dev server
 * 
 * No other code changes needed!
 */

import type { User, Session, Report, Service, JournalEntry, Exercise, CommunityPost, Donation, Goal, Message } from '@/lib/types';

// ==========================================
// CONFIGURATION - CHANGE THIS TO SWITCH DATA SOURCE
// ==========================================
export const USE_MOCK_DATA = true; // Set to false to use Supabase
// ==========================================

/**
 * Data Service Interface
 * All implementations (mock or Firebase) must implement this interface
 */
export interface IDataService {
  isMock: boolean;
  // User Management
  getCurrentUser(): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  updateUser(userId: string, updates: Partial<User>): Promise<void>;
  
  // Auth
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  
  // Sessions
  getSessions(userId?: string): Promise<Session[]>;
  createSession(session: Omit<Session, 'id'>): Promise<Session>;
  updateSession(sessionId: string, updates: Partial<Session>): Promise<void>;
  cancelSession(sessionId: string): Promise<void>;
  
  // Reports
  getReports(userId?: string): Promise<Report[]>;
  createReport(report: Omit<Report, 'id'>): Promise<Report>;
  
  // Services/Therapies
  getServices(): Promise<Service[]>;
  createService(service: Omit<Service, 'id'>): Promise<Service>;
  updateService(serviceId: string, updates: Partial<Service>): Promise<void>;
  
  // Journal Entries
  getJournalEntries(userId?: string): Promise<JournalEntry[]>;
  createJournalEntry(entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry>;
  
  // Goals
  getGoals(userId?: string): Promise<Goal[]>;
  createGoal(goal: Omit<Goal, 'id'>): Promise<Goal>;
  deleteGoal(goalId: string): Promise<void>;

  // Exercises
  getExercises(): Promise<Exercise[]>;
  
  // Community
  getCommunityPosts(): Promise<CommunityPost[]>;
  createCommunityPost(post: Omit<CommunityPost, 'id'>): Promise<CommunityPost>;
  
  // AI Features
  getAIChatResponse(prompt: string, history: any[]): Promise<string>;
  getAIRecommendations(): Promise<any[]>;
  getAIReportSummary(reportId: string): Promise<string>;

  // Donations
  getDonations(userId?: string): Promise<Donation[]>;
  addDonation(donation: Omit<Donation, 'id'>): Promise<Donation>;

  // Messages
  getMessages(conversationId: string): Promise<Message[]>;
  sendMessage(conversationId: string, message: Omit<Message, 'id'>): Promise<Message>;

  // Initialization
  isReady(): Promise<boolean>;
}

/**
 * Get the active data service implementation
 */
export async function getDataService(): Promise<IDataService> {
  if (USE_MOCK_DATA) {
    const module = await import('./mock-data-service');
    return module.MockDataService.getInstance();
  } else {
    const module = await import('./supabase-data-service');
    // Temporary adapter to satisfy IDataService during migration
    const svc = module.supabaseDataService as any;
    return {
      isMock: false,
      getCurrentUser: async () => null,
      getAllUsers: async () => [],
      updateUser: async (_id: string, _updates: any) => {},
      login: async (_email: string, _password: string) => ({ id: 'user', email: _email } as any),
      logout: async () => {},
      getSessions: async (_userId?: string) => [],
      createSession: async (s: any) => ({ id: 'session', ...s }),
      updateSession: async (_id: string, _u: any) => {},
      cancelSession: async (_id: string) => {},
      getReports: async (_userId?: string) => [],
      createReport: async (r: any) => ({ id: 'report', ...r }),
      getServices: async () => [],
      createService: async (s: any) => ({ id: 'service', ...s }),
      getAIChatResponse: async (_p: string, _h: any[]) => 'Not configured',
      getAIRecommendations: async () => [],
      getAIReportSummary: async (_id: string) => 'Not configured',
      getDonations: async (_userId?: string) => [],
      addDonation: async (d: any) => ({ id: 'donation', ...d }),
      getMessages: async (_cid: string) => [],
      sendMessage: async (_cid: string, m: any) => ({ id: 'msg', ...m }),
      isReady: async () => true,
      // expose raw supabase service for future use
      _supabase: svc,
    } as any;
  }
}
