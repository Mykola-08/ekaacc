'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface SessionUser {
  sub: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

interface AuthSessionContextValue {
  user: SessionUser | null;
  loading: boolean;
  accessToken: string | null;
}

const AuthSessionContext = createContext<AuthSessionContextValue>({
  user: null,
  loading: true,
  accessToken: null,
});

export const AuthSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (active) setUser(data.user || null);
        }
      } catch {}
      try {
        const at = await fetch('/api/auth/access-token');
        if (at.ok) {
          const d = await at.json();
          if (active) setAccessToken(d.accessToken || null);
        }
      } catch {}
      if (active) setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthSessionContext.Provider value={{ user, loading, accessToken }}>
      {children}
    </AuthSessionContext.Provider>
  );
};

export function useAuthSession() {
  return useContext(AuthSessionContext);
}
