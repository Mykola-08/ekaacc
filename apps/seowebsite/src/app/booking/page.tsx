import { Metadata } from 'next';
import { BookingWizard } from '@/components/platform/booking/BookingWizard';

export const metadata: Metadata = {
  title: 'Book a Session | EKA',
  description: 'Schedule your next appointment with Elena.',
};

// Hardcoded for demo/MVP as per existing structure
const DEFAULT_SERVICE = {
  id: '711', // Replicating the "Magic" service ID if applicable or standard
  name: 'Holistic Consultation',
  description: 'Deep dive into your resonance.',
  price: 150,
  duration: 60,
  category: 'Wellness',
  is_active: true,
  created_at: new Date().toISOString()
};

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-background">
      <BookingWizard service={DEFAULT_SERVICE} />
    </div>
  );
}
