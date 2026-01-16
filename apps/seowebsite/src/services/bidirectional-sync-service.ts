interface SyncStatistic {
  id: string;
  timestamp: string;
  imported: number;
  exported: number;
  errors: number;
  externalSystem?: string;
  entityType?: string;
  syncDirection?: string;
  operation?: string;
  success?: boolean;
  conflict?: boolean;
  syncTimeMs?: number | null;
}

interface SyncConflict {
  id: string;
  type: string;
  local_data: unknown;
  external_data: unknown;
  created_at: string;
  resolved_at?: string;
}

interface SyncQueueItem {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  data: unknown;
  created_at: string;
}

interface SyncResult {
  success: boolean;
  conflict: boolean;
  isNew: boolean;
  isUpdated: boolean;
  data: unknown;
  imported: number;
  exported: number;
  updated: number;
  errors: string[];
}

interface SyncOptions {
  source?: string;
  direction?: 'inbound' | 'outbound' | 'bidirectional';
  conflictResolution?: 'local_wins' | 'external_wins' | 'merge';
}

export const bidirectionalSyncService = {
  getSyncStatistics: async (_limit?: number): Promise<SyncStatistic[]> => [],
  getPendingConflicts: async (_limit?: number): Promise<SyncConflict[]> => [],
  getSyncQueue: async (_limit: number): Promise<SyncQueueItem[]> => [],
  syncBidirectional: async (_options: { fullSync?: boolean; startDate?: string; endDate?: string }): Promise<SyncResult> => ({ 
    success: true, 
    conflict: false, 
    isNew: false, 
    isUpdated: false, 
    data: null,
    imported: 0,
    exported: 0,
    updated: 0,
    errors: []
  }),
  resolveConflict: async (_id: string, _resolution: 'local' | 'external' | 'merge'): Promise<{ success: boolean }> => ({ success: true }),
  retryQueueItem: async (_id: string): Promise<{ success: boolean }> => ({ success: true }),
  healthCheck: async (): Promise<boolean> => true,
  processInboundBooking: async (_data: unknown, _options: SyncOptions): Promise<SyncResult> => ({ 
    success: true, 
    conflict: false, 
    isNew: false, 
    isUpdated: false, 
    data: null,
    imported: 0,
    exported: 0,
    updated: 0,
    errors: []
  }),
  processInboundCustomer: async (_data: unknown, _options: SyncOptions): Promise<SyncResult> => ({ 
    success: true, 
    conflict: false, 
    isNew: false, 
    isUpdated: false, 
    data: null,
    imported: 0,
    exported: 0,
    updated: 0,
    errors: []
  }),
  getSyncMetadataByExternalId: async (_externalId: string, _type: string): Promise<{ local_id: string; external_id: string; type: string }> => ({ local_id: '', external_id: '', type: '' }),
  updateAppointmentStatus: async (_localId: string, _status: string): Promise<{ success: boolean }> => ({ success: true }),
  updateSyncMetadataStatus: async (_localId: string, _status: string): Promise<{ success: boolean }> => ({ success: true }),
  updateUserProfileTimestamp: async (_localId: string): Promise<{ success: boolean }> => ({ success: true }),
  recordSyncStatistics: async (_stats: Omit<SyncStatistic, 'id' | 'timestamp'>): Promise<{ success: boolean }> => ({ success: true }),
};
