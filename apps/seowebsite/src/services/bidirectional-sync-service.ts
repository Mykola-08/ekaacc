export interface SyncStatistic {
  id: string;
  timestamp: string;
  date?: string; // Alias for dashboard compatibility
  imported: number;
  exported: number;
  errors: number;
  externalSystem?: string;
  external_system?: string; // Snake case alias
  entityType?: string;
  entity_type?: string; // Snake case alias
  syncDirection?: string;
  sync_direction?: string; // Snake case alias
  operation?: string;
  success?: boolean;
  conflict?: boolean;
  syncTimeMs?: number | null;
  avg_sync_time_ms?: number; // Dashboard compatible
  total_operations?: number; // Dashboard compatible  
  success_count?: number; // Dashboard compatible
  failure_count?: number; // Dashboard compatible
  conflict_count?: number; // Dashboard compatible
}

export interface SyncConflict {
  id: string;
  type: string;
  entity_type?: string; // Dashboard alias
  local_data: unknown;
  external_data: unknown;
  local_id?: string;
  external_id?: string;
  conflict_type?: string;
  conflict_data?: unknown;
  created_at: string;
  resolved_at?: string | null;
  resolution_strategy?: string | null;
}

export interface SyncQueueItem {
  id: string;
  type: string;
  entity_type?: string;
  entity_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  data: unknown;
  direction?: string;
  external_system?: string;
  created_at: string;
  scheduled_at?: string;
  processed_at?: string | null;
  error_message?: string | null;
  retry_count?: number;
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

export interface SyncOptions {
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
