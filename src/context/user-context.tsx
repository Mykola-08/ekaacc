'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useUser } from '@/hooks/use-firebase-hooks';
import { allUsers as mockUsers } from '@/lib/data';
import type { User } from '@/lib/types';

interface UserContextType {
  currentUser: User | null;
  allUsers: User[];
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user: currentUser, loading: isLoading } = useUser();

  const allUsers = mockUsers; 
  
  const value = {
      currentUser: currentUser as User | null,
      allUsers,
      isLoading
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
