'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { AppError, errorHandler, ErrorContext, withRetry, RetryConfig } from '@/lib/platform/utils/error-handling';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
  retryCount: number;
}

export interface UseAsyncOperationOptions {
  retryConfig?: Partial<RetryConfig>;
  errorContext?: ErrorContext;
  onSuccess?: (data: any) => void;
  onError?: (error: AppError) => void;
  onRetry?: (attempt: number) => void;
  initialData?: any;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
}

export function useAsyncOperation<T>(
  operation: () => Promise<T>,
  options: UseAsyncOperationOptions = {}
) {
  const {
    retryConfig,
    errorContext,
    onSuccess,
    onError,
    onRetry,
    initialData = null,
    enabled = true,
    refetchOnWindowFocus = false,
    staleTime = 0,
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
    retryCount: 0,
  });

  const mountedRef = useRef(true);
  const lastFetchTimeRef = useRef<number>(0);
  const operationRef = useRef(operation);

  // Update operation ref when operation changes
  useEffect(() => {
    operationRef.current = operation;
  }, [operation]);

  const execute = useCallback(async () => {
    // Check stale time
    const now = Date.now();
    if (staleTime > 0 && now - lastFetchTimeRef.current < staleTime) {
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await withRetry(
        () => operationRef.current(),
        retryConfig,
        {
          ...errorContext,
          operation: errorContext?.operation || 'useAsyncOperation',
        }
      );

      if (!mountedRef.current) return;

      setState(prev => ({
        ...prev,
        data: result,
        loading: false,
        error: null,
        retryCount: 0,
      }));

      lastFetchTimeRef.current = now;
      onSuccess?.(result);
    } catch (error: any) {
      if (!mountedRef.current) return;

      const appError = errorHandler.handleError(error, {
        ...errorContext,
        operation: errorContext?.operation || 'useAsyncOperation',
      });

      setState(prev => ({
        ...prev,
        loading: false,
        error: appError,
        retryCount: prev.retryCount + 1,
      }));

      onError?.(appError);
    }
  }, [retryConfig, errorContext, onSuccess, onError, staleTime]);

  const retry = useCallback(async () => {
    onRetry?.(state.retryCount + 1);
    await execute();
  }, [execute, onRetry, state.retryCount]);

  const refetch = useCallback(async () => {
    lastFetchTimeRef.current = 0;
    await execute();
  }, [execute]);

  // Handle window focus refetch
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        refetch();
      }
    };

    document.addEventListener('visibilitychange', handleFocus);
    return () => document.removeEventListener('visibilitychange', handleFocus);
  }, [refetch, refetchOnWindowFocus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Auto-execute on mount if enabled
  useEffect(() => {
    if (enabled) {
      execute();
    }
  }, [enabled]); // Only depend on enabled, not execute

  return {
    ...state,
    execute,
    retry,
    refetch,
    setData: (data: T | null) => setState(prev => ({ ...prev, data })),
    setLoading: (loading: boolean) => setState(prev => ({ ...prev, loading })),
    setError: (error: AppError | null) => setState(prev => ({ ...prev, error })),
  };
}

