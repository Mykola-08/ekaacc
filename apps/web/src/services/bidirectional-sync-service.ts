import { SquareClient, SquareEnvironment } from 'square';
import type { Booking as SquareBooking, Customer as SquareCustomer } from 'square';
import type { SearchCustomersRequest, ListBookingsRequest, UpdateBookingRequest, CancelBookingRequest, UpdateCustomerRequest } from 'square';
import { createClient } from '@supabase/supabase-js';
import type { NormalizedBooking } from '@/types/square';
import type { Database } from '@/types/supabase';

/**
 * Bidirectional Sync Service for Square Appointments and Supabase
 * Ensures data consistency between both systems with conflict resolution
 */

export interface SyncOptions {
  batchSize?: number;
  startDate?: Date;
  endDate?: Date;
  locationId?: string;
  teamMemberId?: string;
  customerId?: string;
  direction?: 'inbound' | 'outbound' | 'bidirectional';
  conflictResolution?: 'local_wins' | 'external_wins' | 'merge' | 'manual';
}

export interface SyncResult {
  success: boolean;
  imported: number;
  exported: number;
  updated: number;
  conflicts: number;
  errors: string[];
  duration: number;
  conflictDetails?: SyncConflict[];
}

export interface SyncConflict {
  entityType: 'booking' | 'customer';
  localId: string;
  externalId: string;
  conflictType: 'data_mismatch' | 'deleted_remotely' | 'deleted_locally';
  localData: any;
  externalData: any;
  resolution?: string;
}

export interface SyncMetadata {
  id?: string;
  entity_type: string;
  local_id: string;
  external_id: string;
  external_system: string;
  entity_status: 'active' | 'deleted' | 'archived';
  sync_status: 'pending' | 'synced' | 'error' | 'conflict';
  last_sync_at?: string;
  sync_version: number;
  external_data?: any;
}

type SupabaseClient = ReturnType<typeof createClient<Database>>;

class BidirectionalSyncService {
  private squareClient: SquareClient | null = null;
  private supabaseClient: SupabaseClient | null = null;
  private isConnected = false;

  constructor() {
    this.initializeClients();
  }

  /**
   * Public methods for API routes to access sync metadata and perform updates
   */
  public async getSyncMetadataByExternalId(externalId: string, entityType: string): Promise<any> {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await (this.supabaseClient as any)
      .from('sync_metadata')
      .select('*')
      .eq('entity_type', entityType)
      .eq('external_id', externalId)
      .eq('external_system', 'square')
      .single();

    if (error) {
      throw new Error(`Failed to fetch sync metadata: ${error.message}`);
    }

    return data;
  }

  public async updateAppointmentStatus(appointmentId: string, status: string): Promise<void> {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const { error } = await (this.supabaseClient as any)
      .from('booking')
      .update({ status })
      .eq('id', appointmentId);

    if (error) {
      throw new Error(`Failed to update appointment status: ${error.message}`);
    }
  }

  public async updateSyncMetadataStatus(localId: string, status: 'active' | 'deleted' | 'archived'): Promise<void> {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const { error } = await (this.supabaseClient as any)
      .from('sync_metadata')
      .update({
        entity_status: status,
        last_sync_at: new Date().toISOString(),
      })
      .eq('local_id', localId)
      .eq('external_system', 'square');

    if (error) {
      throw new Error(`Failed to update sync metadata status: ${error.message}`);
    }
  }

