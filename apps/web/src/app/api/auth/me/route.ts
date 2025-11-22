import { getSession } from '@auth0/nextjs-auth0'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const session = await getSession(request, NextResponse.next())
  if (!session) {
    return new Response(JSON.stringify({ user: null }), { status: 200 })
  }
  // Strip tokens, return claims only
  const { user } = session
  return new Response(JSON.stringify({ user }), { headers: { 'Content-Type': 'application/json' } })
}