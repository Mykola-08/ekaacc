/**
 * Example: Using Google OAuth Tokens
 * 
 * This file demonstrates how to use the Google OAuth integration
 * to access Google APIs on behalf of authenticated users.
 */

import React from 'react'
import { useSimpleAuth } from '@/hooks/use-simple-auth'
import { 
  getGoogleProfile,
  listGoogleCalendarEvents,
  listGoogleDriveFiles,
  getGmailProfile,
  listGmailMessages,
  createGoogleCalendarEvent,
  GOOGLE_SCOPES,
} from '@/lib/google-api-helper'
import { 
  getGoogleTokens,
  getValidGoogleToken,
} from '@/services/provider-tokens-service'

// ============================================================================
// Example 1: Get User's Google Profile
// ============================================================================

export async function exampleGetGoogleProfile(userId: string) {
  try {
    const profile = await getGoogleProfile(userId)
    
    console.log('Google Profile:', {
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      verified_email: profile.verified_email,
    })
    
    return profile
  } catch (error) {
    console.error('Failed to fetch Google profile:', error)
    throw error
  }
}

// ============================================================================
// Example 2: List Google Calendar Events
// Requires: calendar.readonly scope
// ============================================================================

export async function exampleListCalendarEvents(userId: string) {
  try {
    // Get events for the next 7 days
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    const response = await listGoogleCalendarEvents(userId, 'primary', {
      timeMin: now.toISOString(),
      timeMax: nextWeek.toISOString(),
      maxResults: 20,
      orderBy: 'startTime',
    })
    
    console.log(`Found ${response.items?.length || 0} upcoming events`)
    
    response.items?.forEach((event: any) => {
      console.log(`- ${event.summary} at ${event.start.dateTime || event.start.date}`)
    })
    
    return response.items || []
  } catch (error) {
    console.error('Failed to fetch calendar events:', error)
    throw error
  }
}

// ============================================================================
// Example 3: Create a Calendar Event
// Requires: calendar scope (write access)
// ============================================================================

export async function exampleCreateCalendarEvent(userId: string) {
  try {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(14, 0, 0, 0) // 2 PM tomorrow
    
    const endTime = new Date(tomorrow)
    endTime.setHours(15, 0, 0, 0) // 3 PM tomorrow
    
    const event = await createGoogleCalendarEvent(userId, {
      summary: 'Meeting created via API',
      description: 'This event was created using the Google Calendar API',
      start: {
        dateTime: tomorrow.toISOString(),
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'America/New_York',
      },
      attendees: [
        { email: 'someone@example.com' },
      ],
    })
    
    console.log('Created event:', event.htmlLink)
    return event
  } catch (error) {
    console.error('Failed to create calendar event:', error)
    throw error
  }
}

// ============================================================================
// Example 4: List Google Drive Files
// Requires: drive.readonly scope
// ============================================================================

export async function exampleListDriveFiles(userId: string) {
  try {
    const response = await listGoogleDriveFiles(userId, {
      pageSize: 10,
      orderBy: 'modifiedTime desc',
      fields: 'files(id, name, mimeType, modifiedTime, size, webViewLink)',
    })
    
    console.log(`Found ${response.files?.length || 0} files`)
    
    response.files?.forEach((file: any) => {
      console.log(`- ${file.name} (${file.mimeType})`)
    })
    
    return response.files || []
  } catch (error) {
    console.error('Failed to fetch Drive files:', error)
    throw error
  }
}

// ============================================================================
// Example 5: Get Gmail Profile and Recent Messages
// Requires: gmail.readonly scope
// ============================================================================

export async function exampleGmailOperations(userId: string) {
  try {
    // Get Gmail profile
    const profile = await getGmailProfile(userId)
    console.log('Gmail Profile:', {
      email: profile.emailAddress,
      messagesTotal: profile.messagesTotal,
      threadsTotal: profile.threadsTotal,
    })
    
    // List recent unread messages
    const messages = await listGmailMessages(userId, {
      q: 'is:unread',
      maxResults: 10,
      labelIds: ['INBOX'],
    })
    
    console.log(`Found ${messages.messages?.length || 0} unread messages`)
    
    return {
      profile,
      unreadMessages: messages.messages || [],
    }
  } catch (error) {
    console.error('Failed to fetch Gmail data:', error)
    throw error
  }
}