// Hook for managing multiple async operations
export function useAsyncOperations<T extends Record<string, any>>(
  operations: T,
  options: UseAsyncOperationOptions = {}
) {
  const {
    enabled = true,
    ...restOptions
  } = options;

  const [states, setStates] = useState<Record<string, AsyncState<any>>>({});
  const [overallLoading, setOverallLoading] = useState(false);
  const [overallError, setOverallError] = useState<AppError | null>(null);

  // Initialize states for all operations
  useEffect(() => {
    const initialStates: Record<string, AsyncState<any>> = {};
    Object.keys(operations).forEach(key => {
      initialStates[key] = {
        data: null,
        loading: false,
        error: null,
        retryCount: 0,
      };
    });
    setStates(initialStates);
  }, [Object.keys(operations).join(',')]);

  const executeAll = useCallback(async () => {
    setOverallLoading(true);
    setOverallError(null);

    const results: Record<string, any> = {};
    const newStates: Record<string, AsyncState<any>> = {};

    try {
      await Promise.allSettled(
        Object.entries(operations).map(async ([key, operation]) => {
          try {
            const result = await withRetry(
              operation,
              restOptions.retryConfig,
              {
                ...restOptions.errorContext,
                operation: `${restOptions.errorContext?.operation || 'useAsyncOperations'}.${key}`,
              }
            );

            results[key] = result;
            newStates[key] = {
              data: result,
              loading: false,
              error: null,
              retryCount: 0,
            };
          } catch (error: any) {
            const appError = errorHandler.handleError(error, {
              ...restOptions.errorContext,
              operation: `${restOptions.errorContext?.operation || 'useAsyncOperations'}.${key}`,
            });

            newStates[key] = {
              data: null,
              loading: false,
              error: appError,
              retryCount: 0,
            };
          }
        })
      );

      setStates(newStates);
      
      // Check if any operations failed
      const hasErrors = Object.values(newStates).some(state => state.error !== null);
      if (hasErrors) {
        setOverallError(new AppError('One or more operations failed', 'MULTIPLE_ERRORS'));
      }

      restOptions.onSuccess?.(results);
      return results;
    } catch (error: any) {
      const appError = errorHandler.handleError(error, restOptions.errorContext);
      setOverallError(appError);
      restOptions.onError?.(appError);
      throw appError;
    } finally {
      setOverallLoading(false);
    }
  }, [operations, restOptions]);

  // Note: Auto-execution disabled for now to avoid complexity
  // useEffect(() => {
  //   if (enabled) {
  //     executeAll();
  //   }
  // }, [enabled]);

  return {
    states,
    overallLoading,
    overallError,
    executeAll,
    execute: (key: keyof T) => {
      const operation = operations[key];
      if (!operation) return Promise.resolve();

      return withRetry(
        operation,
        restOptions.retryConfig,
        {
          ...restOptions.errorContext,
          operation: `${restOptions.errorContext?.operation || 'useAsyncOperations'}.${String(key)}`,
        }
      );
    },
  };
}

// Hook for optimistic updates
export function useOptimisticOperation<T>(
  operation: () => Promise<T>,
  options: UseAsyncOperationOptions & {
    optimisticData: T;
    rollbackOnError?: boolean;
    initialData?: T;
  }
) {
  const {
    optimisticData,
    rollbackOnError = true,
    initialData,
    ...asyncOptions
  } = options;

  const [isOptimistic, setIsOptimistic] = useState(false);
  const [previousData, setPreviousData] = useState<T | null>(null);
  const [optimisticError, setOptimisticError] = useState<AppError | null>(null);

  const asyncOperation = useAsyncOperation(operation, {
    ...asyncOptions,
    initialData,
    onSuccess: (data) => {
      setIsOptimistic(false);
      setOptimisticError(null);
      asyncOptions.onSuccess?.(data);
    },
    onError: (error) => {
      setIsOptimistic(false);
      setOptimisticError(error);
      asyncOptions.onError?.(error);
    },
  });

  const executeOptimistic = useCallback(async () => {
    setPreviousData(asyncOperation.data);
    setIsOptimistic(true);
    setOptimisticError(null);
    
    try {
      await asyncOperation.execute();
    } catch (error) {
      if (rollbackOnError) {
        setIsOptimistic(false);
      }
      throw error;
    }
  }, [asyncOperation, rollbackOnError]);

  return {
    ...asyncOperation,
    data: isOptimistic ? optimisticData : (optimisticError && !rollbackOnError ? optimisticData : asyncOperation.data),
    isOptimistic,
    executeOptimistic,
    rollback: () => {
      if (previousData !== null) {
        asyncOperation.setData(previousData);
        setIsOptimistic(false);
        setOptimisticError(null);
      }
    },
  };
}
