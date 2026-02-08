'use client';

import { useOptimistic, useState, useTransition } from 'react';

/**
 * A hook to handle optimistic UI updates for async actions.
 * 
 * @param initialState The initial state of the data
 * @param reducer A function that takes the current state and an optimistic value, and returns the new optimistic state
 */
export function useOptimisticAction<T, U>(
  initialState: T,
  reducer: (state: T, optimisticValue: U) => T
) {
  const [optimisticState, addOptimistic] = useOptimistic(initialState, reducer);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<Error | null>(null);

  const runAction = async (action: (payload: U) => Promise<T>, payload: U) => {
    setError(null);
    startTransition(async () => {
      addOptimistic(payload);
      try {
        await action(payload);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
      }
    });
  };

  return {
    state: optimisticState,
    isPending,
    error,
    runAction,
  };
}

