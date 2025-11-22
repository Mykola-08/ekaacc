import { supabaseAdmin } from '@/lib/supabase';
import { walletService } from './wallet-service';
import { stripeService } from './stripe-service';
import { paymentVerificationService } from './payment-verification-service';

export interface BookingRequest {
  userId: string;
  therapistId: string;
  slot: {
    start: string;
    end: string;
  };
  serviceId: string;
  price: number;
  paymentMethod: 'wallet' | 'stripe' | 'pay_at_place' | 'bizum';
}

export interface BookingResult {
  bookingId?: string;
  status: 'scheduled' | 'pending_payment' | 'failed';
  clientSecret?: string;
  paymentIntentId?: string;
  message?: string;
}

export class BookingService {
  private static instance: BookingService;

  static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  async createBooking(request: BookingRequest): Promise<BookingResult> {
    const { userId, therapistId, slot, price, paymentMethod } = request;

    // 1. Fetch Therapist Config
    const { data: therapist } = await supabaseAdmin
      .from('teacher_marketplace_profiles')
      .select('payment_policy, deposit_percentage')
      .eq('user_id', therapistId)
      .single();

    if (!therapist) throw new Error('Therapist not found');

    // 2. Fetch User Reputation
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('reputation_score')
      .eq('id', userId)
      .single();

    const reputation = userProfile?.reputation_score || 100;

    // 3. Determine Payment Requirement
    let requiredPaymentType = therapist.payment_policy || 'pay_at_place';
    
    // Force prepayment for low reputation
    if (reputation < 50) {
      requiredPaymentType = 'prepay_full';
    }

    // 4. Calculate Amount to Pay Now
    let amountToPay = 0;
    if (requiredPaymentType === 'prepay_full') {
      amountToPay = price;
    } else if (requiredPaymentType === 'prepay_deposit') {
      amountToPay = price * ((therapist.deposit_percentage || 20) / 100);
    }

    // 5. Handle Payment
    let paymentStatus = 'pending';
    let stripePaymentIntentId = null;
    let clientSecret = undefined;

    if (amountToPay > 0) {
      if (paymentMethod === 'pay_at_place') {
        throw new Error('Prepayment required for this booking');
      }

      if (paymentMethod === 'wallet') {
        const canAfford = await walletService.canAfford(userId, amountToPay);
        if (!canAfford) {
          throw new Error('Insufficient wallet balance');
        }
        await walletService.deductAmount(userId, amountToPay, `Booking prepayment for ${slot.start}`);
        paymentStatus = 'paid';
      } else if (paymentMethod === 'stripe') {
        // Create placeholder booking ID (or use UUID)
        // We'll create the booking first as pending_payment
        paymentStatus = 'pending'; 
      } else if (paymentMethod === 'bizum') {
        // Bizum requires manual verification (upload proof)
        paymentStatus = 'pending';
      }
    } else {
      paymentStatus = 'pending'; // Pay at place
    }

    // 6. Create Booking Record
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: userId,
        therapist_id: therapistId,
        scheduled_start_time: slot.start,
        scheduled_end_time: slot.end,
        status: amountToPay > 0 && (paymentMethod === 'stripe' || paymentMethod === 'bizum') ? 'pending_payment' : 'scheduled',
        payment_status: paymentStatus,
        payment_method: paymentMethod,
        amount_paid: paymentStatus === 'paid' ? amountToPay : 0,
        deposit_amount: amountToPay,
        price: price
      })
      .select('id')
      .single();

    if (error) throw error;

    // 7. Handle Stripe Intent if needed
    if (amountToPay > 0 && paymentMethod === 'stripe') {
      const intent = await stripeService.createSessionPrepaymentIntent(userId, booking.id, amountToPay);
      
      // Update booking with intent ID
      await supabaseAdmin
        .from('bookings')
        .update({ stripe_payment_intent_id: intent.paymentIntentId })
        .eq('id', booking.id);

      return {
        bookingId: booking.id,
        status: 'pending_payment',
        clientSecret: intent.clientSecret,
        paymentIntentId: intent.paymentIntentId
      };
    }

    return {
      bookingId: booking.id,
      status: 'scheduled'
    };
  }

  /**
   * Submit a payment proof (e.g. Bizum screenshot) for verification
   */
  async submitPaymentProof(bookingId: string, proofUrl: string): Promise<{ verified: boolean; message: string }> {
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (!booking) throw new Error('Booking not found');

    // Verify the proof using AI
    // We expect the amount to be the deposit amount or full price depending on what was required
    const expectedAmount = booking.deposit_amount > 0 ? booking.deposit_amount : booking.price;
    
    const verificationResult = await paymentVerificationService.verifyPaymentProof(
      proofUrl,
      expectedAmount,
      'EUR'
    );

    if (verificationResult.isValid) {
      // Update booking status
      await supabaseAdmin
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'scheduled', // Move from pending_payment to scheduled
          // Store verification details if needed, maybe in a metadata column?
          // For now just mark as paid
        })
        .eq('id', bookingId);

      return { verified: true, message: 'Payment verified successfully' };
    } else {
      return { 
        verified: false, 
        message: `Verification failed: ${verificationResult.issues.join(', ')}` 
      };
    }
  }

  /**
   * Complete a booking (e.g. after session) and handle refunds if payment method changed
   */
  async completeBooking(bookingId: string, finalPaymentMethod: string): Promise<void> {
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (!booking) throw new Error('Booking not found');

    // Check for refund condition
    // If originally paid via Stripe (prepayment) but now paying via Cash/Bizum/Wallet
    if (
      booking.stripe_payment_intent_id && 
      booking.amount_paid > 0 && 
      finalPaymentMethod !== 'stripe'
    ) {
      // Refund the Stripe payment
      await stripeService.refundPayment(booking.stripe_payment_intent_id);
      
      // Update booking to reflect refund and new payment method
      await supabaseAdmin
        .from('bookings')
        .update({
          payment_status: 'paid', // Assuming new method is paid immediately (cash/bizum)
          payment_method: finalPaymentMethod,
          stripe_payment_intent_id: null, // Clear or keep for history? Better keep in logs, maybe add refund_id
          amount_paid: 0 // Reset amount paid via Stripe? Or keep it? 
          // Actually, if they pay cash, amount_paid should reflect the cash amount.
          // But we refunded the stripe amount.
        })
        .eq('id', bookingId);
        
      console.log(`Refunded booking ${bookingId} due to payment method change to ${finalPaymentMethod}`);
    } else if (
      booking.payment_method === 'bizum' &&
      booking.payment_status === 'paid' &&
      finalPaymentMethod !== 'bizum'
    ) {
      // Manual refund required for Bizum
      console.warn(`MANUAL REFUND REQUIRED: Booking ${bookingId} was paid via Bizum but completed via ${finalPaymentMethod}`);
      // TODO: Create an admin task or notification for manual refund
    } else {
      // Just update status
      await supabaseAdmin
        .from('bookings')
        .update({
          status: 'completed',
          payment_method: finalPaymentMethod,
          payment_status: 'paid'
        })
        .eq('id', bookingId);
    }
  }
}

export const bookingService = BookingService.getInstance();
