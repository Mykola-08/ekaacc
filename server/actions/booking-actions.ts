'use server';

import { cancelBooking } from '@/server/dashboard/service';
import {
  createBooking,
  getServiceAvailability,
  listServices,
  fetchService,
} from '@/server/booking/service';
import { ReputationService } from '@/server/reputation/service';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function fetchServiceAction(serviceId: string) {
  const result = await fetchService(serviceId);
  if (result.error) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

export async function getReputationPolicyAction(email: string, priceCents: number) {
  try {
    const policy = await ReputationService.getPolicyForService(email, priceCents);
    return { success: true as const, data: policy };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function getActiveServicesAction() {
  const result = await listServices();
  if (result.error) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

export async function getTherapistsAction() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, avatar_url')
    .eq('role', 'therapist');
  if (error) return { success: false as const, error: error.message };
  return { success: true as const, data: data ?? [] };
}

export async function cancelBookingAction(bookingId: string, userId: string) {
  const result = await cancelBooking(bookingId, userId);
  if (result.success) {
    revalidatePath('/bookings');
  }
  return result;
}

type BookingActionInput = {
  serviceId: string;
  variantId?: string;
  startTime: Date;
  endTime: Date;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  priceCents: number;
  paymentMode: 'stripe' | 'wallet' | 'deposit' | 'pay_later';
  depositCents?: number;
  staffId?: string;
  userId?: string;
};

export async function createNewBookingAction(data: BookingActionInput) {
  // Basic server-side validation
  if (!data.email || !data.serviceId) {
    return { success: false, error: 'Missing required fields' };
  }

  const res = await createBooking({
    serviceId: data.serviceId,
    serviceVariantId: data.variantId,
    startTime: data.startTime.toISOString(),
    email: data.email,
    phone: data.phone,
    displayName: `${data.firstName} ${data.lastName}`.trim(),
    paymentMode: data.paymentMode as any,
    userId: data.userId,
    staffId: data.staffId,
  });

  if (res.error) {
    return { success: false, error: res.error };
  }

  revalidatePath('/bookings');
  return { success: true, bookingId: res.data?.bookingId };
}

export async function getAvailableSlotsAction(serviceId: string, date: string, variantId?: string) {
  const result = await getServiceAvailability(serviceId, date, variantId);

  if (result.error) {
    return { success: false, error: result.error };
  }

  return { success: true, data: result.data };
}
