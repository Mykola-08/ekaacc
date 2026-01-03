'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'guest' | 'user' | 'staff' | 'admin' | 'developer';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('guest');

  useEffect(() => {
    const storedRole = localStorage.getItem('eka-docs-role') as UserRole;
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('eka-docs-role', newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole: handleSetRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
