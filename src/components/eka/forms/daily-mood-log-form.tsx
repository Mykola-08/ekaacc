'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useBehavioralTracking } from '@/hooks/use-behavioral-tracking';
import { Loader2, Heart, Brain, Battery, Moon, Activity, Smile, Frown, Meh } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface DailyMoodLogFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MoodLogData) => void;
}

export interface MoodLogData {
  date: Date;
  overallMood: number;
  energy: number;
  stress: number;
  sleep: number;
  physicalHealth: number;
  emotions: string[];
  triggers?: string;
  gratitude?: string;
  notes?: string;
  activities?: string[];
}

// Validation schemas
const basicMoodSchema = z.object({
  basicMood: z.string().min(1, 'Please select a mood'),
  basicEnergy: z.string().min(1, 'Please select energy level'),
  basicStress: z.string().min(1, 'Please select stress level'),
  notes: z.string().optional(),
});

const fullMoodSchema = z.object({
  overallMood: z.number().min(1).max(10),
  energy: z.number().min(1).max(10),
  stress: z.number().min(1).max(10),
  sleep: z.number().min(1).max(10),
  physicalHealth: z.number().min(1).max(10),
  emotions: z.array(z.string()).min(1, 'Please select at least one emotion'),
  triggers: z.string().optional(),
  gratitude: z.string().optional(),
  notes: z.string().optional(),
  activities: z.array(z.string()).optional(),
});

const emotions = [
  { label: 'Happy', icon: '😊', color: 'bg-green-500' },
  { label: 'Sad', icon: '😢', color: 'bg-blue-500' },
  { label: 'Anxious', icon: '😰', color: 'bg-yellow-500' },
  { label: 'Angry', icon: '😠', color: 'bg-red-500' },
  { label: 'Calm', icon: '😌', color: 'bg-purple-500' },
  { label: 'Excited', icon: '🤩', color: 'bg-orange-500' },
  { label: 'Tired', icon: '😴', color: 'bg-indigo-500' },
  { label: 'Frustrated', icon: '😤', color: 'bg-pink-500' },
  { label: 'Content', icon: '😊', color: 'bg-teal-500' },
  { label: 'Overwhelmed', icon: '🤯', color: 'bg-rose-500' },
];

const activities = [
  'Exercise',
  'Meditation',
  'Social Activity',
  'Work/Study',
  'Hobby',
  'Therapy Session',
  'Self-care',
  'Time in Nature',
];

