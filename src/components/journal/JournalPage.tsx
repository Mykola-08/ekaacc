'use client';

import { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Book02Icon,
  Add01Icon,
  Calendar03Icon,
  SmileIcon,
  Sad01Icon,
  MehIcon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/components/ui/morphing-toaster';

interface JournalEntry {
  id: string;
  content: string;
  mood: number | null;
  tags: string[];
  created_at: string;
  metadata: Record<string, any>;
}

const MOODS = [
  { id: 'happy', score: 8, icon: SmileIcon, color: 'text-success', bg: 'bg-success/10' },
  { id: 'neutral', score: 5, icon: MehIcon, color: 'text-warning', bg: 'bg-warning/10' },
  { id: 'sad', score: 2, icon: Sad01Icon, color: 'text-destructive', bg: 'bg-destructive/10' },
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
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
    if (error) {
      toast.error('Could not save entry.');
      return;
    }
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
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="mb-6 flex items-center justify-end gap-2">
        <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 rounded-[calc(var(--radius)*0.8)] px-6 text-sm font-semibold transition-all">
              <HugeiconsIcon icon={Add01Icon} className="mr-2 size-5" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card rounded-[calc(var(--radius)*0.8)] border-0 p-8 sm:max-w-150">
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
                        ? `${m.bg} scale-110 ring-2 ring-black/5`
                        : 'hover:bg-card'
                    )}
                  >
                    <HugeiconsIcon
                      icon={m.icon}
                      className={cn(
                        'size-8',
                        m.color,
                        newEntry.mood !== m.id && 'opacity-40 grayscale'
                      )}
                    />
                  </button>
                ))}
              </div>
              <Input
                placeholder="Title (optional)"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                className="bg-secondary placeholder:text-muted-foreground text-foreground h-14 rounded-[var(--radius)] border-none px-6 py-4 text-lg font-semibold focus-visible:ring-0"
              />
              <Textarea
                placeholder="How are you feeling today?"
                value={newEntry.text}
                onChange={(e) => setNewEntry({ ...newEntry, text: e.target.value })}
                className="bg-secondary placeholder:text-muted-foreground text-foreground min-h-50 resize-none rounded-[var(--radius)] border-none p-6 text-base leading-relaxed focus-visible:ring-0"
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleSave}
                className="h-14 w-full rounded-[var(--radius)] text-lg font-semibold transition-transform active:scale-95"
              >
                Save Entry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-muted h-32 animate-pulse rounded-[calc(var(--radius)*0.8)]"
            />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="border-border bg-muted/30 flex flex-col items-center justify-center rounded-[calc(var(--radius)*0.8)] border-2 border-dashed py-20 text-center">
          <div className="bg-card mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <HugeiconsIcon icon={Book02Icon} className="text-muted-foreground/50 size-8" />
          </div>
          <h3 className="text-foreground text-lg font-semibold">No entries yet</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Start journaling to track your wellness.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 pb-20">
          {entries.map((entry) => {
            const m = getMoodById(entry.mood);
            const title = entry.metadata?.title || 'Journal Entry';
            return (
              <div
                key={entry.id}
                className="group bg-card hover:border-border rounded-[calc(var(--radius)*0.8)] border border-transparent p-8 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="mb-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                  <div className="flex items-center gap-5">
                    <div
                      className={cn(
                        'flex h-14 w-14 items-center justify-center rounded-[var(--radius)] transition-transform duration-500 group-hover:scale-110',
                        m.bg
                      )}
                    >
                      <HugeiconsIcon icon={m.icon} className={cn('size-7', m.color)} />
                    </div>
                    <div>
                      <h3 className="text-foreground mb-1 text-xl font-semibold tracking-tight">
                        {title}
                      </h3>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                        <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pl-0 md:pl-19">
                  <p className="text-muted-foreground text-base leading-relaxed font-medium">
                    {entry.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
