'use client';

import { useState } from 'react';
import { useSimpleAuth } from '@/hooks/use-simple-auth';
import { Home } from '@/components/features/client-portal/Home';
import { BookAppointment } from '@/components/features/client-portal/BookAppointment';
import { PastAppointments } from '@/components/features/client-portal/PastAppointments';
// import { Profile } from '@/components/features/client-portal/Profile/Profile'; // Assuming it's in a folder
// import { SessionDetails } from '@/components/features/client-portal/SessionDetails';
import { ResponsiveContainer } from '@/components/features/client-portal/Layout/ResponsiveContainer'; // Corrected path
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type View = 'HOME' | 'BOOKING' | 'APPOINTMENTS' | 'PROFILE' | 'SESSION';

export default function ClientPortalPage() {
  const { user, isLoading, isAuthenticated } = useSimpleAuth();
  const [currentView, setCurrentView] = useState<View>('HOME');
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect or show login
    // router.push('/login?redirect=/client-portal');
    // For now, simple message
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p>Please log in to access the portal.</p>
        <Button onClick={() => router.push('/login')}>Log In</Button>
      </div>
    );
  }

  const handleBack = () => setCurrentView('HOME');

  return (
    <div className="min-h-screen bg-background text-foreground">
       {/* Simple Header for navigation context if needed, or hide it to look like app */}
      
      {currentView === 'HOME' && (
        <Home
          userId={user.id}
          userName={user.user_metadata?.name || user.email || 'User'}
          onBookAppointment={() => setCurrentView('BOOKING')}
          onViewSession={() => setCurrentView('APPOINTMENTS')}
          onViewProfile={() => setCurrentView('PROFILE')}
        />
      )}

      {currentView === 'BOOKING' && (
        <BookAppointment
          userId={user.id}
          onBack={handleBack}
        />
      )}

      {currentView === 'APPOINTMENTS' && (
        <PastAppointments
          userId={user.id}
          onBack={handleBack}
          onViewFeedback={(type, practitioner) => console.log('Feedback', type, practitioner)}
        />
      )}
      
      {currentView === 'PROFILE' && (
          <div className="p-8">
              <Button onClick={handleBack} className="mb-4">Back</Button>
              <h1 className="text-2xl font-bold">Profile</h1>
              <p>Profile component to be integrated.</p>
          </div>
      )}

    </div>
  );
}
