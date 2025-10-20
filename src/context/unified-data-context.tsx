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

  // Initialize data service
  useEffect(() => {
    const init = async () => {
      const service = await getDataService();
      setDataService(service);
    };
    init();
  }, []);

  // Load initial data
  useEffect(() => {
    if (!dataService) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
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
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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
