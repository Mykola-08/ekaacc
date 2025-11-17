'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState, useEffect } from 'react';
import { Loader2, Sparkles, Gift, X, Target, Heart, TrendingUp, Calendar, Smile, Star, Trophy, Zap, Brain, MessageCircle } from 'lucide-react';
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

const goalCategories = [
  { id: 'physical', label: 'Physical Wellness', icon: Heart, color: 'text-red-500' },
  { id: 'mental', label: 'Mental Clarity', icon: Brain, color: 'text-purple-500' },
  { id: 'emotional', label: 'Emotional Balance', icon: Smile, color: 'text-yellow-500' },
  { id: 'relationships', label: 'Better Relationships', icon: MessageCircle, color: 'text-blue-500' },
  { id: 'performance', label: 'Peak Performance', icon: Trophy, color: 'text-green-500' },
];

const communicationStyles = [
  { value: 'empathetic', label: 'Warm & Empathetic', description: 'Understanding and compassionate' },
  { value: 'direct', label: 'Clear & Direct', description: 'Straightforward and practical' },
  { value: 'casual', label: 'Friendly & Casual', description: 'Relaxed and conversational' },
  { value: 'formal', label: 'Professional & Formal', description: 'Structured and respectful' },
];

const motivationOptions = [
  { id: 'achievement', label: 'Achieving goals', icon: Target },
  { id: 'growth', label: 'Personal growth', icon: TrendingUp },
  { id: 'recognition', label: 'Recognition & praise', icon: Star },
  { id: 'purpose', label: 'Sense of purpose', icon: Sparkles },
  { id: 'autonomy', label: 'Independence', icon: Zap },
  { id: 'connection', label: 'Connection with others', icon: Heart },
];

const stressorOptions = [
  'Work pressure', 'Financial concerns', 'Relationships', 'Health issues',
  'Family responsibilities', 'Time management', 'Uncertainty', 'Social situations'
];

const copingOptions = [
  'Exercise', 'Meditation', 'Talking to friends', 'Journaling',
  'Creative activities', 'Nature walks', 'Music', 'Reading'
];

// AI-powered predictions based on user input
const generatePrediction = (data: { goals: string; concerns: string[]; motivations: string[] }) => {
  const concernCount = data.concerns.length;
  const motivationCount = data.motivations.length;
  const hasGoal = data.goals.length > 20;
  
  // Simple scoring algorithm
  let timelineWeeks = 12;
  let successRate = 75;
  
  if (concernCount <= 2) timelineWeeks -= 2;
  if (concernCount >= 5) timelineWeeks += 3;
  if (motivationCount >= 3) timelineWeeks -= 1;
  if (hasGoal) successRate += 10;
  
  successRate = Math.min(95, Math.max(65, successRate));
  
  return {
    timeline: timelineWeeks,
    successRate,
    recommendation: concernCount <= 2 
      ? "You're in great shape to achieve your goals quickly!" 
      : concernCount <= 4
      ? "With consistent effort, you'll see meaningful progress."
      : "Taking it step-by-step will lead to lasting change.",
    keyStrength: motivationCount >= 3 
      ? "Your strong motivation is a powerful asset!"
      : "Building momentum will be your first win!"
  };
};

