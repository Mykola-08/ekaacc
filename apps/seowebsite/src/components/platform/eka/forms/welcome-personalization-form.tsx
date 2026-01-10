'use client';

import { Badge } from '@/components/platform/ui/badge';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent } from '@/components/platform/ui/card';
import { Input } from '@/components/platform/ui/input';
import { Label } from '@/components/platform/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/platform/ui/dialog';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/platform/ui/select';
import { Textarea } from '@/components/platform/ui/textarea';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, Gift, X } from 'lucide-react';
import { useToast } from '@/hooks/platform/use-toast';

interface WelcomePersonalizationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PersonalizationData) => void;
  onSkip?: () => void;
}

const emergencyContactSchema = z.object({
  name: z.string().min(2, 'Emergency contact name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  relationship: z.string().optional(),
});

const personalizationSchema = z.object({
  goals: z.string().min(10, 'Please describe your therapy goals in detail'),
  interests: z.string().optional(),
  values: z.string().optional(),
  preferences: z.string().optional(),
  mentalHealthConcerns: z.array(z.string()).min(1, 'Please select at least one concern'),
  previousTherapyExperience: z.string().optional(),
  preferredSessionTime: z.string().optional(),
  emergencyContact: emergencyContactSchema,
  // AI Learning Fields
  communicationStyle: z.enum(['formal', 'casual', 'empathetic', 'direct']).optional(),
  motivationFactors: z.array(z.string()).optional(),
  stressors: z.array(z.string()).optional(),
  copingMechanisms: z.array(z.string()).optional(),
  preferredTherapyApproach: z.string().optional(),
  languagePreference: z.string().optional(),
  culturalBackground: z.string().optional(),
  lifeStage: z.string().optional(),
  supportSystem: z.string().optional(),
});

export type PersonalizationData = z.infer<typeof personalizationSchema>;

const mentalHealthOptions = [
  'Anxiety',
  'Depression',
  'Stress Management',
  'Relationship Issues',
  'Trauma',
  'Self-esteem',
  'Life Transitions',
  'Work-related Issues',
  'Sleep Problems',
  'Other'
];

export function WelcomePersonalizationForm({ open, onClose, onSubmit, onSkip }: WelcomePersonalizationFormProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(personalizationSchema),
    defaultValues: {
      goals: '',
      interests: '',
      values: '',
      preferences: '',
      mentalHealthConcerns: [],
      previousTherapyExperience: '',
      preferredSessionTime: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      }
    }
  });

  // Watch form values
  const goals = watch('goals');
  const mentalHealthConcerns = watch('mentalHealthConcerns');
  const emergencyContact = watch('emergencyContact');

  const totalSteps = 3;

  const handleConcernToggle = (concern: string) => {
    const currentConcerns = mentalHealthConcerns || [];
    const newConcerns = currentConcerns.includes(concern) 
      ? currentConcerns.filter(c => c !== concern)
      : [...currentConcerns, concern];
    setValue('mentalHealthConcerns', newConcerns);
  };

  const handleNext = async () => {
    let isValid = false;
    
    if (step === 1) {
      isValid = await trigger('goals');
    } else if (step === 2) {
      isValid = await trigger('mentalHealthConcerns');
    }

    if (isValid || step > 2) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onClose();
    }
  };

  const onFormSubmit = async (data: PersonalizationData) => {
    setIsLoading(true);
    toast({
      title: 'Personalizing your experience...',
      description: 'AI is analyzing your preferences to create the perfect wellness journey.',
    });

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSubmit(data);

    toast({
      title: '🎉 Welcome to EKA!',
      description: 'You\'ve earned a €10 discount on your first session!',
    });

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Welcome to EKA
              </DialogTitle>
              <DialogDescription>
                Complete this form to personalize your wellness journey
              </DialogDescription>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Gift className="h-3 w-3" />
              €10 Discount
            </Badge>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`h-2 rounded-full flex-1 ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
                {s < totalSteps && <div className="w-2" />}
              </div>
            ))}
          </div>

          {/* Step 1: Personal Goals & Interests */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Tell us about yourself</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="goals">What are your therapy goals? *</Label>
                      <Textarea
                        id="goals"
                        placeholder="e.g., I want to manage my anxiety better, improve my relationships, build self-confidence..."
                        {...register('goals')}
                        rows={4}
                        className="mt-2"
                      />
                      {errors.goals && (
                        <p className="text-sm text-destructive mt-1">{errors.goals.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="interests">What are your interests and hobbies?</Label>
                      <Textarea
                        id="interests"
                        placeholder="e.g., Reading, yoga, painting, hiking..."
                        {...register('interests')}
                        rows={3}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="values">What values are important to you?</Label>
                      <Textarea
                        id="values"
                        placeholder="e.g., Family, honesty, personal growth, compassion..."
                        {...register('values')}
                        rows={3}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="preferences">Any preferences for therapy approach?</Label>
                      <Textarea
                        id="preferences"
                        placeholder="e.g., CBT, mindfulness-based, solution-focused..."
                        {...register('preferences')}
                        rows={2}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Mental Health Concerns */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">What brings you to therapy? *</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Select all that apply:</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {mentalHealthOptions.map((concern) => (
                          <Button
                            key={concern}
                            type="button"
                            variant={mentalHealthConcerns?.includes(concern) ? 'default' : 'outline'}
                            onClick={() => handleConcernToggle(concern)}
                            className="justify-start"
                          >
                            {concern}
                          </Button>
                        ))}
                      </div>
                      {errors.mentalHealthConcerns && (
                        <p className="text-sm text-destructive mt-1">{errors.mentalHealthConcerns.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="previousExperience">Previous therapy experience</Label>
                      <Select value={watch('previousTherapyExperience')} onValueChange={(value) => setValue('previousTherapyExperience', value)}>
                      <SelectValue placeholder="Select your experience level"  />
                      <SelectContent>
                        <SelectItem value="none">This is my first time</SelectItem>
                        <SelectItem value="some">I've had some therapy before</SelectItem>
                        <SelectItem value="extensive">I've been in therapy for a while</SelectItem>
                      </SelectContent>
                    </Select>
                    </div>

                    <div>
                      <Label htmlFor="sessionTime">Preferred session time</Label>
                      <Select value={watch('preferredSessionTime')} onValueChange={(value) => setValue('preferredSessionTime', value)}>
                      <SelectValue placeholder="When works best for you?"  />
                      <SelectContent>
                        <SelectItem value="morning">Morning (8 AM - 12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                        <SelectItem value="evening">Evening (5 PM - 9 PM)</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Emergency Contact */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Emergency Contact Information *</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    For your safety, please provide someone we can contact in case of emergency.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="emergencyName">Name *</Label>
                      <Input
                        id="emergencyName"
                        placeholder="Full name"
                        {...register('emergencyContact.name')}
                        className="mt-2"
                      />
                      {errors.emergencyContact?.name && (
                        <p className="text-sm text-destructive mt-1">{errors.emergencyContact.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="emergencyPhone">Phone Number *</Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        {...register('emergencyContact.phone')}
                        className="mt-2"
                      />
                      {errors.emergencyContact?.phone && (
                        <p className="text-sm text-destructive mt-1">{errors.emergencyContact.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="emergencyRelationship">Relationship</Label>
                      <Select 
                        value={emergencyContact?.relationship || ''} 
                        onValueChange={(value) => setValue('emergencyContact.relationship', value)}
                      >
                        <SelectValue placeholder="Select relationship"  />
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="spouse">Spouse/Partner</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-start gap-2">
                      <Gift className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Your €10 Discount is Ready!</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Complete this form to unlock your welcome discount on your first therapy session.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={isLoading}
            >
              Skip for now
            </Button>
            <div className="flex gap-2 flex-1 sm:flex-initial">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Back
                </Button>
              )}
              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Complete & Claim Discount
                    </>
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
