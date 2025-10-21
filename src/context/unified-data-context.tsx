/**
 * Unified Data Context
 * 
 * This context automatically uses either mock data or Firebase
 * based on the USE_MOCK_DATA configuration in data-service.ts
 * 
 * Components should use this context instead of mock-data-context
 * or user-context directly.
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getDataService, IDataService, USE_MOCK_DATA } from '@/services/data-service';
import type { User, Session, Report, Service, JournalEntry, Exercise, CommunityPost } from '@/lib/types';

interface DataContextType {
  // User
  currentUser: User | null;
  allUsers: User[];
  isLoading: boolean;
  
  // Data
  sessions: Session[];
  reports: Report[];
  services: Service[];
  journalEntries: JournalEntry[];
  exercises: Exercise[];
  communityPosts: CommunityPost[];
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  refreshData: () => Promise<void>;
  
  // Metadata
  dataSource: 'mock' | 'firebase';
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function UnifiedDataProvider({ children }: { children: ReactNode }) {
  const [dataService, setDataService] = useState<IDataService | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState<Set<string>>(new Set());

  // Initialize data service
  useEffect(() => {
    const init = async () => {
      const service = await getDataService();
      setDataService(service);
    };
    init();
  }, []);

  // Load critical data first (user + all users), defer secondary data
  useEffect(() => {
    if (!dataService) return;

    const loadCriticalData = async () => {
      setIsLoading(true);
      try {
        // Load only critical data first: currentUser and allUsers
        const [user, users] = await Promise.all([
          dataService.getCurrentUser(),
          dataService.getAllUsers(),
        ]);

        setCurrentUser(user);
        setAllUsers(users);
        setDataLoaded(prev => new Set([...prev, 'user', 'allUsers']));
      } catch (error) {
        console.error('Error loading critical data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCriticalData();

    // Defer secondary data loading to next tick (non-blocking)
    const timer = setTimeout(() => {
      loadSecondaryData();
    }, 100);

    return () => clearTimeout(timer);

    async function loadSecondaryData() {
      if (!dataService) return; // Guard against null dataService
      try {
        // Load remaining data in background without blocking UI
        const [sess, reps, serv, journal, exer, community] = await Promise.all([
          dataService.getSessions().catch(() => []),
          dataService.getReports().catch(() => []),
          dataService.getServices().catch(() => []),
          dataService.getJournalEntries().catch(() => []),
          dataService.getExercises().catch(() => []),
          dataService.getCommunityPosts().catch(() => []),
        ]);

        setSessions(sess);
        setReports(reps);
        setServices(serv);
        setJournalEntries(journal);
        setExercises(exer);
        setCommunityPosts(community);
        setDataLoaded(prev => new Set([...prev, 'sessions', 'reports', 'services', 'journal', 'exercises', 'community']));
      } catch (error) {
        console.error('Error loading secondary data:', error);
      }
    }
  }, [dataService]);

  const login = async (email: string, password: string) => {
    if (!dataService) throw new Error('Data service not initialized');
    setIsLoading(true);
    try {
      const user = await dataService.login(email, password);
      setCurrentUser(user);
      // Reload data after login
      await refreshData();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!dataService) throw new Error('Data service not initialized');
    setIsLoading(true);
    try {
      await dataService.logout();
      setCurrentUser(null);
      setSessions([]);
      setReports([]);
      setJournalEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!dataService || !currentUser) throw new Error('No current user');
    await dataService.updateUser(currentUser.id, updates);
    setCurrentUser({ ...currentUser, ...updates });
  };

  const refreshData = async () => {
    if (!dataService) return;
    
    const [user, users, sess, reps, serv, journal, exer, community] = await Promise.all([
      dataService.getCurrentUser(),
      dataService.getAllUsers(),
      dataService.getSessions(),
      dataService.getReports(),
      dataService.getServices(),
      dataService.getJournalEntries(),
      dataService.getExercises(),
      dataService.getCommunityPosts(),
    ]);

    setCurrentUser(user);
    setAllUsers(users);
    setSessions(sess);
    setReports(reps);
    setServices(serv);
    setJournalEntries(journal);
    setExercises(exer);
    setCommunityPosts(community);
  };

  const value: DataContextType = {
    currentUser,
    allUsers,
    isLoading,
    sessions,
    reports,
    services,
    journalEntries,
    exercises,
    communityPosts,
    login,
    logout,
    updateUser,
    refreshData,
    dataSource: USE_MOCK_DATA ? 'mock' : 'firebase',
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a UnifiedDataProvider');
  }
  return context;
}

// Alias for backward compatibility
export const useMockData = useData;
