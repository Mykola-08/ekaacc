# Square Appointments Bidirectional Sync System

## Overview

This document describes the comprehensive bidirectional synchronization system between Square Appointments and Supabase, including real-time sync capabilities, conflict resolution, and monitoring features.

## Features

### 🔄 Bidirectional Sync
- **Inbound Sync**: Square → Supabase (bookings, customers)
- **Outbound Sync**: Supabase → Square (bookings, customers)
- **Real-time Sync**: Webhook-based immediate updates
- **Conflict Resolution**: Multiple strategies (local_wins, external_wins, merge, manual)

### 📊 Monitoring & Analytics
- **Sync Statistics**: Track sync performance and success rates
- **Conflict Management**: Visual conflict resolution interface
- **Queue Management**: Monitor pending and failed sync items
- **Health Monitoring**: Real-time system health status

### ⚙️ Configuration
- **Feature Flags**: Alpha/beta feature controls
- **Environment Support**: Sandbox and Production environments
- **Webhook Management**: Secure webhook signature verification
- **Retry Logic**: Automatic retry with exponential backoff

## Architecture

### Core Components

1. **BidirectionalSyncService** (`src/services/bidirectional-sync-service.ts`)
   - Main sync orchestration
   - Conflict detection and resolution
   - Queue management
   - Statistics tracking

2. **Webhook Handler** (`src/app/api/webhooks/square/bidirectional-route.ts`)
   - Real-time event processing
   - Signature verification
   - Event routing and handling
   - Sync loop prevention

3. **Database Triggers** (`supabase/migrations/20241118_sync_triggers.sql`)
   - Automatic change detection
   - Sync queue population
   - Metadata management

4. **Sync Monitoring Dashboard** (`src/components/square/sync-monitoring-dashboard.tsx`)
   - Real-time sync status
   - Conflict resolution UI
   - Statistics visualization
   - Manual sync controls

### Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Square    │     │  Bidirectional │     │  Supabase   │
│  Appointments│◄────►   Sync Service │◄────►  Database  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │ Webhooks           │                    │ Triggers
       ▼                    ▼                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Real-time   │     │ Conflict    │     │ Change      │
│ Updates     │     │ Resolution  │     │ Detection   │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Configuration

### Environment Variables

```bash
# Square API Configuration
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_ENVIRONMENT=Sandbox|Production
SQUARE_WEBHOOK_SIGNATURE_KEY=your_webhook_signature_key

# Feature Flags (Alpha Features)
NEXT_PUBLIC_SQUARE_APPOINTMENTS_ENABLED=true
NEXT_PUBLIC_SQUARE_SYNC_ENABLED=true
NEXT_PUBLIC_SQUARE_WEBHOOKS_ENABLED=true
NEXT_PUBLIC_SQUARE_IMPORT_ENABLED=true
```

### Database Schema

#### Sync Metadata Table
```sql
CREATE TABLE sync_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    local_id UUID NOT NULL,
    external_id VARCHAR(255) NOT NULL,
    external_system VARCHAR(50) NOT NULL,
    entity_status VARCHAR(20) DEFAULT 'active',
    sync_status VARCHAR(20) DEFAULT 'pending',
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_version INTEGER DEFAULT 1,
    external_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Sync Queue Table
```sql
CREATE TABLE sync_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    operation VARCHAR(20) NOT NULL,
    direction VARCHAR(20) NOT NULL,
    external_system VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Sync Conflicts Table
```sql
CREATE TABLE sync_conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    local_id UUID NOT NULL,
    external_id VARCHAR(255) NOT NULL,
    external_system VARCHAR(50) NOT NULL,
    conflict_type VARCHAR(50) NOT NULL,
    local_data JSONB,
    external_data JSONB,
    resolution_strategy VARCHAR(50),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Usage

### Manual Sync

Trigger a manual sync through the API:

```bash
# Test sync functionality
curl -X POST http://localhost:3000/api/square/sync/test \
  -H "Content-Type: application/json" \
  -d '{
    "direction": "bidirectional",
    "batchSize": 50,
    "conflictResolution": "merge"
  }'
