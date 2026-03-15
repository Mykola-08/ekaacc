import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="maia-theme bg-background text-foreground flex min-h-dvh flex-col antialiased">
      {children}
    </div>
  );
}
