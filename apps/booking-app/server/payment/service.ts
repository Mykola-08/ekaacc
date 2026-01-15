import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { emitEvent } from '@/lib/events';

// Initialize Supabase Admin for backend operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CreateCheckoutSessionParams {
  serviceId: string;
  serviceName: string;
  price: number;
  customerName: string;
  customerEmail: string;
  date: string;
  bookingId: string;
  origin: string;
}

interface CheckoutResult {
  data: { sessionId: string; url: string } | null;
  error: { message: string } | null;
}

// Singleton Stripe client
let stripeClient: Stripe | null = null;

function getStripeClient(): Stripe | null {
  if (stripeClient) return stripeClient;
  
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error('STRIPE_SECRET_KEY is missing');
    return null;
  }
  
  stripeClient = new Stripe(secretKey, {
    apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion,
    maxNetworkRetries: 2,
  });
  
  return stripeClient;
}

/**
 * Resolves or Creates a Stripe Customer for the given user/email.
 * Links the Stripe Customer ID to the Supabase User Profile if applicable.
 */
async function getOrCreateStripeCustomer(
  stripe: Stripe,
  email: string,
  name: string,
  userId?: string
): Promise<string> {
  // 1. If we have a logged-in user, check their profile first
  if (userId) {
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (profile?.stripe_customer_id) {
      return profile.stripe_customer_id;
    }
  }

  // 2. Search Stripe by email (prevent duplicates for Guests or unsynced Users)
  const existingCustomers = await stripe.customers.list({ email: email, limit: 1 });
  
  if (existingCustomers.data.length > 0) {
    const customerId = existingCustomers.data[0].id;
    // Link back to profile if user exists but wasn't linked
    if (userId) {
      await supabaseAdmin
        .from('user_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }
    return customerId;
  }

  // 3. Create new Stripe Customer
  const newCustomer = await stripe.customers.create({
    email,
    name,
    metadata: {
      supabase_user_id: userId || 'guest'
    }
  });

  // Link new customer to profile
  if (userId) {
    await supabaseAdmin
      .from('user_profiles')
      .update({ stripe_customer_id: newCustomer.id })
      .eq('id', userId);
  }

  return newCustomer.id;
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutResult> {
  const { bookingId, origin, serviceName, price, customerEmail, customerName } = params;

  const stripe = getStripeClient();
  if (!stripe) {
    return { data: null, error: { message: 'Payment configuration error' } };
  }

  try {
    // A. Resolve User ID from Booking (to link customer properly)
    const { data: booking } = await supabaseAdmin
      .from('booking')
      .select('customer_reference_id')
      .eq('id', bookingId)
      .single();

    const userId = booking?.customer_reference_id;

    // B. Get Stripe Customer ID
    const stripeCustomerId = await getOrCreateStripeCustomer(
      stripe,
      customerEmail,
      customerName,
      userId
    );

    // C. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId, // Link the session to the customer
      customer_update: {
        address: 'auto', // Allow them to update their address in Stripe
        name: 'auto',
      },
      automatic_payment_methods: { enabled: true },

      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: serviceName,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      client_reference_id: bookingId,
      // customer_email is mutually exclusive with customer
      metadata: {
        bookingId,
        customerName,
      },
      payment_intent_data: {
        metadata: {
          bookingId
        }
      },
      // Expire session after 30 minutes
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
    });

    if (!session.url) {
      throw new Error('Failed to create session URL');
    }

    await emitEvent('payment.session_created', { bookingId, sessionId: session.id });

    return { 
      data: { 
        sessionId: session.id, 
        url: session.url 
      }, 
      error: null 
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown payment error';
    console.error('Error creating checkout session:', errorMessage);
    return { data: null, error: { message: errorMessage } };
  }
}
