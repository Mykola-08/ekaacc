# Square Integration Guide

## Overview

This project uses the Square SDK (v43.x) for payment processing and booking management. A server-side wrapper is provided at `src/server/square-client.ts` to simplify integration and keep credentials secure.

## Environment Variables

Add these environment variables to your `.env.local` file or deployment environment:

```env
# Required: Your Square access token (get from Square Developer Dashboard)
SQUARE_ACCESS_TOKEN=your_access_token_here

# Optional: Environment (defaults to 'Sandbox')
# Valid values: 'Production' or 'Sandbox'
SQUARE_ENV=Sandbox

# Optional: allow the client to request bookings via the Square API
NEXT_PUBLIC_USE_SQUARE_API=true
```

### Getting a Square Access Token

1. Visit the [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Create or select your application
3. Navigate to the **Credentials** tab
4. Copy your **Sandbox** or **Production** Access Token
5. Add it to your `.env.local` file

⚠️ **Never commit your access token to version control!**

## Server-Side Wrapper Usage

The wrapper at `src/server/square-client.ts` provides three main functions:

### List Bookings

```typescript
import { listBookings } from '@/server/square-client';

// Fetch up to 20 recent bookings
const bookings = await listBookings(20);
```

### Find Customer by Email

```typescript
import { findCustomerByEmail } from '@/server/square-client';

const customer = await findCustomerByEmail('user@example.com');
if (customer) {
  console.log('Customer found:', customer.id);
}
```

### Create Payment

```typescript
import { createPayment } from '@/server/square-client';

const paymentBody = {
  sourceId: 'cnon:card-nonce-from-frontend',
  amountMoney: {
    amount: 1000, // Amount in cents ($10.00)
    currency: 'USD',
  },
  idempotencyKey: crypto.randomUUID(),
};

const payment = await createPayment(paymentBody);
```

## Integration with Next.js

### Server Actions

Use the Square wrapper in Next.js Server Actions:

```typescript
'use server';

import { createPayment } from '@/server/square-client';

export async function processPayment(sourceId: string, amount: number) {
  try {
    const result = await createPayment({
      sourceId,
      amountMoney: { amount, currency: 'USD' },
      idempotencyKey: crypto.randomUUID(),
    });
    return { success: true, paymentId: result.payment?.id };
  } catch (error) {
    console.error('Payment failed:', error);
    return { success: false, error: 'Payment processing failed' };
  }
}
```

### API Routes

Or use in API routes (`app/api/payments/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createPayment } from '@/server/square-client';

export async function POST(request: NextRequest) {
  const { sourceId, amount } = await request.json();
  
  try {
    const result = await createPayment({
      sourceId,
      amountMoney: { amount, currency: 'USD' },
      idempotencyKey: crypto.randomUUID(),
    });
    return NextResponse.json({ success: true, paymentId: result.payment?.id });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Payment failed' }, { status: 500 });
  }
}
```

## Testing

For development and testing:

1. Use **Sandbox** mode by setting `SQUARE_ENV=Sandbox`
2. Use Square's [test card numbers](https://developer.squareup.com/docs/testing/test-values)
3. Test payments will not charge real money in Sandbox mode

### Test Card Numbers

- **Success**: `4111 1111 1111 1111`
- **Decline**: `4000 0000 0000 0002`
- **CVV**: Any 3 digits
- **Expiration**: Any future date

## Error Handling

All wrapper functions throw errors if:

- `SQUARE_ACCESS_TOKEN` is not configured
- The API request fails

Always wrap calls in try-catch blocks:

```typescript
try {
  const bookings = await listBookings();
  // Process bookings...
} catch (error) {
  console.error('Square API error:', error);
  // Handle error gracefully
}
```

## Production Checklist

Before deploying to production:

- [ ] Set `SQUARE_ENV=Production`
- [ ] Use your **Production** Access Token
- [ ] Test payment flows in Sandbox first
- [ ] Implement proper error handling and logging
- [ ] Set up webhook endpoints for payment events
- [ ] Review Square's [best practices](https://developer.squareup.com/docs/security)

## Resources

- [Square Developer Documentation](https://developer.squareup.com/docs)
- [Square SDK for TypeScript](https://github.com/square/square-nodejs-sdk)
- [Payment API Guide](https://developer.squareup.com/docs/payments-api/overview)
- [Bookings API Guide](https://developer.squareup.com/docs/appointments-api/overview)

## Support

For Square API issues, consult the [Square Developer Forums](https://developer.squareup.com/forums) or contact Square Support.
