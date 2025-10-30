'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/context/unified-data-context';
import { PersonalizationEngine } from '@/lib/personalization-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, Smile, Meh, Frown } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

type JournalEntry = {
  id: string;
  date: Date;
  mood: number; // 1-5
  painLevel: number; // 1-10
  energyLevel: number; // 1-10
  notes: string;
  tags: string[];
};

export default function JournalPage() {
  const { toast } = useToast();
  const { currentUser, updateUser } = useData();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [mood, setMood] = useState(3);
  const [painLevel, setPainLevel] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [notes, setNotes] = useState('');

  // Mock data - replace with Firebase
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: new Date(2025, 9, 19),
      mood: 4,
      painLevel: 4,
      energyLevel: 7,
      notes: 'Had a great session today. Feeling much more flexible after the stretching exercises.',
      tags: ['therapy', 'positive'],
    },
    {
      id: '2',
      date: new Date(2025, 9, 18),
      mood: 3,
      painLevel: 6,
      energyLevel: 5,
      notes: 'Some pain in lower back, but manageable. Did my morning exercises.',
      tags: ['pain', 'exercises'],
    },
  ]);

  const handleSaveEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      mood,
      painLevel,
      energyLevel,
      notes,
      tags: [],
    };

    setEntries([newEntry, ...entries]);
    setShowNewEntry(false);
    setNotes('');
    setMood(3);
    setPainLevel(5);
    setEnergyLevel(5);

    toast({
      title: 'Entry saved',
      description: 'Your wellness journal entry has been saved.',
    });

    // Track activity for personalization
    try {
      if (currentUser) {
        const updated = PersonalizationEngine.trackActivity(currentUser, {
          type: 'feature-use',
          data: {
            feature: 'journal',
            action: 'create-entry',
            timestamp: new Date().toISOString(),
          }
        });
        // Persist to context/back-end (merge with existing activityData)
        updateUser({ activityData: { ...(currentUser.activityData || {}), ...updated } });
      }
    } catch (e) {
      console.error('Failed to track journal activity', e);
    }
  };

  useEffect(() => {
    // Track page visit
    if (currentUser) {
      try {
        const updated = PersonalizationEngine.trackActivity(currentUser, {
          type: 'page-visit',
          data: {
            page: '/journal',
            timestamp: new Date().toISOString(),
          }
        });
        updateUser({ activityData: { ...(currentUser.activityData || {}), ...updated } });
      } catch (e) {
        console.error('Failed to track page visit', e);
      }
    }
  }, [currentUser, updateUser]);

  const getMoodIcon = (moodValue: number) => {
    if (moodValue >= 4) return <Smile className="h-5 w-5 text-green-500" />;
    if (moodValue === 3) return <Meh className="h-5 w-5 text-yellow-500" />;
    return <Frown className="h-5 w-5 text-red-500" />;
  };

  const getMoodLabel = (moodValue: number) => {
    if (moodValue >= 4) return 'Good';
    if (moodValue === 3) return 'Okay';
    return 'Not Great';
  };

  const getEntriesForDate = (date: Date) => {
    return entries.filter(
      (entry) =>
        entry.date.toDateString() === date.toDateString()
    );
  };

  const dateHasEntry = (date: Date) => {
    return entries.some(
      (entry) => entry.date.toDateString() === date.toDateString()
    );
  };

  const selectedDateEntries = getEntriesForDate(selectedDate);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Wellness Journal</h1>
        <p className="text-muted-foreground">
          Track your daily wellness, mood, and symptoms
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view or add entries</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                hasEntry: (date) => dateHasEntry(date),
              }}
              modifiersClassNames={{
                hasEntry: 'bg-primary/20 font-bold',
              }}
            />
          </CardContent>
        </Card>

        {/* Entries for selected date */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </CardTitle>
                  <CardDescription>
                    {selectedDateEntries.length} {selectedDateEntries.length === 1 ? 'entry' : 'entries'}
                  </CardDescription>
                </div>
                {!showNewEntry && (
                  <Button onClick={() => setShowNewEntry(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Entry
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* New Entry Form */}
              {showNewEntry && (
                <div className="p-4 border rounded-lg space-y-4 bg-muted/50">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    New Journal Entry
                  </h3>

                  <div className="space-y-2">
                    <Label>How are you feeling today?</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[mood]}
                        onValueChange={(value) => setMood(value[0])}
                        min={1}
                        max={5}
                        step={1}
                        className="flex-1"
                      />
                      <div className="w-20 flex items-center gap-2">
                        {getMoodIcon(mood)}
                        <span className="text-sm">{getMoodLabel(mood)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Pain Level (1-10)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[painLevel]}
                        onValueChange={(value) => setPainLevel(value[0])}
                        min={1}
                        max={10}
                        step={1}
                        className="flex-1"
                      />
                      <div className="w-12 text-center font-medium">
                        {painLevel}/10
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Energy Level (1-10)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[energyLevel]}
                        onValueChange={(value) => setEnergyLevel(value[0])}
                        min={1}
                        max={10}
                        step={1}
                        className="flex-1"
                      />
                      <div className="w-12 text-center font-medium">
                        {energyLevel}/10
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="How are you feeling? Any symptoms or progress to note?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveEntry}>Save Entry</Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowNewEntry(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Existing Entries */}
              {selectedDateEntries.map((entry) => (
                <div key={entry.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getMoodIcon(entry.mood)}
                      <span className="font-medium">{getMoodLabel(entry.mood)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">Pain: {entry.painLevel}/10</Badge>
                      <Badge variant="outline">Energy: {entry.energyLevel}/10</Badge>
                    </div>
                  </div>
                  <p className="text-sm">{entry.notes}</p>
                  {entry.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {selectedDateEntries.length === 0 && !showNewEntry && (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No entries for this date</p>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewEntry(true)}
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
