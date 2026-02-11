'use client';

import React from 'react';
import { motion } from 'motion/react';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  showValue?: boolean;
}

export const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 12,
  color = 'var(--primary)',
  backgroundColor = 'var(--secondary)',
  label,
  showValue = true,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-2" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Ring */}
        <svg width={size} height={size} className="-rotate-90 transform">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            className="transition-all duration-300"
          />
          {/* Progress Ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            strokeLinecap="round"
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-foreground text-2xl font-semibold tracking-tighter tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
      {label && (
        <span className="text-muted-foreground text-center text-xs font-black tracking-[0.15em] uppercase">
          {label}
        </span>
      )}
    </div>
  );
};
