'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCcw } from "lucide-react"

export default function Error({
 error,
 reset,
}: {
 error: Error & { digest?: string }
 reset: () => void
}) {
 useEffect(() => {
  // Log the error to an error reporting service
  console.error(error)
 }, [error])

 return (
  <div className="min-h-screen bg-background-dark text-slate-200 flex items-center justify-center p-6">
   <div className="bg-surface border border-border-subtle rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
    <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
      <AlertCircle className="w-8 h-8 text-red-400" />
    </div>
    <h2 className="text-2xl font-serif text-slate-100 mb-3">Something went wrong!</h2>
    <p className="text-muted-foreground/80 mb-8">
     We encountered an error while loading the booking details. Please checking your connection and try again.
    </p>
    <div className="flex gap-4 justify-center">
       <Button 
        onClick={() => window.history.back()}
        variant="outline"
        className="hover:bg-surface-highlight hover:text-white"
       >
        Go Back
       </Button>
      <Button 
        onClick={
        // Attempt to recover by trying to re-render the segment
        () => reset()
        }
        className="bg-primary hover:bg-primary-hover text-primary-foreground"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Try again
      </Button>
    </div>
   </div>
  </div>
 )
}
