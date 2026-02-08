import React from 'react';

export function SurfacePanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-card text-card-foreground rounded-xl border shadow-sm ${className || ''}`}>
      {children}
    </div>
  );
}
