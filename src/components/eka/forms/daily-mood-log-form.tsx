'use client';

import { Badge, Button, Card, CardContent, Label, Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, Slider, Textarea } from '@/components/keep';
import { useState } from 'react';
;
;
;
;
;
import { Loader2, Heart, Brain, Battery, Moon, Activity, Smile, Frown, Meh } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
;
;
import { format } from 'date-fns';

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
  const [formType, setFormType] = useState<'basic' | 'full'>('basic');

  // Shared state
  const [notes, setNotes] = useState('');

  // Full form state
  const [overallMood, setOverallMood] = useState([5]);
  const [energy, setEnergy] = useState([5]);
  const [stress, setStress] = useState([5]);
  const [sleep, setSleep] = useState([5]);
  const [physicalHealth, setPhysicalHealth] = useState([5]);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [triggers, setTriggers] = useState('');
  const [gratitude, setGratitude] = useState('');

  // Basic form state
  const [basicMood, setBasicMood] = useState<string>('Neutral');
  const [basicEnergy, setBasicEnergy] = useState<string>('Normal');
  const [basicStress, setBasicStress] = useState<string>('Normal');

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const getMoodEmoji = (value: number) => {
    if (value <= 3) return <Frown className="h-6 w-6 text-red-500" />;
    if (value <= 7) return <Meh className="h-6 w-6 text-yellow-500" />;
    return <Smile className="h-6 w-6 text-green-500" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (formType === 'basic') {
      onSubmit({
        date: new Date(),
        overallMood: 0,
        energy: 0,
        stress: 0,
        sleep: 0,
        physicalHealth: 0,
        emotions: [basicMood],
        notes,
        activities: [],
        triggers: '',
        gratitude: '',
      });
      toast({
        title: 'Basic mood log saved!',
        description: 'Your quick check-in has been recorded.',
      });
    } else {
      if (selectedEmotions.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Please select at least one emotion',
          description: 'This helps track your emotional patterns over time.',
        });
        setIsLoading(false);
        return;
      }
      onSubmit({
        date: new Date(),
        overallMood: overallMood[0],
        energy: energy[0],
        stress: stress[0],
        sleep: sleep[0],
        physicalHealth: physicalHealth[0],
        emotions: selectedEmotions,
        triggers,
        gratitude,
        notes,
        activities: selectedActivities,
      });
      toast({
        title: 'Mood log saved!',
        description: 'Your daily check-in has been recorded. Keep up the great work! 🌟',
      });
    }
    setIsLoading(false);
  };

  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle className="text-2xl flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            Daily Mood Check-in
          </ModalTitle>
          <ModalDescription>
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </ModalDescription>
        </ModalHeader>

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {formType === 'basic' ? (
            <>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label className="mb-2 block">How do you feel overall?</Label>
                    <div className="flex gap-2 flex-wrap">
                      {['Great', 'Good', 'Neutral', 'Bad', 'Awful'].map((mood) => (
                        <Button
                          key={mood}
                          type="button"
                          variant={basicMood === mood ? 'default' : 'outline'}
                          onClick={() => setBasicMood(mood)}
                        >
                          {mood}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Energy</Label>
                    <div className="flex gap-2 flex-wrap">
                      {['High', 'Normal', 'Low'].map((energy) => (
                        <Button
                          key={energy}
                          type="button"
                          variant={basicEnergy === energy ? 'default' : 'outline'}
                          onClick={() => setBasicEnergy(energy)}
                        >
                          {energy}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Stress</Label>
                    <div className="flex gap-2 flex-wrap">
                      {['High', 'Normal', 'Low'].map((stress) => (
                        <Button
                          key={stress}
                          type="button"
                          variant={basicStress === stress ? 'default' : 'outline'}
                          onClick={() => setBasicStress(stress)}
                        >
                          {stress}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Anything else you'd like to share?</Label>
                    <Textarea
                      placeholder="Other thoughts, feelings, or notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* ...existing full form code... */}
              <Card>
                <CardContent className="pt-6 space-y-6">
                  {/* Overall Mood */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Overall Mood
                      </Label>
                      <div className="flex items-center gap-2">
                        {getMoodEmoji(overallMood[0])}
                        <Badge variant="background">{overallMood[0]}/10</Badge>
                      </div>
                    </div>
                    <Slider
                      value={overallMood}
                      onValueChange={setOverallMood}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Very Low</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  {/* Energy Level */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="flex items-center gap-2">
                        <Battery className="h-4 w-4" />
                        Energy Level
                      </Label>
                      <Badge variant="background">{energy[0]}/10</Badge>
                    </div>
                    <Slider
                      value={energy}
                      onValueChange={setEnergy}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Exhausted</span>
                      <span>Energized</span>
                    </div>
                  </div>

                  {/* Stress Level */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Stress Level
                      </Label>
                      <Badge variant="background">{stress[0]}/10</Badge>
                    </div>
                    <Slider
                      value={stress}
                      onValueChange={setStress}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Very Calm</span>
                      <span>Very Stressed</span>
                    </div>
                  </div>

                  {/* Sleep Quality */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Sleep Quality
                      </Label>
                      <Badge variant="background">{sleep[0]}/10</Badge>
                    </div>
                    <Slider
                      value={sleep}
                      onValueChange={setSleep}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Very Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  {/* Physical Health */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Physical Health
                      </Label>
                      <Badge variant="background">{physicalHealth[0]}/10</Badge>
                    </div>
                    <Slider
                      value={physicalHealth}
                      onValueChange={setPhysicalHealth}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Unwell</span>
                      <span>Healthy</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emotions */}
              <Card>
                <CardContent className="pt-6">
                  <Label className="mb-3 block">How are you feeling today? (Select all that apply) *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {emotions.map((emotion) => (
                      <Button
                        key={emotion.label}
                        type="button"
                        variant={selectedEmotions.includes(emotion.label) ? 'default' : 'outline'}
                        onClick={() => toggleEmotion(emotion.label)}
                        className="justify-start h-auto py-3"
                      >
                        <span className="text-2xl mr-2">{emotion.icon}</span>
                        {emotion.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Activities */}
              <Card>
                <CardContent className="pt-6">
                  <Label className="mb-3 block">Today's Activities</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {activities.map((activity) => (
                      <Button
                        key={activity}
                        type="button"
                        variant={selectedActivities.includes(activity) ? 'default' : 'outline'}
                        onClick={() => toggleActivity(activity)}
                        className="text-sm"
                      >
                        {activity}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Triggers */}
              <Card>
                <CardContent className="pt-6">
                  <Label htmlFor="triggers">Any triggers or challenges today?</Label>
                  <Textarea
                    id="triggers"
                    placeholder="What made you feel anxious, sad, or stressed?"
                    value={triggers}
                    onChange={(e) => setTriggers(e.target.value)}
                    rows={3}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              {/* Gratitude */}
              <Card>
                <CardContent className="pt-6">
                  <Label htmlFor="gratitude">What are you grateful for today?</Label>
                  <Textarea
                    id="gratitude"
                    placeholder="List 1-3 things you're thankful for..."
                    value={gratitude}
                    onChange={(e) => setGratitude(e.target.value)}
                    rows={2}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              {/* Additional Notes */}
              <Card>
                <CardContent className="pt-6">
                  <Label htmlFor="notes">Additional thoughts or notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Anything else you want to remember about today?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mt-2"
                  />
                </CardContent>
              </Card>
            </>
          )}
          <ModalFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-initial">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Mood Log'
              )}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
