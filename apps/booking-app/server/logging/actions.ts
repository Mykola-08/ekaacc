'use server'

import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

// Fallback to console if service key is missing (e.g. during build or local dev without env)
const serviceClient = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null

export async function logError(error: any, info?: any) {
  // Always log to console in server environment
  console.error('[ServerError]', error)

  if (!serviceClient) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not set. Skipping DB logging.')
    return
  }

  try {
    const error_message = error instanceof Error ? error.message : String(error)
    const stack_trace = error instanceof Error ? error.stack : null
    const component_stack = info?.componentStack
    
    let url = 'unknown'
    let user_agent = 'unknown'

    try {
        const headerList = await headers()
        url = headerList.get('referer') || headerList.get('x-invoke-path') || 'unknown'
        user_agent = headerList.get('user-agent') || 'unknown'
    } catch (e) {
        // Headers might not be available in some contexts
    }

    const metadata = { ...info }

    // Try to get user if possible, but don't fail if not
    let userId = null
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        userId = user?.id || null
    } catch(e) {
        // Auth might fail or not be available
    }

    await serviceClient.from('error_logs').insert({
      user_id: userId,
      error_message,
      stack_trace,
      component_stack,
      url,
      user_agent,
      app_version: process.env.npm_package_version || '0.0.0',
      metadata
    })
  } catch (loggingError) {
    console.error('Failed to log error to DB:', loggingError)
  }
}

export async function getErrorLogs(page = 1, pageSize = 20) {
  const supabase = await createClient()

  // Authentication check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
      throw new Error('Unauthorized: No user found')
  }

  // Authorization check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'therapist') {
     throw new Error('Unauthorized: Insufficient permissions')
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, count, error } = await supabase
    .from('error_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)
  
  if (error) throw error

  return { data, count }
}

export async function getErrorLogById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .eq('id', id)
        .single()
    
    if (error) throw error
    return data
}
