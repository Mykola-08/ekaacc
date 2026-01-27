'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { logError } from '@/server/logging/actions'
import { Button } from '@/components/ui/button'

export default function Error({
 error,
 reset,
}: {
 error: Error & { digest?: string }
 reset: () => void
}) {
 useEffect(() => {
  // Log the error to an error reporting service
  logError(error, { 
    digest: error.digest, 
    location: 'app-root-error-boundary' 
  })
 }, [error])

 return (
  <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center p-6">
   <h2 className="text-2xl font-semibold tracking-tight">Something went wrong!</h2>
   <p className="text-sm text-muted-foreground max-w-[400px]">
    We encountered an unexpected error. Our team has been notified automatically.
   </p>
   {error.digest && (
     <code className="text-xs bg-muted px-2 py-1 rounded">Error Digest: {error.digest}</code>
   )}
   <Button
    onClick={
     // Attempt to recover by trying to re-render the segment
     () => reset()
    }
   >
    Try again
   </Button>
  </div>
 )
}
