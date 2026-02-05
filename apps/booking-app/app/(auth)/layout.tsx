import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Minimal layout for auth pages – no header, no footer.
    // The pages themselves can control their centering and containers.
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      {children}
    </div>
  );
}
