"use client"

import { cn } from "@/lib/platform/utils"
import { ReactNode } from "react"

interface TextShimmerProps {
  children: ReactNode
  className?: string
  duration?: number
}

export function TextShimmer({ children, className, duration = 1.5 }: TextShimmerProps) {
  return (
    <div
      className={cn(
        "relative inline-block bg-gradient-to-r from-transparent via-white/80 to-transparent bg-[length:200%_100%] bg-clip-text",
        className
      )}
      style={{
        animation: `shimmer ${duration}s linear infinite`,
        backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 50%, transparent)",
      }}
    >
      {children}
    </div>
  )
}