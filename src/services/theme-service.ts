// Theme management service

import {
  Theme,
  UserThemePreference,
  ThemeMode,
  SubscriptionType,
  DEFAULT_THEMES,
} from '@/lib/subscription-types';
import { getDb } from '@/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import {
  getUserThemePreference as fetchUserThemePreference,
  setUserThemePreference as persistUserThemePreference,
} from '@/firebase/firestore/subscriptions';

// ============================================================================
// Helpers
// ============================================================================

const ADDITIONAL_THEME_DEFINITIONS: Omit<Theme, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'forest',
    displayName: 'Forest Green',
    description: 'Natural forest theme with earthy tones',
    category: 'premium',
    isPublic: false,
    requiredSubscription: 'loyalty',
    colors: {
      primary: '#10b981',
      primaryForeground: '#ffffff',
      secondary: '#d1fae5',
      secondaryForeground: '#064e3b',
      background: '#f0fdf4',
      foreground: '#064e3b',
      muted: '#d1fae5',
      mutedForeground: '#047857',
      accent: '#6ee7b7',
      accentForeground: '#064e3b',
      destructive: '#dc2626',
      destructiveForeground: '#ffffff',
      border: '#a7f3d0',
      input: '#a7f3d0',
      ring: '#10b981',
      card: '#ffffff',
      cardForeground: '#064e3b',
      popover: '#ffffff',
      popoverForeground: '#064e3b',
    },
    isActive: true,
    order: 4,
    featured: false,
  },
  {
    name: 'midnight',
    displayName: 'Midnight Purple',
    description: 'Deep purple theme for night owls',
    category: 'premium',
    isPublic: false,
    requiredSubscription: 'vip',
    colors: {
      primary: '#8b5cf6',
      primaryForeground: '#ffffff',
      secondary: '#1e1b4b',
      secondaryForeground: '#e0e7ff',
      background: '#0f172a',
      foreground: '#e2e8f0',
      muted: '#1e293b',
      mutedForeground: '#94a3b8',
      accent: '#312e81',
      accentForeground: '#e0e7ff',
      destructive: '#ef4444',
      destructiveForeground: '#ffffff',
      border: '#334155',
      input: '#334155',
      ring: '#8b5cf6',
      card: '#1e293b',
      cardForeground: '#e2e8f0',
      popover: '#1e293b',
      popoverForeground: '#e2e8f0',
    },
    isActive: true,
    order: 5,
    featured: true,
  },
  {
    name: 'rose',
    displayName: 'Rose Garden',
    description: 'Elegant rose-themed design',
    category: 'premium',
    isPublic: false,
    requiredSubscription: 'vip',
    colors: {
      primary: '#f43f5e',
      primaryForeground: '#ffffff',
      secondary: '#ffe4e6',
      secondaryForeground: '#881337',
      background: '#fff1f2',
      foreground: '#881337',
      muted: '#ffe4e6',
      mutedForeground: '#9f1239',
      accent: '#fda4af',
      accentForeground: '#881337',
      destructive: '#dc2626',
      destructiveForeground: '#ffffff',
      border: '#fecdd3',
      input: '#fecdd3',
      ring: '#f43f5e',
      card: '#ffffff',
      cardForeground: '#881337',
      popover: '#ffffff',
      popoverForeground: '#881337',
    },
    isActive: true,
    order: 6,
    featured: false,
  },
];

function normalizeTimestamp(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return undefined;
}

