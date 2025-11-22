/**
 * Provider Tokens Service
 * Manages OAuth provider tokens (access and refresh tokens) for third-party API access
 * 
 * Based on Supabase documentation:
 * https://supabase.com/docs/guides/auth/social-login/auth-google#saving-google-tokens
 */

import { supabase } from '@/lib/supabase'

export interface ProviderToken {
  id: string
  user_id: string
  provider: 'google' | 'github' | 'twitter' | 'linkedin' | 'apple' | 'facebook'
  provider_token: string | null
  provider_refresh_token: string | null
  token_expires_at: string | null
  scopes: string[] | null
  created_at: string
  updated_at: string
}

export interface SaveProviderTokenParams {
  userId: string
  provider: ProviderToken['provider']
  providerToken: string | null
  providerRefreshToken: string | null
  expiresIn?: number // Seconds until token expires
  scopes?: string[]
}

export interface GoogleTokens {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: Date | null
}

/**
 * Save or update provider tokens for a user
 * This should be called after successful OAuth authentication
 */
export async function saveProviderTokens({
  userId,
  provider,
  providerToken,
  providerRefreshToken,
  expiresIn,
  scopes,
}: SaveProviderTokenParams) {
  try {
    const tokenExpiresAt = expiresIn 
      ? new Date(Date.now() + expiresIn * 1000).toISOString()
      : null

    const { data, error } = await supabase
      .from('user_provider_tokens')
      .upsert({
        user_id: userId,
        provider,
        provider_token: providerToken,
        provider_refresh_token: providerRefreshToken,
        token_expires_at: tokenExpiresAt,
        scopes,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,provider',
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving provider tokens:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error saving provider tokens:', error)
    return { data: null, error }
  }
}

/**
 * Get provider tokens for a user
 */
export async function getProviderTokens(
  userId: string,
  provider: ProviderToken['provider']
): Promise<{ data: ProviderToken | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('user_provider_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', provider)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching provider tokens:', error)
      return { data: null, error }
    }

    return { data: data || null, error: null }
  } catch (error) {
    console.error('Unexpected error fetching provider tokens:', error)
    return { data: null, error }
  }
}

/**
 * Get Google tokens for a user
 * Convenience method specifically for Google tokens
 */
export async function getGoogleTokens(userId: string): Promise<GoogleTokens> {
  const { data, error } = await getProviderTokens(userId, 'google')

  if (error || !data) {
    return {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    }
  }

  return {
    accessToken: data.provider_token,
    refreshToken: data.provider_refresh_token,
    expiresAt: data.token_expires_at ? new Date(data.token_expires_at) : null,
  }
}

/**
 * Check if a token is expired or will expire soon
 * @param expiresAt - Token expiration date
 * @param bufferSeconds - Consider token expired if it expires within this many seconds (default: 300 = 5 minutes)
 */
export function isTokenExpired(expiresAt: Date | null, bufferSeconds: number = 300): boolean {
  if (!expiresAt) return true
  const now = new Date()
  const bufferTime = new Date(now.getTime() + bufferSeconds * 1000)
  return expiresAt <= bufferTime
}

/**
 * Delete provider tokens for a user
 * Useful when user disconnects an OAuth provider
 */
export async function deleteProviderTokens(
  userId: string,
  provider: ProviderToken['provider']
) {
  try {
    const { error } = await supabase
      .from('user_provider_tokens')
      .delete()
      .eq('user_id', userId)
      .eq('provider', provider)

    if (error) {
      console.error('Error deleting provider tokens:', error)
      return { error }
    }

    return { error: null }
  } catch (error) {
    console.error('Unexpected error deleting provider tokens:', error)
    return { error }
  }
}

/**
 * Get all provider tokens for a user
 * Useful for showing which OAuth providers are connected
 */
export async function getAllProviderTokens(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_provider_tokens')
      .select('provider, token_expires_at, scopes, updated_at')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching all provider tokens:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error fetching all provider tokens:', error)
    return { data: null, error }
  }
}

/**
 * Refresh Google access token using refresh token
 * Note: This requires setting up a backend endpoint or edge function
 * to securely handle the token refresh with your Google Client Secret
 * 
 * @see https://developers.google.com/identity/protocols/oauth2/web-server#offline
 */
export async function refreshGoogleToken(userId: string): Promise<{
  accessToken: string | null
  expiresIn: number | null
  error: any
}> {
  try {
    const { data: tokens } = await getProviderTokens(userId, 'google')
    
    if (!tokens?.provider_refresh_token) {
      return {
        accessToken: null,
        expiresIn: null,
        error: { message: 'No refresh token available' }
      }
    }

    // Call your backend endpoint to refresh the token
    // This should be implemented as an Edge Function or API route
    const response = await fetch('/api/auth/refresh-google-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: tokens.provider_refresh_token,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const { access_token, expires_in } = await response.json()

    // Save the new access token
    await saveProviderTokens({
      userId,
      provider: 'google',
      providerToken: access_token,
      providerRefreshToken: tokens.provider_refresh_token,
      expiresIn: expires_in,
      scopes: tokens.scopes || undefined,
    })

    return {
      accessToken: access_token,
      expiresIn: expires_in,
      error: null,
    }
  } catch (error) {
    console.error('Error refreshing Google token:', error)
    return {
      accessToken: null,
      expiresIn: null,
      error,
    }
  }
}

/**
 * Get a valid Google access token, refreshing if necessary
 * This is the recommended method to use before making Google API calls
 */
export async function getValidGoogleToken(userId: string): Promise<string | null> {
  const tokens = await getGoogleTokens(userId)

  if (!tokens.accessToken) {
    return null
  }

  // If token is expired or expiring soon, refresh it
  if (isTokenExpired(tokens.expiresAt)) {
    const refreshed = await refreshGoogleToken(userId)
    return refreshed.accessToken
  }

  return tokens.accessToken
}
