import { Card } from '@/components/ui/card';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /**
   * When true, renders children directly without wrapping them in a Card.
   * Useful when the caller already provides a Card or custom surface.
   */
  asChild?: boolean;
}

export function AnimatedCard({ children, className, delay = 0, asChild = false }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className={className}
    >
      {asChild ? children : <Card>{children}</Card>}
    </motion.div>
  );
}

export function GlowCard({
  children,
  className,
  glowColor = 'primary'
}: {
  children: ReactNode;
  className?: string;
  glowColor?: 'primary' | 'green' | 'blue' | 'purple';
}) {
  const glowColors = {
    primary: 'hover:shadow-primary/20',
    green: 'hover:shadow-green-500/20',
    blue: 'hover:shadow-blue-500/20',
    purple: 'hover:shadow-purple-500/20',
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        glowColors[glowColor],
        className
      )}
    >
      {children}
    </Card>
  );
}
