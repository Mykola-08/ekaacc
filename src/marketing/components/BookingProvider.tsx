'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useAnalytics } from '@/marketing/hooks/useAnalytics';
import { BookingContext } from '@/marketing/contexts/bookingContext';
import SmartBookingPopup from './SmartBookingPopup';

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const { logEvent } = useAnalytics();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  const navigateToBooking = useCallback((serviceOrEvent?: string | React.MouseEvent) => {
    const service = typeof serviceOrEvent === 'string' ? serviceOrEvent : undefined;
    logEvent('initiate_booking', { source: 'provider', service });
    setPreselectedService(service);
    setIsPopupOpen(true);
  }, [logEvent]);

  const handleClose = useCallback(() => setIsPopupOpen(false), []);

  const contextValue = useMemo(() => ({ navigateToBooking }), [navigateToBooking]);

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
      {isPopupOpen && (
        <SmartBookingPopup 
          isOpen={isPopupOpen} 
          onClose={handleClose} 
          preselectedService={preselectedService}
        />
      )}
    </BookingContext.Provider>
  );
}
