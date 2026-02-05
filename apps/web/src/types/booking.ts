// Booking related TypeScript interfaces aligned with system prompt

export interface CancellationPolicy {
  deadlineOffsetHours: number; // hours before start when full/partial refund still applies
  refundPercent: number; // 0-100 applied to prepaid (or remaining deposit)
  feeCents?: number; // optional absolute fee retained
}

export interface BookingAddon {
  addonId: string;
  name: string;
  priceCents: number;
}

export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'refunded' | 'canceled';
export type BookingStatus = 'scheduled' | 'completed' | 'canceled' | 'no_show' | 'in_service';

export interface Booking {
  id: string;
  serviceId: string;
  serviceName?: string; // convenience hydration
  staffId?: string | null;
  startTime: string; // ISO-8601
  endTime: string; // ISO-8601
  durationMinutes: number;
  basePriceCents: number;
  currency: string;
  addons: BookingAddon[];
  customerReferenceId?: string | null;
  email: string;
  phone?: string;
  displayName?: string;
  paymentStatus: PaymentStatus;
  paymentMode: 'full' | 'deposit';
  depositCents?: number; // when paymentMode = deposit
  cancellationPolicy?: CancellationPolicy;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  reservationExpiresAt?: string; // TTL for pending payment
}

export interface AvailabilitySlot {
  startTime: string; // ISO
  endTime: string; // ISO
  staffId?: string | null;
  isReserved?: boolean; // tentative hold
}

export interface AvailabilityResponse {
  serviceId: string;
  date: string; // YYYY-MM-DD
  slots: AvailabilitySlot[];
  generatedAt: string; // ISO timestamp
  durationMinutes: number;
}
