# External Services Integration (Square & Stripe)

## Overview

This system provides normalized database storage for external service data from Square and Stripe payment platforms. All services, products, prices, and customer information are stored in a structured, queryable format.

## Database Schema

### Tables

#### 1. `external_service_providers`
Tracks integrated payment/booking platforms.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| provider_name | VARCHAR(50) | Provider name ('square', 'stripe') |
| is_enabled | BOOLEAN | Whether integration is active |
| api_version | VARCHAR(50) | API version in use |
| last_sync_at | TIMESTAMPTZ | Last successful sync timestamp |
| sync_status | VARCHAR(50) | Current sync status |
| config | JSONB | Provider-specific configuration |

#### 2. `external_products`
Normalized storage for products/services from external platforms.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| provider_id | UUID | FK to external_service_providers |
| external_id | VARCHAR(255) | External platform's product ID |
| internal_service_id | UUID | FK to internal services table |
| name | VARCHAR(500) | Product/service name |
| description | TEXT | Product description |
| product_type | VARCHAR(100) | Type ('service', 'good', etc.) |
| category | VARCHAR(200) | Category classification |
| is_active | BOOLEAN | Whether product is active |
| external_data | JSONB | Full JSON from external API |
| last_synced_at | TIMESTAMPTZ | Last sync timestamp |

#### 3. `external_prices`
Normalized storage for pricing information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| provider_id | UUID | FK to external_service_providers |
| product_id | UUID | FK to external_products |
| external_id | VARCHAR(255) | External platform's price ID |
| amount | DECIMAL(12,2) | Price amount (in currency units, not cents) |
| currency | VARCHAR(3) | Currency code (EUR, USD, etc.) |
| pricing_type | VARCHAR(50) | 'one_time', 'recurring', etc. |
| recurring_interval | VARCHAR(20) | 'day', 'week', 'month', 'year' |
| recurring_interval_count | INTEGER | Interval count for recurring |
| trial_period_days | INTEGER | Trial period in days |
| is_active | BOOLEAN | Whether price is active |
| external_data | JSONB | Full JSON from external API |

#### 4. `external_customers`
Normalized storage for customer data.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| provider_id | UUID | FK to external_service_providers |
| external_id | VARCHAR(255) | External platform's customer ID |
| internal_user_id | UUID | FK to auth.users |
| email | VARCHAR(320) | Customer email |
| name | VARCHAR(500) | Customer name |
| phone | VARCHAR(50) | Phone number |
| address | JSONB | Address information |
| is_active | BOOLEAN | Whether customer is active |
| external_data | JSONB | Full JSON from external API |

#### 5. `external_subscriptions`
Normalized storage for subscription data.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| provider_id | UUID | FK to external_service_providers |
| external_id | VARCHAR(255) | External platform's subscription ID |
| customer_id | UUID | FK to external_customers |
| price_id | UUID | FK to external_prices |
| internal_subscription_id | UUID | FK to subscriptions |
| status | VARCHAR(50) | Subscription status |
| current_period_start | TIMESTAMPTZ | Period start |
| current_period_end | TIMESTAMPTZ | Period end |
| trial_start | TIMESTAMPTZ | Trial start |
| trial_end | TIMESTAMPTZ | Trial end |
| canceled_at | TIMESTAMPTZ | Cancellation timestamp |
| external_data | JSONB | Full JSON from external API |

#### 6. `external_sync_log`
Audit log for sync operations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| provider_id | UUID | FK to external_service_providers |
| sync_type | VARCHAR(100) | Type of data synced |
| sync_operation | VARCHAR(50) | Operation type |
| status | VARCHAR(50) | Sync status |
| items_processed | INTEGER | Total items processed |
| items_created | INTEGER | Items created |
| items_updated | INTEGER | Items updated |
| items_failed | INTEGER | Items that failed |
| started_at | TIMESTAMPTZ | Sync start time |
| completed_at | TIMESTAMPTZ | Sync completion time |
| duration_ms | INTEGER | Duration in milliseconds |

## Usage

### Syncing Data

#### Manual Sync from Script

```bash
# Install dependencies if needed
npm install

# Run the sync script
npx tsx scripts/sync-external-services.ts
```

#### Programmatic Sync

```typescript
import ExternalServicesSync from '@/services/external-services-sync';

// Sync Stripe products and prices
const result = await ExternalServicesSync.syncStripe(
  stripeProducts,
  stripePrices
);

console.log('Products synced:', result.products.itemsCreated);
console.log('Prices synced:', result.prices.itemsCreated);
```

### Querying Data

#### Get All Synced Products

```typescript
import ExternalServicesSync from '@/services/external-services-sync';

// Get all Stripe products with prices
const products = await ExternalServicesSync.getSyncedProducts('stripe');

// Get all Square products with prices
const squareProducts = await ExternalServicesSync.getSyncedProducts('square');
```

#### Get Sync Status

```typescript
const status = await ExternalServicesSync.getSyncStatus('stripe');
console.log('Last sync:', status.last_sync_at);
console.log('Status:', status.sync_status);
```

