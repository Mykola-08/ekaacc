'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Activity, Clock, Plus, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface Note {
  id: string;
  date: string;
  type: 'soap' | 'general';
  summary: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
}

const MOCK_NOTES: Note[] = [
  {
    id: '1',
    date: '2023-10-24T14:30:00',
    type: 'soap',
    summary: 'Patient reports reduced anxiety. Session focused on breathing techniques.',
    subjective: 'Patient reports feeling "lighter" but still struggles with sleep.',
    objective: 'Affect is brighter. Eye contact improved.',
    assessment: 'Anxiety symptoms decreasing. Progress made on coping mechanisms.',
    plan: 'Continue CBT next week. Assigned breathing homework.',
  },
];

export function ClinicalNotes({ userId }: { userId: string }) {
  const [notes, setNotes] = useState(MOCK_NOTES);
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState<Partial<Note>>({ type: 'soap' });

  const handleSave = () => {
    const note: Note = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: 'soap',
      summary: newNote.subjective ? newNote.subjective.substring(0, 50) + '...' : 'New Note',
      ...newNote,
    } as Note;
    setNotes([note, ...notes]);
    setIsEditing(false);
    setNewNote({ type: 'soap' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Clinical Notes</h2>
          <p className="text-muted-foreground">
            Secure medical records for Patient #{userId.substring(0, 6)}
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          className="rounded-xl bg-card text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" />
          New SOAP Note
        </Button>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="rounded-xl border border-border bg-muted/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lock className="h-4 w-4 text-accent-foreground" />
                  New Secure Note
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Subjective
                    </label>
                    <Textarea
                      placeholder="Client's reported symptoms, history, statement..."
                      className="min-h-[100px] resize-none rounded-xl border-border bg-background"
                      onChange={(e) => setNewNote({ ...newNote, subjective: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Objective
                    </label>
                    <Textarea
                      placeholder="Vital signs, physical exam results, observations..."
                      className="min-h-[100px] resize-none rounded-xl border-border bg-background"
                      onChange={(e) => setNewNote({ ...newNote, objective: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Assessment
                    </label>
                    <Textarea
                      placeholder="Diagnosis, progress update..."
                      className="min-h-[100px] resize-none rounded-xl border-border bg-background"
                      onChange={(e) => setNewNote({ ...newNote, assessment: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Plan
                    </label>
                    <Textarea
                      placeholder="Next steps, prescriptions, homework..."
                      className="min-h-[100px] resize-none rounded-xl border-border bg-background"
                      onChange={(e) => setNewNote({ ...newNote, plan: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="rounded-lg bg-accent text-white hover:bg-accent/90"
                  >
                    Sign & Save Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {notes.map((note) => (
          <motion.div layout key={note.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="rounded-xl border-0 bg-background shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-accent/10 p-2.5 text-accent-foreground">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">Session Note</h4>
                        <Badge
                          variant="secondary"
                          className="h-5 bg-muted px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted/80"
                        >
                          SOAP
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {format(new Date(note.date), "PPP 'at' p")}
                      </div>
                    </div>
                  </div>
                  <Lock className="h-4 w-4 text-muted-foreground/40" />
                </div>

                <div className="grid grid-cols-1 gap-6 pl-[52px] md:grid-cols-2">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      S/O (Observations)
                    </span>
                    <p className="rounded-lg border border-border/50 bg-muted/50 p-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-medium text-foreground">S:</span> {note.subjective}
                      <br />
                      <span className="font-medium text-foreground">O:</span> {note.objective}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      A/P (Analysis)
                    </span>
                    <p className="rounded-lg border border-border/50 bg-muted/50 p-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-medium text-foreground">A:</span> {note.assessment}
                      <br />
                      <span className="font-medium text-foreground">P:</span> {note.plan}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
