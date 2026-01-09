import { supabaseServer } from '@/lib/supabaseServerClient';
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
    const { bookingId, origin } = params;

    // Directly confirm booking in Supabase, bypassing Stripe
    const { error } = await supabaseServer
      .from('booking')
      .update({ 
        payment_status: 'captured', 
        stripe_payment_intent: 'manual_bypass' 
      })
      .eq('id', bookingId);

    if (error) {
      console.error('Error confirming booking:', error);
      await emitEvent('payment.capture.failed', { bookingId, reason: error.message });
      return { data: null, error: { message: error.message } };
    }

    await emitEvent('payment.captured', { bookingId, paymentIntent: 'manual_bypass' });

    return { 
      data: { 
        sessionId: 'manual_session_' + bookingId, 
        url: `${origin}/success?session_id=manual_session_${bookingId}` 
      }, 
      error: null 
    };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return { data: null, error: { message: error.message } };
  }
}