export function WelcomePersonalizationForm({ open, onClose, onSubmit, onSkip }: WelcomePersonalizationFormProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form state
  const [selectedGoalCategories, setSelectedGoalCategories] = useState<string[]>([]);
  const [goals, setGoals] = useState('');
  const [interests, setInterests] = useState('');
  const [values, setValues] = useState('');
  const [preferences, setPreferences] = useState('');
  const [mentalHealthConcerns, setMentalHealthConcerns] = useState<string[]>([]);
  const [previousTherapyExperience, setPreviousTherapyExperience] = useState('');
  const [preferredSessionTime, setPreferredSessionTime] = useState('');
  const [communicationStyle, setCommunicationStyle] = useState<'formal' | 'casual' | 'empathetic' | 'direct'>('empathetic');
  const [motivationFactors, setMotivationFactors] = useState<string[]>([]);
  const [stressors, setStressors] = useState<string[]>([]);
  const [copingMechanisms, setCopingMechanisms] = useState<string[]>([]);
  const [lifeStage, setLifeStage] = useState('');
  const [showPrediction, setShowPrediction] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  
  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    if (step === 5 && goals && mentalHealthConcerns.length > 0) {
      const pred = generatePrediction({
        goals,
        concerns: mentalHealthConcerns,
        motivations: motivationFactors
      });
      setPrediction(pred);
      setShowPrediction(true);
    }
  }, [step, goals, mentalHealthConcerns, motivationFactors]);

  const handleGoalCategoryToggle = (categoryId: string) => {
    setSelectedGoalCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleMotivationToggle = (motivationId: string) => {
    setMotivationFactors(prev => 
      prev.includes(motivationId) 
        ? prev.filter(m => m !== motivationId)
        : [...prev, motivationId]
    );
  };

  const handleStressorToggle = (stressor: string) => {
    setStressors(prev => 
      prev.includes(stressor) 
        ? prev.filter(s => s !== stressor)
        : [...prev, stressor]
    );
  };

  const handleCopingToggle = (coping: string) => {
    setCopingMechanisms(prev => 
      prev.includes(coping) 
        ? prev.filter(c => c !== coping)
        : [...prev, coping]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedGoalCategories.length === 0) {
      toast({
        variant: 'destructive',
        title: '✨ Pick at least one wellness area',
        description: 'This helps us create your personalized journey!',
      });
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
      toast({
        title: '🎉 Great progress!',
        description: `You're ${Math.round(progress + 20)}% complete`,
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    
    const formData: PersonalizationData = {
      goals: `${selectedGoalCategories.join(', ')}: ${goals}`,
      interests,
      values,
      preferences,
      mentalHealthConcerns,
      previousTherapyExperience,
      preferredSessionTime,
      emergencyContact,
      communicationStyle,
      motivationFactors,
      stressors,
      copingMechanisms,
      lifeStage,
    };

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: '🎊 Congratulations!',
        description: 'Your personalized wellness journey is ready!',
      });
      onSubmit(formData);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <ModalTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-500" />
              Let's Personalize Your Journey
            </DialogTitle>
            {onSkip && (
              <Button variant="outline" size="sm" onClick={onSkip}>
                Skip for now
              </Button>
            )}
          </div>
          <DialogDescription>
            Step {step} of {totalSteps} - {Math.round(progress)}% complete
          </DialogDescription>
          <div className="h-2 mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Goal Categories */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <Target className="h-12 w-12 text-blue-500 mx-auto" />
                <h3 className="text-xl font-semibold">What brings you here today?</h3>
                <p className="text-sm text-muted-foreground">
                  Select all the areas you'd like to focus on
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {goalCategories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedGoalCategories.includes(category.id);
                  
                  return (
                    <Card
                      key={category.id}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        isSelected ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-950' : ''
                      }`}
                      onClick={() => handleGoalCategoryToggle(category.id)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className={`h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center`}>
                            <Icon className={`h-6 w-6 ${category.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{category.label}</p>
                          </div>
                          {isSelected && (
                            <Star className="h-5 w-5 text-blue-500 fill-blue-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {selectedGoalCategories.length > 0 && (
                <div className="space-y-2">
                  <Label>Tell us more about your specific goals</Label>
                  <Textarea
                    placeholder="Example: I want to reduce stress and improve my sleep quality..."
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Tip: Be specific! It helps us create a better plan for you.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Communication Style & Motivations */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <MessageCircle className="h-12 w-12 text-purple-500 mx-auto" />
                <h3 className="text-xl font-semibold">How should we communicate with you?</h3>
                <p className="text-sm text-muted-foreground">
                  Choose the style that resonates with you
                </p>
              </div>

              <RadioGroup value={communicationStyle} onValueChange={(value: any) => setCommunicationStyle(value)}>
                <div className="grid gap-3">
                  {communicationStyles.map((style) => (
                    <Card
                      key={style.value}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        communicationStyle === style.value ? 'border-2 border-purple-500 bg-purple-50 dark:bg-purple-950' : ''
                      }`}
                      onClick={() => setCommunicationStyle(style.value as any)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={style.value} id={style.value} />
                          <div className="flex-1">
                            <Label htmlFor={style.value} className="text-base font-semibold cursor-pointer">
                              {style.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">{style.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </RadioGroup>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <h4 className="font-semibold">What motivates you most?</h4>
                </div>
                <p className="text-sm text-muted-foreground">Select all that apply</p>
                
                <div className="grid grid-cols-2 gap-2">
                  {motivationOptions.map((motivation) => {
                    const Icon = motivation.icon;
                    const isSelected = motivationFactors.includes(motivation.id);
                    
                    return (
                      <Badge
                        key={motivation.id}
                        variant={isSelected ? 'background' : 'border'}
                        className={`cursor-pointer p-3 justify-start hover:scale-105 transition-all ${
                          isSelected ? 'bg-gradient-to-r from-blue-500 to-purple-500' : ''
                        }`}
                        onClick={() => handleMotivationToggle(motivation.id)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {motivation.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Stressors & Coping */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <Brain className="h-12 w-12 text-orange-500 mx-auto" />
                <h3 className="text-xl font-semibold">Understanding your challenges</h3>
                <p className="text-sm text-muted-foreground">
                  This helps us provide better support
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">😰</span>
                  <h4 className="font-semibold">What causes you stress?</h4>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {stressorOptions.map((stressor) => {
                    const isSelected = stressors.includes(stressor);
                    
                    return (
                      <Badge
                        key={stressor}
                        variant={isSelected ? 'background' : 'border'}
                        className={`cursor-pointer hover:scale-105 transition-all ${
                          isSelected ? 'bg-orange-500' : ''
                        }`}
                        onClick={() => handleStressorToggle(stressor)}
                      >
                        {stressor}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">😌</span>
                  <h4 className="font-semibold">How do you currently cope?</h4>
                </div>
                <p className="text-sm text-muted-foreground">What helps you feel better?</p>
                
                <div className="flex flex-wrap gap-2">
                  {copingOptions.map((coping) => {
                    const isSelected = copingMechanisms.includes(coping);
                    
                    return (
                      <Badge
                        key={coping}
                        variant={isSelected ? 'background' : 'border'}
                        className={`cursor-pointer hover:scale-105 transition-all ${
                          isSelected ? 'bg-green-500' : ''
                        }`}
                        onClick={() => handleCopingToggle(coping)}
                      >
                        {coping}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {copingMechanisms.length > 0 && (
                <Card className="bg-green-50 dark:bg-green-950 border-green-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Heart className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-700 dark:text-green-300">
                          Great self-awareness! 🌟
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          You already have {copingMechanisms.length} healthy coping {copingMechanisms.length === 1 ? 'mechanism' : 'mechanisms'}. 
                          We'll help you build on these strengths!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 4: Life Context */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <Calendar className="h-12 w-12 text-blue-500 mx-auto" />
                <h3 className="text-xl font-semibold">A bit about your life</h3>
                <p className="text-sm text-muted-foreground">
                  Quick details to personalize your experience
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>What stage of life are you in?</Label>
                  <Select value={lifeStage} onValueChange={setLifeStage}>
                    <SelectValue placeholder="Select your life stage"  />
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="early-career">Early Career (20s-30s)</SelectItem>
                      <SelectItem value="established">Established Career (30s-40s)</SelectItem>
                      <SelectItem value="mid-life">Mid-Life (40s-50s)</SelectItem>
                      <SelectItem value="senior">Senior Years (60+)</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>When do you prefer sessions?</Label>
                  <Select value={preferredSessionTime} onValueChange={setPreferredSessionTime}>
                    <SelectValue placeholder="Choose your preferred time"  />
                    <SelectContent>
                      <SelectItem value="morning">Morning (6am - 12pm)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12pm - 5pm)</SelectItem>
                      <SelectItem value="evening">Evening (5pm - 9pm)</SelectItem>
                      <SelectItem value="flexible">I'm flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Previous therapy experience?</Label>
                  <Select value={previousTherapyExperience} onValueChange={setPreviousTherapyExperience}>
                    <SelectValue placeholder="Have you tried therapy before?"  />
                    <SelectContent>
                      <SelectItem value="none">This is my first time</SelectItem>
                      <SelectItem value="some">I've tried it a few times</SelectItem>
                      <SelectItem value="regular">I've had regular therapy</SelectItem>
                      <SelectItem value="extensive">Extensive experience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {previousTherapyExperience === 'none' && (
                  <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-semibold text-blue-700 dark:text-blue-300">
                            Welcome to your wellness journey! 🎉
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            Taking the first step is the hardest part. We're here to make your experience comfortable and effective.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Step 5: AI Prediction & Summary */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto" />
                <h3 className="text-xl font-semibold">Your Personalized Wellness Forecast</h3>
                <p className="text-sm text-muted-foreground">
                  Based on your responses, here's what we predict
                </p>
              </div>

              {showPrediction && prediction && (
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-2 border-green-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-green-500" />
                        Success Prediction
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Your Success Probability</span>
                          <span className="text-2xl font-bold text-green-600">{prediction.successRate}%</span>
                        </div>
                        <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-600 transition-all duration-300" 
                            style={{ width: `${prediction.successRate}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg">
                          <Calendar className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">{prediction.timeline}</p>
                          <p className="text-xs text-muted-foreground">weeks to see results</p>
                        </div>
                        <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg">
                          <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">{selectedGoalCategories.length}</p>
                          <p className="text-xs text-muted-foreground">focus areas</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="font-semibold text-green-700 dark:text-green-300">
                          {prediction.recommendation}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          💪 {prediction.keyStrength}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Your Personalization Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">Focus Areas</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedGoalCategories.map(id => 
                              goalCategories.find(c => c.id === id)?.label
                            ).join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MessageCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">Communication Style</p>
                          <p className="text-sm text-muted-foreground">
                            {communicationStyles.find(s => s.value === communicationStyle)?.label}
                          </p>
                        </div>
                      </div>

                      {motivationFactors.length > 0 && (
                        <div className="flex items-start gap-3">
                          <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium">Key Motivations</p>
                            <p className="text-sm text-muted-foreground">
                              {motivationFactors.length} motivators identified
                            </p>
                          </div>
                        </div>
                      )}

                      {copingMechanisms.length > 0 && (
                        <div className="flex items-start gap-3">
                          <Heart className="h-5 w-5 text-green-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium">Healthy Coping Strategies</p>
                            <p className="text-sm text-muted-foreground">
                              {copingMechanisms.join(', ')}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-300">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">AI-Powered Personalization Active</p>
                          <p className="text-sm text-muted-foreground">
                            Your responses will help us continuously improve your experience
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>

        <ModalFooter className="gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} disabled={isLoading}>
              Back
            </Button>
          )}
          {step < totalSteps ? (
            <Button onClick={handleNext} className="gap-2">
              Continue
              <Sparkles className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading} className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Setting up your journey...
                </>
              ) : (
                <>
                  <Gift className="h-4 w-4" />
                  Complete Setup
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
