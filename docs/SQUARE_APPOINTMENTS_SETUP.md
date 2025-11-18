# Square Appointments Integration Setup Guide

## Overview
This guide will help you set up Square Appointments integration for your application. The integration is currently in **alpha** and supports:

- ✅ Booking synchronization
- ✅ Customer import/export
- ✅ Real-time webhook updates
- ✅ Admin dashboard
- ✅ Feature flag controls

## Prerequisites

1. **Square Developer Account**: Sign up at [developer.squareup.com](https://developer.squareup.com)
2. **Square Appointments Subscription**: Required for booking management
3. **Application Setup**: Create a new application in Square Dashboard

## Step 1: Environment Configuration

1. Copy the example configuration:
```bash
cp .env.square.example .env.local
```

2. Add your Square credentials:
```env
# Required: Your Square access token
SQUARE_ACCESS_TOKEN=sq0atp-your-access-token-here

# Required: Set to Production for live environment
SQUARE_ENV=Sandbox

# Optional: Specific location ID (leave empty for all locations)
SQUARE_LOCATION_ID=your-location-id

# Required for webhooks: Get from Square Dashboard
SQUARE_WEBHOOK_SIGNATURE_KEY=your-webhook-signature-key
```

3. Enable the alpha features:
```env
# Enable Square Appointments integration
NEXT_PUBLIC_SQUARE_APPOINTMENTS_ENABLED=true

# Enable specific features
NEXT_PUBLIC_SQUARE_SYNC_ENABLED=true
NEXT_PUBLIC_SQUARE_WEBHOOKS_ENABLED=true
NEXT_PUBLIC_SQUARE_IMPORT_ENABLED=true
```

## Step 2: Square Dashboard Setup

### Create Application
1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Click "New Application"
3. Name your application (e.g., "My Appointments App")
4. Note your Application ID and Access Token

### Configure OAuth Permissions
Required scopes for full functionality:
- `APPOINTMENTS_READ` - Read bookings
- `APPOINTMENTS_WRITE` - Create/update bookings
- `APPOINTMENTS_ALL_READ` - Read all bookings (seller-level)
- `APPOINTMENTS_ALL_WRITE` - Manage all bookings (seller-level)
- `CUSTOMERS_READ` - Read customer data
- `CUSTOMERS_WRITE` - Manage customer data
- `MERCHANT_PROFILE_READ` - Read business information

### Set Up Webhooks
1. In your Square application, go to Webhooks
2. Add webhook endpoint URL: `https://your-domain.com/api/webhooks/square`
3. Subscribe to these events:
   - `booking.created`
   - `booking.updated`
   - `booking.cancelled`
   - `customer.created`
   - `customer.updated`
   - `customer.deleted`
4. Copy the webhook signature key

## Step 3: Test the Integration

### 1. Verify Connection
Go to your admin dashboard and click "Test Connection" to verify:
- ✅ API credentials are valid
- ✅ Webhook signature is configured
- ✅ Environment is accessible

### 2. Test Booking Sync
- Create a test booking in Square Appointments
- Use the "Sync Bookings" button in the admin panel
- Verify bookings appear in your application

### 3. Test Webhooks
- Create/update/cancel a booking in Square
- Check webhook logs in your application
- Verify real-time updates are working

## Step 4: User Interface Integration

### Add to Admin Dashboard
```tsx
import { SquareAdminPanel } from '@/components/square/square-admin-panel';

// In your admin dashboard
<SquareAdminPanel className="mb-6" />
```

### Add to User Dashboard
```tsx
import { SquareIntegrationPanel } from '@/components/square/square-integration-panel';

// In user dashboard
<SquareIntegrationPanel className="mb-6" />
```

## Step 5: Production Deployment

### 1. Switch to Production
```env
# Change to Production
SQUARE_ENV=Production
SQUARE_ACCESS_TOKEN=your-production-access-token
```

### 2. Update Webhook URL
- Change webhook endpoint to your production domain
- Update webhook signature key

### 3. Test in Production
- Create test bookings
- Verify sync is working
- Check webhook delivery

## API Reference

### Sync Operations
```typescript
import { squareAppointmentsService } from '@/services/square-appointments-service';

// Sync bookings
const result = await squareAppointmentsService.syncBookings({
  batchSize: 50,
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
});

// Sync customers
const customerResult = await squareAppointmentsService.syncCustomers({
  batchSize: 100,
});
```

### Feature Flags
```typescript
import { 
  isSquareAppointmentsEnabled,
  isSquareSyncEnabled,
  isSquareImportEnabled 
} from '@/lib/feature-flags';

if (isSquareAppointmentsEnabled()) {
  // Show Square integration UI
}
```

## Troubleshooting

### Common Issues

1. **Connection Test Fails**
   - Verify access token is correct
   - Check environment setting (Sandbox vs Production)
   - Ensure Square Appointments subscription is active

2. **Webhooks Not Working**
   - Verify webhook URL is accessible
   - Check webhook signature key is correct
   - Ensure webhook events are subscribed

3. **Sync Not Working**
   - Check feature flags are enabled
   - Verify API permissions/scopes
   - Check for rate limiting

4. **Alpha Feature Warnings**
   - These are expected during alpha phase
   - Report any issues to the development team

### Debug Mode
Enable debug logging:
```env
# Add to your .env.local
SQUARE_DEBUG=true
```

### Support
- Check Square API status: [status.squareup.com](https://status.squareup.com)
- Square Developer Forums: [developer.squareup.com/forums](https://developer.squareup.com/forums)
- API Documentation: [developer.squareup.com/reference](https://developer.squareup.com/reference)

## Security Considerations

- ✅ Never expose access tokens in client-side code
- ✅ Always verify webhook signatures
- ✅ Use HTTPS for webhook endpoints
- ✅ Implement rate limiting
- ✅ Regularly rotate access tokens
- ✅ Monitor API usage and set up alerts

## Next Steps

1. **Customize Sync Logic**: Modify `square-appointments-service.ts` to fit your data model
2. **Add Error Handling**: Implement retry logic and error notifications
3. **Performance Optimization**: Add caching and batch processing
4. **User Experience**: Enhance UI based on user feedback
5. **Analytics**: Add sync statistics and monitoring

## Alpha Feature Status

This integration is currently in **alpha** phase. This means:
- ⚠️ Features may change without notice
- ⚠️ Some functionality may be incomplete
- ⚠️ Bugs are expected
- ✅ Core functionality is working
- ✅ Active development is ongoing

Please report any issues or feedback to help improve the integration!