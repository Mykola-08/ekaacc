export interface SyncOptions {
    batchSize?: number;
    startDate?: Date;
    endDate?: Date;
}

export interface SyncResult {
    success: boolean;
    imported: number;
    updated: number;
    errors: string[];
    duration: number;
}

export const squareAppointmentsService = {
    getSyncStatus: async () => ({ lastSync: new Date().toISOString(), connected: true }),
    syncBookings: async (options: SyncOptions): Promise<SyncResult> => ({ success: true, imported: 0, updated: 0, errors: [], duration: 0 }),
    syncCustomers: async (options: SyncOptions): Promise<SyncResult> => ({ success: true, imported: 0, updated: 0, errors: [], duration: 0 }),
    testConnection: async () => true,
    processBooking: async (_data: any) => ({ success: true }),
    processCustomer: async (_data: any) => ({ success: true }),
};
