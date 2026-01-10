export interface ProviderToken {
    id: string;
    provider: string;
    user_id: string;
    access_token: string;
    refresh_token?: string;
    expires_at?: string;
}

export async function getValidGoogleToken(_userId: string): Promise<string> {
    return 'mock-token';
}

export async function saveProviderTokens(..._args: any[]) {
    // Stub
}

export async function getAllProviderTokens(_userId: string): Promise<ProviderToken[]> {
    return [];
}

export async function deleteProviderTokens(_userId: string, _provider: string): Promise<void> {
    // Stub
}
