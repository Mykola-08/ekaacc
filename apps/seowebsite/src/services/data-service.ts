import type { User, Session, Report, Donation } from '@/lib/platform/types';

export interface DataService {
    getAllUsers: () => Promise<User[]>;
    getSessions: (userId?: string) => Promise<Session[]>;
    getReports: (userId?: string) => Promise<Report[]>;
    getDonations: (userId: string) => Promise<Donation[]>;
    updateUser: (userId: string, data: Partial<User>) => Promise<{ success: boolean }>;
}

export const getDataService = async (): Promise<DataService> => {
    return {
        getAllUsers: async () => [],
        getSessions: async (_userId?: string) => [],
        getReports: async (_userId?: string) => [],
        getDonations: async (_userId: string) => [],
        updateUser: async (_userId: string, _data: Partial<User>) => ({ success: true }),
    };
};
