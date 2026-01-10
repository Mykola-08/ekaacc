export const bidirectionalSyncService = {
  getSyncStatistics: async () => [],
  getPendingConflicts: async () => [],
  getSyncQueue: async (limit: number) => [],
  syncBidirectional: async (options: any) => ({ 
    success: true, 
    conflict: false, 
    isNew: false, 
    isUpdated: false, 
    data: null 
  }),
  resolveConflict: async (id: string, resolution: any) => ({ success: true }),
  retryQueueItem: async (id: string) => ({ success: true }),
  healthCheck: async () => true,
  processInboundBooking: async (_data: any, _options: any) => ({ 
    success: true, 
    conflict: false, 
    isNew: false, 
    isUpdated: false, 
    data: null 
  }),
  processInboundCustomer: async (_data: any, _options: any) => ({ 
    success: true, 
    conflict: false, 
    isNew: false, 
    isUpdated: false, 
    data: null 
  }),
  getSyncMetadataByExternalId: async (_externalId: string, _type: string) => ({ local_id: '', external_id: '', type: '' }),
  updateAppointmentStatus: async (_localId: string, _status: string) => ({ success: true }),
  updateSyncMetadataStatus: async (_localId: string, _status: string) => ({ success: true }),
  updateUserProfileTimestamp: async (_localId: string) => ({ success: true }),
  recordSyncStatistics: async (_stats: any) => ({ success: true }),
};
