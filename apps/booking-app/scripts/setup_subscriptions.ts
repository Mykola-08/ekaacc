
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from apps/booking-app/.env.local or similar if possible, 
// strictly we rely on the environment variables being set or passed.
dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !STRIPE_SECRET_KEY) {
  console.error('Missing env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or STRIPE_SECRET_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
// @ts-ignore - Stripe version string mismatch in types
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' });

const SUBSCRIPTIONS = [
  {
    name: 'VIP Membership',
    description: 'Exclusive access to VIP services and priority booking.',
    priceAmount: 2999, // 29.99 EUR
    currency: 'eur',
    interval: 'month',
    type: 'subscription',
    tags: ['vip', 'membership']
  },
  {
    name: 'Loyal Membership',
    description: 'Loyalty perks and discounts on all bookings.',
    priceAmount: 9999, // 99.99 EUR
    currency: 'eur',
    interval: 'year',
    type: 'subscription',
    tags: ['loyal', 'membership']
  }
];

async function main() {
  console.log('Starting Subscription Setup...');

  for (const sub of SUBSCRIPTIONS) {
    console.log(`Processing: ${sub.name}`);

    // 1. Create/Get Product in Stripe
    // We search by name to avoid duplicates if run multiple times
    const search = await stripe.products.search({ query: `name:'${sub.name}'` });
    let product = search.data[0];

    if (!product) {
      console.log(`Creating Stripe Product: ${sub.name}`);
      product = await stripe.products.create({
        name: sub.name,
        description: sub.description,
      });
    } else {
      console.log(`Found existing Stripe Product: ${product.id}`);
    }

    // 2. Create Price in Stripe
    // We check if a price with multiple params exists? 
    // Easier to just create one if we don't store it, but we should try to find it.
    // List prices for product
    const prices = await stripe.prices.list({ product: product.id, active: true });
    let price = prices.data.find(p => 
      p.unit_amount === sub.priceAmount && 
      p.currency === sub.currency && 
      p.recurring?.interval === sub.interval
    );

    if (!price) {
      console.log(`Creating Stripe Price: ${sub.priceAmount/100} ${sub.currency}/${sub.interval}`);
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: sub.priceAmount,
        currency: sub.currency,
        recurring: { interval: sub.interval as any },
      });
    } else {
      console.log(`Found existing Stripe Price: ${price.id}`);
    }

    // 3. Upsert into Supabase service table
    // We use name as a unique key for lookup to update if exists?
    // Or we just insert.
    
    // Check if service exists by name
    const { data: existingServices } = await supabase
      .from('service')
      .select('id')
      .eq('name', sub.name)
      .limit(1);

    let serviceId;

    if (existingServices && existingServices.length > 0) {
      serviceId = existingServices[0].id;
      console.log(`Updating existing Service: ${serviceId}`);
      await supabase.from('service').update({
        stripe_product_id: product.id,
        description: sub.description,
        tags: sub.tags,
        metadata: { type: 'subscription' }
      }).eq('id', serviceId);
    } else {
      console.log(`Inserting new Service`);
      const { data: newService, error } = await supabase.from('service').insert({
        name: sub.name,
        description: sub.description,
        stripe_product_id: product.id,
        tags: sub.tags,
        metadata: { type: 'subscription' }
      }).select().single();
      
      if (error) {
        console.error('Error inserting service:', error);
        continue;
      }
      serviceId = newService.id;
    }

    // 4. Upsert into service_variant
    // We'll create a single variant for the subscription
    const { data: existingVariants } = await supabase
      .from('service_variant')
      .select('id')
      .eq('service_id', serviceId)
      .eq('price_amount', sub.priceAmount) // Simplistic check
      .limit(1);

    if (existingVariants && existingVariants.length > 0) {
      console.log(`Updating Variant: ${existingVariants[0].id}`);
      await supabase.from('service_variant').update({
        stripe_price_id: price.id,
        name: `${sub.interval}ly`,
        duration_min: 0 // Subscriptions don't really have duration in minutes like sessions
      }).eq('id', existingVariants[0].id);
    } else {
      console.log(`Inserting new Variant`);
      await supabase.from('service_variant').insert({
        service_id: serviceId,
        name: `${sub.interval}ly`,
        duration_min: 0,
        price_amount: sub.priceAmount,
        currency: sub.currency.toUpperCase(),
        stripe_price_id: price.id
      });
    }

    console.log(`Done with ${sub.name}`);
  }
}

main().catch(console.error);
