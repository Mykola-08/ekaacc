'use client';

export type UserPreferences = {
  goals?: string[];
  interests?: string[];
  values?: string[];
  preferences?: Record<string, any>;
};

export async function savePreferences(userId: string, prefs: UserPreferences): Promise<void> {
  console.log('Stub savePreferences', { userId, prefs });
}