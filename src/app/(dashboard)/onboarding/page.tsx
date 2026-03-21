'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/hooks/platform/auth/use-simple-auth';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const PATIENT_GOALS = [
  'Stress reduction',
  'Better sleep',
  'Pain management',
  'Emotional balance',
  'Fitness',
  'Other',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useSimpleAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const totalSteps = 4;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.name) {
      setFullName((current) => current || user.name || '');
    }
  }, [user?.name]);

  const stepTitle = useMemo(() => {
    const map: Record<number, string> = {
      1: t('onboarding.welcome'),
      2: 'Complete your profile',
      3: 'Choose your wellness goals',
      4: 'Book your first session',
    };
    return map[step] ?? t('onboarding.welcome');
  }, [step, t]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const canGoNext = () => {
    if (step === 2) {
      return fullName.trim().length > 1;
    }
    if (step === 3) {
      return selectedGoals.length >= 1 && selectedGoals.length <= 3;
    }
    return true;
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((current) => {
      if (current.includes(goal)) return current.filter((item) => item !== goal);
      if (current.length >= 3) return current;
      return [...current, goal];
    });
  };

  const saveOnboarding = async (skipBooking = false) => {
    setSaving(true);
    const supabase = createClient();

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone,
          preferred_language: preferredLanguage,
          timezone,
          onboarding_completed: true,
        })
        .eq('auth_id', user?.id);

      if (updateError) {
        await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            phone,
            onboarding_completed: true,
          })
          .eq('auth_id', user?.id);
      }

      if (selectedGoals.length > 0) {
        const goalsPayload = selectedGoals.map((goal) => ({
          user_id: user?.id,
          title: goal,
          status: 'active',
          progress_percentage: 0,
        }));

        await supabase.from('goals').insert(goalsPayload);
      }

      if (!skipBooking) {
        router.push('/book');
        return;
      }

      router.push('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-screen items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="mb-3 space-y-2">
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>
                Step {step} of {totalSteps}
              </span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <Progress value={(step / totalSteps) * 100} className="h-2" />
          </div>
          <CardTitle className="text-2xl">{stepTitle}</CardTitle>
          <CardDescription>
            {step === 1
              ? t('onboarding.subtitle')
              : 'Tell us a few details so we can personalize your experience.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Welcome to EKA Balance. You will get personalized recommendations and AI-powered
                support in just a few steps.
              </p>
              <div className="border-primary/20 bg-primary/5 text-muted-foreground rounded-[var(--radius)] border p-3 text-xs">
                Therapist and admin accounts are created via invite links by platform
                administrators. Standard sign-up creates a client account automatically.
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <Label>Full name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Preferred language</Label>
                <Input
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Timezone</Label>
                <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">Pick 1 to 3 goals</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {PATIENT_GOALS.map((goal) => (
                  <button
                    type="button"
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={cn(
                      'rounded-[var(--radius)] border px-3 py-2 text-left text-sm transition-colors',
                      selectedGoals.includes(goal)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:bg-muted'
                    )}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                You are all set. Book your first session now, or skip and start exploring your
                dashboard.
              </p>
            </div>
          )}

          <div className="border-border/60 flex items-center justify-between border-t pt-4">
            <Button
              variant="ghost"
              onClick={() => setStep((current) => Math.max(1, current - 1))}
              disabled={step === 1 || saving}
            >
              Back
            </Button>

            <div className="flex items-center gap-2">
              {step === 4 && (
                <Button variant="outline" disabled={saving} onClick={() => saveOnboarding(true)}>
                  Skip for now
                </Button>
              )}

              {step < totalSteps && (
                <Button
                  onClick={() => setStep((current) => Math.min(totalSteps, current + 1))}
                  disabled={!canGoNext() || saving}
                >
                  Next
                </Button>
              )}

              {step === totalSteps && (
                <Button onClick={() => saveOnboarding(false)} disabled={saving || !canGoNext()}>
                  {saving ? t('onboarding.loading') : 'Book first session'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
