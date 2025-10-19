'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useUser, useFirestore, useDoc, doc, useMemoFirebase } from '@/firebase';
import { allUsers as mockUsers } from '@/lib/data';
import type { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface UserContextType {
  currentUser: User | null;
  allUsers: User[];
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const userRef = useMemoFirebase(() => authUser ? doc(firestore, 'users', authUser.uid) : null, [authUser, firestore]);
  const { data: userData, isLoading: isUserDocLoading } = useDoc<User>(userRef);

  const isLoading = isAuthLoading || (authUser && isUserDocLoading);

  // While loading, or if no user is authenticated, we can provide a null currentUser.
  // The UI components should handle the loading state.
  const currentUser = userData ? { 
    ...userData,
    id: authUser?.uid || '', // ensure id from auth is used
    name: userData.name || authUser?.displayName || 'Anonymous User',
    email: userData.email || authUser?.email || '',
    avatarUrl: userData.avatarUrl || authUser?.photoURL || `https://i.pravatar.cc/150?u=${authUser?.uid}`,
    initials: (userData.name || authUser?.displayName || 'A').split(' ').map(n => n[0]).join(''),
  } : null;

  // For now, `allUsers` can remain mock data, or you could fetch it from a `/users` collection
  const allUsers = mockUsers; 
  
  const value = {
      currentUser,
      allUsers,
      isLoading
  };

  if (isLoading) {
    // You could return a full-page loader here if desired
    // For now, we let the consuming components handle their own skeleton states
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
