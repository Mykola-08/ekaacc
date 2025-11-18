import { SquareClient, SquareEnvironment } from 'square';
import type { Booking as SquareBooking, Customer as SquareCustomer } from 'square';
import type { SearchCustomersRequest, ListBookingsRequest } from 'square';
import type { NormalizedBooking } from '@/types/square';

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
    // This is where you would implement your custom booking processing logic
    // For example, save to your database, create local records, etc.
    console.log(`Processing booking: ${booking.id}`);
    
    // Normalize the booking data
    const normalizedBooking = this.normalizeBooking(booking);
    
    // TODO: Implement your database storage logic here
    // await saveBookingToDatabase(normalizedBooking);
  }

  /**
   * Process a single customer - override this method to implement custom logic
   */
  public async processCustomer(customer: SquareCustomer): Promise<void> {
    // This is where you would implement your custom customer processing logic
    console.log(`Processing customer: ${customer.id}`);
    
    // TODO: Implement your database storage logic here
    // await saveCustomerToDatabase(customer);
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