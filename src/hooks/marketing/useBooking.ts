import { useContext } from 'react';
import { BookingContext } from '@/context/marketing/bookingContext';

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
