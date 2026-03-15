'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useBookingData() {
  const [services, setServices] = useState<{ id: string; name: string; price: number }[]>([]);
  const [therapists, setTherapists] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Example data fetch placeholder
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Mock or fetch data here
      // const supabase = createClient();
      setServices([
        { id: '1', name: 'Initial Consultation', price: 150 },
        { id: '2', name: 'Follow-up Session', price: 100 },
      ]);
      setTherapists([
        { id: 't1', name: 'Dr. Smith' },
        { id: 't2', name: 'Dr. Doe' },
      ]);
      setLoading(false);
    }
    fetchData();
  }, []);

  return { services, therapists, loading };
}
