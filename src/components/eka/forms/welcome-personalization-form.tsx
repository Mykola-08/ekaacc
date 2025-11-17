'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Loader2, Sparkles, Gift, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WelcomePersonalizationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PersonalizationData) => void;
  onSkip?: () => void;
}

export interface PersonalizationData {
  goals: string;
  interests: string;
  values: string;
  preferences: string;
  mentalHealthConcerns: string[];
  previousTherapyExperience: string;
  preferredSessionTime: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  // AI Learning Fields
  communicationStyle?: 'formal' | 'casual' | 'empathetic' | 'direct';
  motivationFactors?: string[];
  stressors?: string[];
  copingMechanisms?: string[];
  preferredTherapyApproach?: string;
  languagePreference?: string;
  culturalBackground?: string;
  lifeStage?: string;
  supportSystem?: string;
}

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

  // Form state
  const [goals, setGoals] = useState('');
  const [interests, setInterests] = useState('');
  const [values, setValues] = useState('');
  const [preferences, setPreferences] = useState('');
  const [mentalHealthConcerns, setMentalHealthConcerns] = useState<string[]>([]);
  const [previousTherapyExperience, setPreviousTherapyExperience] = useState('');
  const [preferredSessionTime, setPreferredSessionTime] = useState('');
  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  });

  const totalSteps = 3;

  const handleConcernToggle = (concern: string) => {
    setMentalHealthConcerns(prev => 
      prev.includes(concern) 
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    );
  };

  const handleNext = () => {
    if (step === 1 && !goals.trim()) {
      toast({
        variant: 'destructive',
        title: 'Please share your goals',
        description: 'This helps us personalize your experience.',
      });
      return;
    }
    if (step === 2 && mentalHealthConcerns.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Please select at least one concern',
        description: 'This helps us match you with the right therapist.',
      });
      return;
    }
    setStep(step + 1);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emergencyContact.name || !emergencyContact.phone) {
      toast({
        variant: 'destructive',
        title: 'Emergency contact required',
        description: 'Please provide emergency contact information for your safety.',
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: 'Personalizing your experience...',
      description: 'AI is analyzing your preferences to create the perfect wellness journey.',
    });

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSubmit({
      goals,
      interests,
      values,
      preferences,
      mentalHealthConcerns,
      previousTherapyExperience,
      preferredSessionTime,
      emergencyContact
    });

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
            <Badge variant="background" className="flex items-center gap-1">
              <Gift className="h-3 w-3" />
              €10 Discount
            </Badge>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        rows={4}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="interests">What are your interests and hobbies?</Label>
                      <Textarea
                        id="interests"
                        placeholder="e.g., Reading, yoga, painting, hiking..."
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        rows={3}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="values">What values are important to you?</Label>
                      <Textarea
                        id="values"
                        placeholder="e.g., Family, honesty, personal growth, compassion..."
                        value={values}
                        onChange={(e) => setValues(e.target.value)}
                        rows={3}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="preferences">Any preferences for therapy approach?</Label>
                      <Textarea
                        id="preferences"
                        placeholder="e.g., CBT, mindfulness-based, solution-focused..."
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
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
                            variant={mentalHealthConcerns.includes(concern) ? 'default' : 'outline'}
                            onClick={() => handleConcernToggle(concern)}
                            className="justify-start"
                          >
                            {concern}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="previousExperience">Previous therapy experience</Label>
                      <Select value={previousTherapyExperience} onValueChange={setPreviousTherapyExperience}>
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
                      <Select value={preferredSessionTime} onValueChange={setPreferredSessionTime}>
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
                        value={emergencyContact.name}
                        onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="emergencyPhone">Phone Number *</Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={emergencyContact.phone}
                        onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="emergencyRelationship">Relationship</Label>
                      <Select 
                        value={emergencyContact.relationship} 
                        onValueChange={(value) => setEmergencyContact({ ...emergencyContact, relationship: value })}
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

          <ModalFooter className="flex-col sm:flex-row gap-2">
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
