'use client';

import { useAuth } from '@/lib/supabase-auth';

export function useUser() {
  const { user } = useAuth();
  return { user } as { user: { id?: string; uid?: string; displayName?: string } | null };
}

export function useCollection<T>(_collectionName: string, _query?: any[]) {
  return { data: [] as T[], loading: false };
}