function createThemeRecord(
  definition: Omit<Theme, 'id' | 'createdAt' | 'updatedAt'>,
  index: number
): Theme {
  const timestamp = new Date(Date.now() - index * 1000).toISOString();
  return {
    ...definition,
    id: `theme-${definition.name}`,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function buildThemeCatalogue(): Theme[] {
  const definitions = [...DEFAULT_THEMES, ...ADDITIONAL_THEME_DEFINITIONS];
  return definitions.map((definition, index) => createThemeRecord(definition, index));
}

function convertFirestoreTheme(id: string, data: Partial<Theme>): Theme {
  const fallbackColors = DEFAULT_THEMES[0]?.colors ?? ADDITIONAL_THEME_DEFINITIONS[0].colors;
  const createdAt = normalizeTimestamp(data.createdAt) ?? new Date().toISOString();
  const updatedAt = normalizeTimestamp(data.updatedAt) ?? createdAt;

  return {
    id,
    name: data.name ?? id,
    displayName: data.displayName ?? data.name ?? id,
    description: data.description ?? '',
    category: data.category ?? 'default',
    isPublic: data.isPublic ?? false,
    requiredSubscription: data.requiredSubscription,
    requiredSubscriptionActive: data.requiredSubscriptionActive ?? false,
    colors: data.colors ?? fallbackColors,
    previewImage: data.previewImage,
    thumbnailImage: data.thumbnailImage,
    author: data.author,
    version: data.version,
    createdAt,
    updatedAt,
    isActive: data.isActive ?? true,
    order: data.order ?? 0,
    featured: data.featured ?? false,
  };
}

// ============================================================================
// Service Interface
// ============================================================================

export interface IThemeService {
  // Theme CRUD
  getAllThemes(): Promise<Theme[]>;
  getTheme(id: string): Promise<Theme | null>;
  getPublicThemes(): Promise<Theme[]>;
  getSubscriptionThemes(subscriptionType: SubscriptionType): Promise<Theme[]>;
  getUserAvailableThemes(userId: string): Promise<Theme[]>;

  // User preferences
  getUserThemePreference(userId: string): Promise<UserThemePreference | null>;
  setUserTheme(userId: string, themeId: string): Promise<void>;
  setThemeMode(userId: string, mode: ThemeMode): Promise<void>;

  // Theme validation
  canUserAccessTheme(userId: string, themeId: string): Promise<boolean>;
}

// ============================================================================
// Mock Implementation
// ============================================================================

export class MockThemeService implements IThemeService {
  private themes: Theme[] = buildThemeCatalogue();
  private userPreferences: Map<string, UserThemePreference> = new Map();

  constructor() {
    const defaultPreference: UserThemePreference = {
      userId: 'test-user',
      currentTheme: 'theme-ocean',
      themeMode: 'auto',
      autoSwitchTheme: true,
      lightThemeId: 'theme-default',
      darkThemeId: 'theme-midnight',
      updatedAt: new Date().toISOString(),
    };

    this.userPreferences.set('test-user', defaultPreference);
    console.log('🎨 Mock Theme Service initialised with themes:', this.themes.length);
  }

  async getAllThemes(): Promise<Theme[]> {
    return this.themes.filter(theme => theme.isActive !== false);
  }

  async getTheme(id: string): Promise<Theme | null> {
    return this.themes.find(theme => theme.id === id) ?? null;
  }

  async getPublicThemes(): Promise<Theme[]> {
    return this.themes.filter(theme => theme.isPublic && theme.isActive !== false);
  }

  async getSubscriptionThemes(subscriptionType: SubscriptionType): Promise<Theme[]> {
    return this.themes.filter(
      theme => theme.requiredSubscription === subscriptionType && theme.isActive !== false
    );
  }

  async getUserAvailableThemes(userId: string): Promise<Theme[]> {
    const { getSubscriptionService } = await import('./subscription-service');
    const subService = await getSubscriptionService();
    const summary = await subService.getUserSubscriptionSummary(userId);

    const baseThemes = await this.getPublicThemes();
    const loyaltyThemes = summary.hasLoyalty ? await this.getSubscriptionThemes('loyalty') : [];
    const vipThemes = summary.hasVIP ? await this.getSubscriptionThemes('vip') : [];

    const combined = [...baseThemes, ...loyaltyThemes, ...vipThemes];
    return combined.filter(
      (theme, index, self) => theme.isActive !== false && index === self.findIndex(t => t.id === theme.id)
    );
  }

  async getUserThemePreference(userId: string): Promise<UserThemePreference | null> {
    return this.userPreferences.get(userId) ?? null;
  }

  async setUserTheme(userId: string, themeId: string): Promise<void> {
    const canAccess = await this.canUserAccessTheme(userId, themeId);
    if (!canAccess) {
      throw new Error('User does not have access to this theme');
    }

    const existing = this.userPreferences.get(userId);
    const preference: UserThemePreference = {
      ...(existing ?? {}),
      userId,
      currentTheme: themeId,
      themeMode: existing?.themeMode ?? 'auto',
      autoSwitchTheme: existing?.autoSwitchTheme,
      lightThemeId: existing?.lightThemeId,
      darkThemeId: existing?.darkThemeId,
      customThemes: existing?.customThemes,
      updatedAt: new Date().toISOString(),
    };

    this.userPreferences.set(userId, preference);
    console.log(`🎨 User ${userId} changed theme to ${themeId}`);
  }

  async setThemeMode(userId: string, mode: ThemeMode): Promise<void> {
    const existing = this.userPreferences.get(userId);
    const preference: UserThemePreference = {
      ...(existing ?? {}),
      userId,
      currentTheme: existing?.currentTheme ?? 'theme-default',
      themeMode: mode,
      autoSwitchTheme: existing?.autoSwitchTheme,
      lightThemeId: existing?.lightThemeId,
      darkThemeId: existing?.darkThemeId,
      customThemes: existing?.customThemes,
      updatedAt: new Date().toISOString(),
    };

    this.userPreferences.set(userId, preference);
    console.log(`🌓 User ${userId} changed theme mode to ${mode}`);
  }

  async canUserAccessTheme(userId: string, themeId: string): Promise<boolean> {
    const theme = await this.getTheme(themeId);
    if (!theme) return false;

    if (theme.isPublic) return true;
    if (!theme.requiredSubscription) return false;

    const { getSubscriptionService } = await import('./subscription-service');
    const subService = await getSubscriptionService();
    return subService.hasActiveSubscription(userId, theme.requiredSubscription);
  }
}

// ============================================================================
// Firestore Implementation
// ============================================================================

export class FirestoreThemeService implements IThemeService {
  private themeCache: Theme[] | null = null;

  private async ensureThemes(): Promise<Theme[]> {
    if (this.themeCache) {
      return this.themeCache;
    }

    try {
      const db = getDb();
      const snapshot = await getDocs(collection(db, 'themes'));
      const themes = snapshot.docs.map(doc => convertFirestoreTheme(doc.id, doc.data() as Partial<Theme>));

      if (themes.length) {
        this.themeCache = themes.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        return this.themeCache;
      }
    } catch (error) {
      console.warn('Failed to load themes from Firestore, using fallback catalogue.', error);
    }

    this.themeCache = buildThemeCatalogue();
    return this.themeCache;
  }

  async getAllThemes(): Promise<Theme[]> {
    const themes = await this.ensureThemes();
    return themes.filter(theme => theme.isActive !== false);
  }

  async getTheme(id: string): Promise<Theme | null> {
    const themes = await this.ensureThemes();
    return themes.find(theme => theme.id === id) ?? null;
  }

  async getPublicThemes(): Promise<Theme[]> {
    const themes = await this.ensureThemes();
    return themes.filter(theme => theme.isPublic && theme.isActive !== false);
  }

  async getSubscriptionThemes(subscriptionType: SubscriptionType): Promise<Theme[]> {
    const themes = await this.ensureThemes();
    return themes.filter(
      theme => theme.requiredSubscription === subscriptionType && theme.isActive !== false
    );
  }

  async getUserAvailableThemes(userId: string): Promise<Theme[]> {
    const themes = await this.ensureThemes();
    if (!userId) {
      return themes.filter(theme => theme.isPublic && theme.isActive !== false);
    }

    const { getSubscriptionService } = await import('./subscription-service');
    const subService = await getSubscriptionService();
    const [hasLoyalty, hasVip] = await Promise.all([
      subService.hasActiveSubscription(userId, 'loyalty'),
      subService.hasActiveSubscription(userId, 'vip'),
    ]);

    return themes.filter(theme => {
      if (theme.isActive === false) return false;
      if (theme.isPublic) return true;
      if (theme.requiredSubscription === 'loyalty') {
        return hasLoyalty || hasVip;
      }
      if (theme.requiredSubscription === 'vip') {
        return hasVip;
      }
      return false;
    });
  }

  async getUserThemePreference(userId: string): Promise<UserThemePreference | null> {
    const preference = await fetchUserThemePreference(userId);
    if (!preference) return null;

    return {
      ...preference,
      updatedAt: normalizeTimestamp(preference.updatedAt) ?? new Date().toISOString(),
    };
  }

  async setUserTheme(userId: string, themeId: string): Promise<void> {
    const canAccess = await this.canUserAccessTheme(userId, themeId);
    if (!canAccess) {
      throw new Error('User does not have access to this theme');
    }

    const existing = await fetchUserThemePreference(userId);
    const preference: UserThemePreference = {
      ...(existing ?? {}),
      userId,
      currentTheme: themeId,
      themeMode: existing?.themeMode ?? 'auto',
      autoSwitchTheme: existing?.autoSwitchTheme,
      lightThemeId: existing?.lightThemeId,
      darkThemeId: existing?.darkThemeId,
      customThemes: existing?.customThemes,
      updatedAt: new Date().toISOString(),
    };

    await persistUserThemePreference(userId, preference);
  }

  async setThemeMode(userId: string, mode: ThemeMode): Promise<void> {
    const existing = await fetchUserThemePreference(userId);
    const preference: UserThemePreference = {
      ...(existing ?? {}),
      userId,
      currentTheme: existing?.currentTheme ?? 'theme-default',
      themeMode: mode,
      autoSwitchTheme: existing?.autoSwitchTheme,
      lightThemeId: existing?.lightThemeId,
      darkThemeId: existing?.darkThemeId,
      customThemes: existing?.customThemes,
      updatedAt: new Date().toISOString(),
    };

    await persistUserThemePreference(userId, preference);
  }

  async canUserAccessTheme(userId: string, themeId: string): Promise<boolean> {
    const theme = await this.getTheme(themeId);
    if (!theme) return false;

    if (theme.isPublic) return true;
    if (!theme.requiredSubscription) return false;

    const { getSubscriptionService } = await import('./subscription-service');
    const subService = await getSubscriptionService();
    return subService.hasActiveSubscription(userId, theme.requiredSubscription);
  }
}

// ============================================================================
// Service Singleton
// ============================================================================

let themeServiceInstance: IThemeService | null = null;

export async function getThemeService(): Promise<IThemeService> {
  if (!themeServiceInstance) {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
    themeServiceInstance = useMock
      ? new MockThemeService()
      : new FirestoreThemeService();
  }
  return themeServiceInstance;
}
