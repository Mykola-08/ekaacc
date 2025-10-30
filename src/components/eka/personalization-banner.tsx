'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedPersonalizationForm, PersonalizationData } from './forms';
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/store/app-store';
import { useToast } from '@/hooks/use-toast';

export function PersonalizationBanner() {
  const [showForm, setShowForm] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { appUser, refreshAppUser } = useAuth();
  const { dataService, initDataService } = useAppStore();
  const { toast } = useToast();

  useEffect(() => {
    initDataService();
  }, [initDataService]);

  if (isDismissed || appUser?.personalizationCompleted) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    toast({
      title: 'Reminder dismissed',
      description: 'You can complete personalization anytime from your account settings.',
    });
  };

  const handleSkip = () => {
    setShowForm(false);
    setIsDismissed(true);
  };

  const handleSubmit = async (data: PersonalizationData) => {
    if (!dataService || !appUser) return;
    
    const updatedUserData = {
      personalizationCompleted: true,
      personalization: {
        goals: data.goals,
        interests: data.interests,
        values: data.values,
        preferences: data.preferences,
        communicationStyle: data.communicationStyle,
        motivationFactors: data.motivationFactors,
        stressors: data.stressors,
        copingMechanisms: data.copingMechanisms,
        preferredTherapyApproach: data.preferredTherapyApproach,
        languagePreference: data.languagePreference,
        culturalBackground: data.culturalBackground,
        lifeStage: data.lifeStage,
        supportSystem: data.supportSystem,
      },
    };

    try {
      await dataService.updateUser(appUser.id, updatedUserData);
      await refreshAppUser(); // Refresh user data from auth context
      
      setShowForm(false);
      setIsDismissed(true);
      
      toast({
        title: '🎉 Personalization Complete!',
        description: 'Your wellness journey is now optimized for you.',
        duration: 5000,
      });
    } catch (error) {
      console.error("Failed to update user personalization", error);
      toast({
        title: 'Update Failed',
        description: 'Could not save your personalization. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary/90 to-primary/70 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                <Gift className="h-4 w-4 text-white" />
                <span className="text-xs font-semibold text-white">€10 Discount</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  Complete your personalization and get €10 off your first session!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowForm(true)}
                className="hidden sm:flex"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Complete Now
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowForm(true)}
                className="sm:hidden"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDismiss}
                className="h-8 w-8 text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <EnhancedPersonalizationForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          onSkip={handleSkip}
        />
      )}
    </>
  );
}
