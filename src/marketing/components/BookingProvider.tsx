'use client';

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalytics } from '@/marketing/hooks/useAnalytics';
import { BookingContext } from '@/marketing/contexts/bookingContext';

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const { logEvent } = useAnalytics();
  const router = useRouter();

  const navigateToBooking = useCallback(
    (serviceOrEvent?: string | React.MouseEvent) => {
      const service = typeof serviceOrEvent === 'string' ? serviceOrEvent : undefined;
      logEvent('initiate_booking', { source: 'provider', service });

      if (service) {
        router.push(`/book/${service}`);
      } else {
        router.push('/book');
      }
    },
    [logEvent, router]
  );

  const contextValue = useMemo(() => ({ navigateToBooking }), [navigateToBooking]);

  return <BookingContext.Provider value={contextValue}>{children}</BookingContext.Provider>;
}
