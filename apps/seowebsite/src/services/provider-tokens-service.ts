export interface ProviderToken {
    id: string;
    provider: string;
    user_id: string;
    access_token: string;
    refresh_token?: string;
    expires_at?: string;
    updated_at?: string;
    token_expires_at?: string;
    scopes?: string[] | null;
}

export interface SaveProviderTokensParams {
    userId: string;
    provider: string;
    providerToken: string | null;
    providerRefreshToken?: string | null;
    expiresIn?: number;
}

export async function getValidGoogleToken(_userId: string): Promise<string> {
    return 'mock-token';
}

export async function saveProviderTokens(
    params: SaveProviderTokensParams
): Promise<void> {
    // Stub implementation
    console.log('saveProviderTokens called with:', params.userId, params.provider);
}

export async function getAllProviderTokens(_userId: string): Promise<{ data: ProviderToken[] | null, error: Error | null }> {
    return { data: [], error: null };
}

export async function deleteProviderTokens(_userId: string, _provider: string): Promise<{ error: Error | null }> {
    return { error: null };
}
