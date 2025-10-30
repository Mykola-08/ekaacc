'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/store/app-store';
import { personalizationEngine } from '@/firebase/personalizationEngine';
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
import type { JournalEntry, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function JournalPage() {
  const { toast } = useToast();
  const { appUser: currentUser, user, refreshAppUser } = useAuth();
  const dataService = useAppStore((state) => state.dataService);

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [mood, setMood] = useState(3);
  const [painLevel, setPainLevel] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [notes, setNotes] = useState('');

  const fetchEntries = async () => {
    if (dataService && user?.uid) {
      setIsLoading(true);
      const userEntries = await dataService.getJournalEntries(user.uid);
      setEntries(userEntries || []);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataService, user]);

  const updateUser = async (data: Partial<User>) => {
    if (dataService && currentUser?.id) {
      await dataService.updateUser(currentUser.id, data);
      await refreshAppUser();
    }
  };

  const handleSaveEntry = async () => {
    if (!dataService || !currentUser) return;

    const newEntry: Omit<JournalEntry, 'id'> = {
      date: selectedDate.toISOString(),
      mood,
      painLevel,
      energyLevel,
      notes,
      tags: [],
      userId: currentUser.id,
    };

    const savedEntry = await dataService.addJournalEntry(newEntry);

    if (savedEntry) {
      setEntries([savedEntry, ...entries]);
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
        const updated = personalizationEngine.trackActivity(currentUser, {
          type: 'feature-use',
          data: {
            feature: 'journal',
            action: 'create-entry',
            timestamp: new Date().toISOString(),
          }
        });
        // Persist to context/back-end (merge with existing activityData)
        updateUser({ activityData: { ...(currentUser.activityData || {}), ...updated } });
      } catch (e) {
        console.error('Failed to track journal activity', e);
      }
    } else {
      toast({
        title: 'Error',
        description: 'Could not save your journal entry. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const entriesForSelectedDate = entries.filter(
    (entry) => format(new Date(entry.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const getMoodIcon = (mood: number) => {
    if (mood >= 4) return <Smile className="h-5 w-5 text-green-500" />;
    if (mood === 3) return <Meh className="h-5 w-5 text-yellow-500" />;
    return <Frown className="h-5 w-5 text-red-500" />;
  };

  const getMoodLabel = (moodValue: number) => {
    if (moodValue >= 4) return 'Good';
    if (moodValue === 3) return 'Okay';
    return 'Not Great';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-[250px]" />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="w-full h-[150px]" />
          <Skeleton className="w-full h-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Calendar */}
      <div className="md:col-span-1">
        <Card>
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
                hasEntry: (date) => entries.some((entry) => entry.date.toDateString() === date.toDateString()),
              }}
              modifiersClassNames={{
                hasEntry: 'bg-primary/20 font-bold',
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Entries for selected date */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Journal Entries for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
                <CardDescription>
                  {entriesForSelectedDate.length > 0
                    ? `${entriesForSelectedDate.length} entries found.`
                    : 'No entries for this day.'}
                </CardDescription>
              </div>
              <Button onClick={() => setShowNewEntry(!showNewEntry)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {showNewEntry && (
              <Card className="bg-gray-50 dark:bg-gray-900/50">
                <CardHeader>
                  <CardTitle>New Entry</CardTitle>
                  <CardDescription>How are you feeling today?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Mood: {mood}</Label>
                    <div className="flex items-center gap-4">
                      <Frown />
                      <Slider
                        value={[mood]}
                        onValueChange={(value) => setMood(value[0])}
                        min={1}
                        max={5}
                        step={1}
                      />
                      <Smile />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Pain Level: {painLevel}</Label>
                    <Slider
                      value={[painLevel]}
                      onValueChange={(value) => setPainLevel(value[0])}
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Energy Level: {energyLevel}</Label>
                    <Slider
                      value={[energyLevel]}
                      onValueChange={(value) => setEnergyLevel(value[0])}
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write about your day, symptoms, or feelings..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setShowNewEntry(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEntry}>Save Entry</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {entriesForSelectedDate.length > 0 ? (
              entriesForSelectedDate.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getMoodIcon(entry.mood)}
                          <span>Mood: {entry.mood}/5</span>
                        </CardTitle>
                        <CardDescription>
                          Pain: {entry.painLevel}/10 | Energy: {entry.energyLevel}/10
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{entry.notes}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              !showNewEntry && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    No journal entries
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Get started by creating a new entry for today.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setShowNewEntry(true)}>
                      <Plus className="mr-2 h-4 w-4" /> New Entry
                    </Button>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
