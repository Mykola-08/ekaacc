'use server';

import { db } from '@/lib/db';
import { Booking } from '@/types/booking';
import { createClient } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  const role = profile?.role || user.app_metadata?.role;
  if (!role || !['admin', 'super_admin', 'Admin', 'SuperAdmin'].includes(role)) {
    throw new Error('Forbidden: Admin role required');
  }
  return user;
}

export async function getAdminBookings(): Promise<Booking[]> {
  await requireAdmin();
  const query = `
    SELECT 
      b.id,
      b.service_id as "serviceId",
      s.name as "serviceName",
      b.staff_id as "staffId",
      b.start_time as "startTime",
      b.end_time as "endTime",
      b.duration_minutes as "durationMinutes",
      b.base_price_cents as "basePriceCents",
      b.currency,
      b.addons_json as "addons",
      b.customer_reference_id as "customerReferenceId",
      b.email,
      b.phone,
      b.display_name as "displayName",
      b.payment_status as "paymentStatus",
      b.payment_mode as "paymentMode",
      b.deposit_cents as "depositCents",
      b.cancellation_policy as "cancellationPolicy",
      b.status,
      b.notes,
      b.source,
      b.origin_app as "originApp",
      b.created_at as "createdAt",
      b.updated_at as "updatedAt",
      b.reservation_expires_at as "reservationExpiresAt"
    FROM booking b
    LEFT JOIN service s ON b.service_id = s.id
    ORDER BY b.created_at DESC
    LIMIT 100;
  `;

  const { rows } = await db.query(query);
  return rows.map((row) => ({
    ...row,
    addons: row.addons || [],
    startTime: row.startTime instanceof Date ? row.startTime.toISOString() : row.startTime,
    endTime: row.endTime instanceof Date ? row.endTime.toISOString() : row.endTime,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : row.updatedAt,
    reservationExpiresAt:
      row.reservationExpiresAt instanceof Date
        ? row.reservationExpiresAt.toISOString()
        : row.reservationExpiresAt,
  })) as Booking[];
}

export type AdminService = {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  active: boolean;
  imageUrl: string;
  tags: string[];
  metadata: any;
};

export async function getAdminServices(): Promise<AdminService[]> {
  await requireAdmin();
  const query = `
      SELECT
        id,
        name,
        description,
        is_public as "isPublic",
        active,
        image_url as "imageUrl",
        tags,
        metadata
      FROM service
      ORDER BY name ASC;
    `;
  const { rows } = await db.query(query);
  return rows as AdminService[];
}
