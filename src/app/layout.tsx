import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { UnifiedDataProvider } from '@/context/unified-data-context';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ProgressProvider } from '@/context/progress-context';


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
      <head>
        {/* DNS Prefetch & Preconnect for faster external resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://placehold.co" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://i.pravatar.cc" />
        
        {/* Load Inter font with optimal display strategy */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" 
          rel="stylesheet"
        />
        
        {/* Optimize font loading */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" as="style" />
      </head>
      <body className={cn('antialiased font-body')}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ProgressProvider>
              <TooltipProvider>
                <UnifiedDataProvider>
                  {children}
                </UnifiedDataProvider>
                <Toaster />
              </TooltipProvider>
            </ProgressProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
