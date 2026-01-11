// Production-grade bookings service with Supabase integration
import { supabase } from '@/lib/platform/supabase';
import { safeSupabaseInsert, safeSupabaseQuery, safeSupabaseUpdate } from '@/lib/platform/supabase/utils';

export const bookingService = {
  async createBooking(userId: string, therapistId: string, date: string, notes?: string) {
    try {
      const { data, error } = await safeSupabaseInsert<any>(
        'appointments',
        {
          user_id: userId,
          practitioner_id: therapistId,
          date,
          time: '09:00', // Default time, should be provided by caller
          notes: notes || null,
          status: 'upcoming',
          created_at: new Date().toISOString()
        }
      );
      
      if (error) {
        console.error('Error creating booking:', error);
        throw new Error('Failed to create booking');
      }
      
      return data;
    } catch (error) {
      console.error('Error in createBooking:', error);
      throw error;
    }
  },
  async getBookingsForUser(userId: string) {
    try {
      const { data, error } = await safeSupabaseQuery<any[]>(
        supabase
          .from('appointments')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
      );
      
      if (error) {
        console.error('Error fetching user bookings:', error);
        throw new Error('Failed to fetch user bookings');
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getBookingsForUser:', error);
      throw error;
    }
  },
  async getBookingsForTherapist(therapistId: string) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('practitioner_id', therapistId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching therapist bookings:', error);
        throw new Error('Failed to fetch therapist bookings');
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getBookingsForTherapist:', error);
      throw error;
    }
  },
  async cancelBooking(bookingId: string) {
    try {
      const { data, error } = await safeSupabaseUpdate<any>(
        'appointments',
        { status: 'cancelled', cancelled_at: new Date().toISOString() },
        { id: bookingId }
      );
      
      if (error) {
        console.error('Error cancelling booking:', error);
        throw new Error('Failed to cancel booking');
      }
      
      return { id: bookingId, status: 'cancelled' };
    } catch (error) {
      console.error('Error in cancelBooking:', error);
      throw error;
    }
  },
  async updateBooking(bookingId: string, updates: Record<string, any>) {
    try {
      const { data, error } = await safeSupabaseUpdate<any>(
        'appointments',
        {
          ...updates,
          updated_at: new Date().toISOString()
        },
        { id: bookingId }
      );
      
      if (error) {
        console.error('Error updating booking:', error);
        throw new Error('Failed to update booking');
      }
      
      return data;
    } catch (error) {
      console.error('Error in updateBooking:', error);
      throw error;
    }
  },
  async getAllBookings() {
    try {
      const { data, error } = await safeSupabaseQuery<any[]>(
        supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false })
      );
      
      if (error) {
        console.error('Error fetching all bookings:', error);
        throw new Error('Failed to fetch bookings');
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getAllBookings:', error);
      throw error;
    }
  },
};

export default bookingService;
