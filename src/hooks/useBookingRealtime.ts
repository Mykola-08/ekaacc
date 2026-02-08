import { useState, useCallback } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Define a partial Booking type for what we expect
export interface Booking {
  id: string;
  start_time: string;
  end_time: string;
  staff_id: string;
  status: 'scheduled' | 'completed' | 'canceled' | 'no_show' | 'in_service';
  [key: string]: any;
}

export function useBookingRealtime(onBookingUpdate?: (payload: RealtimePostgresChangesPayload<Booking>) => void) {
  const [latestEvent, setLatestEvent] = useState<RealtimePostgresChangesPayload<Booking> | null>(null);

  const handleUpdate = useCallback((payload: RealtimePostgresChangesPayload<Booking>) => {
    setLatestEvent(payload);
    if (onBookingUpdate) {
      onBookingUpdate(payload);
    }
  }, [onBookingUpdate]);

  useRealtimeSubscription<Booking>({
    table: 'booking',
    callback: handleUpdate,
  });

  return { latestBookingEvent: latestEvent };
}

