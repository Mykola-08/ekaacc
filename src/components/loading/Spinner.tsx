"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Transition } from "@headlessui/react"

export interface SpinnerProps {
  className?: string
}

/**
 * A minimal, CSS-only spinner used inside buttons (e.g., the "Sign In" button)
 * to show action progress without blocking the UI.
 * 
 * Note: Kept lightweight without Headless UI Transition as it's often used 
 * inside tight layouts (buttons) where extra wrappers might cause issues.
 */
export function LoadingSpinner({ className }: SpinnerProps) {
  return (
    <Loader2 className={cn("h-4 w-4 animate-spin", className)} />
  )
}

/**
 * Used by Next.js (loading.jsx) to show a center-screen spinner while navigating between routes.
 * 
 * Updated to use Headless UI Transition for a smooth "appear" effect.
 */
export function InlineSpinner({ className }: SpinnerProps) {
  return (
    <Transition
      appear={true}
      show={true}
      enter="transition-opacity duration-300 ease-in-out"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      as="div"
      className={cn("flex min-h-[50vh] w-full items-center justify-center", className)}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </Transition>
  )
}

