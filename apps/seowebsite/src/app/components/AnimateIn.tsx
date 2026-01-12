'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimateInProps {
 children: ReactNode;
 delay?: number;
 duration?: number;
 className?: string;
 from?: 'bottom' | 'left' | 'right' | 'top';
 amount?: number; // Distance to move
}

export default function AnimateIn({ 
 children, 
 delay = 0, 
 duration = 0.6, 
 className = "",
 from = 'bottom',
 amount = 20
}: AnimateInProps) {
 
 const variants = {
  hidden: { 
   opacity: 0, 
   y: from === 'bottom' ? amount : from === 'top' ? -amount : 0,
   x: from === 'left' ? -amount : from === 'right' ? amount : 0,
  },
  visible: { 
   opacity: 1, 
   y: 0, 
   x: 0,
   transition: {
    duration: duration,
    delay: delay,
    ease: "easeOut" as const
   }
  }
 };

 return (
  <motion.div
   initial="hidden"
   whileInView="visible"
   viewport={{ once: true, margin: "-50px" }}
   variants={variants}
   className={className}
  >
   {children}
  </motion.div>
 );
}