  public async updateUserProfileTimestamp(userId: string): Promise<void> {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const { error } = await (this.supabaseClient as any)
      .from('user_profiles')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to update user profile: ${error.message}`);
    }
  }

  public async recordSyncStatistics(params: {
    externalSystem: string;
    entityType: string;
    syncDirection: string;
    operation: string;
    success: boolean;
    conflict: boolean;
    syncTimeMs?: number | null;
  }): Promise<void> {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    try {
      await (this.supabaseClient as any)
        ?.rpc('record_sync_stat', {
          p_external_system: params.externalSystem,
          p_entity_type: params.entityType,
          p_sync_direction: params.syncDirection,
          p_operation: params.operation,
          p_success: params.success,
          p_conflict: params.conflict,
          p_sync_time_ms: params.syncTimeMs ?? null
        });
    } catch (error) {
      console.error('Failed to record sync statistics:', error);
      // Don't throw - statistics failure shouldn't break the sync
    }
  }

  private initializeClients() {
    // Initialize Square client
    const squareToken = process.env.SQUARE_ACCESS_TOKEN;
    const squareEnv = process.env.SQUARE_ENV === 'Production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox;

    if (squareToken) {
      try {
        this.squareClient = new SquareClient({
          environment: squareEnv,
        });
      } catch (error) {
        console.error('Failed to initialize Square client:', error);
      }
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      try {
        this.supabaseClient = createClient<Database>(supabaseUrl, supabaseServiceKey);
      } catch (error) {
        console.error('Failed to initialize Supabase client:', error);
      }
    }

    this.isConnected = !!(this.squareClient && this.supabaseClient);
  }

  /**
   * Main bidirectional sync method
   */
  async syncBidirectional(options: SyncOptions = {}): Promise<SyncResult> {
    if (!this.isConnected) {
      throw new Error('BidirectionalSyncService: Clients not connected');
    }

    const startTime = Date.now();
    const result: SyncResult = {
      success: false,
      imported: 0,
      exported: 0,
      updated: 0,
      conflicts: 0,
      errors: [],
      duration: 0,
      conflictDetails: [],
    };

    try {
      const direction = options.direction || 'bidirectional';

      if (direction === 'inbound' || direction === 'bidirectional') {
        const inboundResult = await this.syncInbound(options);
        result.imported += inboundResult.imported;
        result.updated += inboundResult.updated;
        result.conflicts += inboundResult.conflicts;
        result.errors.push(...inboundResult.errors);
        if (inboundResult.conflictDetails) {
          result.conflictDetails?.push(...inboundResult.conflictDetails);
        }
      }

      if (direction === 'outbound' || direction === 'bidirectional') {
        const outboundResult = await this.syncOutbound(options);
        result.exported += outboundResult.exported;
        result.updated += outboundResult.updated;
        result.conflicts += outboundResult.conflicts;
        result.errors.push(...outboundResult.errors);
        if (outboundResult.conflictDetails) {
          result.conflictDetails?.push(...outboundResult.conflictDetails);
        }
      }

      result.success = result.errors.length === 0;
    } catch (error) {
      result.errors.push(`Bidirectional sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * Sync from Square to Supabase (inbound)
   */
  private async syncInbound(options: SyncOptions): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      imported: 0,
      exported: 0,
      updated: 0,
      conflicts: 0,
      errors: [],
      duration: 0,
      conflictDetails: [],
    };

