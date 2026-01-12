'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export default function Error({
 error,
 reset,
}: {
 error: Error & { digest?: string }
 reset: () => void
}) {
 useEffect(() => {
  console.error(error)
 }, [error])

 return (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
   <div className="bg-destructive/10 p-4 rounded-full mb-4">
    <ShieldAlert className="w-10 h-10 text-destructive" />
   </div>
   <h2 className="text-xl font-bold mb-2">Access Restricted or Error</h2>
   <p className="text-muted-foreground mb-6 max-w-sm">
    {error.message === 'Forbidden' 
      ? "You don't have permission to view this finance dashboard." 
      : "We couldn't load the verification queue. Please try again."}
   </p>
   <Button onClick={() => reset()} variant="outline">
    Try again
   </Button>
  </div>
 )
}
