'use client';

import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { BookingContext } from '@/contexts/bookingContext';
import SmartBookingPopup from './SmartBookingPopup';
import { BOOKING_APP_URL } from '@/lib/config';

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const { logEvent } = useAnalytics();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  const navigateToBooking = (serviceOrEvent?: string | React.MouseEvent) => {
    const service = typeof serviceOrEvent === 'string' ? serviceOrEvent : undefined;
    logEvent('initiate_booking', { source: 'provider', service });

    if (service) {
      // Integrated Booking App Redirection
      // Uses slugs: nutrition, massage, kinesiology, etc.
      const bookingUrl = BOOKING_APP_URL 
        ? `${BOOKING_APP_URL}/book/${service}`
        : `/booking/book/${service}`; // Fallback to relative if rewrite exists, or assume localhost/dev behavior

       // For now, let's assume we want to redirect to the separate app.
       // Since I don't have the exact URL, I'll use a placeholder that can be configured.
       // Or simpler: If we are in dev, localhost:3001. If prod, booking.eka-balance.com?
       
       const isDev = process.env.NODE_ENV === 'development';
       const targetHost = isDev ? 'http://localhost:3001' : 'https://booking.ekabalance.com';
       window.location.href = `${targetHost}/book/${service}`;
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
