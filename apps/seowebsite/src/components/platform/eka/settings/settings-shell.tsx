import React from 'react';

export function SettingsShell({ children, title, description, className }: { children: React.ReactNode; title?: string; description?: string, className?: string }) {
  return <div className={`space-y-6 ${className || ''}`}>{children}</div>;
}