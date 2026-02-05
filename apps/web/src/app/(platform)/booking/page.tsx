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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-blue-50/20 to-purple-50/30 dark:from-emerald-950/20 dark:via-blue-950/20 dark:to-purple-950/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/15 via-transparent to-transparent dark:from-emerald-900/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-100/15 via-transparent to-transparent dark:from-purple-900/10 pointer-events-none" />
      
      <div className="relative z-10">
        <BookingWizard service={DEFAULT_SERVICE} />
      </div>
    </div>
  );
}
