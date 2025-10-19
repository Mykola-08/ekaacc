
'use server';
import { Client, Environment, Booking, TeamMember, Customer } from 'square';

// This file is now deprecated in favor of Firebase Functions handling Square API calls.
// The code is left here for reference but is no longer used by the application.
// The new architecture uses Firestore as the source of truth for the frontend,
// with Firebase Functions and Square Webhooks keeping it in sync.

const squareClient = new Client({
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

/**
 * @deprecated This function is deprecated. The new architecture fetches bookings from Firestore, 
 * which is populated by a Square webhook.
 */
export async function getSquareBookings(userPhoneNumber?: string): Promise<any[]> {
  console.warn("getSquareBookings is deprecated. Fetch data from Firestore instead.");
  return [];
}