    try {
      // Sync bookings
      const bookings = await this.fetchSquareBookings(options);
      for (const booking of bookings) {
        try {
          const processed = await this.processInboundBooking(booking, options);
          if (processed.isNew) {
            result.imported++;
          } else if (processed.isUpdated) {
            result.updated++;
          }
          if (processed.conflict) {
            result.conflicts++;
            result.conflictDetails?.push(processed.conflict);
          }
        } catch (error) {
          result.errors.push(`Booking ${booking.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Sync customers
      const customers = await this.fetchSquareCustomers(options);
      for (const customer of customers) {
        try {
          const processed = await this.processInboundCustomer(customer, options);
          if (processed.isNew) {
            result.imported++;
          } else if (processed.isUpdated) {
            result.updated++;
          }
          if (processed.conflict) {
            result.conflicts++;
            result.conflictDetails?.push(processed.conflict);
          }
        } catch (error) {
          result.errors.push(`Customer ${customer.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

    } catch (error) {
      result.errors.push(`Inbound sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.success = false;
    }

    return result;
  }

  /**
   * Sync from Supabase to Square (outbound)
   */
  private async syncOutbound(options: SyncOptions): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      imported: 0,
      exported: 0,
      updated: 0,
      conflicts: 0,
      errors: [],
      duration: 0,
      conflictDetails: [],
    };

    try {
      // Get pending outbound sync items
      const { data: pendingItems, error } = await this.supabaseClient!
        .from('sync_queue')
        .select('*')
        .eq('status', 'pending')
        .eq('direction', 'to_external')
        .eq('external_system', 'square')
        .order('scheduled_at', { ascending: true })
        .limit(options.batchSize || 50);

      if (error) {
        throw new Error(`Failed to fetch sync queue: ${error.message}`);
      }

      for (const item of (pendingItems as any[]) || []) {
        try {
          const processed = await this.processOutboundItem(item, options);
          if (processed.isNew) {
            result.exported++;
          } else if (processed.isUpdated) {
            result.updated++;
          }
          if (processed.conflict) {
            result.conflicts++;
            result.conflictDetails?.push(processed.conflict);
          }
        } catch (error) {
          result.errors.push(`Queue item ${item.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          
          // Update queue item status to failed
          await (this.supabaseClient! as any)
            .from('sync_queue')
            .update({ 
              status: 'failed', 
              error_message: error instanceof Error ? error.message : 'Unknown error',
              processed_at: new Date().toISOString()
            })
            .eq('id', item.id);
        }
      }

    } catch (error) {
      result.errors.push(`Outbound sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.success = false;
    }

    return result;
  }

  /**
   * Process inbound booking from Square
   */
  public async processInboundBooking(squareBooking: SquareBooking, options: SyncOptions) {
    let result = { isNew: false, isUpdated: false, conflict: null as SyncConflict | null };

    try {
      // Check if we already have this booking
      const { data: existingSync } = await this.supabaseClient!
        .from('sync_metadata')
        .select('*')
        .eq('entity_type', 'booking')
        .eq('external_id', squareBooking.id!)
        .eq('external_system', 'square')
        .single() as any;

      if (existingSync) {
        // Check for conflicts
        const conflict = await this.detectBookingConflict(squareBooking, existingSync);
        if (conflict) {
          result.conflict = conflict;
          await this.handleConflict(conflict, options);
          return result;
        }

        // Update existing booking
        const normalizedBooking = this.normalizeSquareBooking(squareBooking);
        await this.updateSupabaseBooking(existingSync.local_id, normalizedBooking);
        
        // Update sync metadata
        await this.updateSyncMetadata(existingSync.id, {
          last_sync_at: new Date().toISOString(),
          sync_version: existingSync.sync_version + 1,
          external_data: squareBooking,
        });

        result.isUpdated = true;
      } else {
        // Create new booking
        const normalizedBooking = this.normalizeSquareBooking(squareBooking);
        const newBookingId = await this.createSupabaseBooking(normalizedBooking);

        // Create sync metadata
        await this.createSyncMetadata({
          entity_type: 'booking',
          local_id: newBookingId,
          external_id: squareBooking.id!,
          external_system: 'square',
          entity_status: 'active',
          sync_status: 'synced',
          last_sync_at: new Date().toISOString(),
          sync_version: 1,
          external_data: squareBooking,
        });

        result.isNew = true;
      }

    } catch (error) {
      throw new Error(`Failed to process inbound booking: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * Process inbound customer from Square
   */
  public async processInboundCustomer(squareCustomer: SquareCustomer, options: SyncOptions) {
    let result = { isNew: false, isUpdated: false, conflict: null as SyncConflict | null };

    try {
      // Check if we already have this customer
      const { data: existingSync } = await this.supabaseClient!
        .from('sync_metadata')
        .select('*')
        .eq('entity_type', 'customer')
        .eq('external_id', squareCustomer.id!)
        .eq('external_system', 'square')
        .single() as any;

      if (existingSync) {
        // Check for conflicts
        const conflict = await this.detectCustomerConflict(squareCustomer, existingSync);
        if (conflict) {
          result.conflict = conflict;
          await this.handleConflict(conflict, options);
          return result;
        }

        // Update existing customer
        await this.updateSupabaseCustomer(existingSync.local_id, squareCustomer);
        
        // Update sync metadata
        await this.updateSyncMetadata(existingSync.id, {
          last_sync_at: new Date().toISOString(),
          sync_version: existingSync.sync_version + 1,
          external_data: squareCustomer,
        });

        result.isUpdated = true;
      } else {
        // Create new customer
        const newCustomerId = await this.createSupabaseCustomer(squareCustomer);

        // Create sync metadata
        await this.createSyncMetadata({
          entity_type: 'customer',
          local_id: newCustomerId,
          external_id: squareCustomer.id!,
          external_system: 'square',
          entity_status: 'active',
          sync_status: 'synced',
          last_sync_at: new Date().toISOString(),
          sync_version: 1,
          external_data: squareCustomer,
        });

        result.isNew = true;
      }

    } catch (error) {
      throw new Error(`Failed to process inbound customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * Process outbound item to Square
   */
  private async processOutboundItem(queueItem: any, options: SyncOptions) {
    let result = { isNew: false, isUpdated: false, conflict: null as SyncConflict | null };

    try {
      const { entity_type, entity_id, operation, payload } = queueItem;

      switch (entity_type) {
        case 'booking':
          result = await this.processOutboundBooking(entity_id, operation, payload, options);
          break;
        case 'customer':
          result = await this.processOutboundCustomer(entity_id, operation, payload, options);
          break;
        default:
          throw new Error(`Unsupported entity type: ${entity_type}`);
      }

      // Update queue item status
      await (this.supabaseClient! as any)
        .from('sync_queue')
        .update({ 
          status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('id', (queueItem as any).id);

    } catch (error) {
      // Update queue item with error
      await (this.supabaseClient! as any)
        .from('sync_queue')
        .update({ 
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          processed_at: new Date().toISOString()
        })
        .eq('id', (queueItem as any).id);

      throw error;
    }

    return result;
  }

  /**
   * Process outbound booking to Square
   */
  private async processOutboundBooking(entityId: string, operation: string, payload: any, options: SyncOptions) {
    const result = { isNew: false, isUpdated: false, conflict: null as SyncConflict | null };

    try {
      if (!this.squareClient) throw new Error('Square client not initialized');

      switch (operation) {
        case 'create':
          // Create new booking in Square
          const createResponse = await this.squareClient.bookings.create(payload);
          if (createResponse.booking?.id) {
            result.isNew = true;
            // Update sync metadata with new Square ID
            await this.updateSyncMetadataAfterOutbound(entityId, createResponse.booking.id, 'booking');
          }
          break;

        case 'update':
          // Update existing booking in Square
          const updateResponse = await this.squareClient.bookings.update({
            bookingId: entityId,
            booking: payload as SquareBooking
          });
          if (updateResponse.booking) {
            result.isUpdated = true;
          }
          break;

        case 'delete':
          // Cancel booking in Square
          await this.squareClient.bookings.cancel({ bookingId: entityId });
          // Update sync metadata to mark as deleted
          await this.updateSyncMetadataStatus(entityId, 'deleted');
          break;

        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }

    } catch (error) {
      throw new Error(`Failed to process outbound booking: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * Process outbound customer to Square
   */
  private async processOutboundCustomer(entityId: string, operation: string, payload: any, options: SyncOptions) {
    const result = { isNew: false, isUpdated: false, conflict: null as SyncConflict | null };

    try {
      if (!this.squareClient) throw new Error('Square client not initialized');

      switch (operation) {
        case 'create':
          // Create new customer in Square
          const createResponse = await this.squareClient.customers.create(payload);
          if (createResponse.customer?.id) {
            result.isNew = true;
            // Update sync metadata with new Square ID
            await this.updateSyncMetadataAfterOutbound(entityId, createResponse.customer.id, 'customer');
          }
          break;

        case 'update':
          // Update existing customer in Square
          const updateResponse = await this.squareClient.customers.update({
            customerId: entityId,
            ...payload
          });
          if (updateResponse.customer) {
            result.isUpdated = true;
          }
          break;

        case 'delete':
          // Delete customer in Square
          await this.squareClient.customers.delete({ customerId: entityId });
          // Update sync metadata to mark as deleted
          await this.updateSyncMetadataStatus(entityId, 'deleted');
          break;

        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }

    } catch (error) {
      throw new Error(`Failed to process outbound customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * Helper methods for database operations
   */
  private async createSyncMetadata(metadata: SyncMetadata): Promise<void> {
    const { error } = await this.supabaseClient!
      .from('sync_metadata')
      .insert(metadata as any);

    if (error) {
      throw new Error(`Failed to create sync metadata: ${error.message}`);
    }
  }

  private async updateSyncMetadata(id: string, updates: Partial<SyncMetadata>): Promise<void> {
    const { error } = await (this.supabaseClient! as any)
      .from('sync_metadata')
      .update(updates)
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update sync metadata: ${error.message}`);
    }
  }

  private async updateSyncMetadataAfterOutbound(localId: string, externalId: string, entityType: string): Promise<void> {
    const { error } = await (this.supabaseClient! as any)
      .from('sync_metadata')
      .update({
        external_id: externalId,
        sync_status: 'synced',
        last_sync_at: new Date().toISOString(),
      })
      .eq('local_id', localId)
      .eq('entity_type', entityType)
      .eq('external_system', 'square');

    if (error) {
      throw new Error(`Failed to update sync metadata after outbound: ${error.message}`);
    }
  }

  // Private method removed - using public version instead

  // Public methods for dashboard access
  public async getSyncQueue(limit = 20): Promise<any[]> {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await this.supabaseClient
      .from('sync_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch sync queue: ${error.message}`);
    }

    return data || [];
  }

  public async getSyncStatistics(limit = 100): Promise<any[]> {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await this.supabaseClient
      .from('sync_statistics')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch sync statistics: ${error.message}`);
    }

    return data || [];
  }

  public async getPendingConflicts(): Promise<any[]> {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await this.supabaseClient
      .from('sync_conflicts')
      .select('*')
      .is('resolved_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch pending conflicts: ${error.message}`);
    }

    return data || [];
  }

  public async resolveConflict(conflictId: string, strategy: 'local_wins' | 'external_wins' | 'merge'): Promise<void> {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const { error } = await (this.supabaseClient as any)
      .from('sync_conflicts')
      .update({
        resolved_at: new Date().toISOString(),
        resolution_strategy: strategy,
      })
      .eq('id', conflictId);

    if (error) {
      throw new Error(`Failed to resolve conflict: ${error.message}`);
    }
  }

  public async retryQueueItem(queueId: string): Promise<void> {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const { error } = await (this.supabaseClient as any)
      .from('sync_queue')
      .update({
        status: 'pending',
        error_message: null,
        retry_count: 0,
        scheduled_at: new Date().toISOString(),
      })
      .eq('id', queueId);

    if (error) {
      throw new Error(`Failed to retry queue item: ${error.message}`);
    }
  }

  private async createSupabaseBooking(normalizedBooking: NormalizedBooking): Promise<string> {
    // Implementation depends on your database schema
    // This is a placeholder - adapt to your actual booking table structure
    const { data, error } = await this.supabaseClient!
      .from('booking')
      .insert({
        user_id: normalizedBooking.userId,
        staff_id: normalizedBooking.therapistId,
        start_time: normalizedBooking.date,
        status: normalizedBooking.status,
        // Add other fields as needed
      } as any)
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to create booking: ${error.message}`);
    }

    return (data as any).id;
  }

  private async updateSupabaseBooking(bookingId: string, normalizedBooking: NormalizedBooking): Promise<void> {
    const { error } = await (this.supabaseClient! as any)
      .from('booking')
      .update({
        start_time: normalizedBooking.date,
        status: normalizedBooking.status,
        // Add other fields as needed
      })
      .eq('id', bookingId);

    if (error) {
      throw new Error(`Failed to update booking: ${error.message}`);
    }
  }

  private async createSupabaseCustomer(squareCustomer: SquareCustomer): Promise<string> {
    // Implementation depends on your user/customer table structure
    // This is a placeholder - adapt to your actual schema
    const { data, error } = await this.supabaseClient!
      .from('profiles')
      .insert({
        // Map Square customer data to your user profile structure
      } as any)
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to create customer: ${error.message}`);
    }

    return (data as any).id;
  }

  private async updateSupabaseCustomer(customerId: string, squareCustomer: SquareCustomer): Promise<void> {
    const { error } = await (this.supabaseClient! as any)
      .from('profiles')
      .update({
        // Map Square customer data to your user profile structure
      })
      .eq('id', customerId);

    if (error) {
      throw new Error(`Failed to update customer: ${error.message}`);
    }
  }

  /**
   * Conflict detection and resolution
   */
  private async detectBookingConflict(squareBooking: SquareBooking, existingSync: SyncMetadata): Promise<SyncConflict | null> {
    try {
      // Check if booking was deleted locally but exists in Square
      if (existingSync.entity_status === 'deleted') {
        return {
          entityType: 'booking',
          localId: existingSync.local_id,
          externalId: squareBooking.id!,
          conflictType: 'deleted_locally',
          localData: { status: 'deleted' },
          externalData: squareBooking,
        };
      }

      // Check for version conflicts using sync_version and updated timestamps
      const localBooking = await this.supabaseClient!
        .from('booking')
        .select('*')
        .eq('id', existingSync.local_id)
        .single();

      if (localBooking.error) {
        return {
          entityType: 'booking',
          localId: existingSync.local_id,
          externalId: squareBooking.id!,
          conflictType: 'deleted_remotely',
          localData: null,
          externalData: squareBooking,
        };
      }

      // Compare last modified timestamps
      const localUpdatedAt = new Date((localBooking.data as any).updated_at || (localBooking.data as any).created_at);
      const externalUpdatedAt = new Date(squareBooking.updatedAt || squareBooking.createdAt || Date.now());
      const timeDiff = Math.abs(localUpdatedAt.getTime() - externalUpdatedAt.getTime());

      // If both systems have been updated within 5 minutes, consider it a conflict
      if (timeDiff > 300000 && existingSync.sync_version) { // 5 minutes in milliseconds
        return {
          entityType: 'booking',
          localId: existingSync.local_id,
          externalId: squareBooking.id!,
          conflictType: 'data_mismatch',
          localData: localBooking.data as any,
          externalData: squareBooking,
        };
      }

      return null;
    } catch (error) {
      console.error('Error detecting booking conflict:', error);
      return null;
    }
  }

  private async detectCustomerConflict(squareCustomer: SquareCustomer, existingSync: SyncMetadata): Promise<SyncConflict | null> {
    try {
      // Check if customer was deleted locally but exists in Square
      if (existingSync.entity_status === 'deleted') {
        return {
          entityType: 'customer',
          localId: existingSync.local_id,
          externalId: squareCustomer.id!,
          conflictType: 'deleted_locally',
          localData: { status: 'deleted' },
          externalData: squareCustomer,
        };
      }

      // Check for version conflicts
      const localCustomer = await this.supabaseClient!
        .from('user_profiles')
        .select('*')
        .eq('id', existingSync.local_id)
        .single();

      if (localCustomer.error) {
        return {
          entityType: 'customer',
          localId: existingSync.local_id,
          externalId: squareCustomer.id!,
          conflictType: 'deleted_remotely',
          localData: null,
          externalData: squareCustomer,
        };
      }

      // Compare last modified timestamps
      const localUpdatedAt = new Date((localCustomer.data as any).updated_at || (localCustomer.data as any).created_at);
      const externalUpdatedAt = new Date(squareCustomer.updatedAt || squareCustomer.createdAt || Date.now());
      const timeDiff = Math.abs(localUpdatedAt.getTime() - externalUpdatedAt.getTime());

      // If both systems have been updated within 5 minutes, consider it a conflict
      if (timeDiff > 300000 && existingSync.sync_version) {
        return {
          entityType: 'customer',
          localId: existingSync.local_id,
          externalId: squareCustomer.id!,
          conflictType: 'data_mismatch',
          localData: localCustomer.data as any,
          externalData: squareCustomer,
        };
      }

      return null;
    } catch (error) {
      console.error('Error detecting customer conflict:', error);
      return null;
    }
  }

  private async handleConflict(conflict: SyncConflict, options: SyncOptions): Promise<void> {
    const strategy = options.conflictResolution || 'manual';

    // Log conflict
    const { data: conflictRecord } = await this.supabaseClient!
      .from('sync_conflicts')
      .insert({
        entity_type: conflict.entityType,
        local_id: conflict.localId,
        external_id: conflict.externalId,
        external_system: 'square',
        conflict_type: conflict.conflictType,
        local_data: conflict.localData,
        external_data: conflict.externalData,
        resolution_strategy: strategy === 'manual' ? null : strategy,
      } as any)
      .select('id')
      .single();

    // Handle based on strategy
    switch (strategy) {
      case 'local_wins':
        await this.resolveConflictLocalWins(conflict);
        break;
      case 'external_wins':
        await this.resolveConflictExternalWins(conflict);
        break;
      case 'merge':
        await this.resolveConflictMerge(conflict);
        break;
      case 'manual':
      default:
        // Leave for manual resolution
        console.log(`Conflict logged for manual resolution: ${conflict.entityType} ${conflict.localId} vs ${conflict.externalId}`);
        break;
    }

    // Update conflict record with resolution
    if (conflictRecord && strategy !== 'manual') {
      await (this.supabaseClient as any)
        .from('sync_conflicts')
        .update({
          resolved_at: new Date().toISOString(),
          resolution_strategy: strategy,
        })
        .eq('id', (conflictRecord as any).id);
    }
  }

  private async resolveConflictLocalWins(conflict: SyncConflict): Promise<void> {
    // Local data takes precedence - push local data to external system
    try {
      if (conflict.entityType === 'booking') {
        // Update Square booking with local data
        const localBooking = conflict.localData;
        await this.squareClient!.bookings.update({
          bookingId: conflict.externalId,
          booking: {
            // Map local booking data to Square format
            id: conflict.externalId,
            startAt: localBooking.start_time,
            locationId: localBooking.location,
            // Add other relevant fields
          }
        });
      } else if (conflict.entityType === 'customer') {
        // Update Square customer with local data
        const localCustomer = conflict.localData;
        await this.squareClient!.customers.update({
          customerId: conflict.externalId,
          // Map local customer data to Square format
          givenName: localCustomer.full_name?.split(' ')[0],
          familyName: localCustomer.full_name?.split(' ').slice(1).join(' '),
          emailAddress: localCustomer.email,
          phoneNumber: localCustomer.phone,
          // Add other relevant fields
        });
      }
    } catch (error) {
      console.error(`Failed to resolve conflict with local_wins strategy: ${error}`);
      throw error;
    }
  }

  private async resolveConflictExternalWins(conflict: SyncConflict): Promise<void> {
    // External data takes precedence - update local system with external data
    try {
      if (conflict.entityType === 'booking') {
        // Update local booking with Square data
        const externalBooking = conflict.externalData;
        await (this.supabaseClient! as any)
          .from('appointments')
          .update({
            start_time: externalBooking.startAt,
            end_time: externalBooking.endAt,
            status: externalBooking.status?.toLowerCase(),
            location: externalBooking.locationId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', conflict.localId);
      } else if (conflict.entityType === 'customer') {
        // Update local customer with Square data
        const externalCustomer = conflict.externalData;
        await (this.supabaseClient! as any)
          .from('user_profiles')
          .update({
            full_name: `${externalCustomer.givenName || ''} ${externalCustomer.familyName || ''}`.trim(),
            // Note: Email and phone updates might need additional validation
            updated_at: new Date().toISOString(),
          })
          .eq('id', conflict.localId);
      }
    } catch (error) {
      console.error(`Failed to resolve conflict with external_wins strategy: ${error}`);
      throw error;
    }
  }

  private async resolveConflictMerge(conflict: SyncConflict): Promise<void> {
    // Merge data from both sources - take the most recent data for each field
    try {
      if (conflict.entityType === 'booking') {
        // Merge booking data
        const localBooking = conflict.localData;
        const externalBooking = conflict.externalData;
        
        // Use external data for scheduling (Square is authoritative for appointments)
        // Use local data for notes and metadata (local system has more context)
        await (this.supabaseClient! as any)
          .from('appointments')
          .update({
            start_time: externalBooking.startAt || localBooking.start_time,
            end_time: externalBooking.endAt || localBooking.end_time,
            status: externalBooking.status?.toLowerCase() || localBooking.status,
            location: externalBooking.locationId || localBooking.location,
            notes: localBooking.notes, // Local notes take precedence
            metadata: {
              ...localBooking.metadata,
              merged_from_square: true,
              merge_timestamp: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          })
          .eq('id', conflict.localId);

        // Also update Square with merged data
        await this.squareClient!.bookings.update({
          bookingId: conflict.externalId,
          booking: {
            id: conflict.externalId,
            startAt: externalBooking.startAt || localBooking.start_time,
            locationId: externalBooking.locationId || localBooking.location,
            // Add other merged fields as needed
          }
        });
      } else if (conflict.entityType === 'customer') {
        // Merge customer data
        const localCustomer = conflict.localData;
        const externalCustomer = conflict.externalData;
        
        // Merge contact info - prefer external for email/phone (more authoritative)
        // Keep local for profile data and preferences
        await (this.supabaseClient! as any)
          .from('user_profiles')
          .update({
            full_name: externalCustomer.givenName && externalCustomer.familyName 
              ? `${externalCustomer.givenName} ${externalCustomer.familyName}`.trim()
              : localCustomer.full_name,
            // Note: Email updates might need additional validation
            address: localCustomer.address, // Local address data preferred
            emergency_contact: localCustomer.emergency_contact, // Local emergency data preferred
            metadata: {
              ...localCustomer.metadata,
              merged_from_square: true,
              merge_timestamp: new Date().toISOString(),
              square_customer_id: conflict.externalId,
            },
            updated_at: new Date().toISOString(),
          })
          .eq('id', conflict.localId);
      }
    } catch (error) {
      console.error(`Failed to resolve conflict with merge strategy: ${error}`);
      throw error;
    }
  }

  /**
   * Data transformation methods
   */
  private normalizeSquareBooking(squareBooking: SquareBooking): NormalizedBooking {
    const appointment = Array.isArray(squareBooking?.appointmentSegments) ? squareBooking.appointmentSegments[0] : undefined;
    const locationId = squareBooking?.locationId;
    const customer = squareBooking?.customerId;
    const startAt = squareBooking?.startAt;
    const serviceName = appointment?.serviceVariationId;
    const therapistId = appointment?.teamMemberId;

    return {
      id: squareBooking?.id ?? `square-booking-${Math.random().toString(36).slice(2)}`,
      userId: customer ?? null,
      therapistId: therapistId ?? null,
      date: startAt ? new Date(startAt).toISOString() : new Date().toISOString(),
      status: (squareBooking?.status ?? 'unknown').toString().toLowerCase(),
      source: 'square',
      locationId: locationId ?? null,
      serviceName: serviceName ?? null,
      customerEmail: null,
      customerPhone: null,
      durationMinutes: appointment?.durationMinutes ?? null,
      raw: squareBooking,
    };
  }

  /**
   * Data fetching methods
   */
  private async fetchSquareBookings(options: SyncOptions): Promise<SquareBooking[]> {
    if (!this.squareClient) throw new Error('Square client not initialized');

    const request: ListBookingsRequest = {
      limit: options.batchSize || 50,
      startAtMin: options.startDate?.toISOString(),
      startAtMax: options.endDate?.toISOString(),
      locationId: options.locationId,
      teamMemberId: options.teamMemberId,
      customerId: options.customerId,
    };

    try {
      const response = await this.squareClient.bookings.list(request);
      // @ts-ignore - SDK response typing
      return response?.items || [];
    } catch (error) {
      console.error('Failed to fetch Square bookings:', error);
      throw new Error('Failed to fetch bookings from Square');
    }
  }

  private async fetchSquareCustomers(options: SyncOptions): Promise<SquareCustomer[]> {
    if (!this.squareClient) throw new Error('Square client not initialized');

    const request: SearchCustomersRequest = {
      limit: BigInt(options.batchSize || 50),
      query: {
        filter: {
          createdAt: options.startDate || options.endDate ? {
            startAt: options.startDate?.toISOString(),
            endAt: options.endDate?.toISOString(),
          } : undefined,
        },
        sort: {
          field: 'CREATED_AT',
          order: 'DESC',
        },
      },
    };

    try {
      const response = await this.squareClient.customers.search(request);
      // @ts-ignore - SDK response typing
      return response?.customers || [];
    } catch (error) {
      console.error('Failed to fetch Square customers:', error);
      throw new Error('Failed to fetch customers from Square');
    }
  }

  /**
   * Queue management for outbound sync
   */
  async queueOutboundSync(entityType: string, entityId: string, operation: string, payload: any): Promise<void> {
    if (!this.supabaseClient) throw new Error('Supabase client not initialized');

    const { error } = await (this.supabaseClient as any)
      .from('sync_queue')
      .insert({
        entity_type: entityType,
        entity_id: entityId,
        operation,
        direction: 'to_external',
        external_system: 'square',
        payload,
        status: 'pending',
      });

    if (error) {
      throw new Error(`Failed to queue sync: ${error.message}`);
    }
  }

  /**
   * Statistics and monitoring
   * Note: Use the public methods getSyncStatistics() and getPendingConflicts() above
   */

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Test Square connection
      if (this.squareClient) {
        const bookings = await this.fetchSquareBookings({ batchSize: 1 });
        if (!bookings || bookings.length === 0) {
          console.warn('Square connection test returned no bookings');
        }
      }

      // Test Supabase connection
      if (this.supabaseClient) {
        const { data, error } = await (this.supabaseClient as any)
          .from('sync_metadata')
          .select('id')
          .limit(1);
        
        if (error) {
          console.error('Supabase connection test failed:', error);
          return false;
        }
      }

      return this.isConnected;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const bidirectionalSyncService = new BidirectionalSyncService();
export default BidirectionalSyncService;