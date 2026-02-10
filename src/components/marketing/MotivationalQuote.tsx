'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote } from 'lucide-react';

const quotes = [
  { text: 'Healing is not linear.', author: 'Mental Health Pro' },
  { text: 'Small steps are still progress.', author: 'Eka Compass' },
  { text: 'You are allowed to take up space.', author: 'Wellness Guide' },
  { text: 'Progress over perfection.', author: 'Daily Mind' },
  { text: "Be proud of how far you've come.", author: 'Self Care Bot' },
  { text: 'Your mental health is a priority.', author: 'Eka Team' },
];

export const MotivationalQuote = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 10000); // Change every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-secondary/50 border-border/40 group relative flex min-h-[120px] flex-col justify-center overflow-hidden rounded-[20px] border p-6">
      <Quote className="text-primary absolute -top-2 -right-2 h-16 w-16 opacity-[0.03] transition-transform duration-700 group-hover:scale-110" />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10"
        >
          <p className="text-foreground text-[17px] leading-snug font-semibold tracking-tight italic">
            "{quotes[index]?.text}"
          </p>
          <p className="text-muted-foreground mt-2 text-[11px] font-black tracking-widest uppercase opacity-60">
            — {quotes[index]?.author}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
