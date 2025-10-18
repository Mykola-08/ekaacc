'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User as AppUser } from '@/lib/types';
import { allUsers, currentUser as initialUser } from '@/lib/data';

interface UserContextType {
  currentUser: AppUser | null;
  setCurrentUser: (user: AppUser) => void;
  allUsers: AppUser[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(initialUser);
  
  const value = {
      currentUser,
      setCurrentUser,
      allUsers,
  }

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
