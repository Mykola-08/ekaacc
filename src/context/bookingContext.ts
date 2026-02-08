import { createContext } from 'react';

export interface BookingContextType {
  navigateToBooking: (service?: string | React.MouseEvent) => void;
}

export const BookingContext = createContext<BookingContextType | undefined>(undefined);