```

### Webhook Setup

1. **Configure in Square Dashboard**:
   - Go to Square Developer Dashboard
   - Navigate to Webhooks section
   - Add webhook URL: `https://your-domain.com/api/webhooks/square`
   - Subscribe to events:
     - `booking.created`
     - `booking.updated`
     - `booking.cancelled`
     - `customer.created`
     - `customer.updated`
     - `customer.deleted`

2. **Verify Webhook Signature**:
   - Set `SQUARE_WEBHOOK_SIGNATURE_KEY` environment variable
   - Webhook handler automatically verifies signatures

### Conflict Resolution

The system supports four conflict resolution strategies:

1. **local_wins**: Local data takes precedence
2. **external_wins**: External (Square) data takes precedence
3. **merge**: Intelligent merging of both data sources
4. **manual**: Conflicts logged for manual resolution

### Monitoring

Access the sync monitoring dashboard:

1. Navigate to Square Admin Panel
2. Click on "Sync Monitoring" tab
3. View real-time sync status, conflicts, and statistics
4. Manually resolve conflicts or trigger syncs

## API Reference

### BidirectionalSyncService

#### Methods

```typescript
// Main sync method
async syncBidirectional(options: SyncOptions): Promise<SyncResult>

// Get sync statistics
async getSyncStatistics(): Promise<SyncStatistics[]>

// Get pending conflicts
async getPendingConflicts(): Promise<SyncConflict[]>

// Health check
async healthCheck(): Promise<boolean>

// Queue outbound sync
async queueOutboundSync(
  entityType: string, 
  entityId: string, 
  operation: string, 
  payload: any
): Promise<void>
```

#### SyncOptions

```typescript
interface SyncOptions {
  batchSize?: number;
  startDate?: Date;
  endDate?: Date;
  locationId?: string;
  teamMemberId?: string;
  customerId?: string;
  direction?: 'inbound' | 'outbound' | 'bidirectional';
  conflictResolution?: 'local_wins' | 'external_wins' | 'merge' | 'manual';
}
```

## Testing

### Run Tests

```bash
# Run the test script
npm run test:sync

# Or use the API endpoint
curl http://localhost:3000/api/square/sync/test
```

### Test Scenarios

1. **Basic Sync**: Verify data flows correctly in both directions
2. **Conflict Resolution**: Test all conflict resolution strategies
3. **Webhook Processing**: Verify real-time updates work
4. **Error Handling**: Test retry logic and error recovery
5. **Performance**: Test with large datasets

## Troubleshooting

### Common Issues

1. **Webhook Not Receiving Events**:
   - Check webhook URL is accessible
   - Verify signature key is correct
   - Check Square Dashboard webhook status

2. **Sync Failures**:
   - Check API credentials
   - Verify feature flags are enabled
   - Review error logs in monitoring dashboard

3. **Conflicts Not Resolving**:
   - Check conflict resolution strategy
   - Verify data mapping is correct
   - Review conflict details in dashboard

4. **Performance Issues**:
   - Adjust batch size for large datasets
   - Check database indexes
   - Monitor sync queue size

### Debug Mode

Enable debug logging:

```bash
# Set debug environment variable
DEBUG=square-sync:* npm run dev
```

## Security Considerations

- **Webhook Signature Verification**: All webhooks are verified using HMAC-SHA256
- **API Key Management**: Secure storage of Square API credentials
- **Data Sanitization**: All external data is validated before processing
- **Rate Limiting**: Built-in rate limiting for API calls
- **Audit Logging**: All sync operations are logged for audit purposes

## Performance Optimization

- **Batch Processing**: Configurable batch sizes for large datasets
- **Database Indexes**: Optimized indexes for sync queries
- **Queue Management**: Efficient queue processing with retry logic
- **Caching**: Smart caching of frequently accessed data
- **Background Processing**: Async processing of webhooks and syncs

## Future Enhancements

- **Advanced Analytics**: More detailed sync analytics and reporting
- **Multi-location Support**: Enhanced support for multiple Square locations
- **Custom Field Mapping**: Configurable field mappings between systems
- **Advanced Conflict Rules**: More sophisticated conflict resolution rules
- **Integration Testing**: Automated integration test suite

## Support

For issues and questions:
- Check the troubleshooting section
- Review logs in the monitoring dashboard
- Check webhook delivery status in Square Dashboard
- Contact development team with sync statistics and error details