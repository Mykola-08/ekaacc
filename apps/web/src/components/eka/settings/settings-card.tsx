'use client';

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from "@/lib/utils";
import { InView } from "@/components/motion-primitives";

interface SettingsCardProps extends React.ComponentProps<typeof Card> {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function SettingsCard({ title, description, className, children, ...props }: SettingsCardProps) {
  return (
    <InView
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className={cn("shadow-sm hover:shadow-md transition-shadow duration-300", className)} {...props}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </InView>
  );
}
