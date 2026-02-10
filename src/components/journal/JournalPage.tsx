'use client';

import { useState } from 'react';
import { BookOpen, Plus, Calendar, Smile, Frown, Meh, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '../dashboard/layout/DashboardLayout';
import { DashboardHeader } from '../dashboard/layout/DashboardHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

// Mock entries
const MOCK_ENTRIES = [
  {
    id: 1,
    title: 'Post-Session Reflection',
    date: '2023-10-24',
    mood: 'happy',
    text: 'Felt really open today after the deep tissue work. Should drink more water.',
  },
  {
    id: 2,
    title: 'Weekly Check-in',
    date: '2023-10-20',
    mood: 'neutral',
    text: 'Back pain is subsiding, but shoulder is still tight.',
  },
];

const MOODS = [
  { id: 'happy', icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'neutral', icon: Meh, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'sad', icon: Frown, color: 'text-indigo-500', bg: 'bg-indigo-50' },
];

export function JournalPage() {
  const [entries, setEntries] = useState(MOCK_ENTRIES);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', text: '', mood: 'neutral' });

  const handleSave = () => {
    if (!newEntry.text) return;
    const entry = {
      id: Date.now(),
      title: newEntry.title || 'Daily Check-in',
      date: new Date().toISOString().split('T')[0] || new Date().toISOString(),
      mood: newEntry.mood,
      text: newEntry.text,
    };
    setEntries([entry, ...entries]);
    setNewEntry({ title: '', text: '', mood: 'neutral' });
    setIsNewEntryOpen(false);
  };

  return (
    <DashboardLayout profile={{ first_name: 'Client' }}>
      <div className="mx-auto max-w-4xl space-y-8">
        <DashboardHeader title="Reflections" subtitle="Your private wellness journal. AI-secured.">
          <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 rounded-lg px-6 text-[15px] font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
                <Plus className="mr-2 h-5 w-5" strokeWidth={2.5} />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card rounded-[20px] border-0 p-8 shadow-eka-xl sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle className="text-foreground text-2xl font-black tracking-tight">
                  New Reflection
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="flex justify-center gap-3 pb-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setNewEntry({ ...newEntry, mood: m.id })}
                      className={cn(
                        'rounded-full p-4 transition-all duration-300',
                        newEntry.mood === m.id
                          ? `${m.bg} scale-110 shadow-inner ring-2 ring-black/5`
                          : 'hover:bg-card'
                      )}
                    >
                      <m.icon
                        className={cn(
                          'h-8 w-8',
                          m.color,
                          newEntry.mood !== m.id && 'opacity-40 grayscale'
                        )}
                        strokeWidth={2.5}
                      />
                    </button>
                  ))}
                </div>
                <Input
                  placeholder="Title (optional)"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  className="bg-secondary placeholder:text-muted-foreground text-foreground h-14 rounded-xl border-none px-6 py-4 text-lg font-bold focus-visible:ring-0"
                />
                <Textarea
                  placeholder="How are you feeling today?"
                  value={newEntry.text}
                  onChange={(e) => setNewEntry({ ...newEntry, text: e.target.value })}
                  className="bg-secondary placeholder:text-muted-foreground text-foreground min-h-[200px] resize-none rounded-xl border-none p-6 text-base leading-relaxed focus-visible:ring-0"
                />
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSave}
                  className="h-14 w-full rounded-xl text-lg font-bold shadow-xl transition-transform active:scale-95"
                >
                  Save Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DashboardHeader>

        <motion.div layout className="grid grid-cols-1 gap-6 pb-20">
          {entries.map((entry) => {
            const m = MOODS.find((mood) => mood.id === entry.mood) || MOODS[1]!;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={entry.id}
                className="bg-card group hover:border-border rounded-[20px] border border-transparent p-8 shadow-eka-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="mb-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                  <div className="flex items-center gap-5">
                    <div
                      className={cn(
                        'flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-110',
                        m.bg
                      )}
                    >
                      <m.icon className={cn('h-7 w-7', m.color)} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-foreground mb-1 text-xl font-bold tracking-tight">
                        {entry.title}
                      </h3>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                        <Calendar className="h-3.5 w-3.5" strokeWidth={2.5} />
                        {entry.date}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary bg-primary/5 hover:bg-primary/10 hidden h-9 rounded-full px-4 text-xs font-bold transition-all group-hover:flex"
                  >
                    <Sparkles className="mr-2 h-3.5 w-3.5" strokeWidth={2.5} />
                    AI Analyze
                  </Button>
                </div>
                <div className="pl-0 md:pl-[76px]">
                  <p className="text-muted-foreground text-[16px] leading-relaxed font-medium">
                    {entry.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
