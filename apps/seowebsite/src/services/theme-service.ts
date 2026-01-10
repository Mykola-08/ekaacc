import type { Theme } from '@/lib/platform/subscription-types';

export interface IThemeService {
    getAllThemes(): Promise<Theme[]>;
    getUserThemePreference(userId: string): Promise<{ currentTheme: string } | null>;
}

export const getThemeService = async (): Promise<IThemeService> => {
    return {
        getAllThemes: async () => [],
        getUserThemePreference: async (userId: string) => null,
    };
};
