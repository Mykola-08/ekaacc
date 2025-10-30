'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { getDataService, USE_MOCK_DATA } from '@/services/data-service';
import { User as AppUser } from '@/lib/types';

type AuthContextShape = {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshAppUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAppUser = async () => {
    const dataService = await getDataService();
    const currentAppUser = await dataService.getCurrentUser();
    setAppUser(currentAppUser);
  };

  useEffect(() => {
    // Mock mode: Auto-login with mock user
    if (USE_MOCK_DATA) {
      const initMockAuth = async () => {
        try {
          const dataService = await getDataService();
          const mockUser = await dataService.getCurrentUser();
          setAppUser(mockUser);
          // Create a minimal mock Firebase User object
          setUser({
            uid: mockUser?.id || 'mock-user',
            email: mockUser?.email || 'demo@eka.com',
            displayName: mockUser?.name || 'Demo User',
          } as User);
        } catch (error) {
          console.error('Mock auth init error:', error);
        } finally {
          setLoading(false);
        }
      };
      initMockAuth();
      return;
    }

    // Firebase mode: Use real auth
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await refreshAppUser();
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (email: string, password: string) => {
    if (USE_MOCK_DATA) {
      // Mock sign in
      const dataService = await getDataService();
      const result = await dataService.login(email, password);
      setAppUser(result);
      setUser({
        uid: result.id,
        email: result.email,
        displayName: result.name,
      } as User);
      return result;
    }
    // Firebase sign in
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    if (USE_MOCK_DATA) {
      // Mock sign out
      const dataService = await getDataService();
      await dataService.logout();
      setUser(null);
      setAppUser(null);
      return;
    }
    // Firebase sign out
    return firebaseSignOut(auth);
  };

  const value = { user, appUser, loading, signIn, signOut, refreshAppUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

