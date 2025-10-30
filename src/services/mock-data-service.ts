/**
 * Mock Data Service Implementation
 * 
 * Provides in-memory mock data for development and demo purposes.
 * All data is stored in localStorage for persistence across page reloads.
 */

import {
  User,
  Session,
  Report,
  Service,
  JournalEntry,
  Exercise,
  CommunityPost,
  TherapyRecommendation,
  Message,
  Donation,
} from '@/lib/types';
import { IDataService } from './data-service';
import { mockSessions, mockReports, mockExercises, mockCommunityPosts, mockTherapies, mockJournalEntries, mockAuth, mockCurrentUser } from '@/lib/mock-data';
import { services } from '@/lib/data';
import { MOCK_AI_RECOMMENDATIONS } from '@/lib/mock-ai-recommendations';

// Simulate network/database delays for realistic async behavior
const SIMULATE_ASYNC = true; // Set to false to disable delays
const DELAY_MS = {
  READ: 100,      // Reading data (getCurrentUser, getSessions, etc.)
  WRITE: 200,     // Creating/updating data
  AUTH: 300,      // Login/logout operations
  AI: 500,        // AI operations
};

const delay = (ms: number) => SIMULATE_ASYNC ? new Promise(resolve => setTimeout(resolve, ms)) : Promise.resolve();

const STORAGE_KEYS = {
  CURRENT_USER: 'mock_current_user',
  SESSIONS: 'mock_sessions',
  REPORTS: 'mock_reports',
  SERVICES: 'mock_services',
  JOURNAL: 'mock_journal',
  COMMUNITY: 'mock_community',
  DONATIONS: 'mock_donations',
};

export class MockDataService implements IDataService {
  public readonly isMock = true;
  private static instance: MockDataService;
  private currentUser: User | null = null;
  private sessions: Session[] = [];
  private reports: Report[] = [];
  private services: Service[] = [];
  private journalEntries: JournalEntry[] = [];
  private communityPosts: CommunityPost[] = [];
  private isInitialized = false;
  private donations: Donation[] = [];

  private constructor() {
    this.initialize();
  }

  static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  private initialize() {
    if (this.isInitialized) return;

    // Load from localStorage or use defaults
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    } else {
      // Auto-login with demo user if no user is logged in
      this.currentUser = {
        ...mockCurrentUser,
        personalizationCompleted: false, // Start with onboarding
      };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
    }

    const savedSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    this.sessions = savedSessions ? JSON.parse(savedSessions) : mockSessions;

    const savedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
    this.reports = savedReports ? JSON.parse(savedReports) : mockReports;

    const savedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
    this.services = savedServices ? JSON.parse(savedServices) : services.map((s, i) => ({ ...s, id: `service-${i+1}` }));

    const savedJournal = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    this.journalEntries = savedJournal ? JSON.parse(savedJournal) : mockJournalEntries;

    const savedCommunity = localStorage.getItem(STORAGE_KEYS.COMMUNITY);
    this.communityPosts = savedCommunity ? JSON.parse(savedCommunity) : mockCommunityPosts;

    const savedDonations = localStorage.getItem(STORAGE_KEYS.DONATIONS);
    this.donations = savedDonations ? JSON.parse(savedDonations) : [];

