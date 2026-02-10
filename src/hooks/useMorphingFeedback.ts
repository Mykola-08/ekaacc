'use client';

import { useState, useCallback, useRef } from 'react';
import type { FeedbackStatus } from '@/components/ui/inline-feedback';

interface FeedbackState {
  status: FeedbackStatus;
  message: string;
}

interface UseMorphingFeedbackOptions {
  /** Auto-reset to idle after success (ms). 0 = no auto-reset */
  successDuration?: number;
  /** Auto-reset to idle after error (ms). 0 = no auto-reset */
  errorDuration?: number;
}

/**
 * Hook to manage morphing feedback state.
 * Replaces `useToast()` patterns with inline, morphing state feedback.
 *
 * Usage:
 * ```tsx
 * const { feedback, setSuccess, setError, setLoading, reset } = useMorphingFeedback();
 *
 * async function handleSave() {
 *   setLoading('Saving...');
 *   const result = await saveProfile(data);
 *   if (result.success) setSuccess('Profile saved');
 *   else setError(result.error);
 * }
 *
 * return (
 *   <>
 *     <MorphingActionButton status={feedback.status} ... />
 *     <InlineFeedback status={feedback.status} message={feedback.message} onDismiss={reset} />
 *   </>
 * );
 * ```
 */
export function useMorphingFeedback(options: UseMorphingFeedbackOptions = {}) {
  const { successDuration = 3000, errorDuration = 5000 } = options;
  const [feedback, setFeedback] = useState<FeedbackState>({ status: 'idle', message: '' });
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setFeedback({ status: 'idle', message: '' });
  }, [clearTimer]);

  const setLoading = useCallback((message: string = 'Processing...') => {
    clearTimer();
    setFeedback({ status: 'loading', message });
  }, [clearTimer]);

  const setSuccess = useCallback((message: string = 'Done') => {
    clearTimer();
    setFeedback({ status: 'success', message });
    if (successDuration > 0) {
      timerRef.current = setTimeout(() => {
        setFeedback({ status: 'idle', message: '' });
      }, successDuration);
    }
  }, [clearTimer, successDuration]);

  const setError = useCallback((message: string = 'Something went wrong') => {
    clearTimer();
    setFeedback({ status: 'error', message });
    if (errorDuration > 0) {
      timerRef.current = setTimeout(() => {
        setFeedback({ status: 'idle', message: '' });
      }, errorDuration);
    }
  }, [clearTimer, errorDuration]);

  const setWarning = useCallback((message: string = 'Warning') => {
    clearTimer();
    setFeedback({ status: 'warning', message });
  }, [clearTimer]);

  const setInfo = useCallback((message: string = 'Info') => {
    clearTimer();
    setFeedback({ status: 'info', message });
  }, [clearTimer]);

  return {
    feedback,
    status: feedback.status,
    message: feedback.message,
    isLoading: feedback.status === 'loading',
    isSuccess: feedback.status === 'success',
    isError: feedback.status === 'error',
    setLoading,
    setSuccess,
    setError,
    setWarning,
    setInfo,
    reset,
  };
}
