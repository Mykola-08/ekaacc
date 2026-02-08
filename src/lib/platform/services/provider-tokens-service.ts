// Provider Tokens Service - OAuth Token Management
import { supabaseAdmin } from '@/lib/platform/supabase';

export interface ProviderToken {
  id: string;
  provider: string;
  user_id: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  updated_at?: string;
  token_expires_at?: string;
}

export async function getValidGoogleToken(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('provider_tokens')
      .select('access_token, refresh_token, token_expires_at')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .single();

    if (error || !data) return null;

    // Check if token is expired
    if (data.token_expires_at && new Date(data.token_expires_at) < new Date()) {
      // Token expired - would need to refresh using refresh_token
      // For now, return null to trigger re-auth
      console.warn('Google token expired for user:', userId);
      return null;
    }

    return data.access_token;
  } catch {
    return null;
  }
}

export async function saveProviderTokens(
  userId: string | any,
  provider?: string,
  accessToken?: string,
  refreshToken?: string,
  expiresIn?: number
): Promise<{ success: boolean; error?: string }> {
  if (typeof userId === 'object') {
    const params = userId;
    userId = params.userId;
    provider = params.provider;
    accessToken = params.providerToken || params.accessToken;
    refreshToken = params.providerRefreshToken || params.refreshToken;
    expiresIn = params.expiresIn;
  }

  try {
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : undefined;

    const { error } = await supabaseAdmin.from('provider_tokens').upsert(
      {
        user_id: userId,
        provider,
        access_token: accessToken,
        refresh_token: refreshToken,
        token_expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,provider' }
    );

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function getAllProviderTokens(
  userId: string
): Promise<{ data: ProviderToken[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('provider_tokens')
      .select('*')
      .eq('user_id', userId);

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as ProviderToken[], error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function deleteProviderTokens(
  userId: string,
  provider: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabaseAdmin
      .from('provider_tokens')
      .delete()
      .eq('user_id', userId)
      .eq('provider', provider);

    if (error) return { error: new Error(error.message) };
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err : new Error('Unknown error') };
  }
}
