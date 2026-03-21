'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
const RichTextEditor = dynamic(
  () => import('@/components/platform/editor/rich-text-editor').then((m) => m.RichTextEditor),
  {
    ssr: false,
    loading: () => <div className="bg-muted h-75 w-full animate-pulse rounded-[calc(var(--radius)*0.8)]" />,
  }
);
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InlineFeedback } from '@/components/ui/inline-feedback';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';

import { PageSection } from '@/components/ui/page-section';
import { Descendant } from 'slate';
import {
  saveSessionNote,
  updateSessionNote,
  deleteSessionNote,
  getSessionNotes,
  getTherapistClients,
} from '@/server/therapist/session-notes-actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon, Calendar02Icon, Clock01Icon, SmileIcon, Target01Icon, WorkHistoryIcon, Add01Icon, Delete01Icon, SparklesIcon, UserCircleIcon, CheckListIcon } from '@hugeicons/core-free-icons';


function serializeSlate(nodes: Descendant[] | undefined): string {
  if (!nodes) return '';
  return nodes
    .map((n: any) => (n.children ? n.children.map((c: any) => c.text).join('') : ''))
    .join('\n');
}

function deserializeSlate(text: string | null | undefined): Descendant[] | undefined {
  if (!text?.trim()) return undefined;
  return text.split('\n').map((line) => ({
    type: 'paragraph',
    children: [{ text: line }],
  })) as Descendant[];
}

