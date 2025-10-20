'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  mockCurrentUser, 
  mockSessions, 
  mockReports, 
  mockTherapies,
  mockJournalEntries,
  mockExercises,
  mockCommunityPosts,
  mockAIInsights,
  mockAuth
} from '@/lib/mock-data';
import type { User } from '@/lib/types';

interface MockDataContextType {
  currentUser: User | null;
  isLoading: boolean;
  sessions: typeof mockSessions;
  reports: typeof mockReports;
  therapies: typeof mockTherapies;
  journalEntries: typeof mockJournalEntries;
  exercises: typeof mockExercises;
  communityPosts: typeof mockCommunityPosts;
  aiInsights: typeof mockAIInsights;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user is already logged in (from localStorage)
      const savedUser = localStorage.getItem('mockUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      } else {
        // Auto-login for demo
        setCurrentUser(mockCurrentUser);
        localStorage.setItem('mockUser', JSON.stringify(mockCurrentUser));
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const user = await mockAuth.login(email, password);
    setCurrentUser(user);
    localStorage.setItem('mockUser', JSON.stringify(user));
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await mockAuth.logout();
    setCurrentUser(null);
    localStorage.removeItem('mockUser');
    setIsLoading(false);
  };

  const updateUser = (updates: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
    }
  };

  const value: MockDataContextType = {
    currentUser,
    isLoading,
    sessions: mockSessions,
    reports: mockReports,
    therapies: mockTherapies,
    journalEntries: mockJournalEntries,
    exercises: mockExercises,
    communityPosts: mockCommunityPosts,
    aiInsights: mockAIInsights,
    login,
    logout,
    updateUser,
  };

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
}
