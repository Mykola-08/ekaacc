'use client';

import { useEffect, useRef } from 'react'

/**
 * A custom hook that listens for window.focus and visibilitychange events.
 * Triggered when a user tabs away and comes back (e.g., from reading an email to the dashboard).
 * Used to automatically re-fetch the latest data without needing to click anything.
 */
export function useRefreshOnFocus(refetch: () => void) {
  const firstTimeRef = useRef(true)

  useEffect(() => {
    if (firstTimeRef.current) {
      firstTimeRef.current = false
      return
    }

    function onFocus() {
      refetch()
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        refetch()
      }
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [refetch])
}
