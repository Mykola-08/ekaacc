// Theme management service

import {
  Theme,
  UserThemePreference,
  ThemeMode,
  SubscriptionType,
  DEFAULT_THEMES,
} from '@/lib/subscription-types';

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
  private themes: Theme[] = [];
  private userPreferences: Map<string, UserThemePreference> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize themes
    this.themes = DEFAULT_THEMES.map((theme, index) => ({
      ...theme,
      id: `theme-${theme.name}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Add more premium themes
    const premiumThemes: Omit<Theme, 'id' | 'createdAt' | 'updatedAt'>[] = [
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

    premiumThemes.forEach((theme, index) => {
      this.themes.push({
        ...theme,
        id: `theme-${theme.name}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    // Initialize user preferences
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

    console.log('🎨 Mock Theme Service initialized with themes:', this.themes.length);
  }

  async getAllThemes(): Promise<Theme[]> {
    return this.themes.filter(t => t.isActive);
  }

  async getTheme(id: string): Promise<Theme | null> {
    return this.themes.find(t => t.id === id) || null;
  }

  async getPublicThemes(): Promise<Theme[]> {
    return this.themes.filter(t => t.isPublic && t.isActive);
  }

  async getSubscriptionThemes(subscriptionType: SubscriptionType): Promise<Theme[]> {
    return this.themes.filter(
      t => t.requiredSubscription === subscriptionType && t.isActive
    );
  }

  async getUserAvailableThemes(userId: string): Promise<Theme[]> {
    // Import subscription service dynamically to avoid circular dependency
    const { getSubscriptionService } = await import('./subscription-service');
    const subService = await getSubscriptionService();
    const summary = await subService.getUserSubscriptionSummary(userId);

    // Start with public themes
    let availableThemes = await this.getPublicThemes();

    // Add loyalty themes if user has loyalty subscription
    if (summary.hasLoyalty) {
      const loyaltyThemes = await this.getSubscriptionThemes('loyalty');
      availableThemes = [...availableThemes, ...loyaltyThemes];
    }

    // Add VIP themes if user has VIP subscription
    if (summary.hasVIP) {
      const vipThemes = await this.getSubscriptionThemes('vip');
      availableThemes = [...availableThemes, ...vipThemes];
    }

    // Remove duplicates
    const uniqueThemes = availableThemes.filter(
      (theme, index, self) => index === self.findIndex(t => t.id === theme.id)
    );

    return uniqueThemes;
  }

  async getUserThemePreference(userId: string): Promise<UserThemePreference | null> {
    return this.userPreferences.get(userId) || null;
  }

  async setUserTheme(userId: string, themeId: string): Promise<void> {
    // Validate theme access
    const canAccess = await this.canUserAccessTheme(userId, themeId);
    if (!canAccess) {
      throw new Error('User does not have access to this theme');
    }

    let preference = this.userPreferences.get(userId);
    
    if (!preference) {
      preference = {
        userId,
        currentTheme: themeId,
        themeMode: 'auto',
        updatedAt: new Date().toISOString(),
      };
    } else {
      preference.currentTheme = themeId;
      preference.updatedAt = new Date().toISOString();
    }

    this.userPreferences.set(userId, preference);
    console.log(`🎨 User ${userId} changed theme to ${themeId}`);
  }

  async setThemeMode(userId: string, mode: ThemeMode): Promise<void> {
    let preference = this.userPreferences.get(userId);
    
    if (!preference) {
      preference = {
        userId,
        currentTheme: 'theme-default',
        themeMode: mode,
        updatedAt: new Date().toISOString(),
      };
    } else {
      preference.themeMode = mode;
      preference.updatedAt = new Date().toISOString();
    }

    this.userPreferences.set(userId, preference);
    console.log(`🌓 User ${userId} changed theme mode to ${mode}`);
  }

  async canUserAccessTheme(userId: string, themeId: string): Promise<boolean> {
    const theme = await this.getTheme(themeId);
    if (!theme) return false;

    // Public themes are always accessible
    if (theme.isPublic) return true;

    // Check if user has required subscription
    if (theme.requiredSubscription) {
      const { getSubscriptionService } = await import('./subscription-service');
      const subService = await getSubscriptionService();
      const hasSubscription = await subService.hasActiveSubscription(
        userId,
        theme.requiredSubscription
      );
      return hasSubscription;
    }

    return false;
  }
}

// ============================================================================
// Firestore Implementation
// ============================================================================

export class FirestoreThemeService implements IThemeService {
  async getAllThemes(): Promise<Theme[]> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async getTheme(id: string): Promise<Theme | null> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async getPublicThemes(): Promise<Theme[]> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async getSubscriptionThemes(subscriptionType: SubscriptionType): Promise<Theme[]> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async getUserAvailableThemes(userId: string): Promise<Theme[]> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async getUserThemePreference(userId: string): Promise<UserThemePreference | null> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async setUserTheme(userId: string, themeId: string): Promise<void> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async setThemeMode(userId: string, mode: ThemeMode): Promise<void> {
    throw new Error('Firestore implementation requires Cloud Functions');
  }

  async canUserAccessTheme(userId: string, themeId: string): Promise<boolean> {
    throw new Error('Firestore implementation requires Cloud Functions');
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
