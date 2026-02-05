export const bidirectionalSyncService = {
  syncBooking: async (data: any) => {},
  syncCustomer: async (data: any) => {},
  processInboundBooking: async (data: any, options: any) => { 
      return { status: 'success', isNew: true, conflict: false, isUpdated: false }; 
  },
  getSyncMetadataByExternalId: async (id: string, type: string) => { return { local_id: '123' }; },
  updateAppointmentStatus: async (id: string, status: string) => {},
  updateSyncMetadataStatus: async (id: string, status: string) => {},
  processInboundCustomer: async (data: any, options: any) => { 
      return { status: 'success', isNew: true, conflict: false, isUpdated: false }; 
  },
  updateUserProfileTimestamp: async (id: string) => {},
  recordSyncStatistics: async (stats: any) => {}
};