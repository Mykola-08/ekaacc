# Square Integration Guide - Enhanced Version

## Overview

This project features a **comprehensive Square API integration** with improved error handling, type safety, and extended functionality. The integration supports payment processing, booking management, customer management, and webhook handling.

## Architecture

The Square integration consists of several components working together to provide a robust payment and booking system:

### Components

1. **Enhanced Square Client** (`src/server/square-client-improved.ts`)
   - Server-side wrapper with comprehensive API coverage
   - Proper TypeScript types for all operations
   - Retry logic for transient failures
   - Rate limit handling
   - Custom error types for better error handling

2. **Type Definitions** (`src/types/square.ts`)
   - Complete TypeScript types for Square API responses
   - Type-safe request and response objects
   - Eliminates `any` types throughout the codebase

3. **API Routes**
   - `src/app/api/square/bookings/route.ts` - Booking management endpoint
   - `src/app/api/webhooks/square/route.ts` - Webhook event handler

4. **AI Integration** (`src/ai/flows/triage-therapy.ts`)
   - Generates booking links based on therapy recommendations
   - Uses environment variables for service and location IDs

## Environment Configuration

### Required Variables

Create a `.env.local` file based on `.env.local.example`:

```env
# Square API Configuration
SQUARE_ACCESS_TOKEN=your_square_access_token_here
SQUARE_ENV=Sandbox

# Square Location ID
SQUARE_LOCATION_ID=your_location_id_here

# Square Service IDs for different therapies
SQUARE_SERVICE_MASSAGE_THERAPY=your_massage_therapy_service_id
SQUARE_SERVICE_FELDENKRAIS=your_feldenkrais_service_id
SQUARE_SERVICE_KINESIOLOGY=your_kinesiology_service_id
SQUARE_SERVICE_360_THERAPY=your_360_therapy_service_id

# Square Webhook Signature Key
SQUARE_WEBHOOK_SIGNATURE_KEY=your_webhook_signature_key_here
```

### Getting Square Credentials

#### Access Token

