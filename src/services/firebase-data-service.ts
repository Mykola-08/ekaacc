/**
 * Firebase Data Service Implementation
 * 
 * Provides real-time data access to Firebase Firestore.
 * Handles authentication, data fetching, and updates.
 */

import type { User, Session, Report, Service, JournalEntry, Exercise, CommunityPost } from '@/lib/types';
import { IDataService } from './data-service';
import { initializeFirebase } from '@/firebase/index';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

export class FirebaseDataService implements IDataService {
  private static instance: FirebaseDataService;
  private firebaseApp: any;
  private firestore: any;
  private auth: any;
  private isInitialized = false;

  private constructor() {
    this.initialize();
  }

  static getInstance(): FirebaseDataService {
    if (!FirebaseDataService.instance) {
      FirebaseDataService.instance = new FirebaseDataService();
    }
    return FirebaseDataService.instance;
  }

  private initialize() {
    if (this.isInitialized) return;

    const { firebaseApp, firestore, auth } = initializeFirebase();
    this.firebaseApp = firebaseApp;
    this.firestore = firestore;
    this.auth = auth;
    this.isInitialized = true;
  }

  async isReady(): Promise<boolean> {
    return this.isInitialized;
  }

  // User Management
  async getCurrentUser(): Promise<User | null> {
    const authUser = this.auth.currentUser;
    if (!authUser) return null;

    const userDoc = await getDoc(doc(this.firestore, 'users', authUser.uid));
    if (!userDoc.exists()) return null;

    const userData = userDoc.data();
    return {
      id: authUser.uid,
      uid: authUser.uid,
      name: userData.name || authUser.displayName || 'Anonymous User',
      displayName: userData.displayName || authUser.displayName,
      email: userData.email || authUser.email || '',
      phoneNumber: userData.phoneNumber || authUser.phoneNumber,
      avatarUrl: userData.avatarUrl || authUser.photoURL || `https://i.pravatar.cc/150?u=${authUser.uid}`,
      role: userData.role || 'Patient',
      initials: userData.initials || (authUser.displayName || 'A').split(' ').map((n: string) => n[0]).join(''),
      createdAt: userData.createdAt,
      goal: userData.goal,
      personalizationCompleted: userData.personalizationCompleted,
      personalization: userData.personalization,
      squareCustomerId: userData.squareCustomerId,
      dashboardWidgets: userData.dashboardWidgets,
      isDonationSeeker: userData.isDonationSeeker,
    } as User;
  }

