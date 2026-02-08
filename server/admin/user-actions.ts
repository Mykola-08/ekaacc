'use server';

import { db } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type UserProfile = {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  createdAt: string;
  lastLogin?: string;
  phone?: string;
  company?: string;
  status: 'active' | 'suspended' | 'pending';
  metadata: any;
};

async function logAdminAction(action: string, targetId: string, details: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // Get profile ID for the actor
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!profile) {
    console.error('Admin profile not found for logging');
    return;
  }

  await db.query(
    `
        INSERT INTO activity_logs (actor_id, action, target_type, target_id, metadata)
        VALUES ($1, $2, $3, $4, $5)
    `,
    [profile.id, action, 'user', targetId, JSON.stringify(details)]
  );
}

export async function getAdminUsers(
  query?: string,
  role?: string,
  status?: string
): Promise<UserProfile[]> {
  // Construct query dynamically based on filters
  let sql = `
    SELECT 
      id,
      email,
      raw_user_meta_data->>'full_name' as "fullName",
      raw_user_meta_data->>'role' as role,
      created_at as "createdAt",
      last_sign_in_at as "lastLogin",
      raw_user_meta_data->>'phone' as phone,
      raw_user_meta_data->>'company' as company,
      COALESCE(raw_user_meta_data->>'status', 'active') as status,
      raw_user_meta_data as metadata
    FROM auth.users
    WHERE 1=1
  `;

  const params: any[] = [];
  let paramIdx = 1;

  if (query) {
    sql += ` AND (email ILIKE $${paramIdx} OR raw_user_meta_data->>'full_name' ILIKE $${paramIdx})`;
    params.push(`%${query}%`);
    paramIdx++;
  }

  if (role && role !== 'all') {
    sql += ` AND raw_user_meta_data->>'role' = $${paramIdx}`;
    params.push(role);
    paramIdx++;
  }

  if (status && status !== 'all') {
    sql += ` AND COALESCE(raw_user_meta_data->>'status', 'active') = $${paramIdx}`;
    params.push(status);
    paramIdx++;
  }

  sql += ` ORDER BY created_at DESC LIMIT 100`;

  // Note: We are querying auth.users directly which requires Service Role key if using PostgREST,
  // but here we are using direct DB connection (pg) which usually has broad access if configured with connection string.
  // Ideally, use a secure view or Supabase Admin Client.
  // Since db.query uses the pool connected via connection string, ensure the user has access to auth schema or use a safer approach.
  // safer: Use Supabase Admin API.

  // Re-implementation using Supabase Admin Client for safety and correctness regarding auth schema
  // const supabase = await createClient();
  // We need Service Role for auth.users list if standard user can't see properly.
  // But let's try using the DB query if the PG user has permissions.
  // If not, we have to rely on a 'public.profiles' table that syncs with auth.users.

  // Fallback to 'profiles' table if auth.users is restricted
  try {
    // Try direct DB query assuming postgres user has access
    const { rows } = await db.query(sql, params);
    return rows.map((r: any) => ({
      ...r,
      id: r.id,
      email: r.email,
      fullName: r.fullName,
      role: r.role,
      phone: r.phone,
      company: r.company,
      status: r.status,
      metadata: r.metadata,
      createdAt: new Date(r.createdAt).toISOString(),
      lastLogin: r.lastLogin ? new Date(r.lastLogin).toISOString() : null,
    })) as UserProfile[];
  } catch (e) {
    console.error('Direct auth.users query failed, falling back to profiles or empty', e);
    return [];
  }
}

export async function updateUserAttributes(userId: string, data: Partial<UserProfile>) {
  const supabase = await createClient();
  // Verify admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // user check logic...

  // We need to update raw_user_meta_data in auth.users
  // Using Supabase Admin client or a stored procedure is best.
  // For now, let's assume we can update a 'profiles' table and have a trigger, OR use the DB directly to update auth.users

  const updates: any = {};
  if (data.fullName) updates.full_name = data.fullName;
  if (data.role) updates.role = data.role;
  if (data.phone) updates.phone = data.phone;
  if (data.company) updates.company = data.company;
  if (data.status) updates.status = data.status;

  // Direct SQL update to auth.users raw_user_meta_data
  // Note: merging jsonb
  const query = `
        UPDATE auth.users 
        SET raw_user_meta_data = raw_user_meta_data || $2
        WHERE id = $1
    `;

  await db.query(query, [userId, JSON.stringify(updates)]);

  await logAdminAction('update_user', userId, { updates });
  revalidatePath('/admin/users');
}

export async function getAdminUserById(id: string): Promise<UserProfile | null> {
  const sql = `
        SELECT 
          id,
          email,
          raw_user_meta_data->>'full_name' as "fullName",
          raw_user_meta_data->>'role' as role,
          created_at as "createdAt",
          last_sign_in_at as "lastLogin",
          raw_user_meta_data->>'phone' as phone,
          raw_user_meta_data->>'company' as company,
          COALESCE(raw_user_meta_data->>'status', 'active') as status,
          raw_user_meta_data as metadata
        FROM auth.users
        WHERE id = $1
    `;

  try {
    const { rows } = await db.query(sql, [id]);
    if (rows.length === 0) return null;

    const r = rows[0]!;
    return {
      ...r,
      id: r.id,
      email: r.email,
      fullName: r.fullName,
      role: r.role,
      phone: r.phone,
      company: r.company,
      status: r.status,
      metadata: r.metadata,
      createdAt: new Date(r.createdAt).toISOString(),
      lastLogin: r.lastLogin ? new Date(r.lastLogin).toISOString() : null,
    } as UserProfile;
  } catch (e) {
    console.error('Failed to fetch user by ID', e);
    return null;
  }
}