export default function SessionNotesPage() {
  const { feedback, setLoading, setSuccess, setError, reset } = useMorphingFeedback();

  // Form state
  const [clientId, setClientId] = useState<string>('');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionDuration, setSessionDuration] = useState('60');
  const [moodRating, setMoodRating] = useState('');
  const [sessionType, setSessionType] = useState('');

  const [notes, setNotes] = useState<Descendant[]>();
  const [goals, setGoals] = useState<Descendant[]>();
  const [homework, setHomework] = useState<Descendant[]>();
  const [observations, setObservations] = useState<Descendant[]>();

  // Past notes & clients
  const [pastNotes, setPastNotes] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Load clients and past notes on mount
  useEffect(() => {
    async function load() {
      const [notesRes, clientList] = await Promise.all([
        getSessionNotes(20),
        getTherapistClients(),
      ]);
      if (notesRes.data) setPastNotes(notesRes.data);
      if (clientList) setClients(clientList);
    }
    load();
  }, []);

  const handleNewNote = () => {
    setEditingNoteId(null);
    setClientId('');
    setSessionDate(new Date().toISOString().split('T')[0]);
    setSessionDuration('60');
    setMoodRating('');
    setSessionType('');
    setNotes(undefined);
    setGoals(undefined);
    setHomework(undefined);
    setObservations(undefined);
    reset();
  };

  const handleSave = useCallback(async () => {
    if (!sessionDate) {
      setError('Please select a session date');
      return;
    }

    setLoading('Saving session note...');

    const noteData = {
      clientId: clientId || null,
      sessionDate,
      durationMinutes: parseInt(sessionDuration),
      sessionType: sessionType || null,
      initialMood: moodRating ? parseInt(moodRating) : null,
      subjective: serializeSlate(notes),
      objective: serializeSlate(observations),
      assessment: serializeSlate(goals),
      plan: serializeSlate(homework),
      isDraft: false,
    };

    const result = editingNoteId
      ? await updateSessionNote(editingNoteId, noteData)
      : await saveSessionNote(noteData);

    if (result.success) {
      setSuccess(editingNoteId ? 'Note updated' : 'Note saved');
      if (!editingNoteId && 'noteId' in result) {
        setEditingNoteId(result.noteId as string);
      }
      // Refresh notes list
      const notesRes = await getSessionNotes(20);
      if (notesRes.data) setPastNotes(notesRes.data);
    } else {
      setError(result.error || 'Failed to save');
    }
  }, [
    sessionDate,
    clientId,
    sessionDuration,
    sessionType,
    moodRating,
    notes,
    observations,
    goals,
    homework,
    editingNoteId,
    setLoading,
    setSuccess,
    setError,
  ]);

  const handleDelete = useCallback(
    async (noteId: string) => {
      setLoading('Deleting...');
      const result = await deleteSessionNote(noteId);
      if (result.success) {
        setSuccess('Note deleted');
        setPastNotes((prev) => prev.filter((n) => n.id !== noteId));
        if (editingNoteId === noteId) handleNewNote();
      } else {
        setError(result.error || 'Failed to delete');
      }
    },
    [editingNoteId, setLoading, setSuccess, setError]
  );

  const handleLoadNote = (note: any) => {
    setEditingNoteId(note.id);
    setClientId(note.client_id || '');
    setSessionDate(note.session_date);
    setSessionDuration(String(note.duration_minutes || 60));
    setMoodRating(note.initial_mood ? String(note.initial_mood) : '');
    setSessionType(note.session_type || '');
    setNotes(deserializeSlate(note.subjective));
    setObservations(deserializeSlate(note.objective));
    setGoals(deserializeSlate(note.assessment));
    setHomework(deserializeSlate(note.plan));
    setShowHistory(false);
  };

  // Keyboard shortcut for save (Ctrl/Cmd + S)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
      <PageSection
        title="Session Notes"
        description="Document your therapy session with comprehensive notes"
        icon={File01Icon}
        actions={
          <div className="flex items-center gap-3">
            <InlineFeedback status={feedback.status} message={feedback.message} onDismiss={reset} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="gap-2"
            >
              <HugeiconsIcon icon={WorkHistoryIcon} className="size-4"  />
              History ({pastNotes.length})
            </Button>
            <Button variant="outline" size="sm" onClick={handleNewNote} className="gap-2">
              <HugeiconsIcon icon={Add01Icon} className="size-4"  />
              New Note
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              className="gap-2"
              disabled={feedback.status === 'loading'}
            >
              <HugeiconsIcon icon={File01Icon} className="size-4"  />
              {editingNoteId ? 'Update Note' : 'Save Note'}
            </Button>
          </div>
        }
      />

      {/* Past Notes History Drawer */}
      {showHistory && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Session Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {pastNotes.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                No session notes yet. Create your first one above.
              </p>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {pastNotes.map((note) => (
                  <div
                    key={note.id}
                    className={cn(
                      'hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-[calc(var(--radius)*0.8)] border p-3 transition-colors',
                      editingNoteId === note.id && 'border-primary bg-muted'
                    )}
                    onClick={() => handleLoadNote(note)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {note.client?.full_name?.[0] || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">
                          {note.client?.full_name || 'Unknown client'}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {new Date(note.session_date).toLocaleDateString()} &middot;{' '}
                          {note.duration_minutes}min
                          {note.is_draft && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Draft
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note.id);
                      }}
                    >
                      <HugeiconsIcon icon={Delete01Icon} className="size-4"  />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      </div>

      {/* Session Info Card */}
      <Card className="mx-4 lg:mx-6">
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
          <CardDescription>Basic details about this therapy session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="">
              <Label htmlFor="client" className="flex items-center gap-2">
                <HugeiconsIcon icon={UserCircleIcon} className="size-4" />
                Client
              </Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="">
              <Label htmlFor="date" className="flex items-center gap-2">
                <HugeiconsIcon icon={Calendar02Icon} className="size-4"  />
                Session Date
              </Label>
              <Input
                id="date"
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
              />
            </div>

            <div className="">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <HugeiconsIcon icon={Clock01Icon} className="size-4"  />
                Duration (min)
              </Label>
              <Select value={sessionDuration} onValueChange={setSessionDuration}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="">
              <Label htmlFor="type" className="flex items-center gap-2">
                <HugeiconsIcon icon={File01Icon} className="size-4"  />
                Session Type
              </Label>
              <Select value={sessionType} onValueChange={setSessionType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initial">Initial Consultation</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="cbt">CBT Session</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="mood" className="flex items-center gap-2">
              <HugeiconsIcon icon={SmileIcon} className="size-4"  />
              Client Mood Rating (1-10)
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <Button
                  key={num}
                  variant={moodRating === num.toString() ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMoodRating(num.toString())}
                  className="w-10"
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Tabs */}
      <div>
      <Tabs defaultValue="notes" className="">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notes" className="gap-2">
            <HugeiconsIcon icon={File01Icon} className="size-4"  />
            Session Notes
          </TabsTrigger>
          <TabsTrigger value="observations" className="gap-2">
            <HugeiconsIcon icon={UserCircleIcon} className="size-4" />
            Observations
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-2">
            <HugeiconsIcon icon={Target01Icon} className="size-4"  />
            Goals
          </TabsTrigger>
          <TabsTrigger value="homework" className="gap-2">
            <HugeiconsIcon icon={CheckListIcon} className="size-4" />
            Homework
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between pb-4">
              <div>
                <CardTitle>Session Notes</CardTitle>
                <CardDescription>
                  Document what happened during the session, client&apos;s concerns, and discussion
                  points
                </CardDescription>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  setNotes([
                    {
                      type: 'paragraph',
                      children: [
                        {
                          text: 'Subjective: Client reports feeling anxious this week, rating mood at 4/10. Sleep is disrupted...',
                          bold: true,
                        },
                      ],
                    },
                    {
                      type: 'paragraph',
                      children: [
                        {
                          text: 'Objective: Client appeared restless, tapping foot during session. Engaged in breathing exercises.',
                          bold: true,
                        },
                      ],
                    },
                    {
                      type: 'paragraph',
                      children: [
                        {
                          text: 'Assessment: Elevated anxiety symptoms related to work stress.',
                          bold: true,
                        },
                      ],
                    },
                    {
                      type: 'paragraph',
                      children: [
                        {
                          text: 'Plan: Continue CBT techniques. Practice 4-7-8 breathing nightly. Reassess next week.',
                          bold: true,
                        },
                      ],
                    },
                  ] as any);
                }}
              >
                <HugeiconsIcon icon={SparklesIcon} className="mr-2 size-4"  />
                Auto-Draft from Scratchpad
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <RichTextEditor
                onChange={setNotes}
                placeholder="What was discussed during this session? Document key points, concerns raised, and therapeutic interventions used..."
                showAIAssist
                className="border-0"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="observations" className="">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Observations</CardTitle>
              <CardDescription>
                Note your professional observations about the client&apos;s mental state, behavior,
                and progress
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RichTextEditor
                onChange={setObservations}
                placeholder="Observations about client's affect, body language, engagement level, changes since last session..."
                showAIAssist
                className="border-0"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Goals & Progress</CardTitle>
              <CardDescription>
                Track therapeutic goals, milestones achieved, and areas for continued focus
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RichTextEditor
                onChange={setGoals}
                placeholder="Short-term and long-term goals, progress towards existing goals, new goals established..."
                showAIAssist
                className="border-0"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homework" className="">
          <Card>
            <CardHeader>
              <CardTitle>Homework & Action Items</CardTitle>
              <CardDescription>
                Assign homework, exercises, and action items for the client to work on before the
                next session
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RichTextEditor
                onChange={setHomework}
                placeholder="Exercises to practice, journal prompts, behavioral experiments, readings, worksheets..."
                showAIAssist
                className="border-0"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>

      {/* Quick Tips */}
      <Card className="mx-4 lg:mx-6 bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 text-sm @xl/main:grid-cols-3">
            <div>
              <h4 className="mb-2 font-semibold">Note-Taking Tips</h4>
              <ul className="text-muted-foreground">
                <li>Be concise but thorough</li>
                <li>Use objective language</li>
                <li>Focus on relevant details</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">Privacy & Security</h4>
              <ul className="text-muted-foreground">
                <li>Notes stored with row-level security</li>
                <li>Only you can access your notes</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">Keyboard Shortcuts</h4>
              <ul className="text-muted-foreground">
                <li>Ctrl/Cmd + B: Bold</li>
                <li>Ctrl/Cmd + I: Italic</li>
                <li>Ctrl/Cmd + S: Save</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
