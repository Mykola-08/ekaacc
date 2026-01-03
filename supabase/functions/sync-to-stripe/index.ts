import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  try {
    const payload = await req.json()
    const { type, table, record, old_record } = payload
    
    // 1. Loop Prevention
    if (record?.last_updated_by_system === 'stripe') {
      console.log('Skipping sync: Change originated from Stripe')
      return new Response('Skipped', { status: 200 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SECRET_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // ----------------------------------------------------------------------
    // PROFILES -> STRIPE CUSTOMERS
    // ----------------------------------------------------------------------
    if (table === 'profiles') {
      if (type === 'INSERT' || type === 'UPDATE') {
        const { id, email, full_name, phone } = record
        
        // Check if we already have a linked Stripe Customer
        const { data: meta } = await supabase
          .from('sync_metadata')
          .select('external_id')
          .eq('local_id', id)
          .eq('entity_type', 'customer')
          .eq('external_system', 'stripe')
          .single()

        let stripeCustomerId = meta?.external_id

        if (stripeCustomerId) {
          // Update existing customer
          await stripe.customers.update(stripeCustomerId, {
            email: email,
            name: full_name,
            phone: phone,
            metadata: { supabase_id: id }
          })
        } else {
          // Create new customer
          const customer = await stripe.customers.create({
            email: email,
            name: full_name,
            phone: phone,
            metadata: { supabase_id: id }
          })
          stripeCustomerId = customer.id

          // Save mapping
          await supabase.from('sync_metadata').insert({
            entity_type: 'customer',
            local_id: id,
            external_id: stripeCustomerId,
            external_system: 'stripe',
            sync_status: 'synced',
            last_sync_at: new Date().toISOString()
          })
        }
      }
      // Handle DELETE if needed (usually we don't delete customers in Stripe automatically)
    }

    // ----------------------------------------------------------------------
    // SERVICES -> STRIPE PRODUCTS & PRICES
    // ----------------------------------------------------------------------
    if (table === 'service') {
      if (type === 'INSERT' || type === 'UPDATE') {
        const { id, name, description, price, stripe_product_id, stripe_price_id, active } = record
        
        let productId = stripe_product_id
        let priceId = stripe_price_id

        // 1. Sync Product
        if (productId) {
          await stripe.products.update(productId, {
            name,
            description,
            active,
            metadata: { supabase_id: id }
          })
        } else {
          const product = await stripe.products.create({
            name,
            description,
            active,
            metadata: { supabase_id: id }
          })
          productId = product.id
          
          // Update local record with Stripe ID (without triggering loop)
          await supabase.from('service').update({ 
            stripe_product_id: productId,
            last_updated_by_system: 'stripe' // Prevent loop
          }).eq('id', id)
        }

        // 2. Sync Price (if changed)
        // Note: Stripe prices are immutable. We create a new one if it changes.
        // For simplicity, we'll check if the price amount matches the current stripe price.
        // But here we'll just create a new price if it's an update or insert and we want to ensure it exists.
        
        // If we have a priceId, we should check if it matches. 
        // But fetching is expensive. A simple strategy:
        // If it's a new service or price changed, create a new price.
        // Detecting "price changed" requires comparing with old_record.
        
        const priceChanged = type === 'INSERT' || (old_record && old_record.price !== price)
        
        if (priceChanged && price !== null) {
          const newPrice = await stripe.prices.create({
            product: productId,
            unit_amount: price, // Already in cents
            currency: 'usd', // Default to USD, or fetch from config
          })
          
          // Update local record
          await supabase.from('service').update({ 
            stripe_price_id: newPrice.id,
            last_updated_by_system: 'stripe'
          }).eq('id', id)
          
          // If there was an old price, we might want to archive it, but that's optional.
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(err.message, { status: 400 })
  }
})
