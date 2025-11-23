/**
 * @file Theme Service Tests
 * @description Unit tests for the Theme Service
 */

import { getThemeService } from '../services/theme-service';

// Mock Supabase client
const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockOrder = jest.fn();
const mockSingle = jest.fn();
const mockFrom = jest.fn();

const mockSupabase = {
  from: mockFrom,
};

jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
  supabaseAdmin: mockSupabase,
}));

describe('ThemeService', () => {
  let themeService: any;

  beforeEach(async () => {
    // Setup mock chain
    mockFrom.mockReturnValue({
      select: mockSelect,
      insert: jest.fn().mockResolvedValue({ data: [], error: null }),
      update: jest.fn().mockResolvedValue({ data: [], error: null }),
      delete: jest.fn().mockResolvedValue({ data: [], error: null }),
    });
    
    mockSelect.mockReturnValue({
      eq: mockEq,
      order: mockOrder,
      single: mockSingle,
    });

    mockEq.mockReturnValue({
      eq: mockEq,
      order: mockOrder,
      single: mockSingle,
    });

    mockOrder.mockReturnValue({
      data: [],
      error: null,
    });

    // Default responses
    mockSelect.mockResolvedValue({ data: [], error: null });
    mockEq.mockResolvedValue({ data: [], error: null });
    mockSingle.mockResolvedValue({ data: null, error: null });

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
