'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/lib/supabase-auth';
import { useMediaQuery } from '@/hooks/use-media-query';

type LayoutMode = 'responsive' | 'desktop' | 'mobile';

interface LayoutContextType {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  activeLayout: 'mobile' | 'desktop'; // The actual layout being rendered
  toggleFullVersion: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isMobileDevice = useMediaQuery('(max-width: 768px)');
  const isTabletDevice = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktopDevice = useMediaQuery('(min-width: 1025px)');

  const [layoutMode, setLayoutModeState] = useState<LayoutMode>('responsive');

  // Load preference from user profile or local storage
  useEffect(() => {
    if (user?.settings?.appPreferences?.layoutMode) {
      setLayoutModeState(user.settings.appPreferences.layoutMode as LayoutMode);
    } else {
      const stored = localStorage.getItem('eka-layout-preference');
      if (stored) {
        setLayoutModeState(stored as LayoutMode);
      }
    }
  }, [user]);

  const setLayoutMode = (mode: LayoutMode) => {
    setLayoutModeState(mode);
    localStorage.setItem('eka-layout-preference', mode);
    // Here you would also sync with the backend if the user is logged in
    // updateUserService(user.id, { settings: { appPreferences: { layoutMode: mode } } });
  };

  const activeLayout = React.useMemo(() => {
    if (layoutMode === 'desktop') return 'desktop';
    if (layoutMode === 'mobile') return 'mobile';
    
    // Responsive mode
    if (isMobileDevice) return 'mobile';
    return 'desktop';
  }, [layoutMode, isMobileDevice]);

  const toggleFullVersion = () => {
    if (activeLayout === 'mobile') {
      setLayoutMode('desktop');
    } else {
      setLayoutMode('responsive'); // Reset to responsive (which will be mobile on phone)
    }
  };

  return (
    <LayoutContext.Provider
      value={{
        layoutMode,
        setLayoutMode,
        isMobile: isMobileDevice,
        isTablet: isTabletDevice,
        isDesktop: isDesktopDevice,
        activeLayout,
        toggleFullVersion,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
