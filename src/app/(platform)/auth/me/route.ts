import { createClient } from '@/lib/platform/supabase/server'
import type { NextRequest } from 'next/server'

export async function GET(_request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return new Response(JSON.stringify({ user: null }), { status: 200 })
  }
  
  return new Response(JSON.stringify({ user }), { headers: { 'Content-Type': 'application/json' } })
}