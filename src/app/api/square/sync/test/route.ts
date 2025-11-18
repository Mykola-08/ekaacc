import { NextRequest, NextResponse } from 'next/server';
import { bidirectionalSyncService } from '@/services/bidirectional-sync-service';
import { isSquareAppointmentsEnabled, isSquareSyncEnabled } from '@/lib/feature-flags';

/**
 * API endpoint for testing bidirectional sync functionality
 * GET: Get sync status and statistics
 * POST: Trigger manual sync with options
 */

export async function GET(req: NextRequest) {
  try {
    // Check if features are enabled
    if (!isSquareAppointmentsEnabled() || !isSquareSyncEnabled()) {
      return NextResponse.json(
        { 
          error: 'Square Appointments sync is disabled',
          enabled: false,
          appointmentsEnabled: isSquareAppointmentsEnabled(),
          syncEnabled: isSquareSyncEnabled()
        },
        { status: 503 }
      );
    }

    // Get health status
    const isHealthy = await bidirectionalSyncService.healthCheck();

    // Get sync statistics
    const statistics = await bidirectionalSyncService.getSyncStatistics();

    // Get pending conflicts
    const conflicts = await bidirectionalSyncService.getPendingConflicts();

    // Get recent queue items
    const queueItems = await bidirectionalSyncService.getSyncQueue(10);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      health: {
        status: isHealthy ? 'healthy' : 'unhealthy',
        message: isHealthy ? 'All systems operational' : 'Connection issues detected'
      },
      statistics: {
        totalRecords: statistics?.length || 0,
        recentStats: statistics?.slice(0, 7) || []
      },
      conflicts: {
        total: conflicts?.length || 0,
        pending: conflicts?.filter(c => !c.resolved_at).length || 0
      },
      queue: {
        total: queueItems?.length || 0,
        pending: queueItems?.filter(q => q.status === 'pending').length || 0,
        failed: queueItems?.filter(q => q.status === 'failed').length || 0
      }
    });

  } catch (error) {
    console.error('Sync status check failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check sync status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if features are enabled
    if (!isSquareAppointmentsEnabled() || !isSquareSyncEnabled()) {
      return NextResponse.json(
        { 
          error: 'Square Appointments sync is disabled',
          enabled: false
        },
        { status: 503 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { 
      direction = 'bidirectional',
      batchSize = 50,
      conflictResolution = 'merge',
      startDate,
      endDate,
      locationId,
      teamMemberId,
      customerId
    } = body;

    // Validate direction
    const validDirections = ['inbound', 'outbound', 'bidirectional'];
    if (!validDirections.includes(direction)) {
      return NextResponse.json(
        { 
          error: 'Invalid direction. Must be one of: inbound, outbound, bidirectional',
          validDirections
        },
        { status: 400 }
      );
    }

    // Validate conflict resolution
    const validResolutions = ['local_wins', 'external_wins', 'merge', 'manual'];
    if (!validResolutions.includes(conflictResolution)) {
      return NextResponse.json(
        { 
          error: 'Invalid conflict resolution. Must be one of: local_wins, external_wins, merge, manual',
          validResolutions
        },
        { status: 400 }
      );
    }

    // Build sync options
    const syncOptions = {
      direction: direction as 'inbound' | 'outbound' | 'bidirectional',
      batchSize,
      conflictResolution: conflictResolution as 'local_wins' | 'external_wins' | 'merge' | 'manual',
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
      ...(locationId && { locationId }),
      ...(teamMemberId && { teamMemberId }),
      ...(customerId && { customerId })
    };

    console.log('Starting manual sync with options:', syncOptions);

    // Execute sync
    const startTime = Date.now();
    const result = await bidirectionalSyncService.syncBidirectional(syncOptions);
    const duration = Date.now() - startTime;

    console.log('Manual sync completed:', {
      success: result.success,
      imported: result.imported,
      exported: result.exported,
      updated: result.updated,
      conflicts: result.conflicts,
      errors: result.errors.length,
      duration
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      syncOptions,
      result: {
        ...result,
        duration
      },
      message: result.success 
        ? `Sync completed successfully in ${duration}ms`
        : `Sync completed with ${result.errors.length} errors in ${duration}ms`
    });

  } catch (error) {
    console.error('Manual sync failed:', error);
    return NextResponse.json(
      { 
        error: 'Manual sync failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}