1. Visit the [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Create or select your application
3. Navigate to the **Credentials** tab
4. Copy the **Sandbox Access Token** (for development) or **Production Access Token** (for production)

#### Location ID

**Option 1: From Square Dashboard**
1. Go to [Square Dashboard](https://squareup.com/dashboard)
2. Navigate to **Account & Settings** > **Business** > **Locations**
3. Click on a location to view its details
4. The Location ID is in the URL: `https://squareup.com/dashboard/locations/{LOCATION_ID}`

**Option 2: Via API**
```typescript
import { listLocations } from '@/server/square-client-improved';

const locations = await listLocations();
console.log(locations.map(loc => ({ id: loc.id, name: loc.name })));
```

#### Service IDs

**Option 1: From Square Dashboard**
1. Go to [Square Dashboard](https://squareup.com/dashboard)
2. Navigate to **Items & Orders** > **Services**
3. Click on a service to view its details
4. The Service Variation ID is visible in the service details

**Option 2: Via API**
```typescript
import { searchCatalog } from '@/server/square-client-improved';

const services = await searchCatalog(['ITEM'], {
  prefixQuery: { attribute_name: 'name', attribute_prefix: '' }
});
console.log(services);
```

#### Webhook Signature Key

1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Select your application
3. Navigate to **Webhooks**
4. Create a new webhook endpoint: `https://your-domain.com/api/webhooks/square`
5. Copy the **Signature Key** that is generated

## API Usage

### Bookings

#### List Bookings

```typescript
import { listBookings } from '@/server/square-client-improved';

// List all bookings
const bookings = await listBookings();

// List bookings with filters
const filteredBookings = await listBookings({
  locationId: 'YOUR_LOCATION_ID',
  startAtMin: '2025-01-01T00:00:00Z',
  startAtMax: '2025-12-31T23:59:59Z',
  limit: 50
});
```

#### Create Booking

```typescript
import { createBooking } from '@/server/square-client-improved';
import { randomUUID } from 'crypto';

const booking = await createBooking({
  idempotencyKey: randomUUID(),
  booking: {
    startAt: '2025-11-01T10:00:00Z',
    locationId: 'YOUR_LOCATION_ID',
    customerId: 'CUSTOMER_ID',
    appointmentSegments: [{
      durationMinutes: 60,
      serviceVariationId: 'SERVICE_VARIATION_ID',
      teamMemberId: 'TEAM_MEMBER_ID'
    }]
  }
});
```

#### Update Booking

```typescript
import { updateBooking } from '@/server/square-client-improved';
import { randomUUID } from 'crypto';

const updated = await updateBooking('BOOKING_ID', {
  idempotencyKey: randomUUID(),
  booking: {
    startAt: '2025-11-01T11:00:00Z',
    customerNote: 'Updated appointment time'
  }
});
```

#### Cancel Booking

```typescript
import { cancelBooking } from '@/server/square-client-improved';
import { randomUUID } from 'crypto';

const cancelled = await cancelBooking('BOOKING_ID', {
  idempotencyKey: randomUUID(),
  bookingVersion: 1
});
```

### Customers

#### Search Customers

```typescript
import { findCustomerByEmail, findCustomerByPhone } from '@/server/square-client-improved';

// Find by email
const customer = await findCustomerByEmail('customer@example.com');

// Find by phone
const customer = await findCustomerByPhone('+1234567890');
```

#### Create Customer

```typescript
import { createCustomer } from '@/server/square-client-improved';

const customer = await createCustomer({
  givenName: 'John',
  familyName: 'Doe',
  emailAddress: 'john.doe@example.com',
  phoneNumber: '+1234567890',
  note: 'New customer from website'
});
```

### Payments

#### Create Payment

```typescript
import { createPayment } from '@/server/square-client-improved';
import { randomUUID } from 'crypto';

const payment = await createPayment({
  sourceId: 'CARD_NONCE_FROM_SQUARE_WEB_SDK',
  idempotencyKey: randomUUID(),
  amountMoney: {
    amount: BigInt(10000), // $100.00 in cents
    currency: 'USD'
  },
  locationId: 'YOUR_LOCATION_ID',
  customerId: 'CUSTOMER_ID',
  referenceId: 'ORDER_123',
  note: 'Payment for massage therapy session'
});
```

#### List Payments

```typescript
import { listPayments } from '@/server/square-client-improved';

const payments = await listPayments(
  '2025-01-01T00:00:00Z', // beginTime
  '2025-12-31T23:59:59Z', // endTime
  'DESC', // sortOrder
  undefined, // cursor
  'YOUR_LOCATION_ID', // locationId
  undefined, // total
  undefined, // last4
  undefined, // cardBrand
  50 // limit
);
```

### Locations and Catalog

#### List Locations

```typescript
import { listLocations } from '@/server/square-client-improved';

const locations = await listLocations();
console.log(locations.map(loc => ({
  id: loc.id,
  name: loc.name,
  address: loc.address
})));
```

#### Search Catalog

```typescript
import { searchCatalog } from '@/server/square-client-improved';

// Search for services
const services = await searchCatalog(['ITEM'], {
  prefixQuery: {
    attribute_name: 'name',
    attribute_prefix: 'massage'
  }
});
```

## Error Handling

The improved Square client provides custom error types for better error handling:

### Error Types

1. **SquareConfigError** - Configuration issues (missing API keys, etc.)
2. **SquareAPIError** - API errors from Square (validation, permissions, etc.)
3. **SquareRateLimitError** - Rate limit exceeded

### Example

```typescript
import {
  listBookings,
  SquareConfigError,
  SquareAPIError,
  SquareRateLimitError
} from '@/server/square-client-improved';

try {
  const bookings = await listBookings();
  // Process bookings...
} catch (error) {
  if (error instanceof SquareConfigError) {
    console.error('Configuration error:', error.message);
    // Handle configuration issues
  } else if (error instanceof SquareRateLimitError) {
    console.error('Rate limited. Retry after:', error.retryAfter);
    // Implement backoff strategy
  } else if (error instanceof SquareAPIError) {
    console.error('API error:', error.message);
    console.error('Status code:', error.statusCode);
    console.error('Errors:', error.errors);
    // Handle API errors
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Retry Logic

The improved client automatically retries failed requests with exponential backoff:

- **Transient failures** (5xx errors, network issues): Retried up to 3 times
- **Rate limiting** (429 errors): Automatically retried with appropriate delay
- **Client errors** (4xx except 429): Not retried (fail fast)

Configuration:
```typescript
// Default: 3 retries with exponential backoff starting at 1000ms
await withRetry(operation, maxRetries = 3, delayMs = 1000);
```

## Webhook Integration

### Setup

1. Configure webhook endpoint in Square Dashboard:
   - URL: `https://your-domain.com/api/webhooks/square`
   - Events: Select desired events (payment.*, booking.*, customer.*)

2. Set environment variable:
   ```env
   SQUARE_WEBHOOK_SIGNATURE_KEY=your_signature_key_here
   ```

3. The webhook handler will automatically:
   - Verify webhook signatures
   - Route events to appropriate handlers
   - Log all webhook activity

### Supported Events

#### Payment Events
- `payment.created` - New payment created
- `payment.updated` - Payment status changed
- `payment.completed` - Payment completed successfully
- `payment.failed` - Payment failed

#### Booking Events
- `booking.created` - New booking created
- `booking.updated` - Booking details changed
- `booking.cancelled` - Booking cancelled

#### Customer Events
- `customer.created` - New customer created
- `customer.updated` - Customer details changed
- `customer.deleted` - Customer deleted

### Customizing Webhook Handlers

Edit `src/app/api/webhooks/square/route.ts` to add custom logic:

```typescript
async function handlePaymentEvent(event: SquareWebhookEvent): Promise<void> {
  switch (event.type) {
    case 'payment.completed':
      // Your custom logic here
      await sendReceiptEmail(event.data.id);
      await updateOrderStatus(event.data.orderId, 'paid');
      break;
  }
}
```

## Server Actions

Use Square functions in Next.js Server Actions:

```typescript
'use server';

import { createPayment } from '@/server/square-client-improved';
import { randomUUID } from 'crypto';

export async function processPayment(sourceId: string, amount: number) {
  try {
    const payment = await createPayment({
      sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(amount),
        currency: 'USD'
      },
      locationId: process.env.SQUARE_LOCATION_ID!
    });

    return { success: true, paymentId: payment.id };
  } catch (error) {
    console.error('Payment failed:', error);
    return { success: false, error: error.message };
  }
}
```

## Testing

### Sandbox Mode

For development and testing:

1. Set `SQUARE_ENV=Sandbox`
2. Use Sandbox Access Token
3. Use Square's [test card numbers](https://developer.squareup.com/docs/testing/test-values):
   - Success: `4111 1111 1111 1111`
   - Declined: `4000 0000 0000 0002`
   - CVV Failure: Use any valid card with CVV `999`

### Integration Tests

Create tests for Square client functions:

```typescript
import { describe, it, expect } from 'vitest';
import { listBookings, isConfigured } from '@/server/square-client-improved';

describe('Square Client', () => {
  it('should be configured', () => {
    expect(isConfigured()).toBe(true);
  });

  it('should list bookings', async () => {
    const bookings = await listBookings({ limit: 10 });
    expect(Array.isArray(bookings)).toBe(true);
  });
});
```

## Production Deployment

Before deploying to production:

### Checklist

- [ ] Set `SQUARE_ENV=Production`
- [ ] Use **Production** Access Token (not Sandbox)
- [ ] Configure all service IDs for production location
- [ ] Set up webhook endpoint with HTTPS
- [ ] Configure webhook signature key
- [ ] Test payment flows in Sandbox first
- [ ] Implement proper error logging and monitoring
- [ ] Set up alerts for failed payments/bookings
- [ ] Review Square's [security best practices](https://developer.squareup.com/docs/security)
- [ ] Implement PCI compliance requirements
- [ ] Test webhook signature verification
- [ ] Set up database backups for payment records

### Security Best Practices

1. **Never expose access tokens** - Keep them server-side only
2. **Verify webhook signatures** - Always validate incoming webhooks
3. **Use HTTPS** - All API calls and webhooks must use HTTPS
4. **Implement rate limiting** - Protect your endpoints from abuse
5. **Log security events** - Monitor for suspicious activity
6. **Rotate credentials** - Regularly update access tokens
7. **Use idempotency keys** - Prevent duplicate payments

## Migration from Old Client

If you're using the old `src/server/square-client.ts`:

1. Update imports:
   ```typescript
   // Old
   import { listBookings } from '@/server/square-client';
   
   // New
   import { listBookings } from '@/server/square-client-improved';
   ```

2. Add error handling:
   ```typescript
   import { SquareAPIError } from '@/server/square-client-improved';
   
   try {
     const bookings = await listBookings();
   } catch (error) {
     if (error instanceof SquareAPIError) {
       // Handle specific error
     }
   }
   ```

3. Update type annotations:
   ```typescript
   import type { SquareBooking } from '@/types/square';
   
   const booking: SquareBooking = await retrieveBooking('BOOKING_ID');
   ```

## Resources

- [Square Developer Documentation](https://developer.squareup.com/docs)
- [Square SDK for TypeScript](https://github.com/square/square-nodejs-sdk)
- [Payment API Guide](https://developer.squareup.com/docs/payments-api/overview)
- [Bookings API Guide](https://developer.squareup.com/docs/appointments-api/overview)
- [Webhooks Guide](https://developer.squareup.com/docs/webhooks/overview)
- [Testing Guide](https://developer.squareup.com/docs/testing/test-values)

## Support

For Square API issues:
- [Square Developer Forums](https://developer.squareup.com/forums)
- [Square Support](https://squareup.com/help/contact)

For integration issues in this project:
- Check the [SQUARE_INTEGRATION_ANALYSIS.md](../SQUARE_INTEGRATION_ANALYSIS.md) document
- Review error logs in the console
- Verify environment variables are correctly set
