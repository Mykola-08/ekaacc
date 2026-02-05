'use client';
export const dynamic = 'force-dynamic';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/hooks/platform/auth/use-simple-auth';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Label } from '@/components/platform/ui/label';
import { Input } from '@/components/platform/ui/input';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function OnboardingPage() {
 const router = useRouter();
 const { user, updateProfile, isAuthenticated, isLoading } = useSimpleAuth();
 const { t } = useLanguage();
 const [loading, setLoading] = useState(false);
 const [role, setRole] = useState<'patient' | 'therapist'>('patient');

 useEffect(() => {
  if (!isLoading && !isAuthenticated) {
   router.push('/login');
  }
 }, [isLoading, isAuthenticated, router]);

 if (isLoading || !isAuthenticated) {
  return null; // Or a loading spinner
 }

 const handleCompleteOnboarding = async () => {
  setLoading(true);
  try {
   // Update user profile to mark onboarding as complete
   // We might also want to set the role here if it's not already set
   await updateProfile({
    personalizationCompleted: true,
    // In a real app, we might save other onboarding data here
   });
   
   router.push('/auth-dispatch');
  } catch (error) {
   console.error('Failed to complete onboarding:', error);
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="flex min-h-screen items-center justify-center bg-muted p-6 md:p-10">
   <Card className="w-full max-w-md">
    <CardHeader className="text-center">
     <CardTitle className="text-2xl">{t('onboarding.welcome')}</CardTitle>
     <CardDescription>
      {t('onboarding.subtitle')}
     </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
     <div className="space-y-4">
      <div className="space-y-2">
       <Label>{t('onboarding.role.label')}</Label>
       <div className="grid grid-cols-2 gap-4">
        <Button 
         variant={role === 'patient' ? 'default' : 'outline'}
         onClick={() => setRole('patient')}
         className="h-24 flex-col gap-2"
        >
         <span className="text-lg">{t('onboarding.role.patient')}</span>
         <span className="text-xs font-normal opacity-70">{t('onboarding.role.patient.desc')}</span>
        </Button>
        <Button 
         variant={role === 'therapist' ? 'default' : 'outline'}
         onClick={() => setRole('therapist')}
         className="h-24 flex-col gap-2"
        >
         <span className="text-lg">{t('onboarding.role.therapist')}</span>
         <span className="text-xs font-normal opacity-70">{t('onboarding.role.therapist.desc')}</span>
        </Button>
       </div>
      </div>
     </div>

     <Button 
      className="w-full" 
      onClick={handleCompleteOnboarding}
      disabled={loading}
     >
      {loading ? t('onboarding.loading') : t('onboarding.getStarted')}
     </Button>
    </CardContent>
   </Card>
  </div>
 );
}