export function DailyMoodLogForm({ open, onClose, onSubmit }: DailyMoodLogFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { trackMoodLog } = useBehavioralTracking();
  const [formType, setFormType] = useState<'basic' | 'full'>('basic');

  // Basic form setup
  const basicForm = useForm({
    resolver: zodResolver(basicMoodSchema),
    defaultValues: {
      basicMood: 'Neutral',
      basicEnergy: 'Normal',
      basicStress: 'Normal',
      notes: '',
    },
  });

  // Full form setup
  const fullForm = useForm({
    resolver: zodResolver(fullMoodSchema),
    defaultValues: {
      overallMood: 5,
      energy: 5,
      stress: 5,
      sleep: 5,
      physicalHealth: 5,
      emotions: [],
      triggers: '',
      gratitude: '',
      notes: '',
      activities: [],
    },
  });

  const toggleEmotion = (emotion: string) => {
    const currentEmotions = fullForm.getValues('emotions');
    const newEmotions = currentEmotions.includes(emotion)
      ? currentEmotions.filter(e => e !== emotion)
      : [...currentEmotions, emotion];
    fullForm.setValue('emotions', newEmotions);
  };

  const toggleActivity = (activity: string) => {
    const currentActivities = fullForm.getValues('activities') || [];
    const newActivities = currentActivities.includes(activity)
      ? currentActivities.filter(a => a !== activity)
      : [...currentActivities, activity];
    fullForm.setValue('activities', newActivities);
  };

  const getMoodEmoji = (value: number) => {
    if (value <= 3) return <Frown className="h-6 w-6 text-red-500" />;
    if (value <= 7) return <Meh className="h-6 w-6 text-yellow-500" />;
    return <Smile className="h-6 w-6 text-green-500" />;
  };

  const handleBasicSubmit = async (data: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const moodData = {
      date: new Date(),
      overallMood: 0,
      energy: 0,
      stress: 0,
      sleep: 0,
      physicalHealth: 0,
      emotions: [data.basicMood],
      notes: data.notes,
      activities: [],
      triggers: '',
      gratitude: '',
    };
    
    onSubmit(moodData);
    
    // Track behavioral interaction
    trackMoodLog(data.basicMood.toLowerCase(), undefined, {
      formType: 'basic',
      hasNotes: data.notes.length > 0
    });
    
    toast({
      title: 'Basic mood log saved!',
      description: 'Your quick check-in has been recorded.',
    });
    setIsLoading(false);
  };

  const handleFullSubmit = async (data: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const moodData = {
      date: new Date(),
      overallMood: data.overallMood,
      energy: data.energy,
      stress: data.stress,
      sleep: data.sleep,
      physicalHealth: data.physicalHealth,
      emotions: data.emotions,
      triggers: data.triggers,
      gratitude: data.gratitude,
      notes: data.notes,
      activities: data.activities,
    };
    
    onSubmit(moodData);
    
    // Track behavioral interaction
    const primaryMood = data.emotions.length > 0 ? data.emotions[0].toLowerCase() : 'neutral';
    trackMoodLog(primaryMood, data.overallMood, {
      formType: 'full',
      energy: data.energy,
      stress: data.stress,
      sleep: data.sleep,
      physicalHealth: data.physicalHealth,
      emotionCount: data.emotions.length,
      activityCount: data.activities?.length || 0,
      hasTriggers: data.triggers.length > 0,
      hasGratitude: data.gratitude.length > 0,
      hasNotes: data.notes.length > 0
    });
    
    toast({
      title: 'Mood log saved!',
      description: 'Your daily check-in has been recorded. Keep up the great work! 🌟',
    });
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            Daily Mood Check-in
          </DialogTitle>
          <DialogDescription>
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>

        {/* Form type selector */}
        <div className="flex gap-2 mb-4">
          <Button
            type="button"
            variant={formType === 'basic' ? 'default' : 'outline'}
            onClick={() => setFormType('basic')}
          >
            Quick Check-in
          </Button>
          <Button
            type="button"
            variant={formType === 'full' ? 'default' : 'outline'}
            onClick={() => setFormType('full')}
          >
            Full Form
          </Button>
        </div>

        {formType === 'basic' ? (
          <Form {...basicForm}>
            <form onSubmit={basicForm.handleSubmit(handleBasicSubmit)} className="space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <FormField
                    control={basicForm.control}
                    name="basicMood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How do you feel overall?</FormLabel>
                        <FormControl>
                          <div className="flex gap-2 flex-wrap">
                            {['Great', 'Good', 'Neutral', 'Bad', 'Awful'].map((mood) => (
                              <Button
                                key={mood}
                                type="button"
                                variant={field.value === mood ? 'default' : 'outline'}
                                onClick={() => field.onChange(mood)}
                              >
                                {mood}
                              </Button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={basicForm.control}
                    name="basicEnergy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Energy Level</FormLabel>
                        <FormControl>
                          <div className="flex gap-2 flex-wrap">
                            {['Very High', 'High', 'Normal', 'Low', 'Very Low'].map((energy) => (
                              <Button
                                key={energy}
                                type="button"
                                variant={field.value === energy ? 'default' : 'outline'}
                                onClick={() => field.onChange(energy)}
                              >
                                {energy}
                              </Button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={basicForm.control}
                    name="basicStress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stress Level</FormLabel>
                        <FormControl>
                          <div className="flex gap-2 flex-wrap">
                            {['Very High', 'High', 'Normal', 'Low', 'Very Low'].map((stress) => (
                              <Button
                                key={stress}
                                type="button"
                                variant={field.value === stress ? 'default' : 'outline'}
                                onClick={() => field.onChange(stress)}
                              >
                                {stress}
                              </Button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={basicForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional thoughts or observations..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Add any additional thoughts or observations
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !basicForm.formState.isValid}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Mood Log
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Form {...fullForm}>
            <form onSubmit={fullForm.handleSubmit(handleFullSubmit)} className="space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <FormField
                    control={fullForm.control}
                    name="overallMood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            Overall Mood
                          </span>
                          <Badge variant="background">{field.value}/10</Badge>
                        </FormLabel>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            max={10}
                            min={1}
                            step={1}
                          />
                        </FormControl>
                        <FormDescription className="flex justify-between">
                          <span>Very Low</span>
                          <span>Excellent</span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={fullForm.control}
                    name="energy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Battery className="h-4 w-4" />
                            Energy Level
                          </span>
                          <Badge variant="background">{field.value}/10</Badge>
                        </FormLabel>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            max={10}
                            min={1}
                            step={1}
                          />
                        </FormControl>
                        <FormDescription className="flex justify-between">
                          <span>Exhausted</span>
                          <span>Energized</span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={fullForm.control}
                    name="stress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Stress Level
                          </span>
                          <Badge variant="background">{field.value}/10</Badge>
                        </FormLabel>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            max={10}
                            min={1}
                            step={1}
                          />
                        </FormControl>
                        <FormDescription className="flex justify-between">
                          <span>Very Calm</span>
                          <span>Very Stressed</span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={fullForm.control}
                    name="sleep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Sleep Quality
                          </span>
                          <Badge variant="background">{field.value}/10</Badge>
                        </FormLabel>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            max={10}
                            min={1}
                            step={1}
                          />
                        </FormControl>
                        <FormDescription className="flex justify-between">
                          <span>Very Poor</span>
                          <span>Excellent</span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={fullForm.control}
                    name="physicalHealth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            Physical Health
                          </span>
                          <Badge variant="background">{field.value}/10</Badge>
                        </FormLabel>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            max={10}
                            min={1}
                            step={1}
                          />
                        </FormControl>
                        <FormDescription className="flex justify-between">
                          <span>Poor</span>
                          <span>Excellent</span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={fullForm.control}
                    name="emotions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emotions</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {emotions.map((emotion) => (
                              <Button
                                key={emotion.label}
                                type="button"
                                variant={field.value?.includes(emotion.label) ? 'default' : 'outline'}
                                onClick={() => toggleEmotion(emotion.label)}
                                className="justify-start"
                              >
                                <span className="mr-2">{emotion.icon}</span>
                                {emotion.label}
                              </Button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={fullForm.control}
                    name="activities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activities</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {activities.map((activity) => (
                              <Button
                                key={activity}
                                type="button"
                                variant={field.value?.includes(activity) ? 'default' : 'outline'}
                                onClick={() => toggleActivity(activity)}
                                className="justify-start"
                              >
                                {activity}
                              </Button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={fullForm.control}
                    name="triggers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Triggers</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What might have influenced your mood today?"
                            {...field}
                            rows={2}
                          />
                        </FormControl>
                        <FormDescription>
                          What might have influenced your mood today?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={fullForm.control}
                    name="gratitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gratitude</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List 1-3 things you're thankful for..."
                            {...field}
                            rows={2}
                          />
                        </FormControl>
                        <FormDescription>
                          List 1-3 things you're thankful for...
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={fullForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional thoughts or notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Anything else you want to remember about today?"
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Anything else you want to remember about today?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !fullForm.formState.isValid}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Mood Log'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
