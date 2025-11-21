/**
 * External Services Sync Service
 * Syncs products, prices, and customers from Square and Stripe to local database
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!url || !key) {
      throw new Error('Supabase URL and Service Role Key are required');
    }
    
    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}

interface SyncResult {
  provider: string;
  type: string;
  itemsProcessed: number;
  itemsCreated: number;
  itemsUpdated: number;
  itemsDeleted: number;
  itemsFailed: number;
  errors: string[];
  duration: number;
}

interface StripeProduct {
  id: string;
  name: string;
  type: string;
  description: string | null;
  active?: boolean;
  metadata?: Record<string, any>;
}

interface StripePrice {
  id: string;
  amount: number;
  currency: string;
  product: string;
  type: string;
  recurring: {
    interval: string;
    interval_count: number;
    trial_period_days?: number;
  } | null;
}

export class ExternalServicesSync {
  /**
   * Sync all Stripe products to the database
   */
  static async syncStripeProducts(products: StripeProduct[]): Promise<SyncResult> {
    const startTime = Date.now();
    const result: SyncResult = {
      provider: 'stripe',
      type: 'products',
      itemsProcessed: 0,
      itemsCreated: 0,
      itemsUpdated: 0,
      itemsDeleted: 0,
      itemsFailed: 0,
      errors: [],
      duration: 0,
    };

    try {
      // Get Stripe provider ID
      const { data: provider, error: providerError } = await getSupabaseClient()
        .from('external_service_providers')
        .select('id')
        .eq('provider_name', 'stripe')
        .single();

      if (providerError || !provider) {
        throw new Error('Stripe provider not found in database');
      }

      const providerId = provider.id;

      // Start sync log
      const { data: syncLog, error: syncLogError } = await getSupabaseClient()
        .from('external_sync_log')
        .insert({
          provider_id: providerId,
          sync_type: 'products',
          sync_operation: 'full_sync',
          status: 'in_progress',
          triggered_by: 'manual',
        })
        .select()
        .single();

      if (syncLogError) {
        console.error('Failed to create sync log:', syncLogError);
      }

      // Process each product
      for (const product of products) {
        result.itemsProcessed++;

        try {
          const productData = {
            provider_id: providerId,
            external_id: product.id,
            name: product.name,
            description: product.description,
            product_type: product.type,
            is_active: product.active ?? true,
            external_data: product,
            last_synced_at: new Date().toISOString(),
          };

          // Upsert product
          const { data, error } = await getSupabaseClient()
            .from('external_products')
            .upsert(productData, {
              onConflict: 'provider_id,external_id',
            })
            .select();

          if (error) {
            result.itemsFailed++;
            result.errors.push(`Product ${product.id}: ${error.message}`);
          } else {
            // Check if it was an insert or update
            const { count } = await getSupabaseClient()
              .from('external_products')
              .select('*', { count: 'exact', head: true })
              .eq('provider_id', providerId)
              .eq('external_id', product.id);

            if (count === 1) {
              result.itemsCreated++;
            } else {
              result.itemsUpdated++;
            }
          }
        } catch (error) {
          result.itemsFailed++;
          result.errors.push(
            `Product ${product.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }

      // Update sync log
      if (syncLog) {
        await getSupabaseClient()
          .from('external_sync_log')
          .update({
            status: result.itemsFailed === 0 ? 'success' : 'partial_success',
            items_processed: result.itemsProcessed,
            items_created: result.itemsCreated,
            items_updated: result.itemsUpdated,
            items_failed: result.itemsFailed,
            completed_at: new Date().toISOString(),
            duration_ms: Date.now() - startTime,
            error_details: result.errors.length > 0 ? { errors: result.errors } : null,
          })
          .eq('id', syncLog.id);
      }

      // Update provider sync status
      await getSupabaseClient()
        .from('external_service_providers')
        .update({
          last_sync_at: new Date().toISOString(),
          sync_status: result.itemsFailed === 0 ? 'success' : 'error',
          sync_error: result.errors.length > 0 ? result.errors.join('; ') : null,
        })
        .eq('id', providerId);
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      result.itemsFailed = result.itemsProcessed;
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * Sync all Stripe prices to the database
   */
  static async syncStripePrices(prices: StripePrice[]): Promise<SyncResult> {
    const startTime = Date.now();
    const result: SyncResult = {
      provider: 'stripe',
      type: 'prices',
      itemsProcessed: 0,
      itemsCreated: 0,
      itemsUpdated: 0,
      itemsDeleted: 0,
      itemsFailed: 0,
      errors: [],
      duration: 0,
    };

    try {
      // Get Stripe provider ID
      const { data: provider, error: providerError } = await getSupabaseClient()
        .from('external_service_providers')
        .select('id')
        .eq('provider_name', 'stripe')
        .single();

      if (providerError || !provider) {
        throw new Error('Stripe provider not found in database');
      }

      const providerId = provider.id;

      // Start sync log
      const { data: syncLog, error: syncLogError } = await getSupabaseClient()
        .from('external_sync_log')
        .insert({
          provider_id: providerId,
          sync_type: 'prices',
          sync_operation: 'full_sync',
          status: 'in_progress',
          triggered_by: 'manual',
        })
        .select()
        .single();

      if (syncLogError) {
        console.error('Failed to create sync log:', syncLogError);
      }

      // Process each price
      for (const price of prices) {
        result.itemsProcessed++;

        try {
          // Get the product UUID from external_products
          const { data: productData, error: productError } = await getSupabaseClient()
            .from('external_products')
            .select('id')
            .eq('provider_id', providerId)
            .eq('external_id', price.product)
            .single();

          if (productError || !productData) {
            result.itemsFailed++;
            result.errors.push(`Price ${price.id}: Product not found (${price.product})`);
            continue;
          }

          const priceData = {
            provider_id: providerId,
            product_id: productData.id,
            external_id: price.id,
            amount: price.amount / 100, // Convert from cents to currency units
            currency: price.currency.toUpperCase(),
            pricing_type: price.type,
            recurring_interval: price.recurring?.interval || null,
            recurring_interval_count: price.recurring?.interval_count || null,
            trial_period_days: price.recurring?.trial_period_days || null,
            is_active: true,
            external_data: price,
            last_synced_at: new Date().toISOString(),
          };

          // Upsert price
          const { error } = await getSupabaseClient()
            .from('external_prices')
            .upsert(priceData, {
              onConflict: 'provider_id,external_id',
            });

          if (error) {
            result.itemsFailed++;
            result.errors.push(`Price ${price.id}: ${error.message}`);
          } else {
            result.itemsCreated++;
          }
        } catch (error) {
          result.itemsFailed++;
          result.errors.push(
            `Price ${price.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }

      // Update sync log
      if (syncLog) {
        await getSupabaseClient()
          .from('external_sync_log')
          .update({
            status: result.itemsFailed === 0 ? 'success' : 'partial_success',
            items_processed: result.itemsProcessed,
            items_created: result.itemsCreated,
            items_updated: result.itemsUpdated,
            items_failed: result.itemsFailed,
            completed_at: new Date().toISOString(),
            duration_ms: Date.now() - startTime,
            error_details: result.errors.length > 0 ? { errors: result.errors } : null,
          })
          .eq('id', syncLog.id);
      }
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      result.itemsFailed = result.itemsProcessed;
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * Sync all products and prices from Stripe
   */
  static async syncStripe(
    products: StripeProduct[],
    prices: StripePrice[]
  ): Promise<{ products: SyncResult; prices: SyncResult }> {
    const productResult = await this.syncStripeProducts(products);
    const priceResult = await this.syncStripePrices(prices);

    return {
      products: productResult,
      prices: priceResult,
    };
  }

  /**
   * Get all synced products with their prices
   */
  static async getSyncedProducts(provider: 'stripe' | 'square') {
    const { data: providerData } = await getSupabaseClient()
      .from('external_service_providers')
      .select('id')
      .eq('provider_name', provider)
      .single();

    if (!providerData) {
      return [];
    }

    const { data, error } = await getSupabaseClient()
      .from('external_products')
      .select(
        `
        *,
        prices:external_prices(*)
      `
      )
      .eq('provider_id', providerData.id)
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching synced products:', error);
      return [];
    }

    return data;
  }

  /**
   * Get sync status for a provider
   */
  static async getSyncStatus(provider: 'stripe' | 'square') {
    const { data, error } = await getSupabaseClient()
      .from('external_service_providers')
      .select('*')
      .eq('provider_name', provider)
      .single();

    if (error) {
      console.error('Error fetching sync status:', error);
      return null;
    }

    return data;
  }

  /**
   * Get recent sync logs
   */
  static async getSyncLogs(provider: 'stripe' | 'square', limit = 20) {
    const { data: providerData } = await getSupabaseClient()
      .from('external_service_providers')
      .select('id')
      .eq('provider_name', provider)
      .single();

    if (!providerData) {
      return [];
    }

    const { data, error } = await getSupabaseClient()
      .from('external_sync_log')
      .select('*')
      .eq('provider_id', providerData.id)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching sync logs:', error);
      return [];
    }

    return data;
  }
}

export default ExternalServicesSync;