    this.isInitialized = true;
  }

  private saveToStorage() {
    if (this.currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
    }
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(this.sessions));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(this.reports));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(this.services));
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(this.journalEntries));
    localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(this.communityPosts));
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(this.donations));
  }

  async isReady(): Promise<boolean> {
    await delay(DELAY_MS.READ);
    return true;
  }

  // User Management
  async getCurrentUser(): Promise<User | null> {
    await delay(DELAY_MS.READ);
    return this.currentUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    await delay(DELAY_MS.READ);
    // Return the comprehensive mock users array
    const { mockUsers } = await import('@/lib/mock-data');
    return mockUsers;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    await delay(DELAY_MS.WRITE);
    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = { ...this.currentUser, ...updates };
      this.saveToStorage();
    }
  }

  // Auth
  async login(email: string, password: string): Promise<User> {
    await delay(DELAY_MS.AUTH);
    const user = await mockAuth.login(email, password);
    this.currentUser = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  }

  async logout(): Promise<void> {
    await delay(DELAY_MS.AUTH);
    await mockAuth.logout();
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // Sessions
  async getSessions(userId?: string): Promise<Session[]> {
    await delay(DELAY_MS.READ);
    if (userId) {
      return this.sessions.filter(s => s.userId === userId);
    }
    return this.sessions;
  }

  async createSession(session: Omit<Session, 'id'>): Promise<Session> {
    await delay(DELAY_MS.WRITE);
    const newSession: Session = {
      ...session,
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    this.sessions.push(newSession);
    this.saveToStorage();
    return newSession;
  }

  async updateSession(sessionId: string, updates: Partial<Session>): Promise<void> {
    await delay(DELAY_MS.WRITE);
    const index = this.sessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      this.sessions[index] = { ...this.sessions[index], ...updates };
      this.saveToStorage();
    }
  }

  async cancelSession(sessionId: string): Promise<void> {
    await delay(DELAY_MS.WRITE);
    await this.updateSession(sessionId, { status: 'Canceled' });
  }

  // Donations
  async getDonations(userId?: string): Promise<Donation[]> {
    await delay(DELAY_MS.READ);
    if (userId) {
      return this.donations.filter(d => d.donorId === userId || d.receiverId === userId);
    }
    return this.donations;
  }

  async addDonation(donation: Omit<Donation, 'id'>): Promise<Donation> {
    await delay(DELAY_MS.WRITE);
    const newDonation: Donation = {
      ...donation,
      id: `donation-${Date.now()}`,
    };
    this.donations.push(newDonation);
    this.saveToStorage();
    return newDonation;
  }

  // Reports
  async getReports(userId?: string): Promise<Report[]> {
    await delay(DELAY_MS.READ);
    if (userId) {
      return this.reports.filter(r => r.sessionId?.includes(userId));
    }
    return this.reports;
  }

  async createReport(report: Omit<Report, 'id'>): Promise<Report> {
    await delay(DELAY_MS.WRITE);
    const newReport: Report = {
      ...report,
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    this.reports.push(newReport);
    this.saveToStorage();
    return newReport;
  }

  // Services/Therapies
  async getServices(): Promise<Service[]> {
    await delay(DELAY_MS.READ);
    return this.services;
  }

  async createService(service: Omit<Service, 'id'>): Promise<Service> {
    await delay(DELAY_MS.WRITE);
    const newService: Service = {
      ...service,
      id: `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    this.services.push(newService);
    this.saveToStorage();
    return newService;
  }

  async updateService(serviceId: string, updates: Partial<Service>): Promise<void> {
    await delay(DELAY_MS.WRITE);
    const index = this.services.findIndex(s => s.id === serviceId);
    if (index !== -1) {
      this.services[index] = { ...this.services[index], ...updates };
      this.saveToStorage();
    }
  }

  // Journal Entries
  async getJournalEntries(userId?: string): Promise<JournalEntry[]> {
    await delay(DELAY_MS.READ);
    // Mock data doesn't have userId on journal entries, so return all
    return this.journalEntries;
  }

  async createJournalEntry(entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry> {
    await delay(DELAY_MS.WRITE);
    const newEntry: JournalEntry = {
      ...entry,
      id: `journal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    this.journalEntries.push(newEntry);
    this.saveToStorage();
    return newEntry;
  }

  // Exercises
  async getExercises(): Promise<Exercise[]> {
    await delay(DELAY_MS.READ);
    return mockExercises;
  }

  // Community
  async getCommunityPosts(): Promise<CommunityPost[]> {
    await delay(DELAY_MS.READ);
    return this.communityPosts;
  }

  async createCommunityPost(post: Omit<CommunityPost, 'id'>): Promise<CommunityPost> {
    await delay(DELAY_MS.WRITE);
    const newPost: CommunityPost = { ...post, id: `post-${Date.now()}` };
    this.communityPosts.unshift(newPost);
    this.saveToStorage();
    return newPost;
  }

  // AI Features
  async getAIChatResponse(prompt: string, history: Message[]): Promise<string> {
    await delay(DELAY_MS.AI);
    console.log('AI Chat Request:', { prompt, history });
    const responses = [
      "That's a very insightful question. Let's explore that a bit more.",
      "Thank you for sharing. It takes courage to open up about these things.",
      "Based on what you've told me, have you considered trying a mindfulness exercise?",
      "It sounds like you're making some real progress. How does that feel?",
      "I understand. Remember that healing is a journey, not a destination. Be kind to yourself.",
      "Could you tell me more about why you feel that way?",
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    // Additional delay for realistic AI response time
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response;
  }

  async getAIRecommendations(): Promise<TherapyRecommendation[]> {
    await delay(DELAY_MS.AI);
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_AI_RECOMMENDATIONS;
  }

  async getAIReportSummary(reportId: string): Promise<string> {
    await delay(DELAY_MS.AI);
    const report = this.reports.find(r => r.id === reportId);
    if (!report) {
      return "Could not find the specified report to summarize.";
    }
    const summary = `This report for ${report.patientName} on ${report.date} shows a positive trend in mood and anxiety levels. Key insights include consistent engagement with mindfulness exercises and improved sleep patterns. The patient noted feeling more 'in control' this week. Areas to focus on next include social interactions and applying coping strategies in real-world scenarios.`;
    await new Promise(resolve => setTimeout(resolve, 700));
    return summary;
  }
}

export default MockDataService;
