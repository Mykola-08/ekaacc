'use client';

import { motion } from 'motion/react';
import { pageTransition } from '@/lib/motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return <motion.div {...pageTransition}>{children}</motion.div>;
}
