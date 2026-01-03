import { SquareClient, SquareEnvironment } from 'square';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { translateText } from '@/lib/translations';

// Initialize Square Client
const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
});

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

export class SquareStripeSyncService {
  
  /**
   * Syncs all Appointment Services from Square to Stripe and Supabase
   */
  async syncServices() {
    console.log('Starting Square -> Stripe Service Sync...');
    
    try {
      // 1. Fetch all items from Square
      // Using searchCatalogObjects (exposed as .search) since searchCatalogItems might not be available
      const response = await squareClient.catalog.search({
        objectTypes: ['ITEM']
      });

      if (!response.objects) {
        console.log('No services found in Square.');
        return;
      }

      for (const item of response.objects) {
        // Filter for Appointment Services if needed, though we process all ITEMs
        if (item.type !== 'ITEM') continue;

        const itemData = (item as any).itemData;
        if (itemData?.productType && itemData.productType !== 'APPOINTMENTS_SERVICE') {
          continue;
        }
        await this.syncItem(item);
      }

      console.log('Sync completed successfully.');
    } catch (error) {
      console.error('Error syncing services:', error);
      throw error;
    }
  }

  /**
   * Syncs a single Catalog Item
   */
  async syncItem(item: any) {
    if (item.type !== 'ITEM') return;

    const squareId = item.id;
    const name = translateText(item.itemData?.name || '');
    const description = translateText(item.itemData?.description || '');
    
    console.log(`Syncing item: ${name} (${squareId})`);

    // 1. Sync to Supabase (Optional - for caching/reference)
    // We sync each variation as a separate service in Supabase because 'services' table seems to represent bookable items with a single price/duration.
    // We do this inside the variation loop.

    // 2. Sync to Stripe
    let product = await this.findStripeProduct(squareId, name);

    if (product) {
      // Update existing product
      product = await stripe.products.update(product.id, {
        name,
        description,
        metadata: {
          square_id: squareId,
          synced_at: new Date().toISOString(),
        }
      });
      console.log(`Updated Stripe Product: ${product.id}`);
    } else {
      // Create new product
      product = await stripe.products.create({
        name,
        description,
        metadata: {
          square_id: squareId,
          synced_at: new Date().toISOString(),
        }
      });
      console.log(`Created Stripe Product: ${product.id}`);
    }

    // 3. Sync Variations (Prices)
    if (item.itemData?.variations) {
      for (const variation of item.itemData.variations) {
        await this.syncVariation(variation, product.id, name);
      }
    }
  }

  /**
   * Syncs a Variation (Price)
   */
  async syncVariation(variation: any, stripeProductId: string, productName: string) {
    const squareVariationId = variation.id;
    const variationName = translateText(variation.itemVariationData?.name || '');
    const priceMoney = variation.itemVariationData?.priceMoney;
    const duration = variation.itemVariationData?.serviceDuration; // in ms

    if (!priceMoney) return;

    const amount = Number(priceMoney.amount); // Square is in cents usually
    const currency = priceMoney.currency;

    // --- Sync to Supabase ---
    await this.syncToSupabase(variation, productName, variationName, amount, currency, duration);

    // --- Sync to Stripe ---
    // Find existing price in Stripe
    const prices = await stripe.prices.list({
      product: stripeProductId,
      active: true,
      limit: 100,
    });

    // Check if we have a price with the same amount and metadata OR same nickname/amount
    const existingPrice = prices.data.find(p => 
      (p.metadata?.square_variation_id === squareVariationId) ||
      (p.nickname === variationName && p.unit_amount === amount && p.currency.toUpperCase() === currency)
    );

    if (existingPrice) {
      console.log(`Price already exists for ${variationName}: ${existingPrice.id}`);
      // Update metadata if missing
      if (existingPrice.metadata?.square_variation_id !== squareVariationId) {
          await stripe.prices.update(existingPrice.id, {
              metadata: {
                  square_variation_id: squareVariationId
              }
          });
      }
      
      // If name changed, we can't easily update price nickname via API in a way that matters much for checkout, 
      // but we can update metadata.
      if (existingPrice.nickname !== variationName) {
          await stripe.prices.update(existingPrice.id, {
              nickname: variationName
          });
      }
    } else {
      // Create new price
      // Note: We cannot "update" a price amount in Stripe. We must create a new one and archive the old one if needed.
      // For simplicity, we just create the new one. Archiving old ones is a bit more complex logic (need to know which one was the "old" one).
      
      // Archive old prices for this variation if any
      const oldPrices = prices.data.filter(p => p.metadata?.square_variation_id === squareVariationId);
      for (const oldPrice of oldPrices) {
          await stripe.prices.update(oldPrice.id, { active: false });
          console.log(`Archived old price: ${oldPrice.id}`);
      }

      const newPrice = await stripe.prices.create({
        product: stripeProductId,
        unit_amount: amount,
        currency: currency,
        nickname: variationName,
        metadata: {
          square_variation_id: squareVariationId,
        }
      });
      console.log(`Created Stripe Price: ${newPrice.id} for ${variationName}`);
    }
  }

