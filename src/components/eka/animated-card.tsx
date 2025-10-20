import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function AnimatedCard({ 
  children, 
  className,
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className={className}
    >
      <Card>
        {children}
      </Card>
    </motion.div>
  );
}

export function GlowCard({ 
  children, 
  className,
  glowColor = 'primary' 
}: { 
  children: React.ReactNode; 
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
