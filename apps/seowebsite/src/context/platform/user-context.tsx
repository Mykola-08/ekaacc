'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/lib/platform/supabase-auth';
import { getDataService } from '@/services/data-service';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/platform/types';

interface UserContextType {
  currentUser: User | null;
  user?: User | null; // Alias for currentUser
  allUsers: User[];
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const dataService = await getDataService();
        const users = await dataService.getAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error('Failed to load users:', error);
        setAllUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const currentUser: User | null = user
    ? {
        id: user.id,
        name: user.displayName || user.email || 'User',
        email: user.email || '',
      } as any
    : null;

  const value = {
    currentUser,
    user: currentUser, // Alias for currentUser
    allUsers,
    isLoading: authLoading || isLoading,
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

// Alias for backwards compatibility
export const useUser = useUserContext;