  /**
   * Syncs a variation to Supabase 'services' table
   */
  async syncToSupabase(variation: any, productName: string, variationName: string, amount: number, currency: string, durationMs: number) {
    const squareVariationId = variation.id;
    const fullName = `${productName} - ${variationName}`;
    const durationMinutes = durationMs ? Math.round(durationMs / 60000) : 60;

    // Check if exists in sync_metadata
    const { data: metadata } = await (supabase
      .from('sync_metadata') as any)
      .select('*')
      .eq('external_id', squareVariationId)
      .eq('external_system', 'square')
      .eq('table_name', 'services')
      .single();

    let serviceId: string;

    if (metadata) {
      serviceId = metadata.record_id;
      // Update Service
      await (supabase
        .from('service') as any)
        .update({
          name: fullName,
          price: amount / 100, // Supabase usually stores decimal/numeric
          // currency: currency, // service table does not have currency column
          duration: durationMinutes,
          // updated_at: new Date().toISOString(), // service table might not have updated_at? Schema says created_at.
        })
        .eq('id', serviceId);
      console.log(`Updated Supabase Service: ${serviceId}`);
    } else {
      // Create Service
      const { data: newService, error } = await (supabase
        .from('service') as any)
        .insert({
          name: fullName,
          price: amount / 100,
          currency: currency,
          duration: durationMinutes,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating Supabase service:', error);
        return;
      }
      serviceId = newService.id;
      console.log(`Created Supabase Service: ${serviceId}`);

      // Create Metadata
      await (supabase
        .from('sync_metadata') as any)
        .insert({
          table_name: 'services',
          record_id: serviceId,
          external_id: squareVariationId,
          external_system: 'square',
          sync_status: 'synced',
          sync_direction: 'inbound',
          last_sync_time: new Date().toISOString(),
        });
    }
  }

  /**
   * Find a Stripe product by Square ID stored in metadata or by Name
   */
  async findStripeProduct(squareId: string, name?: string) {
    // 1. Try by Metadata
    const search = await stripe.products.search({
      query: `metadata['square_id']:'${squareId}'`,
      limit: 1,
    });
    if (search.data[0]) return search.data[0];

    // 2. Try by Name (if provided)
    if (name) {
      const searchByName = await stripe.products.search({
        query: `name:"${name}"`,
        limit: 1,
      });
      if (searchByName.data[0]) {
        // Found by name, update metadata so next time we find by ID
        await stripe.products.update(searchByName.data[0].id, {
          metadata: { square_id: squareId }
        });
        return searchByName.data[0];
      }
    }

    return null;
  }
}

export const squareStripeSyncService = new SquareStripeSyncService();
