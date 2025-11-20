/**
 * API Route: Refresh Google OAuth Token
 * 
 * This endpoint securely refreshes a Google access token using a refresh token.
 * The Google Client Secret is kept server-side and never exposed to the client.
 * 
 * @see https://developers.google.com/identity/protocols/oauth2/web-server#offline
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the refresh token from the request
    const { refresh_token } = await request.json()

    if (!refresh_token) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      )
    }

    // Get Google OAuth credentials from environment
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET

    if (!clientId || !clientSecret) {
      console.error('Google OAuth credentials not configured')
      return NextResponse.json(
        { error: 'OAuth configuration error' },
        { status: 500 }
      )
    }

    // Exchange refresh token for new access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refresh_token,
        grant_type: 'refresh_token',
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Failed to refresh Google token:', errorData)
      return NextResponse.json(
        { error: 'Failed to refresh token', details: errorData },
        { status: tokenResponse.status }
      )
    }

    const tokenData = await tokenResponse.json()

    // Return the new access token
    return NextResponse.json({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
      scope: tokenData.scope,
    })

  } catch (error) {
    console.error('Error refreshing Google token:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
