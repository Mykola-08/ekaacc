'use client';

import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { BookingContext } from '@/context/bookingContext';
import SmartBookingPopup from './SmartBookingPopup';
import { BOOKING_APP_URL } from '@/lib/constants';

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const { logEvent } = useAnalytics();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  const navigateToBooking = (serviceOrEvent?: string | React.MouseEvent) => {
    const service = typeof serviceOrEvent === 'string' ? serviceOrEvent : undefined;
    logEvent('initiate_booking', { source: 'provider', service });

    if (service) {
      const bookingUrl = BOOKING_APP_URL
        ? `${BOOKING_APP_URL}/book/${service}`
        : `/book/${service}`;
      window.location.href = bookingUrl;
      return;
    }

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
