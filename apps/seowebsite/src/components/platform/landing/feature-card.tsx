'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Skeleton } from '@/components/platform/ui/skeleton';
import { LucideIcon, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/platform/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isLoading?: boolean;
  delay?: number;
  className?: string;
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  isLoading = false, 
  delay = 0,
  className 
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: delay * 0.1 }}
        className={cn("h-full", className)}
      >
        <Card className="border-muted h-full">
          <CardHeader>
            <Skeleton className="w-12 h-12 rounded-lg mb-4" />
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn("h-full", className)}
    >
      <Card className={cn(
        "border-muted hover:border-primary/30 transition-all duration-300 h-full group cursor-pointer",
        "hover:shadow-lg hover:shadow-primary/10",
        isHovered && "shadow-lg shadow-primary/20 border-primary/40"
      )}>
        <CardHeader>
          <motion.div 
            className={cn(
              "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4",
              "from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300"
            )}
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            <Icon className={cn(
              "h-6 w-6 text-primary transition-all duration-300",
              isHovered && "text-primary/80 scale-110"
            )} />
          </motion.div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.p 
            className={cn(
              "text-muted-foreground transition-all duration-300",
              isHovered && "text-foreground"
            )}
            animate={{ 
              y: isHovered ? -2 : 0
            }}
          >
            {description}
          </motion.p>
        </CardContent>
        
        {/* Hover effect overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
        
        {/* Corner accent */}
        <motion.div 
          className="absolute top-0 right-0 w-8 h-8 bg-primary/10 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8
          }}
        />
      </Card>
    </motion.div>
  );
}

interface FeatureGridProps {
  features: Array<{
    icon: LucideIcon;
    title: string;
    description: string;
  }>;
  isLoading?: boolean;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  className?: string;
}

export function FeatureGrid({ 
  features, 
  isLoading = false, 
  columns = { sm: 2, md: 2, lg: 4 },
  className 
}: FeatureGridProps) {
  const gridClass = cn(
    "grid gap-6",
    columns.sm && `grid-cols-1 sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    className
  );

  return (
    <div className={gridClass}>
      {isLoading 
        ? Array.from({ length: 8 }).map((_, index) => (
            <FeatureCard
              key={index}
              icon={Sparkles}
              title=""
              description=""
              isLoading={true}
              delay={index}
            />
          ))
        : features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index}
            />
          ))
      }
    </div>
  );
}

// Re-export for convenience
// export { Sparkles };