export const bidirectionalSyncService = {
  getSyncStatistics: async () => [],
  getPendingConflicts: async () => [],
  getSyncQueue: async (limit: number) => [],
  syncBidirectional: async (options: any) => ({ success: true }),
  resolveConflict: async (id: string, resolution: any) => ({ success: true }),
  retryQueueItem: async (id: string) => ({ success: true }),
};
