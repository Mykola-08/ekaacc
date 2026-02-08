'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
    targetDate: string | Date;
    onEnd?: () => void;
}

export const CountdownTimer = ({ targetDate, onEnd }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();
            let timeLeft = null;

            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            } else if (onEnd) {
                onEnd();
            }

            return timeLeft;
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, [targetDate, onEnd]);

    if (!timeLeft) return null;

    const TimeBlock = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col items-center">
            <motion.span 
                key={value}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-lg font-bold tracking-tighter tabular-nums text-primary"
            >
                {value.toString().padStart(2, '0')}
            </motion.span>
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">
                {label}
            </span>
        </div>
    );

    return (
        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/60 shadow-sm">
            {timeLeft.days > 0 && <TimeBlock value={timeLeft.days} label="days" />}
            {timeLeft.days > 0 && <span className="text-muted-foreground/30 font-bold mb-3">:</span>}
            <TimeBlock value={timeLeft.hours} label="hours" />
            <span className="text-muted-foreground/30 font-bold mb-3">:</span>
            <TimeBlock value={timeLeft.minutes} label="mins" />
            <span className="text-muted-foreground/30 font-bold mb-3">:</span>
            <TimeBlock value={timeLeft.seconds} label="secs" />
        </div>
    );
};

