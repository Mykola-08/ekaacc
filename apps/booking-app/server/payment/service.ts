import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-11-17.clover',
});

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
    const { serviceId, serviceName, price, customerName, customerEmail, date, bookingId, origin } = params;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${serviceName} (Deposit)`,
            },
            unit_amount: Math.round(price * 100), // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      customer_email: customerEmail,
      metadata: {
        serviceId,
        customerName,
        bookingDate: date,
        bookingId,
      },
    });

    return { data: { sessionId: session.id, url: session.url }, error: null };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return { data: null, error: { message: error.message } };
  }
}
