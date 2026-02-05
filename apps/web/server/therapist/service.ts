import { db } from '@/lib/db';

export interface StaffProfile {
  id: string;
  name: string;
  display_name: string | null;
  email: string | null;
  bio: string | null;
  photo_url: string | null;
  specialties: string[] | null;
  active: boolean;
}

export async function getActiveTherapists(): Promise<StaffProfile[]> {
  const { rows } = await db.query<StaffProfile>(
    `SELECT id, name, display_name, email, bio, photo_url, specialties, active 
     FROM staff 
     WHERE active = true`
  );
  return rows;
}

export async function getSingleActiveTherapist(): Promise<StaffProfile | null> {
    const therapists = await getActiveTherapists();
    return therapists.length === 1 ? therapists[0] ?? null : null;
}
