
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!supabaseUrl || !supabaseServiceKey || !stripeSecretKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-11-17.clover' });

async function setupStripe() {
  console.log('Starting Stripe setup...');

  // 1. Get Tiers from DB
  const { data: tiers, error } = await supabase
    .from('subscription_tiers')
    .select('*')
    .order('monthly_price');

  if (error) {
    console.error('Error fetching tiers:', error);
    return;
  }

  console.log(`Found ${tiers.length} tiers in database.`);

  for (const tier of tiers) {
    console.log(`Processing tier: ${tier.name}`);

    let productId = tier.stripe_product_id;
    let monthlyPriceId = tier.stripe_monthly_price_id;
    let yearlyPriceId = tier.stripe_yearly_price_id;

    // Create Product if missing
    if (!productId) {
      console.log(`Creating product for ${tier.name}...`);
      const product = await stripe.products.create({
        name: tier.name,
        description: `Subscription to ${tier.name} tier`,
        metadata: {
          tier_id: tier.id,
          tier_type: tier.type,
        },
      });
      productId = product.id;
      await supabase
        .from('subscription_tiers')
        .update({ stripe_product_id: productId })
        .eq('id', tier.id);
    } else {
        console.log(`Product already exists: ${productId}`);
    }

    // Create Monthly Price if missing
    if (!monthlyPriceId && tier.monthly_price > 0) {
      console.log(`Creating monthly price for ${tier.name}...`);
      const price = await stripe.prices.create({
        product: productId,
        unit_amount: Math.round(tier.monthly_price * 100), // cents
        currency: tier.currency.toLowerCase(),
        recurring: { interval: 'month' },
        metadata: {
          tier_id: tier.id,
          interval: 'monthly',
        },
      });
      monthlyPriceId = price.id;
      await supabase
        .from('subscription_tiers')
        .update({ stripe_monthly_price_id: monthlyPriceId })
        .eq('id', tier.id);
    }

    // Create Yearly Price if missing
    if (!yearlyPriceId && tier.yearly_price > 0) {
      console.log(`Creating yearly price for ${tier.name}...`);
      const price = await stripe.prices.create({
        product: productId,
        unit_amount: Math.round(tier.yearly_price * 100), // cents
        currency: tier.currency.toLowerCase(),
        recurring: { interval: 'year' },
        metadata: {
          tier_id: tier.id,
          interval: 'yearly',
        },
      });
      yearlyPriceId = price.id;
      await supabase
        .from('subscription_tiers')
        .update({ stripe_yearly_price_id: yearlyPriceId })
        .eq('id', tier.id);
    }
    
    console.log(`Finished processing ${tier.name}.`);
  }

  console.log('Stripe setup complete.');
}

setupStripe().catch(console.error);
