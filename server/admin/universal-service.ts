import { createClient } from '@/lib/supabase/server';

/**
 * Super Admin Service
 * Bypass RLS (using service_role in real implementation implies server-side only)
 * or check 'super_admin' role in every call.
 */
export class AdminUniversalService {
  // CAUTION: This function should check for super_admin role strictly
  private async getAdminClient() {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user?.id)
      .single();

    if (roleData?.role !== 'super_admin' && roleData?.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    return supabase;
  }

  async impersonateUser(targetUserId: string) {
    // Returns a session token or mechanism to act as this user
    // Usually handled via specific Auth provider 'impersonate' API or signed cookie
  }

  async forceCancelBooking(bookingId: string, reason: string) {
    const supabase = await this.getAdminClient();
    // Admin can cancel even if policy says no
    const { error } = await supabase
      .from('booking')
      .update({
        status: 'canceled',
        payment_status: 'refunded', // Trigger refund webhook logic
        notes: `Admin Cancel: ${reason}`,
      })
      .eq('id', bookingId);

    if (error) throw error;
  }

  async adjustUserLegacyPoints(userId: string, pointsDelta: number) {
    const supabase = await this.getAdminClient();
    // Direct SQL injection for points
    const { error } = await supabase.rpc('increment_points', {
      p_user_id: userId,
      p_amount: pointsDelta,
    });
    return error;
  }

  async getAllUsersExpensive() {
    const supabase = await this.getAdminClient();
    // Full user dump
    const { data } = await supabase.from('auth.users').select('*'); // Warning: restricted table
    return data;
  }
}
