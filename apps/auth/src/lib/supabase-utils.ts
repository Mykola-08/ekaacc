import { createClient } from './supabase/client';

const supabase = createClient();

/**
 * Safely execute a Supabase query with proper type handling
 */
export async function safeSupabaseQuery<T>(
  query: any
): Promise<{ data: T | null; error: any }> {
  try {
    const result = await query;
    return { data: result.data as T | null, error: result.error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Safely execute a Supabase insert operation
 */
export async function safeSupabaseInsert<T>(
  table: string,
  data: any
): Promise<{ data: T | null; error: any }> {
  return safeSupabaseQuery<T>(
    supabase.from(table).insert(data).select().single()
  );
}

/**
 * Safely execute a Supabase update operation
 */
export async function safeSupabaseUpdate<T>(
  table: string,
  data: any,
  match: any
): Promise<{ data: T | null; error: any }> {
  return safeSupabaseQuery<T>(
    supabase.from(table).update(data).match(match).select().single()
  );
}