// ============================================================================
// Example 6: Check Token Status
// ============================================================================

export async function exampleCheckTokenStatus(userId: string) {
  try {
    const tokens = await getGoogleTokens(userId)
    
    if (!tokens.accessToken) {
      console.log('No Google token found. User needs to sign in with Google.')
      return null
    }
    
    console.log('Token status:', {
      hasAccessToken: !!tokens.accessToken,
      hasRefreshToken: !!tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      isExpired: tokens.expiresAt ? tokens.expiresAt < new Date() : true,
    })
    
    return tokens
  } catch (error) {
    console.error('Failed to check token status:', error)
    throw error
  }
}

// ============================================================================
// Example 7: React Component Using Google Calendar
// ============================================================================

export function GoogleCalendarWidget() {
  const { user } = useSimpleAuth()
  const [events, setEvents] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (user) {
      loadEvents()
    }
  }, [user])

  const loadEvents = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const now = new Date()
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      const response = await listGoogleCalendarEvents(user.id, 'primary', {
        timeMin: now.toISOString(),
        timeMax: nextWeek.toISOString(),
        maxResults: 10,
        orderBy: 'startTime',
      })
      
      setEvents(response.items || [])
    } catch (err: any) {
      console.error('Failed to load calendar events:', err)
      setError(err.message || 'Failed to load calendar events')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Please sign in to view your calendar</div>
  }

  if (loading) {
    return <div>Loading calendar events...</div>
  }

  if (error) {
    return (
      <div className="text-red-600">
        <p>Error: {error}</p>
        <button onClick={loadEvents}>Retry</button>
      </div>
    )
  }

  if (events.length === 0) {
    return <div>No upcoming events in the next 7 days</div>
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Upcoming Events</h3>
      {events.map((event) => (
        <div key={event.id} className="p-3 border rounded">
          <div className="font-medium">{event.summary}</div>
          <div className="text-sm text-gray-600">
            {new Date(event.start.dateTime || event.start.date).toLocaleString()}
          </div>
          {event.location && (
            <div className="text-sm text-gray-500">{event.location}</div>
          )}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// Example 8: Configure OAuth with Custom Scopes
// ============================================================================

export function exampleSignInWithCustomScopes() {
  const { signInWithOAuth } = useSimpleAuth()
  
  // To request custom scopes, you need to modify the auth context
  // Update src/context/auth-context.tsx, line ~275:
  
  /*
  if (provider === 'google') {
    options.queryParams = {
      access_type: 'offline',
      prompt: 'consent',
    }
    // Add custom scopes here
    options.scopes = [
      GOOGLE_SCOPES.OPENID,
      GOOGLE_SCOPES.EMAIL,
      GOOGLE_SCOPES.PROFILE,
      GOOGLE_SCOPES.CALENDAR_READONLY,
      GOOGLE_SCOPES.DRIVE_READONLY,
      GOOGLE_SCOPES.GMAIL_READONLY,
    ].join(' ')
  }
  */
  
  // Then just call signInWithOAuth as normal
  return (
    <button onClick={() => signInWithOAuth('google')}>
      Sign in with Google (with Calendar, Drive, Gmail access)
    </button>
  )
}

// ============================================================================
// Example 9: Handle Token Refresh
// ============================================================================

export async function exampleHandleTokenRefresh(userId: string) {
  try {
    // getValidGoogleToken automatically refreshes if needed
    const accessToken = await getValidGoogleToken(userId)
    
    if (!accessToken) {
      console.log('No token available. User needs to connect Google account.')
      return null
    }
    
    // Use the token for API calls
    console.log('Got valid access token:', accessToken.substring(0, 20) + '...')
    
    // Make custom API call
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    
    const data = await response.json()
    console.log('User info:', data)
    
    return data
  } catch (error) {
    console.error('Token refresh failed:', error)
    throw error
  }
}
