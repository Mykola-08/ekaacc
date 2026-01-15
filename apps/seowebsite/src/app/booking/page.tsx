import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Book a Session | EKA',
  description: 'Schedule your next appointment with Elena.',
};

export default function BookingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Book a Session</h1>
      <p className="text-lg text-gray-700 mb-6">
        Ready to start your journey? Book your appointment online.
      </p>
      <Link 
        href="https://app.eka.com" // Assuming this is the booking app URL, or relative if mapped
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md text-lg font-medium inline-block"
      >
        Go to Booking App
      </Link>
    </div>
  );
}
