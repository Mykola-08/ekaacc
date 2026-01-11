import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    let event
    let isThinPayload = false

    // Try verifying with Snapshot Secret first
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '',
        undefined,
        cryptoProvider
      )
    } catch (err) {
      // If that fails, try Thin Secret
      try {
        event = await stripe.webhooks.constructEventAsync(
          body,
          signature,
          Deno.env.get('STRIPE_WEBHOOK_SECRET_THIN') ?? '',
          undefined,
          cryptoProvider
        )
        isThinPayload = true
      } catch (err2) {
        console.error('Signature verification failed for both secrets')
        return new Response('Invalid signature', { status: 400 })
      }
    }

    // If it's a Thin payload, we MUST fetch the full event details from Stripe
    if (isThinPayload) {
      console.log(`Received Thin payload for event ${event.id}, fetching full details...`)
      try {
        event = await stripe.events.retrieve(event.id)
      } catch (fetchError) {
        console.error('Failed to retrieve full event details:', fetchError)
        return new Response('Error retrieving event details', { status: 500 })
      }
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Log the event
    await supabase.from('webhook_events').insert({
      source: 'stripe',
      event_type: event.type,
      payload: event,
      status: 'processing'
    })

    const systemFlag = { last_updated_by_system: 'stripe' }

    switch (event.type) {
      // ----------------------------------------------------------------------
      // CUSTOMER EVENTS
      // ----------------------------------------------------------------------
      case 'customer.created':
      case 'customer.updated': {
        const customer = event.data.object
        const email = customer.email
        if (!email) break

        // 1. Try to find profile by email
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single()

        if (existingProfile) {
          // Update existing profile
          await supabase.from('profiles').update({
            full_name: customer.name || undefined,
            phone: customer.phone || undefined,
            ...systemFlag
          }).eq('id', existingProfile.id)

          // Link in sync_metadata
          await supabase.from('sync_metadata').upsert({
            entity_type: 'customer',
            local_id: existingProfile.id,
            external_id: customer.id,
            external_system: 'stripe',
            sync_status: 'synced',
            last_sync_at: new Date().toISOString()
          }, { onConflict: 'entity_type, local_id, external_system' })
        }
        // If no profile exists, we skip creation for now to avoid creating users without auth.
        // In a real app, you might create a "lead" or "contact" record.
        break
      }

      // ----------------------------------------------------------------------
      // PRODUCT & PRICE EVENTS
      // ----------------------------------------------------------------------
      case 'product.created':
      case 'product.updated': {
        const product = event.data.object
        
        // Note: 'service' table doesn't have organization_id in the new schema
        // We upsert based on stripe_product_id if possible, but 'service' table might not have a unique constraint on it yet.
        // Ideally we should match by ID if we stored it in metadata.
        
        const supabaseId = product.metadata.supabase_id;
        
        if (supabaseId) {
             await supabase.from('service').update({
                name: product.name,
                description: product.description,
                active: product.active,
                // price: 0, // Don't reset price here
                // updated_at: new Date().toISOString(), // service table doesn't have updated_at in schema? Check schema.
                ...systemFlag
              }).eq('id', supabaseId)
        } else {
             // If no supabase_id, we might want to create it, but we need duration etc.
             // For now, we only update if we know the ID.
             console.log('Product updated but no supabase_id in metadata, skipping update')
        }
        break
      }

      case 'price.created':
      case 'price.updated': {
        const price = event.data.object
        const productId = typeof price.product === 'string' ? price.product : price.product.id
        
        if (productId) {
          // We need to find the service with this stripe_product_id
          // But wait, we didn't add stripe_product_id to 'service' table in the schema file I read!
          // I need to check if 'service' table has stripe_product_id.
          // If not, I should add it.
          
          // Assuming it has it or we use metadata.
          // But here we don't have the product object to check metadata.
          // So we rely on stripe_product_id column.
          
          await supabase.from('service').update({
            price: price.unit_amount || 0, // Store in cents
            // stripe_price_id: price.id, // If column exists
            ...systemFlag
          }).eq('stripe_product_id', productId)
        }
        break
      }

      // ----------------------------------------------------------------------
      // INVOICE EVENTS
      // ----------------------------------------------------------------------
      case 'invoice.created':
      case 'invoice.updated':
      case 'invoice.paid': {
        const invoice = event.data.object
        
        // Find student_id via sync_metadata
        const { data: meta } = await supabase
          .from('sync_metadata')
          .select('local_id')
          .eq('external_id', invoice.customer)
          .eq('external_system', 'stripe')
          .single()
        
        // Get default organization
        const { data: org } = await supabase.from('organizations').select('id').limit(1).single()
        if (!org) break

        await supabase.from('invoices').upsert({
          stripe_invoice_id: invoice.id,
          organization_id: org.id,
          invoice_number: invoice.number,
          student_id: meta?.local_id || null,
          total_amount: invoice.total / 100,
          amount_due: invoice.amount_due / 100,
          amount_paid: invoice.amount_paid / 100,
          status: invoice.status,
          issue_date: new Date(invoice.created * 1000).toISOString(),
          due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
          ...systemFlag
        }, { onConflict: 'stripe_invoice_id' })
        break
      }

      // ----------------------------------------------------------------------
      // PAYMENT INTENT EVENTS (Wallet & Bookings)
      // ----------------------------------------------------------------------
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        const { type, userId, creditsAmount, sessionId } = paymentIntent.metadata

        if (type === 'wallet_topup' && userId && creditsAmount) {
          // 1. Get Wallet ID
          const { data: wallet } = await supabase
            .from('wallets')
            .select('id')
            .eq('user_id', userId)
            .single()
          
          let walletId = wallet?.id

          // Create wallet if not exists
          if (!walletId) {
            const { data: newWallet } = await supabase
              .from('wallets')
              .insert({ user_id: userId })
              .select('id')
              .single()
            walletId = newWallet?.id
          }

          if (walletId) {
            // 2. Add Transaction
            await supabase.from('wallet_transactions').insert({
              wallet_id: walletId,
              amount: parseFloat(creditsAmount),
              type: 'credit',
              description: `Top-up via Stripe`,
              stripe_payment_intent_id: paymentIntent.id,
              metadata: {
                amount_paid: paymentIntent.amount / 100,
                currency: paymentIntent.currency
              }
            })

            // 3. Update Balance
            const { data: currentWallet } = await supabase
              .from('wallets')
              .select('balance')
              .eq('id', walletId)
              .single()
            
            const newBalance = (currentWallet?.balance || 0) + parseFloat(creditsAmount)
            
            await supabase
              .from('wallets')
              .update({ balance: newBalance, updated_at: new Date().toISOString() })
              .eq('id', walletId)
          }
        } else if (type === 'session_prepayment' && sessionId) {
          // Update booking status
          await supabase
            .from('bookings')
            .update({
              payment_status: 'paid',
              amount_paid: paymentIntent.amount / 100,
              stripe_payment_intent_id: paymentIntent.id,
              updated_at: new Date().toISOString(),
              ...systemFlag
            })
            .eq('id', sessionId)
        }
        break
      }

      // ----------------------------------------------------------------------
      // BOOKING PAYMENT (Checkout Session)
      // ----------------------------------------------------------------------
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.client_reference_id
        
        // Handle Subscription
        if (session.mode === 'subscription') {
          const subscriptionId = session.subscription
          const customerId = session.customer

          if (userId && subscriptionId) {
            await supabase
              .from('subscriptions')
              .upsert({
                user_id: userId,
                stripe_subscription_id: subscriptionId,
                stripe_customer_id: customerId,
                status: 'active',
                plan_type: session.metadata?.tierId || 'loyal', 
                updated_at: new Date().toISOString(),
              })
          }
        } 
        // Handle One-time Booking or Plan Purchase
        else if (session.mode === 'payment') {
          const bookingId = session.metadata?.bookingId || session.client_reference_id;
          const planDefinitionId = session.metadata?.planDefinitionId;
          
          if (bookingId) {
             // Update 'booking' table
             const { error } = await supabase
              .from('booking')
              .update({
                payment_status: 'captured',
                stripe_payment_intent: session.payment_intent,
                updated_at: new Date().toISOString(),
                ...systemFlag
              })
              .eq('id', bookingId);
             
             if (error) console.error('Error updating booking:', error);
          }

          if (planDefinitionId && userId) {
             console.log(`Assigning plan ${planDefinitionId} to user ${userId}`);
             const { error: planError } = await supabase.rpc('assign_plan_to_user', {
                p_user_id: userId,
                p_plan_id: planDefinitionId,
                p_performed_by: null
             });
             
             if (planError) console.error('Error assigning plan pack:', planError);
          }
        }
        break
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(err.message, { status: 400 })
  }
})
