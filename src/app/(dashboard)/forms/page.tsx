'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import {
  WelcomePersonalizationForm,
  DonationSeekerApplicationForm,
  DailyMoodLogForm,
  SessionAssessmentForm,
  PersonalizationData,
  DonationSeekerData,
  MoodLogData,
  SessionAssessmentData,
} from '@/components/platform/eka/forms';
import { FileText, Heart, ClipboardCheck, Sparkles, Gift, Brain } from 'lucide-react';
import { InlineFeedback } from '@/components/ui/inline-feedback';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import { useAuth } from '@/lib/platform/supabase/auth';
import { useAppStore } from '@/store/platform/app-store';
import { PersonalizationEngine } from '@/lib/platform/services/personalization-engine';
import { usePermissions } from '@/components/dashboard/auth/PermissionGate';

export default function FormsPage() {
  const can = usePermissions();
  const [showWelcomeForm, setShowWelcomeForm] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [showPreSessionForm, setShowPreSessionForm] = useState(false);
  const [showPostSessionForm, setShowPostSessionForm] = useState(false);

  const { feedback, setSuccess, reset } = useMorphingFeedback();
  const { user: currentUser } = useAuth();
  const { dataService, initDataService } = useAppStore();

  useEffect(() => {
    initDataService?.();
  }, [initDataService]);

  const updateUser = async (userData: any) => {
    if (dataService && currentUser) {
      await dataService.updateUser(currentUser.id, userData);
    }
  };

  useEffect(() => {
    if (currentUser) {
      const updates = PersonalizationEngine.trackActivity(currentUser as any, {
        type: 'page-visit',
        data: { page: '/forms' },
      });
      updateUser({
        user_metadata: {
          ...(currentUser.user_metadata || {}),
          activityData: { ...((currentUser.user_metadata as any)?.activityData || {}), ...updates },
        },
      });
    }
  }, [currentUser, updateUser]);

  const handlePersonalizationSubmit = (data: PersonalizationData) => {
    updateUser({
      user_metadata: {
        ...(currentUser?.user_metadata || {}),
        personalizationCompleted: true,
        personalization: {
          goals: data.goals,
          interests: data.interests ? data.interests.split(',').map((i) => i.trim()) : [],
          values: data.values,
          preferences: data.preferences,
        },
      },
    });
    setShowWelcomeForm(false);
    setSuccess('Personalization complete! Your profile has been updated.');
  };

  const handleDonationSubmit = (data: DonationSeekerData) => {
    setShowDonationForm(false);
    setSuccess('Application submitted! We will review within 48 hours.');
  };

  const handleMoodLogSubmit = (data: MoodLogData) => {
    setShowMoodForm(false);
    setSuccess('Mood log saved! Your daily check-in has been recorded.');
  };

  const handleSessionAssessmentSubmit = (data: SessionAssessmentData) => {
    setShowPreSessionForm(false);
    setShowPostSessionForm(false);
    setSuccess('Assessment saved! Session documentation complete.');
  };

  return (
    <div className="container mx-auto p-6">
      <div>
        <h1 className="mb-2 text-3xl font-semibold">EKA Forms</h1>
        <p className="text-muted-foreground">
          Access all patient and therapist forms with integrated AI assistance
        </p>
        <InlineFeedback
          status={feedback.status}
          message={feedback.message}
          onDismiss={reset}
          className="mt-3"
        />
      </div>

      {/* Patient Forms — visible to users with patient_data.view_own */}
      {can('patient_data', 'view_own') && (
        <div className="">
          <h2 className="text-2xl font-semibold">Patient Forms</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Gift className="text-primary h-8 w-8 opacity-10" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-primary h-5 w-5" />
                  Welcome Form
                </CardTitle>
                <CardDescription>First-time personalization with &euro;10 discount</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground mb-4 text-sm">
                  <p>&bull; Multi-step onboarding</p>
                  <p>&bull; Mental health assessment</p>
                  <p>&bull; Emergency contact collection</p>
                  <p>&bull; &euro;10 discount on first session</p>
                </div>
                <Button onClick={() => setShowWelcomeForm(true)} className="w-full">
                  Open Welcome Form
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Heart className="text-primary h-8 w-8 opacity-10" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="text-primary h-5 w-5" />
                  Daily Mood Log
                </CardTitle>
                <CardDescription>Track your daily emotions and wellbeing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground mb-4 text-sm">
                  <p>&bull; Mood, energy, stress tracking</p>
                  <p>&bull; Emotion selection</p>
                  <p>&bull; Activity logging</p>
                  <p>&bull; Gratitude journaling</p>
                </div>
                <Button onClick={() => setShowMoodForm(true)} className="w-full">
                  Log Today&apos;s Mood
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <FileText className="text-primary h-8 w-8 opacity-10" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="text-primary h-5 w-5" />
                  Donation Seeker
                </CardTitle>
                <CardDescription>Apply for financial support with AI assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground mb-4 text-sm">
                  <p>&bull; Financial needs assessment</p>
                  <p>&bull; AI-enhanced history revision</p>
                  <p>&bull; Confidential application</p>
                  <p>&bull; 48-hour review process</p>
                </div>
                <Button onClick={() => setShowDonationForm(true)} className="w-full">
                  Apply for Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Therapist Forms — visible to users with therapist_tools.create */}
      {can('therapist_tools', 'create') && (
        <div className="">
          <h2 className="text-2xl font-semibold">Therapist Forms</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <ClipboardCheck className="text-primary h-8 w-8 opacity-10" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="text-primary h-5 w-5" />
                  Pre-Session Assessment
                </CardTitle>
                <CardDescription>Complete before session begins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground mb-4 text-sm">
                  <p>&bull; Client current state evaluation</p>
                  <p>&bull; Crisis risk assessment</p>
                  <p>&bull; Session goal setting</p>
                  <p>&bull; Medication tracking</p>
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

            <Card className="relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Brain className="text-primary h-8 w-8 opacity-10" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="text-primary h-5 w-5" />
                  Post-Session Assessment
                </CardTitle>
                <CardDescription>Document session outcomes and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground mb-4 text-sm">
                  <p>&bull; Session summary documentation</p>
                  <p>&bull; Progress tracking</p>
                  <p>&bull; Intervention recording</p>
                  <p>&bull; Follow-up planning</p>
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
      )}

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
                <span
                  className={currentUser.personalizationCompleted ? 'text-success' : 'text-warning'}
                >
                  {currentUser.personalizationCompleted
                    ? '\u2713 Completed'
                    : '\u26A0 Not completed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium">{currentUser.role?.name}</span>
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
