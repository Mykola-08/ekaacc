'use client';

import { useState, useEffect } from 'react';
import { getActiveServicesAction, getTherapistsAction } from '@/server/actions/booking-actions';

type BookingService = {
  id: string;
  name: string;
  description?: string | null;
  duration_minutes: number;
  price_cents: number;
  currency?: string;
};

type BookingTherapist = {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  specialties?: string | null;
};

export function useBookingData() {
  const [services, setServices] = useState<BookingService[]>([]);
  const [therapists, setTherapists] = useState<BookingTherapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const [servicesRes, therapistsRes] = await Promise.all([
          getActiveServicesAction(),
          getTherapistsAction(),
        ]);

        if (!servicesRes.success) {
          throw new Error(String(servicesRes.error ?? 'Failed to load services'));
        }

        if (!therapistsRes.success) {
          throw new Error(String(therapistsRes.error ?? 'Failed to load therapists'));
        }

        const normalizedServices: BookingService[] = (servicesRes.data || []).map(
          (service: any) => ({
            id: service.id,
            name: service.name,
            description: service.description,
            duration_minutes: Number(service.duration || 60),
            price_cents: Math.round(Number(service.price || 0) * 100),
            currency: service.currency || 'EUR',
          })
        );

        const normalizedTherapists: BookingTherapist[] = (therapistsRes.data || []).map(
          (therapist: any) => ({
            id: therapist.id,
            full_name: therapist.full_name || 'Therapist',
            avatar_url: therapist.avatar_url,
            specialties: therapist.specialties || null,
          })
        );

        setServices(normalizedServices);
        setTherapists(normalizedTherapists);
      } catch (fetchError: any) {
        setError(fetchError?.message || 'Failed to load booking data');
        setServices([]);
        setTherapists([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { services, therapists, loading, error };
}
