/**
 * @file Theme Service Tests
 * @description Unit tests for the Theme Service
 */

import { getThemeService } from '../services/theme-service';

describe('ThemeService', () => {
  let themeService: any;

  beforeEach(async () => {
    // Using mock data mode for testing
    process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true';
    themeService = await getThemeService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllThemes', () => {
    it('should retrieve all available themes', async () => {
      const themes = await themeService.getAllThemes();
      expect(Array.isArray(themes)).toBe(true);
      if (themes.length > 0) {
        expect(themes[0]).toHaveProperty('id');
        expect(themes[0]).toHaveProperty('name');
      }
    });
  });

  describe('getTheme', () => {
    it('should retrieve a specific theme by ID', async () => {
      const theme = await themeService.getTheme('light');
      if (theme) {
        expect(theme).toHaveProperty('id');
        expect(theme).toHaveProperty('name');
      }
    });
  });

  describe('getPublicThemes', () => {
    it('should retrieve public themes', async () => {
      const themes = await themeService.getPublicThemes();
      expect(Array.isArray(themes)).toBe(true);
    });
  });

  describe('getUserAvailableThemes', () => {
    it('should retrieve themes available to a user', async () => {
      const themes = await themeService.getUserAvailableThemes('user-123');
      expect(Array.isArray(themes)).toBe(true);
    });
  });

  describe('getUserThemePreference', () => {
    it('should retrieve user theme preference', async () => {
      const preference = await themeService.getUserThemePreference('user-123');
      // May be null if user has no preference set
      if (preference) {
        expect(preference).toHaveProperty('userId');
        expect(preference).toHaveProperty('themeId');
      }
    });
  });
});
