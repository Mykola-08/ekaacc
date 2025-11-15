import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/lib/supabase-auth';
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
        
        {/* Load Inter and Manrope fonts with optimal display strategy */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet"
        />
        
        {/* Optimize font loading */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" as="style" />
      </head>
      <body className={cn('antialiased font-sans')}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ProgressProvider>
              <TooltipProvider>
                {children}
                <Toaster />
              </TooltipProvider>
            </ProgressProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
