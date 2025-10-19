
'use server';
import { Client, Environment, Booking } from 'square';
import { Session } from './types';

// Initialize the Square client
const squareClient = new Client({
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

/**
 * Maps a Square Booking object to our internal Session type.
 * @param booking - The booking object from the Square API.
 * @returns A Session object.
 */
function mapBookingToSession(booking: Booking): Session {
  // Helper to determine status
  const getStatus = (status: string | undefined): 'Upcoming' | 'Completed' | 'Canceled' => {
    switch (status) {
      case 'ACCEPTED':
        return 'Upcoming';
      case 'DECLINED_BY_SELLER':
      case 'CANCELLED_BY_CUSTOMER':
      case 'CANCELLED_BY_SELLER':
        return 'Canceled';
      default:
        // Assuming if it's in the past and not cancelled, it's completed.
        const startTime = new Date(booking.startAt || 0);
        return startTime < new Date() ? 'Completed' : 'Upcoming';
    }
  };

  const serviceVariation = booking.appointmentSegments?.[0]?.serviceVariation;

  return {
    id: booking.id || 'unknown-id',
    therapist: serviceVariation?.teamMemberId || 'Unknown Staff', // Placeholder, you might need another API call to get staff name
    therapistAvatarUrl: 'https://i.pravatar.cc/150?u=square',
    date: booking.startAt || new Date().toISOString(),
    time: new Date(booking.startAt || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: Number(serviceVariation?.serviceVariationData?.serviceItemData?.durationMinutes) || 0,
    status: getStatus(booking.status),
    type: serviceVariation?.serviceVariationData?.name || 'Unknown Service',
    // You might need to fetch customer details separately if not available here
  };
}


/**
 * Fetches bookings from the Square API for the configured location.
 * @returns A promise that resolves to an array of Session objects.
 */
export async function getSquareBookings(): Promise<Session[]> {
  const locationId = process.env.SQUARE_LOCATION_ID;

  if (!process.env.SQUARE_ACCESS_TOKEN || !locationId) {
    console.error("Square access token or location ID is not configured.");
    return [];
  }

  try {
    const { result } = await squareClient.bookingsApi.listBookings(undefined, undefined, undefined, undefined, locationId);
    
    if (!result.bookings) {
        return [];
    }

    // You might want to fetch customer and staff details here to enrich the data
    // For now, we'll just map what we have.
    const sessions = result.bookings.map(mapBookingToSession);
    
    return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Failed to fetch Square bookings:", error);
    // In a real app, you'd want more robust error handling
    return [];
  }
}
