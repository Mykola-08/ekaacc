import React from 'react';

export function SettingsHeader({
  heading,
  text,
  title,
  description,
}: {
  heading?: string;
  text?: string;
  title?: string;
  description?: string;
}) {
  return (
    <div className="space-y-0.5">
      <h2 className="text-2xl font-bold tracking-tight">{heading || title || ''}</h2>
      <p className="text-muted-foreground">{text || description || ''}</p>
    </div>
  );
}