  async getAllUsers(): Promise<User[]> {
    const usersSnapshot = await getDocs(collection(this.firestore, 'users'));
    return usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: doc.id,
        ...data,
      } as User;
    });
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const userRef = doc(this.firestore, 'users', userId);
    await updateDoc(userRef, updates as any);
  }

  // Auth
  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};

    return {
      id: user.uid,
      uid: user.uid,
      name: userData.name || user.displayName || 'Anonymous User',
      displayName: userData.displayName || user.displayName,
      email: userData.email || user.email || '',
      phoneNumber: userData.phoneNumber || user.phoneNumber,
      avatarUrl: userData.avatarUrl || user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
      role: userData.role || 'Patient',
      initials: userData.initials || (user.displayName || 'A').split(' ').map((n: string) => n[0]).join(''),
      createdAt: userData.createdAt,
      goal: userData.goal,
      personalizationCompleted: userData.personalizationCompleted,
      personalization: userData.personalization,
      squareCustomerId: userData.squareCustomerId,
      dashboardWidgets: userData.dashboardWidgets,
      isDonationSeeker: userData.isDonationSeeker,
    } as User;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  // Sessions
  async getSessions(userId?: string): Promise<Session[]> {
    let q;
    if (userId) {
      q = query(collection(this.firestore, 'sessions'), where('userId', '==', userId));
    } else {
      q = collection(this.firestore, 'sessions');
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Session));
  }

  async createSession(session: Omit<Session, 'id'>): Promise<Session> {
    const docRef = await addDoc(collection(this.firestore, 'sessions'), session);
    return {
      id: docRef.id,
      ...session,
    } as Session;
  }

  async updateSession(sessionId: string, updates: Partial<Session>): Promise<void> {
    const sessionRef = doc(this.firestore, 'sessions', sessionId);
    await updateDoc(sessionRef, updates as any);
  }

  async cancelSession(sessionId: string): Promise<void> {
    await this.updateSession(sessionId, { status: 'Canceled' });
  }

  // Reports
  async getReports(userId?: string): Promise<Report[]> {
    if (!userId) {
      const snapshot = await getDocs(collection(this.firestore, 'reports'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Report));
    }

    // Get reports from user's subcollection
    const reportsRef = collection(this.firestore, 'users', userId, 'reports');
    const snapshot = await getDocs(reportsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Report));
  }

  async createReport(report: Omit<Report, 'id'>): Promise<Report> {
    const docRef = await addDoc(collection(this.firestore, 'reports'), {
      ...report,
      createdAt: Timestamp.now(),
    });
    return {
      id: docRef.id,
      ...report,
    } as Report;
  }

  // Services/Therapies
  async getServices(): Promise<Service[]> {
    const snapshot = await getDocs(collection(this.firestore, 'services'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Service));
  }

  async createService(service: Omit<Service, 'id'>): Promise<Service> {
    const docRef = await addDoc(collection(this.firestore, 'services'), service);
    return {
      id: docRef.id,
      ...service,
    } as Service;
  }

  async updateService(serviceId: string, updates: Partial<Service>): Promise<void> {
    const serviceRef = doc(this.firestore, 'services', serviceId);
    await updateDoc(serviceRef, updates as any);
  }

  // Journal Entries
  async getJournalEntries(userId?: string): Promise<JournalEntry[]> {
    if (!userId) {
      const snapshot = await getDocs(collection(this.firestore, 'journal'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as JournalEntry));
    }

    const q = query(collection(this.firestore, 'journal'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as JournalEntry));
  }

  async createJournalEntry(entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry> {
    const docRef = await addDoc(collection(this.firestore, 'journal'), entry);
    return {
      id: docRef.id,
      ...entry,
    } as JournalEntry;
  }

  // Exercises
  async getExercises(): Promise<Exercise[]> {
    const snapshot = await getDocs(collection(this.firestore, 'exercises'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Exercise));
  }

  // Community
  async getCommunityPosts(): Promise<CommunityPost[]> {
    const snapshot = await getDocs(collection(this.firestore, 'community'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as CommunityPost));
  }

  async createCommunityPost(post: Omit<CommunityPost, 'id'>): Promise<CommunityPost> {
    const docRef = await addDoc(collection(this.firestore, 'communityPosts'), {
      ...post,
      createdAt: Timestamp.now(),
    });
    return { id: docRef.id, ...post } as CommunityPost;
  }

  // AI Features - Placeholder implementations
  async getAIChatResponse(prompt: string, history: any[]): Promise<string> {
    // In a real implementation, this would call a Cloud Function or a third-party AI service.
    console.warn('FirebaseDataService.getAIChatResponse is a placeholder.');
    const responses = [
      "This is a placeholder response from the Firebase service. In a real app, I would provide a thoughtful answer.",
      "To enable real AI responses, you would need to integrate with an AI backend like a Cloud Function calling the Gemini API.",
    ];
    return Promise.resolve(responses[Math.floor(Math.random() * responses.length)]);
  }

  async getAIRecommendations(): Promise<any[]> {
    console.warn('FirebaseDataService.getAIRecommendations is a placeholder.');
    // This would fetch recommendations, possibly pre-generated and stored in Firestore.
    return Promise.resolve([]);
  }

  async getAIReportSummary(reportId: string): Promise<string> {
    console.warn('FirebaseDataService.getAIReportSummary is a placeholder.');
    const report = await this.getReports().then(reports => reports.find(r => r.id === reportId));
    if (!report) {
      return Promise.resolve("Report not found.");
    }
    return Promise.resolve(`This is a placeholder summary for report ${reportId}. A real implementation would generate a dynamic summary.`);
  }
}

export default FirebaseDataService;
