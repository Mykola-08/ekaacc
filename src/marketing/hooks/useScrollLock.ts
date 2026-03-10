import { useEffect, useRef } from 'react';

/**
 * Locks body scroll when a modal/popup is open.
 * Uses position:fixed trick to reliably prevent background scrolling on all platforms (including iOS).
 * Compensates for scrollbar width to prevent layout shift in the header and page content.
 */
export function useScrollLock(isLocked: boolean) {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (isLocked) {
      // Save current scroll position
      scrollYRef.current = window.scrollY;

      // Calculate scrollbar width before hiding it
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Lock body in place
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';

      // Compensate for scrollbar removal to prevent layout shift
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      // Restore body
      const savedY = scrollYRef.current;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';

      // Restore scroll position
      window.scrollTo(0, savedY);
    }

    return () => {
      // Cleanup on unmount
      const savedY = scrollYRef.current;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      window.scrollTo(0, savedY);
    };
  }, [isLocked]);
}
