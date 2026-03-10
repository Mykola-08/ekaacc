'use client';

import React, { MouseEvent } from 'react';
import Link from 'next/link';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

export function BentoCard({ 
  href, 
  className = "", 
  children, 
  delay = 0 
}: { 
  href: string, 
  className?: string, 
  children: React.ReactNode, 
  delay?: number
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative h-full w-full ${className}`}
    >
      <motion.div 
        className="w-full h-full"
      >
        <Link 
          href={href} 
          onMouseMove={handleMouseMove}
          className="relative block w-full h-full rounded-3xl overflow-hidden group outline-none isolate  border border-secondary/50 bg-[#fbfbfd]  transition-shadow duration-500"
        >
          {/* Spotlight overlay */}
          <motion.div
            className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-[60] mix-blend-overlay"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  600px circle at ${mouseX}px ${mouseY}px,
                  rgba(255,255,255,0.4),
                  transparent 40%
                )
              `,
            }}
          />
          {children}
        </Link>
      </motion.div>
    </motion.div>
  );
}
