'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Calendar, Smile, Frown, Meh } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  content: string;
  mood: number | null;
  tags: string[];
  created_at: string;
  metadata: Record<string, any>;
}

const MOODS = [
  { id: 'happy', score: 8, icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'neutral', score: 5, icon: Meh, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'sad', score: 2, icon: Frown, color: 'text-indigo-500', bg: 'bg-indigo-50' },
];

export function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', text: '', mood: 'neutral' });
  const supabase = createClient();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setEntries(data);
    if (error) console.error('Error fetching journal entries:', error);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!newEntry.text) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const moodObj = MOODS.find((m) => m.id === newEntry.mood);
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        content: newEntry.text,
        mood: moodObj?.score || 5,
        tags: [],
        metadata: { title: newEntry.title || 'Daily Check-in' },
      })
      .select()
      .single();
    if (error) { toast.error('Could not save entry.'); return; }
    if (data) setEntries([data, ...entries]);
    setNewEntry({ title: '', text: '', mood: 'neutral' });
    setIsNewEntryOpen(false);
    toast.success('Journal entry saved.');
  };

  const getMoodById = (score: number | null) => {
    if (score === null) return MOODS[1]!;
    if (score >= 7) return MOODS[0]!;
    if (score >= 4) return MOODS[1]!;
    return MOODS[2]!;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 md:px-8">
      <DashboardHeader title="Reflections" subtitle="Your private wellness journal.">
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

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-[20px] bg-muted" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-muted/30 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-sm">
            <BookOpen className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No entries yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Start journaling to track your wellness.</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-6 pb-20">
          {entries.map((entry) => {
            const m = getMoodById(entry.mood);
            const title = entry.metadata?.title || 'Journal Entry';
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={entry.id}
                className="group rounded-[20px] border border-transparent bg-card p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-border hover:shadow-md"
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
                      <h3 className="mb-1 text-xl font-bold tracking-tight text-foreground">
                        {title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" strokeWidth={2.5} />
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pl-0 md:pl-[76px]">
                  <p className="text-[16px] font-medium leading-relaxed text-muted-foreground">
                    {entry.content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
