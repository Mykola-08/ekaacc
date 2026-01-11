import Stripe from 'stripe';
import { emitEvent } from '@/lib/events';

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

export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutResult> {
  const { bookingId, origin, serviceName, price, customerEmail, customerName } = params;

  const stripe = getStripeClient();
  if (!stripe) {
    return { data: null, error: { message: 'Payment configuration error' } };
  }

  try {
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
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
      customer_email: customerEmail,
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
