'use client';

import { cn } from "@/lib/utils";
import { TextEffect } from "@/components/motion-primitives";

interface SettingsHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function SettingsHeader({ title, description, className, ...props }: SettingsHeaderProps) {
  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      <TextEffect 
        per="word" 
        preset="fade-in-blur"
        as="h2"
        className="text-2xl font-bold tracking-tight"
      >
        {title}
      </TextEffect>
      {description && (
        <TextEffect 
          per="word"
          preset="fade"
          as="p"
          className="text-muted-foreground"
          delay={0.2}
        >
          {description}
        </TextEffect>
      )}
    </div>
  );
}
