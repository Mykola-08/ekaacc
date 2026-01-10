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

export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  try {
    const { bookingId, origin, serviceName, price, customerEmail, customerName } = params;

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is missing');
      return { data: null, error: { message: 'Payment configuration error' } };
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-01-27.acacia' as any, // Use latest or pinned version
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: serviceName,
              // images: [serviceImage] // Optional: Add service image if available
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
        bookingId: bookingId,
        customerName: customerName,
      },
      payment_intent_data: {
        metadata: {
          bookingId: bookingId
        }
      }
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
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return { data: null, error: { message: error.message } };
  }
}
