import type { Theme } from '@/lib/platform/subscription-types';

export interface IThemeService {
    getAllThemes(): Promise<Theme[]>;
    getUserThemePreference(userId: string): Promise<{ currentTheme: string } | null>;
    setUserTheme(userId: string, theme: string): Promise<void>;
}

export const getThemeService = async (): Promise<IThemeService> => {
    return {
        getAllThemes: async () => [],
        getUserThemePreference: async (_userId: string) => null,
        setUserTheme: async (_userId: string, _theme: string) => {
            console.warn("setUserTheme called (stub)");
        },
    };
};
