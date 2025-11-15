'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/lib/supabase-auth';
import { allUsers as mockUsers } from '@/lib/data';
import type { User } from '@/lib/types';

interface UserContextType {
  currentUser: User | null;
  allUsers: User[];
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: isLoading } = useAuth();

  const allUsers = mockUsers;

  const currentUser: User | null = user
    ? {
        id: user.id,
        name: user.user_metadata?.displayName || user.email || 'User',
        email: user.email || '',
      } as any
    : null;

  const value = {
    currentUser,
    allUsers,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
