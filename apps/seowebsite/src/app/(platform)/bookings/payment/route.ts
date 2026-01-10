
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/platform/supabase/server';
import { stripe } from '@/lib/platform/stripe';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { bookingId, amount, currency = 'eur' } = await req.json() as any;

    if (!bookingId || !amount) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        bookingId,
        userId: user.id,
        type: 'booking_payment',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update booking with payment intent ID
    const { error } = await supabase
      .from('appointments')
      .update({ 
        stripe_payment_intent_id: paymentIntent.id,
        payment_status: 'pending'
      })
      .eq('id', bookingId)
      .eq('user_id', user.id); // Ensure user owns the booking

    if (error) {
      console.error('Error updating booking:', error);
      return new NextResponse('Database Error', { status: 500 });
    }

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
