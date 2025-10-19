'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
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

  const isLoading = isAuthLoading || (!!authUser && isUserDocLoading);

  // While loading, or if no user is authenticated, we can provide a null currentUser.
  // The UI components should handle the loading state.
  const currentUser = useMemo(() => {
    if (!authUser) return null;
    // Base user from auth
    const baseUser = {
        id: authUser.uid,
        name: authUser.displayName || 'Anonymous User',
        email: authUser.email || '',
        avatarUrl: authUser.photoURL || `https://i.pravatar.cc/150?u=${authUser.uid}`,
        initials: (authUser.displayName || 'A').split(' ').map(n => n[0]).join(''),
        // Set default role if not in Firestore
        role: 'User' as const, 
    };

    // If we have Firestore data, merge it in
    if (userData) {
        return {
            ...baseUser,
            ...userData,
            // Ensure auth data isn't overwritten by potentially null Firestore data
            id: authUser.uid, 
            name: userData.name || baseUser.name,
            email: userData.email || baseUser.email,
        };
    }
    
    return baseUser;
  }, [authUser, userData]);

  // For now, `allUsers` can remain mock data, or you could fetch it from a `/users` collection
  const allUsers = mockUsers; 
  
  const value = {
      currentUser: currentUser as User | null,
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
