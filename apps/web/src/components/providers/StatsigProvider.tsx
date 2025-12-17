"use client";
import React, { useEffect, useState, createContext, useContext } from 'react';
import { StatsigClient } from '@statsig/js-client';

interface StatsigContextValue {
  flags: Record<string, boolean>;
  ready: boolean;
  check: (key: string) => boolean;
}

const StatsigContext = createContext<StatsigContextValue | undefined>(undefined);

interface StatsigProviderProps {
  userID?: string;
  initialFlags?: Record<string, boolean>;
  children: React.ReactNode;
}

export function StatsigProvider({ userID = 'anonymous', initialFlags = {}, children }: StatsigProviderProps) {
  const [flags, setFlags] = useState<Record<string, boolean>>(initialFlags);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const clientKey = process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY;
    if (!clientKey) {
      // Client key absent; rely solely on initialFlags.
      setReady(true);
      return;
    }
    let cancelled = false;
    let client: StatsigClient | null = null;
    (async () => {
      try {
        client = new StatsigClient(clientKey, { userID });
        await client.initializeAsync();
        if (cancelled) return;
        // Hydrate known gates from initial list if present
        const merged = { ...initialFlags };
        Object.keys(merged).forEach(k => {
          merged[k] = client!.checkGate(k);
        });
        setFlags(merged);
      } catch {
        // ignore errors; keep fallbacks
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => { 
      cancelled = true; 
      if (client) {
        client.shutdown();
      }
    };
  }, [userID, initialFlags]);

  const value: StatsigContextValue = {
    flags,
    ready,
    check: (key: string) => flags[key] === true,
  };

  return <StatsigContext.Provider value={value}>{children}</StatsigContext.Provider>;
}

export function useStatsig() {
  const ctx = useContext(StatsigContext);
  if (!ctx) throw new Error('useStatsig must be used within StatsigProvider');
  return ctx;
}