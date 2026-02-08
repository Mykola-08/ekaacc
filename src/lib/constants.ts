// Client-safe constants that can be used in both client and server components

// BOOKING_APP_URL is now an internal route since we merged booking-app into the single app
// Set to empty string to use relative paths (e.g., "/login", "/signup", "/book/service-name")
export const BOOKING_APP_URL = process.env.NEXT_PUBLIC_BOOKING_APP_URL || '';

