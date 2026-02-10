'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Meh, Frown, Sun, Cloud, CloudRain, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const moods = [
  {
    score: 10,
    icon: Sun,
    label: 'Great',
    color: 'text-amber-500',
    bg: 'bg-amber-50/50',
    hover: 'hover:bg-amber-100/50',
  },
  {
    score: 7,
    icon: Smile,
    label: 'Good',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50/50',
    hover: 'hover:bg-emerald-100/50',
  },
  {
    score: 5,
    icon: Meh,
    label: 'Okay',
    color: 'text-sky-500',
    bg: 'bg-sky-50/50',
    hover: 'hover:bg-sky-100/50',
  },
  {
    score: 3,
    icon: Cloud,
    label: 'Down',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50/50',
    hover: 'hover:bg-indigo-100/50',
  },
  {
    score: 1,
    icon: Frown,
    label: 'Bad',
    color: 'text-rose-500',
    bg: 'bg-rose-50/50',
    hover: 'hover:bg-rose-100/50',
  },
];

export function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredMood, setHoveredMood] = useState<number | null>(null);
  const supabase = createClient();

  const handleMoodSelect = async (score: number) => {
    setSelectedMood(score);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('wellness_entries').insert({
        user_id: user.id,
        mood: score,
        energy: 'moderate',
        stress: 'mild',
      });

      if (error) throw error;
      setSubmitted(true);
      toast.success('Thanks for sharing how you feel.');
    } catch (err) {
      console.error('Error saving mood:', err);
      toast.error("Couldn't save your entry.");
    }
  };

  return (
    <Card className="border-border bg-card group relative overflow-hidden rounded-[20px] border p-8 shadow-sm transition-all hover:shadow-md">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-primary text-xl font-bold tracking-tighter">Daily Check-in</h3>
          <p className="text-muted-foreground text-sm font-medium">How are you feeling right now?</p>
        </div>
        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
          <Heart className="text-primary h-5 w-5" strokeWidth={2} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-between gap-2"
          >
            {moods.map((mood) => (
              <button
                key={mood.score}
                onMouseEnter={() => setHoveredMood(mood.score)}
                onMouseLeave={() => setHoveredMood(null)}
                onClick={() => handleMoodSelect(mood.score)}
                className={cn(
                  'flex flex-1 flex-col items-center gap-2 rounded-lg p-3 transition-all duration-200 active:scale-95',
                  'hover:bg-surface-container',
                  selectedMood === mood.score
                    ? 'bg-surface-container ring-border ring-1'
                    : 'bg-transparent'
                )}
              >
                <mood.icon className={cn('h-6 w-6', mood.color)} strokeWidth={2.5} />
                <span className="text-muted text-xs font-bold tracking-wider uppercase">
                  {mood.label}
                </span>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="thankyou"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container/50 space-y-3 rounded-xl py-6 text-center"
          >
            <Heart className="text-accent fill-accent mx-auto h-8 w-8" />
            <div className="space-y-1 px-4">
              <h4 className="text-primary text-base font-bold tracking-tight">Logged for today</h4>
              <p className="text-muted text-sm opacity-80">Thanks for sharing how you feel.</p>
            </div>
            <Button
              variant="link"
              className="text-accent text-xs font-bold"
              onClick={() => setSubmitted(false)}
            >
              Update
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
