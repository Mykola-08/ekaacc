/**
 * Data Service Abstraction Layer
 * 
 * This service provides a unified interface for accessing user data,
 * making it easy to switch between mock data (for development/demo)
 * and Firebase (for production).
 * 
 * To switch between implementations:
 * 1. Change USE_MOCK_DATA in this file
 * 2. Restart your dev server
 * 
 * No other code changes needed!
 */

import type { User, Session, Report, Service, JournalEntry, Exercise, CommunityPost } from '@/lib/types';

// ==========================================
// CONFIGURATION - CHANGE THIS TO SWITCH DATA SOURCE
// ==========================================
export const USE_MOCK_DATA = true; // Set to false to use Firebase
// ==========================================

/**
 * Data Service Interface
 * All implementations (mock or Firebase) must implement this interface
 */
export interface IDataService {
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
  
  // Exercises
  getExercises(): Promise<Exercise[]>;
  
  // Community
  getCommunityPosts(): Promise<CommunityPost[]>;
  createCommunityPost(post: Omit<CommunityPost, 'id'>): Promise<CommunityPost>;
  
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
    const module = await import('./firebase-data-service');
    return module.FirebaseDataService.getInstance();
  }
}
