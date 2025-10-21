"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/lib/types';
import fxAuth from '@/lib/fx-auth';

type AuthContextShape = {
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;
  switchRole: (role: 'Patient' | 'Therapist' | 'Admin') => void;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // initialize from unified auth wrapper
    setCurrentUser((fxAuth.currentUser as any) || null);
    const unsub = fxAuth.onAuthStateChanged((u:any) => {
      setCurrentUser(u as User | null);
    });
    return () => { if (unsub) unsub(); };
  }, []);

  const switchRole = (role: 'Patient' | 'Therapist' | 'Admin') => {
    // optimistic role switch in client for demo/testing
    const existing = (fxAuth.currentUser as any) || currentUser || null;
    if (!existing) return;
    const updated = { ...existing, role } as User;
    setCurrentUser(updated);
    // if in mock mode, attempt to persist to mockAuth via fxAuth interface
    try {
      if ((fxAuth as any).currentUser) {
        // mock wrapper keeps currentUser in memory; update if writable
        (fxAuth as any).currentUser = updated as any;
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
