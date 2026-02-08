/**
 * Optimized Data Loading Hook
 * 
 * Uses React Query-like patterns for data fetching with caching
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseOptimizedDataOptions<T> {
  cacheKey: string;
  fetcher: () => Promise<T>;
  staleTime?: number;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseOptimizedDataReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Global cache
const dataCache = new Map<string, { data: any; timestamp: number }>();
const DEFAULT_STALE_TIME = 300000; // 5 minutes

export function useOptimizedData<T>({
  cacheKey,
  fetcher,
  staleTime = DEFAULT_STALE_TIME,
  enabled = true,
  onSuccess,
  onError,
}: UseOptimizedDataOptions<T>): UseOptimizedDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache first
    const cached = dataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < staleTime) {
      setData(cached.data);
      if (onSuccess) onSuccess(cached.data);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      
      if (isMountedRef.current) {
        setData(result);
        dataCache.set(cacheKey, { data: result, timestamp: Date.now() });
        if (onSuccess) onSuccess(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        if (onError) onError(error);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [cacheKey, fetcher, enabled, staleTime, onSuccess, onError]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}

/**
 * Clear data cache
 */
export function clearDataCache(keyPattern?: string) {
  if (keyPattern) {
    const keysToDelete: string[] = [];
    dataCache.forEach((_, key) => {
      if (key.includes(keyPattern)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => dataCache.delete(key));
  } else {
    dataCache.clear();
  }
}

/**
 * Prefetch data
 */
export async function prefetchData<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  staleTime: number = DEFAULT_STALE_TIME
): Promise<void> {
  const cached = dataCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < staleTime) {
    return; // Already cached and fresh
  }

  try {
    const data = await fetcher();
    dataCache.set(cacheKey, { data, timestamp: Date.now() });
  } catch (error) {
    console.error('Prefetch failed:', error);
  }
}

