'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'eka-right-panel-open';

interface RightPanelContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const RightPanelContext = createContext<RightPanelContextValue | null>(null);

export function RightPanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') setIsOpen(true);
    } catch {
      // SSR or storage unavailable
    }
  }, []);

  const persist = useCallback((value: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // Storage unavailable
    }
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    persist(true);
  }, [persist]);

  const close = useCallback(() => {
    setIsOpen(false);
    persist(false);
  }, [persist]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      persist(next);
      return next;
    });
  }, [persist]);

  // Keyboard shortcut: Ctrl+.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '.' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  return (
    <RightPanelContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </RightPanelContext.Provider>
  );
}

export function useRightPanel() {
  const ctx = useContext(RightPanelContext);
  if (!ctx) throw new Error('useRightPanel must be used within a RightPanelProvider.');
  return ctx;
}
