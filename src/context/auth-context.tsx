'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { getDataService } from '@/services/data-service';
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

  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = () => {
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

