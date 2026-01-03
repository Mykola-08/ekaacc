'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UsePredictivePrefetchOptions {
  enabled?: boolean;
  threshold?: number; // Distance in pixels to trigger prefetch
}

export function usePredictivePrefetch(href: string, options: UsePredictivePrefetchOptions = {}) {
  const { enabled = true, threshold = 100 } = options;
  const router = useRouter();
  const elementRef = useRef<HTMLElement>(null);
  const [prefetched, setPrefetched] = useState(false);

  useEffect(() => {
    if (!enabled || prefetched || !elementRef.current) return;

    const element = elementRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      if (prefetched) return;

      const rect = element.getBoundingClientRect();
      const elementX = rect.left + rect.width / 2;
      const elementY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(e.clientX - elementX, 2) + Math.pow(e.clientY - elementY, 2)
      );

      if (distance < threshold) {
        router.prefetch(href);
        setPrefetched(true);
        document.removeEventListener('mousemove', handleMouseMove);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enabled, href, prefetched, router, threshold]);

  return { elementRef };
}
