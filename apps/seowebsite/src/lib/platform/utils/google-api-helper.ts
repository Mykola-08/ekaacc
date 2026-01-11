/**
 * Google API Helper
 * Utilities for making authenticated requests to Google APIs using stored OAuth tokens
 * 
 * This module provides helper functions to:
 * - Fetch user's Google profile information
 * - Access Google Calendar, Drive, Gmail, and other APIs
 * - Handle token refresh automatically
 * 
 * @see https://developers.google.com/identity/protocols/oauth2/web-server
 */

import { getValidGoogleToken } from '@/lib/platform/services/provider-tokens-service'

/**
 * Make an authenticated request to a Google API
 * Automatically handles token refresh if needed
 * 
 * @param userId - User ID to fetch tokens for
 * @param url - Google API endpoint URL
 * @param options - Fetch options (method, body, etc.)
 */
export async function fetchGoogleAPI(
  userId: string,
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = await getValidGoogleToken(userId)

  if (!accessToken) {
    throw new Error('No valid Google access token available. Please reconnect your Google account.')
  }

  const headers = new Headers(options.headers)
  headers.set('Authorization', `Bearer ${accessToken}`)

  return fetch(url, {
    ...options,
    headers,
  })
}

/**
 * Get user's Google profile information
 * Requires: openid, email, profile scopes (default)
 */
export async function getGoogleProfile(userId: string) {
  const response = await fetchGoogleAPI(
    userId,
    'https://www.googleapis.com/oauth2/v2/userinfo'
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch Google profile: ${response.statusText}`)
  }

  return response.json()
}

/**
 * List user's Google Calendar events
 * Requires: https://www.googleapis.com/auth/calendar.readonly scope
 * 
 * @see https://developers.google.com/calendar/api/v3/reference/events/list
 */
export async function listGoogleCalendarEvents(
  userId: string,
  calendarId: string = 'primary',
  params: {
    timeMin?: string // ISO 8601 timestamp
    timeMax?: string // ISO 8601 timestamp
    maxResults?: number
    orderBy?: 'startTime' | 'updated'
  } = {}
) {
  const queryParams = new URLSearchParams()
  if (params.timeMin) queryParams.append('timeMin', params.timeMin)
  if (params.timeMax) queryParams.append('timeMax', params.timeMax)
  if (params.maxResults) queryParams.append('maxResults', params.maxResults.toString())
  if (params.orderBy) queryParams.append('orderBy', params.orderBy)

  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${queryParams}`
  const response = await fetchGoogleAPI(userId, url)

  if (!response.ok) {
    throw new Error(`Failed to fetch calendar events: ${response.statusText}`)
  }

  return response.json()
}

/**
 * List files from Google Drive
 * Requires: https://www.googleapis.com/auth/drive.readonly scope
 * 
 * @see https://developers.google.com/drive/api/v3/reference/files/list
 */
export async function listGoogleDriveFiles(
  userId: string,
  params: {
    q?: string // Query string for filtering files
    pageSize?: number
    orderBy?: string
    fields?: string
  } = {}
) {
  const queryParams = new URLSearchParams()
  if (params.q) queryParams.append('q', params.q)
  if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
  if (params.orderBy) queryParams.append('orderBy', params.orderBy)
  if (params.fields) queryParams.append('fields', params.fields)

  const url = `https://www.googleapis.com/drive/v3/files?${queryParams}`
  const response = await fetchGoogleAPI(userId, url)

  if (!response.ok) {
    throw new Error(`Failed to fetch Drive files: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get Gmail profile (email address, messages total, etc.)
 * Requires: https://www.googleapis.com/auth/gmail.readonly scope
 * 
 * @see https://developers.google.com/gmail/api/reference/rest/v1/users/getProfile
 */
export async function getGmailProfile(userId: string) {
  const response = await fetchGoogleAPI(
    userId,
    'https://www.googleapis.com/gmail/v1/users/me/profile'
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch Gmail profile: ${response.statusText}`)
  }

  return response.json()
}

/**
 * List Gmail messages
 * Requires: https://www.googleapis.com/auth/gmail.readonly scope
 * 
 * @see https://developers.google.com/gmail/api/reference/rest/v1/users.messages/list
 */
export async function listGmailMessages(
  userId: string,
  params: {
    q?: string // Gmail query string
    maxResults?: number
    labelIds?: string[]
  } = {}
) {
  const queryParams = new URLSearchParams()
  if (params.q) queryParams.append('q', params.q)
  if (params.maxResults) queryParams.append('maxResults', params.maxResults.toString())
  if (params.labelIds) {
    params.labelIds.forEach(labelId => queryParams.append('labelIds', labelId))
  }

  const url = `https://www.googleapis.com/gmail/v1/users/me/messages?${queryParams}`
  const response = await fetchGoogleAPI(userId, url)

  if (!response.ok) {
    throw new Error(`Failed to fetch Gmail messages: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Example: Create a Google Calendar event
 * Requires: https://www.googleapis.com/auth/calendar scope (write access)
 * 
 * @see https://developers.google.com/calendar/api/v3/reference/events/insert
 */
export async function createGoogleCalendarEvent(
  userId: string,
  event: {
    summary: string
    description?: string
    start: { dateTime: string; timeZone?: string }
    end: { dateTime: string; timeZone?: string }
    attendees?: { email: string }[]
  },
  calendarId: string = 'primary'
) {
  const response = await fetchGoogleAPI(
    userId,
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to create calendar event: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Common Google API scopes
 * Use these when configuring OAuth in your signInWithOAuth call
 */
export const GOOGLE_SCOPES = {
  // Default scopes (always included)
  OPENID: 'openid',
  EMAIL: 'https://www.googleapis.com/auth/userinfo.email',
  PROFILE: 'https://www.googleapis.com/auth/userinfo.profile',
  
  // Calendar
  CALENDAR_READONLY: 'https://www.googleapis.com/auth/calendar.readonly',
  CALENDAR: 'https://www.googleapis.com/auth/calendar',
  CALENDAR_EVENTS: 'https://www.googleapis.com/auth/calendar.events',
  
  // Drive
  DRIVE_READONLY: 'https://www.googleapis.com/auth/drive.readonly',
  DRIVE: 'https://www.googleapis.com/auth/drive',
  DRIVE_FILE: 'https://www.googleapis.com/auth/drive.file',
  
  // Gmail
  GMAIL_READONLY: 'https://www.googleapis.com/auth/gmail.readonly',
  GMAIL_MODIFY: 'https://www.googleapis.com/auth/gmail.modify',
  GMAIL_COMPOSE: 'https://www.googleapis.com/auth/gmail.compose',
  GMAIL_SEND: 'https://www.googleapis.com/auth/gmail.send',
  
  // YouTube
  YOUTUBE_READONLY: 'https://www.googleapis.com/auth/youtube.readonly',
  YOUTUBE: 'https://www.googleapis.com/auth/youtube',
} as const
