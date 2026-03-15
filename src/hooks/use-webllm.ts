'use client';

/**
 * Hook to detect WebLLM browser extension availability
 */

import { useState, useEffect } from 'react';
import { isWebLLMAvailable } from '@/lib/platform/integrations/webllm';

export function useWebLLMAvailable() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    // Check immediately
    setAvailable(isWebLLMAvailable());

    // Re-check after a delay (extension may load after page)
    const timer = setTimeout(() => {
      setAvailable(isWebLLMAvailable());
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return available;
}
