export const getDataService = async () => {
    return {
        getAllUsers: async () => [],
        getSessions: async (_userId?: string) => [],
        getReports: async (_userId?: string) => [],
        getDonations: async (_userId: string) => [],
        updateUser: async (_userId: string, _data: any) => ({ success: true }),
    };
};