#### Get Sync Logs

```typescript
const logs = await ExternalServicesSync.getSyncLogs('stripe', 10);
logs.forEach(log => {
  console.log(`${log.sync_type}: ${log.status} (${log.items_processed} items)`);
});
```

#### Direct Database Queries

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

// Get all active Stripe products with their prices
const { data } = await supabase
  .from('external_products')
  .select(`
    *,
    provider:external_service_providers(*),
    prices:external_prices(*)
  `)
  .eq('is_active', true)
  .order('name');

// Get products in a specific price range
const { data: affordableServices } = await supabase
  .from('external_prices')
  .select(`
    *,
    product:external_products(*)
  `)
  .gte('amount', 50)
  .lte('amount', 100)
  .eq('currency', 'EUR');

// Get all recurring subscriptions
const { data: subscriptions } = await supabase
  .from('external_prices')
  .select(`
    *,
    product:external_products(*)
  `)
  .eq('pricing_type', 'recurring')
  .order('amount');
```

## Data Flow

```
External API (Stripe/Square)
    ↓
MCP Tools (mcp_stripe_*, mcp_square_*)
    ↓
ExternalServicesSync Service
    ↓
Normalized Database Tables
    ↓
Application Logic
```

## Benefits of Normalization

1. **Single Source of Truth**: All external service data in one place
2. **Easy Querying**: Fast searches across products, prices, and customers
3. **Audit Trail**: Complete sync history in `external_sync_log`
4. **Offline Access**: Local copy of external data for faster reads
5. **Cross-Platform Analytics**: Compare Stripe vs Square data easily
6. **Internal Linking**: Link external products to internal services
7. **Data Consistency**: Structured schema ensures data quality

## Current Data (as of sync)

### Stripe Products Synced: 25
- Kinesiology Session
- Constellations
- 360° Review
- Muscle Tension Relief 4 in 1
- EKA Privé VIP
- Servicios Corporativos
- Suscripción Diamond
- Movement Lesson
- Nutrición Integrativa
- Suscripción Silver
- Suscripción Gold
- Sesión Individual
- Feldenkrais
- Suscripción Bronze
- Pack de Sesiones
- Free Consultation
- Massage Rubí Premium
- Massage Rubí Full
- Massage Rubí Basic
- 360° Revision
- Kinesiology Barcelona
- Massage Barcelona VIP
- Massage Barcelona Premium
- Massage Barcelona Full
- Massage Barcelona Basic

### Stripe Prices Synced: 45
- Price range: €0 - €500 (converted from cents)
- One-time and recurring billing options
- Multiple price points per product

## Maintenance

### Running Regular Syncs

Add to your cron jobs or scheduled tasks:

```bash
# Daily sync at 2 AM
0 2 * * * cd /path/to/project && npx tsx scripts/sync-external-services.ts
```

### Monitoring Sync Health

```sql
-- Check recent sync status
SELECT 
  provider_name,
  sync_type,
  status,
  items_processed,
  items_failed,
  started_at,
  duration_ms
FROM external_sync_log
JOIN external_service_providers ON external_sync_log.provider_id = external_service_providers.id
ORDER BY started_at DESC
LIMIT 10;

-- Check for failed syncs
SELECT *
FROM external_sync_log
WHERE status = 'failed'
ORDER BY started_at DESC;
```

## Migration

The database migration is located at:
```
supabase/migrations/20251121_external_services_catalog.sql
```

To apply the migration:

```bash
# Using Supabase CLI
supabase db push

# Or deploy via Supabase Dashboard
# Copy the migration SQL and run in SQL Editor
```

## API Integration

### Stripe Integration

The system uses Stripe MCP tools:
- `mcp_stripe_list_products`
- `mcp_stripe_list_prices`
- `mcp_stripe_list_customers`
- `mcp_stripe_list_subscriptions`

### Square Integration

The system uses Square MCP tools:
- `mcp_square_get_service_info`
- `mcp_square_make_api_request`
- `mcp_square_get_type_info`

## Next Steps

1. **Run Migration**: Apply the database migration to Supabase
2. **Test Sync**: Run the sync script to populate the database
3. **Verify Data**: Query the tables to ensure data is correct
4. **Schedule Syncs**: Set up automated syncs via cron or Vercel cron
5. **Link Internal Services**: Map external products to internal service IDs
6. **Build UI**: Create admin interfaces to view and manage synced data

## Troubleshooting

### Sync Fails

Check the sync log:
```typescript
const logs = await ExternalServicesSync.getSyncLogs('stripe', 1);
console.log(logs[0].error_message);
console.log(logs[0].error_details);
```

### Missing Products

Verify provider is enabled:
```sql
SELECT * FROM external_service_providers WHERE provider_name = 'stripe';
```

### Price Mismatches

Note that Stripe returns prices in cents, but we store in currency units:
- Stripe: `7000` (cents) → Database: `70.00` (euros)
