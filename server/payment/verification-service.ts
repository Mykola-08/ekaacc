
import { createClient } from '@/lib/supabase/server';

export interface PaymentProofInput {
  bookingId?: string;
  proofType: 'image' | 'reference_code' | 'cash_log';
  proofUrl?: string; // from Storage bucket
  referenceCode?: string;
  amountCents: number;
}

export class PaymentVerificationService {

  /**
   * Submit a payment proof (e.g. Bank Transfer screenshot)
   */
  async submitProof(userId: string | null, input: PaymentProofInput) {
    const supabase = await createClient();
    
    // If userId is null (guest), we proceed with null
    const { data, error } = await supabase
      .from('payment_proof')
      .insert({
        user_id: userId,
        booking_id: input.bookingId,
        proof_type: input.proofType,
        proof_url: input.proofUrl,
        reference_code: input.referenceCode,
        amount_cents: input.amountCents,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    
    // Optionally update booking status to 'pending_verification' if schema allows
    if (input.bookingId) {
      await supabase
        .from('booking')
        .update({ payment_status: 'pending' }) // Ensure it's pending
        .eq('id', input.bookingId);
    }

    return data;
  }

  /**
   * Therapist: Log a cash payment received in person.
   * Creates a proof and immediately verifies it.
   */
  async logCashPayment(therapistUserId: string, bookingId: string, amountCents: number) {
    const supabase = await createClient();

    // 1. Get Booking details to see if we can link a user
    const { data: booking } = await supabase
      .from('booking')
      .select('customer_reference_id') // Assuming this might link to user or we query by email
      .eq('id', bookingId)
      .single();

    // 2. Create Pending Proof
    const proofInput: PaymentProofInput = {
      bookingId,
      proofType: 'cash_log',
      amountCents,
      referenceCode: `CASH-${new Date().getTime()}`
    };

    // We try to use the customer ref if it's a UUID (User ID), otherwise null
    // Ideally we resolve the proper user ID here.
    const customerId = booking?.customer_reference_id || null; // Simplified

    const proof = await this.submitProof(customerId, proofInput);

    // 3. Auto-Verify
    return await this.reviewProof(proof.id, therapistUserId, 'verified', 'Cash payment confirmed by therapist');
  }

  /**
   * Admin/Staff: Review and Verify Proof
   */
  async reviewProof(proofId: string, verifierId: string, status: 'verified' | 'rejected', notes?: string) {
    const supabase = await createClient();

    // Call the RPC function defined in migration
    const { error } = await supabase.rpc('verify_payment_proof', {
      p_proof_id: proofId,
      p_verifier_id: verifierId,
      p_status: status,
      p_notes: notes || ''
    });

    if (error) throw error;
    return true;
  }

  /**
   * Get pending verifications for Dashboard (Admin View - All)
   */
  async getPendingProofs() {
    const supabase = await createClient();
    const { data } = await supabase
      .from('payment_proof')
      .select(`
        *,
        booking:booking(id, service_id, start_time, display_name),
        user:auth.users(email)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
      
    return data;
  }

  /**
   * Get pending verifications for a specific Therapist
   * Returns proofs linked to bookings assigned to this therapist.
   */
  async getTherapistPendingProofs(staffAuthId: string) {
    const supabase = await createClient();
    
    // 1. Get Staff ID
    const { data: staff } = await supabase
      .from('staff')
      .select('id')
      .eq('auth_user_id', staffAuthId)
      .single();

    if (!staff) return []; // Not a staff member

    // 2. Get Proofs filtered by booking.staff_id
    // !inner ensures we only get proofs that HAVE a booking that matches the filter
    const { data } = await supabase
      .from('payment_proof')
      .select(`
        *,
        booking:booking!inner(id, service_id, start_time, display_name, staff_id),
        user:auth.users(email)
      `)
      .eq('status', 'pending')
      .eq('booking.staff_id', staff.id)
      .order('created_at', { ascending: false });
      
    return data;
  }
}
