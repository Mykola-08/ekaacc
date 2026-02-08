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
    { score: 10, icon: Sun, label: 'Great', color: 'text-amber-500', bg: 'bg-amber-50/50', hover: 'hover:bg-amber-100/50' },
    { score: 7, icon: Smile, label: 'Good', color: 'text-emerald-500', bg: 'bg-emerald-50/50', hover: 'hover:bg-emerald-100/50' },
    { score: 5, icon: Meh, label: 'Okay', color: 'text-sky-500', bg: 'bg-sky-50/50', hover: 'hover:bg-sky-100/50' },
    { score: 3, icon: Cloud, label: 'Down', color: 'text-indigo-500', bg: 'bg-indigo-50/50', hover: 'hover:bg-indigo-100/50' },
    { score: 1, icon: Frown, label: 'Bad', color: 'text-rose-500', bg: 'bg-rose-50/50', hover: 'hover:bg-rose-100/50' },
];

export function MoodCheckIn() {
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [hoveredMood, setHoveredMood] = useState<number | null>(null);
    const supabase = createClient();

    const handleMoodSelect = async (score: number) => {
        setSelectedMood(score);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase.from('mood_tracking').insert({
                user_id: user.id,
                mood: score,
                energy: 5, // Default/Placeholder
                stress: 5,
                sleep_quality: 5
            });

            if (error) throw error;
            setSubmitted(true);
            toast.success("Thanks for sharing how you feel.");
        } catch (err) {
            console.error("Error saving mood:", err);
            toast.error("Couldn't save your entry.");
        }
    };

    return (
        <Card className="p-8 rounded-2xl border border-border bg-surface overflow-hidden relative group shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold tracking-tighter text-primary">Daily Check-in</h3>
                    <p className="text-sm text-muted font-medium">How are you feeling right now?</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                    <Heart className="w-5 h-5 text-accent" strokeWidth={2} />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!submitted ? (
                    <motion.div
                        key="selection"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex justify-between items-center gap-2"
                    >
                        {moods.map((mood) => (
                            <button
                                key={mood.score}
                                onMouseEnter={() => setHoveredMood(mood.score)}
                                onMouseLeave={() => setHoveredMood(null)}
                                onClick={() => handleMoodSelect(mood.score)}
                                className={cn(
                                    "flex flex-col items-center gap-2 flex-1 p-3 rounded-lg transition-all duration-200 active:scale-95",
                                    "hover:bg-surface-container",
                                    selectedMood === mood.score ? "bg-surface-container ring-1 ring-border" : "bg-transparent"
                                )}
                            >
                                <mood.icon className={cn("w-6 h-6", mood.color)} strokeWidth={2.5} />
                                <span className="text-xs font-bold uppercase tracking-wider text-muted">{mood.label}</span>
                            </button>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="thankyou"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-6 text-center space-y-3 bg-surface-container/50 rounded-xl"
                    >
                        <Heart className="w-8 h-8 text-accent fill-accent mx-auto" />
                        <div className="space-y-1 px-4">
                            <h4 className="text-base font-bold tracking-tight text-primary">Logged for today</h4>
                            <p className="text-sm text-muted opacity-80">
                                Thanks for sharing how you feel.
                            </p>
                        </div>
                        <Button
                            variant="link"
                            className="text-accent font-bold text-xs"
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

