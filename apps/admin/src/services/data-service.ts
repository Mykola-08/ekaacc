/**
 * Data Service Abstraction Layer
 * 
 * This service provides a unified interface for accessing user data
 * using Supabase for production data.
 */

import type { User, Session, Report, Service, JournalEntry, Exercise, CommunityPost, Donation, Goal, Message } from '@/lib/types';

/**
 * Data Service Interface
 * All implementations must implement this interface
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
  const module = await import('./supabase-data-service');
  return module.supabaseDataService;
}
