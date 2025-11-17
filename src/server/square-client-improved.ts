import { SquareClient, SquareEnvironment } from 'square';
import type {
  SquareConfig,
  SquareBooking,
  SquareCustomer,
  SquarePayment,
  SquareLocation,
  CreateBookingRequest,
  UpdateBookingRequest,
  CancelBookingRequest,
  CreatePaymentRequest,
  SearchCustomersRequest,
  ListBookingsRequest,
} from '@/types/square';

/**
 * Enhanced server-side Square client wrapper with improved error handling,
 * type safety, and extended functionality.
 * 
 * Features:
 * - Proper TypeScript types
 * - Retry logic for transient failures
 * - Comprehensive error handling
 * - Extended API coverage
 * - Rate limit handling
 */

// Custom error types
export class SquareConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SquareConfigError';
  }
}

export class SquareAPIError extends Error {
  public statusCode?: number;
  public errors?: any[];

  constructor(message: string, statusCode?: number, errors?: any[]) {
    super(message);
    this.name = 'SquareAPIError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export class SquareRateLimitError extends Error {
  public retryAfter?: number;

  constructor(message: string, retryAfter?: number) {
    super(message);
    this.name = 'SquareRateLimitError';
    this.retryAfter = retryAfter;
  }
}

// Configuration
const config: SquareConfig = {
  accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
  environment: (process.env.SQUARE_ENV as 'Production' | 'Sandbox') || 'Sandbox',
  locationId: process.env.SQUARE_LOCATION_ID,
};

// Validate configuration on import
if (!config.accessToken) {
  console.warn('SQUARE_ACCESS_TOKEN not set; Square client will not be able to make requests.');
}

/**
 * Get configured Square client instance
 */
function getClient(): SquareClient {
  if (!config.accessToken) {
    throw new SquareConfigError('SQUARE_ACCESS_TOKEN not configured');
  }

  const env = config.environment === 'Production' 
    ? SquareEnvironment.Production 
    : SquareEnvironment.Sandbox;

  // Provide a minimal valid config to avoid initialization errors
  return new SquareClient({
    environment: env,
    accessToken: config.accessToken,
  });
}

/**
 * Retry logic for transient failures
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // Don't retry on client errors (4xx except 429)
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429) {
        throw error;
      }

      // Handle rate limiting
      if (error.statusCode === 429) {
        const retryAfter = error.retryAfter || delayMs * Math.pow(2, attempt);
        console.warn(`Rate limited. Retrying after ${retryAfter}ms`);
        await sleep(retryAfter);
        continue;
      }

      // Exponential backoff for other errors
      if (attempt < maxRetries - 1) {
        const backoffDelay = delayMs * Math.pow(2, attempt);
        console.warn(`Request failed (attempt ${attempt + 1}/${maxRetries}). Retrying after ${backoffDelay}ms`);
        await sleep(backoffDelay);
      }
    }
  }

  throw lastError || new Error('Operation failed after retries');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Handle Square API errors consistently
 */
function handleSquareError(error: any): never {
  if (error.statusCode === 429) {
    throw new SquareRateLimitError(
      'Square API rate limit exceeded',
      error.retryAfter
    );
  }

  if (error.errors && Array.isArray(error.errors)) {
    const errorMessages = error.errors.map((e: any) => e.detail || e.code).join('; ');
    throw new SquareAPIError(
      `Square API error: ${errorMessages}`,
      error.statusCode,
      error.errors
    );
  }

  throw new SquareAPIError(
    error.message || 'Unknown Square API error',
    error.statusCode
  );
}

// ============================================================================
// BOOKINGS API
// ============================================================================

/**
 * List bookings with optional filters
 */
export async function listBookings(request?: ListBookingsRequest): Promise<SquareBooking[]> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.bookings.list(request as any);
      return (response as any)?.items || [];
    } catch (error) {
      handleSquareError(error);
    }
  });
}

/**
 * Retrieve a specific booking by ID
 */
export async function retrieveBooking(bookingId: string): Promise<SquareBooking> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.bookings.get({ bookingId });
      return (response as any)?.booking;
    } catch (error) {
      handleSquareError(error);
    }
  });
}

/**
 * Create a new booking
 */
export async function createBooking(request: CreateBookingRequest): Promise<SquareBooking> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.bookings.create(request as any);
      return (response as any)?.booking;
    } catch (error) {
      handleSquareError(error);
    }
  });
}

/**
 * Update an existing booking
 */
export async function updateBooking(
  bookingId: string,
  request: UpdateBookingRequest
): Promise<SquareBooking> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.bookings.update({ bookingId, ...request } as any);
      return (response as any)?.booking;
    } catch (error) {
      handleSquareError(error);
    }
  });
}

/**
 * Cancel a booking
 */
export async function cancelBooking(
  bookingId: string,
  request?: CancelBookingRequest
): Promise<SquareBooking> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.bookings.cancel({ bookingId, ...request } as any);
      return (response as any)?.booking;
    } catch (error) {
      handleSquareError(error);
    }
  });
}

// ============================================================================
// CUSTOMERS API
// ============================================================================

/**
 * Search for customers
 */
export async function searchCustomers(request: SearchCustomersRequest): Promise<SquareCustomer[]> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.customers.search(request as any);
      return (response as any)?.customers || [];
    } catch (error) {
      handleSquareError(error);
    }
  });
}

