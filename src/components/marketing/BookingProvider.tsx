'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAnalytics } from '@/hooks/marketing/useAnalytics';
import { BookingContext } from '@/context/marketing/bookingContext';

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { logEvent } = useAnalytics();

  const navigateToBooking = (serviceOrEvent?: string | React.MouseEvent) => {
    const service = typeof serviceOrEvent === 'string' ? serviceOrEvent : undefined;
    logEvent('initiate_booking', { source: 'provider', service });
    if (service) {
      router.push(`/book?service=${encodeURIComponent(service)}`);
      return;
    }
    router.push('/book');
  };

  return (
    <BookingContext.Provider value={{ navigateToBooking }}>{children}</BookingContext.Provider>
  );
}
