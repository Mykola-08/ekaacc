'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {  FileText, Activity, Clock, Plus, Lock } from 'lucide-react';
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
    plan: 'Continue CBT next week. Assigned breathing homework.'
  }
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
      ...newNote
    } as Note;
    setNotes([note, ...notes]);
    setIsEditing(false);
    setNewNote({ type: 'soap' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Clinical Notes</h2>
           <p className="text-zinc-500">Secure medical records for Patient #{userId.substring(0,6)}</p>
        </div>
        <Button onClick={() => setIsEditing(true)} className="bg-zinc-900 text-white shadow-lg hover:scale-105 transition-transform active:scale-95 rounded-xl">
           <Plus className="w-4 h-4 mr-2" />
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
              <Card className="border border-zinc-200 shadow-sm bg-zinc-50/50 rounded-xl">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                       <Lock className="w-4 h-4 text-indigo-500" />
                       New Secure Note
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Subjective</label>
                          <Textarea 
                            placeholder="Client's reported symptoms, history, statement..." 
                            className="bg-white border-zinc-200 rounded-xl resize-none min-h-[100px]"
                            onChange={e => setNewNote({...newNote, subjective: e.target.value})}
                          />
                       </div>
                       <div>
                          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Objective</label>
                          <Textarea 
                            placeholder="Vital signs, physical exam results, observations..." 
                            className="bg-white border-zinc-200 rounded-xl resize-none min-h-[100px]"
                            onChange={e => setNewNote({...newNote, objective: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Assessment</label>
                          <Textarea 
                            placeholder="Diagnosis, progress update..." 
                            className="bg-white border-zinc-200 rounded-xl resize-none min-h-[100px]"
                            onChange={e => setNewNote({...newNote, assessment: e.target.value})}
                          />
                       </div>
                       <div>
                          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Plan</label>
                          <Textarea 
                            placeholder="Next steps, prescriptions, homework..." 
                            className="bg-white border-zinc-200 rounded-xl resize-none min-h-[100px]"
                            onChange={e => setNewNote({...newNote, plan: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                       <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                       <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Sign & Save Note</Button>
                    </div>
                 </CardContent>
              </Card>
           </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
         {notes.map((note) => (
            <motion.div layout key={note.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow rounded-xl">
                  <CardContent className="p-6">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                              <FileText className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="flex items-center gap-2">
                                 <h4 className="font-semibold text-zinc-900">Session Note</h4>
                                 <Badge variant="secondary" className="bg-zinc-100 text-zinc-500 hover:bg-zinc-200 text-xs px-2 py-0.5 h-5">SOAP</Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                                 <Clock className="w-3.5 h-3.5" />
                                 {format(new Date(note.date), "PPP 'at' p")}
                              </div>
                           </div>
                        </div>
                        <Lock className="w-4 h-4 text-zinc-300" />
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-[52px]">
                        <div className="space-y-1">
                           <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">S/O (Observations)</span>
                           <p className="text-sm text-zinc-600 leading-relaxed bg-zinc-50/50 p-3 rounded-lg border border-zinc-100/50">
                              <span className="font-medium text-zinc-900">S:</span> {note.subjective}<br/>
                              <span className="font-medium text-zinc-900">O:</span> {note.objective}
                           </p>
                        </div>
                        <div className="space-y-1">
                           <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">A/P (Analysis)</span>
                           <p className="text-sm text-zinc-600 leading-relaxed bg-zinc-50/50 p-3 rounded-lg border border-zinc-100/50">
                              <span className="font-medium text-zinc-900">A:</span> {note.assessment}<br/>
                              <span className="font-medium text-zinc-900">P:</span> {note.plan}
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

