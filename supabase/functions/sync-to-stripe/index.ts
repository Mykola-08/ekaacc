import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
});

serve(async (req) => {
  try {
    const payload = await req.json();
    const { type, table, record, old_record } = payload;

    // 1. Loop Prevention
    if (record?.last_updated_by_system === 'stripe') {
      console.log('Skipping sync: Change originated from Stripe');
      return new Response('Skipped', { status: 200 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SECRET_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // ----------------------------------------------------------------------
    // PROFILES -> STRIPE CUSTOMERS
    // ----------------------------------------------------------------------
    // Note: Table is 'user_profiles' in latest schema, not 'profiles'
    if (table === 'user_profiles' || table === 'profiles') {
      if (type === 'INSERT' || type === 'UPDATE') {
        const { id, email, full_name, phone } = record;

        // Check if we already have a linked Stripe Customer
        const { data: meta } = await supabase
          .from('sync_metadata')
          .select('external_id')
          .eq('local_id', id)
          .eq('entity_type', 'customer')
          .eq('external_system', 'stripe')
          .single();

        let stripeCustomerId = meta?.external_id;

        if (stripeCustomerId) {
          // Update existing customer
          await stripe.customers.update(stripeCustomerId, {
            email: email,
            name: full_name,
            phone: phone,
            metadata: { supabase_id: id },
          });
        } else {
          // Create new customer
          const customer = await stripe.customers.create({
            email: email,
            name: full_name,
            phone: phone,
            metadata: { supabase_id: id },
          });
          stripeCustomerId = customer.id;

          // Save mapping
          await supabase.from('sync_metadata').insert({
            entity_type: 'customer',
            local_id: id,
            external_id: stripeCustomerId,
            external_system: 'stripe',
            sync_status: 'synced',
            last_sync_at: new Date().toISOString(),
          });
        }
      }
      // Handle DELETE if needed
    }

    // ----------------------------------------------------------------------
    // ADDONS -> STRIPE PRODUCTS & PRICES
    // ----------------------------------------------------------------------
    if (table === 'service_addon') {
      if (type === 'INSERT' || type === 'UPDATE') {
        const { id, name, price_cents, stripe_product_id, active } = record;

        // Product Logic
        let productId = stripe_product_id;

        if (productId) {
          await stripe.products.update(productId, {
            name,
            active,
            metadata: { supabase_id: id, type: 'addon' },
          });
        } else {
          const product = await stripe.products.create({
            name,
            active,
            metadata: { supabase_id: id, type: 'addon' },
          });
          productId = product.id;

          await supabase
            .from('service_addon')
            .update({
              stripe_product_id: productId,
              last_updated_by_system: 'stripe',
            })
            .eq('id', id);
        }

        // Price Logic
        const priceChanged =
          type === 'INSERT' || (old_record && old_record.price_cents !== price_cents);

        if (priceChanged && price_cents !== null && price_cents >= 0) {
          const newPrice = await stripe.prices.create({
            product: productId,
            unit_amount: price_cents,
            currency: 'usd',
          });

          await supabase
            .from('service_addon')
            .update({
              stripe_price_id: newPrice.id,
              last_updated_by_system: 'stripe',
            })
            .eq('id', id);
        }
      }
    }

    // ----------------------------------------------------------------------
    // SERVICES (Product Only) -> STRIPE PRODUCTS
    // ----------------------------------------------------------------------
    if (table === 'service') {
      if (type === 'INSERT' || type === 'UPDATE') {
        const { id, name, description, stripe_product_id, active, images } = record;

        // Ensure images is an array of strings (Stripe expects valid URLs)
        const productImages = Array.isArray(images)
          ? images.filter((url: any) => typeof url === 'string' && url.startsWith('http'))
          : [];

        let productId = stripe_product_id;

        if (productId) {
          await stripe.products.update(productId, {
            name,
            description,
            active,
            images: productImages,
            metadata: { supabase_id: id },
          });
        } else {
          const product = await stripe.products.create({
            name,
            description,
            active,
            images: productImages,
            metadata: { supabase_id: id },
          });
          productId = product.id;

          await supabase
            .from('service')
            .update({
              stripe_product_id: productId,
              last_updated_by_system: 'stripe',
            })
            .eq('id', id);
        }
      }
    }

    // ----------------------------------------------------------------------
    // SERVICE VARIANTS (Prices) -> STRIPE PRICES
    // ----------------------------------------------------------------------
    if (table === 'service_variant') {
      if (type === 'INSERT' || type === 'UPDATE') {
        const { id, service_id, name, price_amount, stripe_price_id, active, currency } = record;

        // 1. Get Parent Service Product ID
        const { data: parentService } = await supabase
          .from('service')
          .select('stripe_product_id')
          .eq('id', service_id)
          .single();

        if (!parentService?.stripe_product_id) {
          console.error(`Cannot sync variant ${id}: Parent service has no Stripe Product ID`);
          return new Response('Missing Parent Product ID', { status: 400 });
        }

        const productId = parentService.stripe_product_id;

        // 2. Sync Price (If changed)
        const priceChanged =
          type === 'INSERT' || (old_record && old_record.price_amount !== price_amount);

        if (priceChanged && price_amount !== null) {
          // Stripe prices are immutable. Create new.
          const newPrice = await stripe.prices.create({
            product: productId,
            unit_amount: price_amount,
            currency: (currency || 'eur').toLowerCase(),
            nickname: name, // Variant Name
            metadata: { supabase_variant_id: id },
          });

          await supabase
            .from('service_variant')
            .update({
              stripe_price_id: newPrice.id,
              last_updated_by_system: 'stripe',
            })
            .eq('id', id);
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(err.message, { status: 400 });
  }
});
