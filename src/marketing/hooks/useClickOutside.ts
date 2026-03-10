import { useEffect, useRef } from 'react';

/**
 * Custom hook to handle clicks outside of a component
 * @param callback Function to call when clicking outside
 * @returns Ref to attach to the component
 */
export function useClickOutside<T extends HTMLElement>(callback: () => void) {
  const ref = useRef<T>(null);
  const callbackRef = useRef(callback);

  // Keep callback ref up to date without re-subscribing the listener
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callbackRef.current();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return ref;
}