/**
 * Find a customer by email address
 */
export async function findCustomerByEmail(email: string): Promise<SquareCustomer | null> {
  const customers = await searchCustomers({
    query: {
      filter: {
        emailAddress: { exact: email }
      }
    }
  });
  return customers[0] || null;
}

/**
 * Find a customer by phone number
 */
export async function findCustomerByPhone(phone: string): Promise<SquareCustomer | null> {
  const customers = await searchCustomers({
    query: {
      filter: {
        phoneNumber: { exact: phone }
      }
    }
  });
  return customers[0] || null;
}

/**
 * Retrieve a specific customer by ID
 */
export async function retrieveCustomer(customerId: string): Promise<SquareCustomer> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.customers.get({ customerId });
      return (response as any)?.customer;
    } catch (error) {
      handleSquareError(error);
    }
  });
}

/**
 * Create a new customer
 */
export async function createCustomer(customer: Partial<SquareCustomer>): Promise<SquareCustomer> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.customers.create(customer as any);
      return (response as any)?.customer;
    } catch (error) {
      handleSquareError(error);
    }
  });
}

// ============================================================================
// PAYMENTS API
// ============================================================================

/**
 * Create a payment
 */
export async function createPayment(request: CreatePaymentRequest): Promise<SquarePayment> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.payments.create(request as any);
      return (response as any)?.payment;
    } catch (error) {
      handleSquareError(error);
    }
  });
}

/**
 * Retrieve a specific payment by ID
 */
export async function retrievePayment(paymentId: string): Promise<SquarePayment> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.payments.get({ paymentId });
      return (response as any)?.payment;
    } catch (error) {
      handleSquareError(error);
    }
  });
}

/**
 * List payments
 */
export async function listPayments(
  beginTime?: string,
  endTime?: string,
  sortOrder?: 'ASC' | 'DESC',
  cursor?: string,
  locationId?: string,
  total?: bigint,
  last4?: string,
  cardBrand?: string,
  limit?: number
): Promise<SquarePayment[]> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.payments.list({
        beginTime,
        endTime,
        sortOrder,
        cursor,
        locationId,
        total,
        last4,
        cardBrand,
        limit,
      } as any);
      return (response as any)?.payments || [];
    } catch (error) {
      handleSquareError(error);
    }
  });
}

/**
 * Cancel a payment
 */
export async function cancelPayment(paymentId: string): Promise<SquarePayment> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.payments.cancel({ paymentId });
      return (response as any)?.payment;
    } catch (error) {
      handleSquareError(error);
    }
  });
}

/**
 * Complete a payment
 */
export async function completePayment(paymentId: string): Promise<SquarePayment> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.payments.complete({ paymentId });
      return (response as any)?.payment;
    } catch (error) {
      handleSquareError(error);
    }
  });
}

// ============================================================================
// LOCATIONS API
// ============================================================================

/**
 * List all locations
 */
export async function listLocations(): Promise<SquareLocation[]> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.locations.list();
      return (response as any)?.locations || [];
    } catch (error) {
      handleSquareError(error);
    }
  });
}

/**
 * Retrieve a specific location by ID
 */
export async function retrieveLocation(locationId: string): Promise<SquareLocation> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.locations.get({ locationId });
      return (response as any)?.location;
    } catch (error) {
      handleSquareError(error);
    }
  });
}

// ============================================================================
// CATALOG API
// ============================================================================

/**
 * Search catalog items (services)
 */
export async function searchCatalog(
  objectTypes?: string[],
  query?: any
): Promise<any[]> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.catalog.search({
        objectTypes,
        query,
      } as any);
      return (response as any)?.objects || [];
    } catch (error) {
      handleSquareError(error);
    }
  });
}

/**
 * List catalog items
 */
export async function listCatalog(
  cursor?: string,
  types?: string[],
  catalogVersion?: bigint
): Promise<any[]> {
  return withRetry(async () => {
    try {
      const client = getClient();
      const response = await client.catalog.list({
        cursor,
        types,
        catalogVersion,
      } as any);
      return (response as any)?.objects || [];
    } catch (error) {
      handleSquareError(error);
    }
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the configured location ID
 */
export function getLocationId(): string {
  if (!config.locationId) {
    throw new SquareConfigError('SQUARE_LOCATION_ID not configured');
  }
  return config.locationId;
}

/**
 * Get the current environment
 */
export function getEnvironment(): 'Production' | 'Sandbox' {
  return config.environment;
}

/**
 * Check if Square is properly configured
 */
export function isConfigured(): boolean {
  return Boolean(config.accessToken);
}

// Export default object with all functions
export default {
  // Bookings
  listBookings,
  retrieveBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  
  // Customers
  searchCustomers,
  findCustomerByEmail,
  findCustomerByPhone,
  retrieveCustomer,
  createCustomer,
  
  // Payments
  createPayment,
  retrievePayment,
  listPayments,
  cancelPayment,
  completePayment,
  
  // Locations
  listLocations,
  retrieveLocation,
  
  // Catalog
  searchCatalog,
  listCatalog,
  
  // Utilities
  getLocationId,
  getEnvironment,
  isConfigured,
};
