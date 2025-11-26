/**
 * Supabase utility functions to handle TypeScript type issues
 */

import { supabase, supabaseAdmin } from './supabase-legacy';

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
 * Safely execute a Supabase admin insert operation
 */
export async function safeSupabaseAdminInsert<T>(
  table: string,
  data: any
): Promise<{ data: T | null; error: any }> {
  return safeSupabaseQuery<T>(
    supabaseAdmin.from(table).insert(data).select().single()
  );
}

/**
 * Safely execute a Supabase update operation
 */
export async function safeSupabaseUpdate<T>(
  table: string,
  data: any,
  match: Record<string, any>
): Promise<{ data: T | null; error: any }> {
  let query = (supabase.from(table) as any).update(data);
  
  Object.entries(match).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  
  return safeSupabaseQuery<T>(query.select().single());
}

/**
 * Safely execute a Supabase admin update operation
 */
export async function safeSupabaseAdminUpdate<T>(
  table: string,
  data: any,
  match: Record<string, any>
): Promise<{ data: T | null; error: any }> {
  let query = (supabaseAdmin.from(table) as any).update(data);
  
  Object.entries(match).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  
  return safeSupabaseQuery<T>(query.select().single());
}

/**
 * Safely execute a Supabase select operation
 */
export async function safeSupabaseSelect<T>(
  table: string,
  match?: Record<string, any>
): Promise<{ data: T[] | null; error: any }> {
  let query = supabase.from(table).select('*');
  
  if (match) {
    Object.entries(match).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }
  
  return safeSupabaseQuery<T[]>(query);
}

/**
 * Safely execute a Supabase query builder operation
 */
export async function safeSupabaseQueryBuilder<T>(
  queryBuilder: any
): Promise<{ data: T | null; error: any }> {
  try {
    const result = await queryBuilder;
    return { data: result.data as T | null, error: result.error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Safely execute a Supabase single select operation
 */
export async function safeSupabaseSelectSingle<T>(
  table: string,
  match: Record<string, any>
): Promise<{ data: T | null; error: any }> {
  let query = supabase.from(table).select('*');
  
  Object.entries(match).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  
  return safeSupabaseQuery<T>(query.single());
}

/**
 * Safely execute a Supabase delete operation
 */
export async function safeSupabaseDelete(
  table: string,
  match: Record<string, any>
): Promise<{ error: any }> {
  let query = supabase.from(table).delete();
  
  Object.entries(match).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  
  try {
    const result = await query;
    return { error: result.error };
  } catch (error) {
    return { error };
  }
}