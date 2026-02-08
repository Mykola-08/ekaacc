'use client';

import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/marketing/useAnalytics';
import { BookingContext } from '@/context/marketing/bookingContext';
import SmartBookingPopup from './SmartBookingPopup';

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const { logEvent } = useAnalytics();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  const navigateToBooking = (serviceOrEvent?: string | React.MouseEvent) => {
    const service = typeof serviceOrEvent === 'string' ? serviceOrEvent : undefined;
    logEvent('initiate_booking', { source: 'provider', service });
    setPreselectedService(service);
    setIsPopupOpen(true);
  };

  return (
    <BookingContext.Provider value={{ navigateToBooking }}>
      {children}
      {isPopupOpen && (
        <SmartBookingPopup 
          isOpen={isPopupOpen} 
          onClose={() => setIsPopupOpen(false)} 
          preselectedService={preselectedService}
        />
      )}
    </BookingContext.Provider>
  );
}



