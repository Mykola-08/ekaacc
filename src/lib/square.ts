
'use server';
import { Client, Environment, Booking, TeamMember, Customer } from 'square';
import { Session } from './types';

// Initialize the Square client
const squareClient = new Client({
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

/**
 * Maps a Square Booking object to our internal Session type.
 * @param booking - The booking object from the Square API.
 * @param teamMembers - A map of team member IDs to TeamMember objects.
 * @returns A Session object.
 */
function mapBookingToSession(booking: Booking, teamMembers: Map<string, TeamMember>): Session {
  const getStatus = (status: string | undefined): 'Upcoming' | 'Completed' | 'Canceled' => {
    const startTime = new Date(booking.startAt || 0);
    const isPast = startTime < new Date();

    switch (status) {
      case 'ACCEPTED':
        return isPast ? 'Completed' : 'Upcoming';
      case 'DECLINED_BY_SELLER':
      case 'CANCELLED_BY_CUSTOMER':
      case 'CANCELLED_BY_SELLER':
        return 'Canceled';
      case 'NO_SHOW':
        return 'Completed'; // Treat as completed for display purposes
      default:
        return isPast ? 'Completed' : 'Upcoming';
    }
  };

  const serviceVariation = booking.appointmentSegments?.[0]?.serviceVariation;
  const teamMemberId = booking.appointmentSegments?.[0]?.teamMemberId;
  const teamMember = teamMemberId ? teamMembers.get(teamMemberId) : undefined;
  const therapistName = teamMember ? `${teamMember.givenName} ${teamMember.familyName}`.trim() : 'Unknown Staff';

  return {
    id: booking.id || 'unknown-id',
    therapist: therapistName,
    therapistAvatarUrl: 'https://i.pravatar.cc/150?u=square', // Placeholder avatar
    date: booking.startAt || new Date().toISOString(),
    time: new Date(booking.startAt || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: Number(serviceVariation?.serviceVariationData?.durationMinutes) || 0,
    status: getStatus(booking.status),
    type: serviceVariation?.serviceVariationData?.name || 'Unknown Service',
  };
}

/**
 * Fetches all active team members.
 * @returns A promise that resolves to a Map of team member IDs to TeamMember objects.
 */
async function getTeamMembers(): Promise<Map<string, TeamMember>> {
  const teamMembersMap = new Map<string, TeamMember>();
  if (!squareClient) return teamMembersMap;
    
  try {
    const { result } = await squareClient.teamApi.searchTeamMembers({});
    if (result.teamMembers) {
      for (const member of result.teamMembers) {
        if (member.id) {
          teamMembersMap.set(member.id, member);
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch Square team members:", error);
    // Don't throw, allow booking fetch to proceed without therapist names if needed
  }
  return teamMembersMap;
}

/**
 * Finds a Square Customer ID by their phone number.
 * @param phoneNumber The phone number to search for.
 * @returns A promise that resolves to the customer ID or null if not found.
 */
async function getCustomerIdByPhoneNumber(phoneNumber: string): Promise<string | null> {
    if (!squareClient) return null;

    try {
        const { result: { customers } } = await squareClient.customersApi.searchCustomers({
            query: {
                filter: {
                    phoneNumber: {
                        exact: phoneNumber
                    }
                }
            }
        });

        if (customers && customers.length > 0) {
            return customers[0].id || null;
        }
        return null;

    } catch (error) {
        console.error("Failed to search for Square customer by phone number:", error);
        throw new Error("Could not connect to Square to find customer profile.");
    }
}


/**
 * Fetches bookings from the Square API for a specific user, identified by phone number.
 * @returns A promise that resolves to an array of Session objects.
 */
export async function getSquareBookings(userPhoneNumber: string): Promise<Session[]> {
  const locationId = process.env.SQUARE_LOCATION_ID;

  if (!process.env.SQUARE_ACCESS_TOKEN || !locationId || locationId === 'YOUR_SQUARE_LOCATION_ID') {
    console.error("Square access token or location ID is not configured properly.");
    throw new Error("Square integration is not configured. Please check environment variables.");
  }

  try {
    const customerId = await getCustomerIdByPhoneNumber(userPhoneNumber);

    if (!customerId) {
        console.log(`No Square customer found for phone number: ${userPhoneNumber}`);
        return []; // No customer, so no bookings
    }
      
    // Fetch bookings and team members in parallel for efficiency
    const [bookingsResult, teamMembersMap] = await Promise.all([
      squareClient.bookingsApi.listBookings(undefined, undefined, undefined, customerId, locationId),
      getTeamMembers()
    ]);
    
    const { bookings } = bookingsResult.result;
    if (!bookings) {
        return [];
    }

    const sessions = bookings.map(booking => mapBookingToSession(booking, teamMembersMap));
    
    return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Failed to fetch Square bookings:", error);
    // Propagate a more user-friendly error message
    if (error instanceof Error && error.message.includes("customer")) {
        throw error;
    }
    throw new Error("Could not retrieve booking data from Square. Please try again later.");
  }
}
