'use client';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/keep';
import { useState, useEffect } from 'react';
;
;
import { 
  WelcomePersonalizationForm, 
  DonationSeekerApplicationForm,
  DailyMoodLogForm,
  SessionAssessmentForm,
  PersonalizationData,
  DonationSeekerData,
  MoodLogData,
  SessionAssessmentData
} from '@/components/eka/forms';
import { FileText, Heart, ClipboardCheck, Sparkles, Gift, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { PersonalizationEngine } from '@/lib/personalization-engine';

export default function FormsPage() {
  const router = require('next/navigation').useRouter?.() || (function(){return { push: (p:string)=>{ window.location.href = p } }})();
  // Redirect to account since forms are contextual now
  if (typeof window !== 'undefined') {
    setTimeout(()=> router.push('/account'), 50);
  }
  const [showWelcomeForm, setShowWelcomeForm] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [showPreSessionForm, setShowPreSessionForm] = useState(false);
  const [showPostSessionForm, setShowPostSessionForm] = useState(false);
  
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const { dataService, initDataService } = useAppStore();

  useEffect(() => {
    initDataService();
  }, [initDataService]);

  const updateUser = async (userData: any) => {
    if (dataService && currentUser) {
      await dataService.updateUser(currentUser.id, userData);
      
    }
  };

  // Track page visit for personalization
  useEffect(() => {
    if (currentUser) {
      const updates = PersonalizationEngine.trackActivity(currentUser, {
        type: 'page-visit',
        data: { page: '/forms' }
      });
      updateUser({ user_metadata: { ...(currentUser.user_metadata || {}), activityData: { ...((currentUser.user_metadata as any)?.activityData || {}), ...updates } } } as any);
    }
  }, [currentUser, updateUser]);

  const handlePersonalizationSubmit = (data: PersonalizationData) => {
    console.log('Personalization submitted:', data);
    updateUser({
      user_metadata: {
        ...(currentUser?.user_metadata || {}),
        personalizationCompleted: true,
        personalization: {
        goals: data.goals,
        interests: data.interests ? data.interests.split(',').map(i => i.trim()) : [],
        values: data.values,
        preferences: data.preferences,
        },
      },
    });
    setShowWelcomeForm(false);
    toast({
      title: 'Personalization complete!',
      description: 'Your profile has been updated successfully.',
    });
  };

  const handleDonationSubmit = (data: DonationSeekerData) => {
    console.log('Donation application submitted:', data);
    setShowDonationForm(false);
    toast({
      title: 'Application submitted!',
      description: 'We\'ll review your application within 48 hours.',
    });
  };

  const handleMoodLogSubmit = (data: MoodLogData) => {
    console.log('Mood log submitted:', data);
    setShowMoodForm(false);
    toast({
      title: 'Mood log saved!',
      description: 'Your daily check-in has been recorded.',
    });
  };

  const handleSessionAssessmentSubmit = (data: SessionAssessmentData) => {
    console.log('Session assessment submitted:', data);
    setShowPreSessionForm(false);
    setShowPostSessionForm(false);
    toast({
      title: 'Assessment saved!',
      description: 'Session documentation complete.',
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">EKA Forms</h1>
        <p className="text-muted-foreground">
          Access all patient and therapist forms with integrated AI assistance
        </p>
      </div>

      {/* Patient Forms */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Patient Forms</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Welcome Personalization Form */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Gift className="h-8 w-8 text-primary opacity-10" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Welcome Form
              </CardTitle>
              <CardDescription>
                First-time personalization with €10 discount
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                <p>• Multi-step onboarding</p>
                <p>• Mental health assessment</p>
                <p>• Emergency contact collection</p>
                <p>• €10 discount on first session</p>
              </div>
              <Button 
                onClick={() => setShowWelcomeForm(true)} 
                className="w-full"
              >
                Open Welcome Form
              </Button>
            </CardContent>
          </Card>

          {/* Daily Mood Log */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Heart className="h-8 w-8 text-primary opacity-10" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Daily Mood Log
              </CardTitle>
              <CardDescription>
                Track your daily emotions and wellbeing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                <p>• Mood, energy, stress tracking</p>
                <p>• Emotion selection</p>
                <p>• Activity logging</p>
                <p>• Gratitude journaling</p>
              </div>
              <Button 
                onClick={() => setShowMoodForm(true)} 
                className="w-full"
              >
                Log Today's Mood
              </Button>
            </CardContent>
          </Card>

          {/* Donation Seeker Application */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <FileText className="h-8 w-8 text-primary opacity-10" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Donation Seeker
              </CardTitle>
              <CardDescription>
                Apply for financial support with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                <p>• Financial needs assessment</p>
                <p>• AI-enhanced history revision</p>
                <p>• Confidential application</p>
                <p>• 48-hour review process</p>
              </div>
              <Button 
                onClick={() => setShowDonationForm(true)} 
                className="w-full"
              >
                Apply for Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Therapist Forms */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Therapist Forms</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Pre-Session Assessment */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <ClipboardCheck className="h-8 w-8 text-primary opacity-10" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                Pre-Session Assessment
              </CardTitle>
              <CardDescription>
                Complete before session begins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                <p>• Client current state evaluation</p>
                <p>• Crisis risk assessment</p>
                <p>• Session goal setting</p>
                <p>• Medication tracking</p>
              </div>
              <Button 
                onClick={() => setShowPreSessionForm(true)} 
                className="w-full"
                variant="outline"
              >
                Start Pre-Session
              </Button>
            </CardContent>
          </Card>

          {/* Post-Session Assessment */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Brain className="h-8 w-8 text-primary opacity-10" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Post-Session Assessment
              </CardTitle>
              <CardDescription>
                Document session outcomes and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                <p>• Session summary documentation</p>
                <p>• Progress tracking</p>
                <p>• Intervention recording</p>
                <p>• Follow-up planning</p>
              </div>
              <Button 
                onClick={() => setShowPostSessionForm(true)} 
                className="w-full"
                variant="outline"
              >
                Complete Post-Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Current Status */}
      {currentUser && (
        <Card>
          <CardHeader>
            <CardTitle>Your Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Personalization:</span>
                <span className={currentUser.personalizationCompleted ? "text-green-600" : "text-yellow-600"}>
                  {currentUser.personalizationCompleted ? "✓ Completed" : "⚠ Not completed"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium">{currentUser.role}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Modals */}
      {showWelcomeForm && (
        <WelcomePersonalizationForm
          open={showWelcomeForm}
          onClose={() => setShowWelcomeForm(false)}
          onSubmit={handlePersonalizationSubmit}
          onSkip={() => setShowWelcomeForm(false)}
        />
      )}

      {showDonationForm && (
        <DonationSeekerApplicationForm
          open={showDonationForm}
          onClose={() => setShowDonationForm(false)}
          onSubmit={handleDonationSubmit}
        />
      )}

      {showMoodForm && (
        <DailyMoodLogForm
          open={showMoodForm}
          onClose={() => setShowMoodForm(false)}
          onSubmit={handleMoodLogSubmit}
        />
      )}

      {showPreSessionForm && (
        <SessionAssessmentForm
          open={showPreSessionForm}
          onClose={() => setShowPreSessionForm(false)}
          onSubmit={handleSessionAssessmentSubmit}
          patientName="John Doe"
          sessionType="pre"
        />
      )}

      {showPostSessionForm && (
        <SessionAssessmentForm
          open={showPostSessionForm}
          onClose={() => setShowPostSessionForm(false)}
          onSubmit={handleSessionAssessmentSubmit}
          patientName="John Doe"
          sessionType="post"
        />
      )}
    </div>
  );
}
