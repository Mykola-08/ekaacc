'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const quotes = [
    { text: "Healing is not linear.", author: "Mental Health Pro" },
    { text: "Small steps are still progress.", author: "Eka Compass" },
    { text: "You are allowed to take up space.", author: "Wellness Guide" },
    { text: "Progress over perfection.", author: "Daily Mind" },
    { text: "Be proud of how far you've come.", author: "Self Care Bot" },
    { text: "Your mental health is a priority.", author: "Eka Team" }
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
        <div className="p-6 rounded-[28px] bg-secondary/50 border border-border/40 min-h-[120px] flex flex-col justify-center relative overflow-hidden group">
            <Quote className="absolute -right-2 -top-2 w-16 h-16 text-primary opacity-[0.03] group-hover:scale-110 transition-transform duration-700" />
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="relative z-10"
                >
                    <p className="text-[17px] font-semibold text-foreground tracking-tight leading-snug italic">
                        "{quotes[index]?.text}"
                    </p>
                    <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mt-2 opacity-60">
                        — {quotes[index]?.author}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

