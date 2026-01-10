'use client';

import { cn } from "@/lib/platform/utils";
import { TextEffect } from "@/components/platform/motion-primitives";

interface SettingsHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  eyebrow?: string;
}

export function SettingsHeader({ title, description, eyebrow, className, ...props }: SettingsHeaderProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
          <span>{eyebrow}</span>
        </div>
      )}
      <TextEffect 
        per="word" 
        preset="fade-in-blur"
        as="h2"
        className="text-3xl font-bold tracking-tight"
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
