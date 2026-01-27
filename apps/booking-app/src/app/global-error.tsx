'use client'

import { useEffect } from 'react'
import { logError } from '@/server/logging/actions'
import { Button } from '@/components/ui/button'
import { Inter, Playfair_Display } from 'next/font/google'
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export default function GlobalError({
 error,
 reset,
}: {
 error: Error & { digest?: string }
 reset: () => void
}) {
 useEffect(() => {
  logError(error, { 
    digest: error.digest, 
    location: 'global-root-error' 
  })
 }, [error])

 return (
  <html lang="en">
   <body className={cn("antialiased", inter.variable, playfair.variable)}>
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 p-8">
      <h1 className="text-4xl font-serif font-bold text-destructive">Critical Error</h1>
      <p className="text-muted-foreground text-center">
        A critical system error occurred. We have logged this event.
      </p>
      <Button onClick={() => reset()}>Restart Application</Button>
    </div>
   </body>
  </html>
 )
}
