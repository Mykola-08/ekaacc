import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';
import { UserProvider } from '@/context/user-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'EKA Account',
  description: 'The central hub for your EKA ecosystem.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('antialiased font-body', inter.variable)}>
        <FirebaseClientProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
