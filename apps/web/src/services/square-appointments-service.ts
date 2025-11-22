import { SquareClient, SquareEnvironment } from 'square';
import type { Booking as SquareBooking, Customer as SquareCustomer } from 'square';
import type { SearchCustomersRequest, ListBookingsRequest } from 'square';
import type { NormalizedBooking } from '@/types/square';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Enhanced Square Appointments service with sync capabilities
 * Supports both one-time imports and continuous synchronization
 */

export interface SyncOptions {
  batchSize?: number;
  startDate?: Date;
  endDate?: Date;
  locationId?: string;
  teamMemberId?: string;
  customerId?: string;
}

export interface SyncResult {
  success: boolean;
  imported: number;
  updated: number;
  errors: string[];
  duration: number;
}

class SquareAppointmentsService {
  private client: SquareClient | null = null;
  private isConnected = false;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    const token = process.env.SQUARE_ACCESS_TOKEN;
    const env = process.env.SQUARE_ENV === 'Production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox;

    if (!token) {
      console.warn('Square Appointments: SQUARE_ACCESS_TOKEN not configured');
      return;
    }

    try {
      this.client = new SquareClient({
        environment: env,
        token: token,
      });
      this.isConnected = true;
    } catch (error) {
      console.error('Square Appointments: Failed to initialize client:', error);
    }
  }

  /**
   * Sync bookings from Square to local database
   */
  async syncBookings(options: SyncOptions = {}): Promise<SyncResult> {
    if (!this.isConnected) {
      throw new Error('Square Appointments: Client not connected');
    }

    const startTime = Date.now();
    const result: SyncResult = {
      success: false,
      imported: 0,
      updated: 0,
      errors: [],
      duration: 0,
    };

    try {
      const bookings = await this.fetchBookings(options);
      
      for (const booking of bookings) {
        try {
          await this.processBooking(booking);
          result.imported++;
        } catch (error) {
          result.errors.push(`Booking ${booking.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      result.success = true;
    } catch (error) {
      result.errors.push(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * Import customers from Square
   */
  async syncCustomers(options: SyncOptions = {}): Promise<SyncResult> {
    if (!this.isConnected) {
      throw new Error('Square Appointments: Client not connected');
    }

    const startTime = Date.now();
    const result: SyncResult = {
      success: false,
      imported: 0,
      updated: 0,
      errors: [],
      duration: 0,
    };

    try {
      const customers = await this.fetchCustomers(options);
      
      for (const customer of customers) {
        try {
          await this.processCustomer(customer);
          result.imported++;
        } catch (error) {
          result.errors.push(`Customer ${customer.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      result.success = true;
    } catch (error) {
      result.errors.push(`Customer sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * Fetch bookings from Square API
   */
  private async fetchBookings(options: SyncOptions = {}): Promise<SquareBooking[]> {
    if (!this.client) throw new Error('Square client not initialized');

    const request: ListBookingsRequest = {
      limit: options.batchSize || 50,
      startAtMin: options.startDate?.toISOString(),
      startAtMax: options.endDate?.toISOString(),
      locationId: options.locationId,
      teamMemberId: options.teamMemberId,
      customerId: options.customerId,
    };

    try {
      const response = await this.client.bookings.list(request);
      // @ts-ignore - SDK response typing
      return response?.items || [];
    } catch (error) {
      console.error('Square Appointments: Failed to fetch bookings:', error);
      throw new Error('Failed to fetch bookings from Square');
    }
  }

  /**
   * Fetch customers from Square API
   */
  private async fetchCustomers(options: SyncOptions = {}): Promise<SquareCustomer[]> {
    if (!this.client) throw new Error('Square client not initialized');

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
      const response = await this.client.customers.search(request);
      // @ts-ignore - SDK response typing
      return response?.customers || [];
    } catch (error) {
      console.error('Square Appointments: Failed to fetch customers:', error);
      throw new Error('Failed to fetch customers from Square');
    }
  }

  /**
   * Process a single booking - override this method to implement custom logic
   */
  public async processBooking(booking: SquareBooking): Promise<void> {
    console.log(`Processing booking: ${booking.id}`);
    
    const normalizedBooking = this.normalizeBooking(booking);
    
    // 1. Check if booking already exists in sync_metadata
    const { data: existingSync } = await supabaseAdmin
      .from('sync_metadata')
      .select('local_id')
      .eq('external_id', normalizedBooking.id)
      .eq('entity_type', 'booking')
      .eq('external_system', 'square')
      .single();

    if (existingSync) {
      // Update existing session
      const { error } = await supabaseAdmin
        .from('sessions')
        .update({
          scheduled_start_time: normalizedBooking.date,
          // Calculate end time based on duration
          scheduled_end_time: new Date(new Date(normalizedBooking.date).getTime() + (normalizedBooking.durationMinutes || 60) * 60000).toISOString(),
          status: normalizedBooking.status === 'accepted' ? 'scheduled' : normalizedBooking.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingSync.local_id);

      if (error) throw new Error(`Failed to update session: ${error.message}`);
    } else {
      // Create new session
      // Note: We need a valid user_id. If normalizedBooking.userId (Square Customer ID) 
      // doesn't map to a Supabase user, we might need to create a placeholder or skip.
      // For now, we'll try to find a user via sync_metadata or skip if not found.
      
      let userId = null;
      if (normalizedBooking.userId) {
        const { data: customerSync } = await supabaseAdmin
          .from('sync_metadata')
          .select('local_id')
          .eq('external_id', normalizedBooking.userId)
          .eq('entity_type', 'customer')
          .eq('external_system', 'square')
          .single();
        
        userId = customerSync?.local_id;
      }

      if (!userId) {
        console.warn(`Skipping booking ${booking.id}: No matching local user found for Square customer ${normalizedBooking.userId}`);
        return;
      }

      const { data: newSession, error: createError } = await supabaseAdmin
        .from('sessions')
        .insert({
          user_id: userId,
          session_type: normalizedBooking.serviceName || 'General Session',
          scheduled_start_time: normalizedBooking.date,
          scheduled_end_time: new Date(new Date(normalizedBooking.date).getTime() + (normalizedBooking.durationMinutes || 60) * 60000).toISOString(),
          status: normalizedBooking.status === 'accepted' ? 'scheduled' : normalizedBooking.status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (createError) throw new Error(`Failed to create session: ${createError.message}`);

      // Create sync metadata
      await supabaseAdmin.from('sync_metadata').insert({
        entity_type: 'booking',
        local_id: newSession.id,
        external_id: normalizedBooking.id,
        external_system: 'square',
        sync_status: 'synced',
        last_sync_at: new Date().toISOString(),
      });
    }
  }

  /**
   * Process a single customer - override this method to implement custom logic
   */
  public async processCustomer(customer: SquareCustomer): Promise<void> {
    console.log(`Processing customer: ${customer.id}`);
    
    if (!customer.id) return;

    // Check if customer already exists in sync_metadata
    const { data: existingSync } = await supabaseAdmin
      .from('sync_metadata')
      .select('local_id')
      .eq('external_id', customer.id)
      .eq('entity_type', 'customer')
      .eq('external_system', 'square')
      .single();

    if (existingSync) {
      // Update existing user profile if needed
      // For now, we assume Supabase is the source of truth for user profiles
      // and we don't overwrite local changes with Square data automatically
      return;
    }

    // Try to match by email
    if (customer.emailAddress) {
      const { data: existingUser } = await supabaseAdmin
        .from('auth.users') // Note: Direct access to auth schema might be restricted depending on permissions
        .select('id')
        .eq('email', customer.emailAddress)
        .single();

      // Alternatively, check public profiles table if you have one
      // const { data: existingProfile } = await supabaseAdmin
      //   .from('profiles')
      //   .select('id')
      //   .eq('email', customer.emailAddress)
      //   .single();

      if (existingUser) {
        // Link existing user
        await supabaseAdmin.from('sync_metadata').insert({
          entity_type: 'customer',
          local_id: existingUser.id,
          external_id: customer.id,
          external_system: 'square',
          sync_status: 'synced',
          last_sync_at: new Date().toISOString(),
        });
      } else {
        // Create new user? 
        // Creating auth users requires admin API. 
        // For now, we'll log that we found a new customer.
        console.log(`Found new Square customer ${customer.emailAddress} not in Supabase.`);
      }
    }
  }

  /**
   * Normalize Square booking data to your application's format
   */
  private normalizeBooking(raw: SquareBooking): NormalizedBooking {
    const appointment = Array.isArray(raw?.appointmentSegments) ? raw.appointmentSegments[0] : undefined;
    const locationId = raw?.locationId;
    const customer = raw?.customerId;
    const startAt = raw?.startAt;
    const serviceName = appointment?.serviceVariationId;
    const therapistId = appointment?.teamMemberId;

    return {
      id: raw?.id ?? `square-booking-${Math.random().toString(36).slice(2)}`,
      userId: customer ?? null,
      therapistId: therapistId ?? null,
      date: startAt ? new Date(startAt).toISOString() : new Date().toISOString(),
      status: (raw?.status ?? 'unknown').toString().toLowerCase(),
      source: 'square',
      locationId: locationId ?? null,
      serviceName: serviceName ?? null,
      customerEmail: null, // Will be populated from customer data
      customerPhone: null, // Will be populated from customer data
      durationMinutes: appointment?.durationMinutes ?? null,
      raw,
    };
  }

  /**
   * Get sync status and statistics
   */
  async getSyncStatus() {
    return {
      connected: this.isConnected,
      lastSync: null, // TODO: Track last sync timestamp
      totalBookings: 0, // TODO: Get from database
      totalCustomers: 0, // TODO: Get from database
      pendingSync: 0, // TODO: Calculate pending items
    };
  }

  /**
   * Test connection to Square API
   */
  async testConnection(): Promise<boolean> {
    if (!this.isConnected) return false;

    try {
      // Try to fetch a single booking to test connection
      const bookings = await this.fetchBookings({ batchSize: 1 });
      return bookings.length >= 0;
    } catch (error) {
      console.error('Square Appointments: Connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const squareAppointmentsService = new SquareAppointmentsService();
export default SquareAppointmentsService;