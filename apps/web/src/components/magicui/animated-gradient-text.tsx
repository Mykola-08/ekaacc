"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface AnimatedGradientTextProps {
  children: ReactNode
  className?: string
  speed?: number
  colorFrom?: string
  colorTo?: string
}

export function AnimatedGradientText({
  children,
  className,
  speed = 1,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
}: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        "animate-gradient bg-gradient-to-r bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colorFrom}, ${colorTo}, ${colorFrom})`,
        animationDuration: `${speed * 3}s`,
        backgroundSize: "300% 100%",
        backgroundPosition: "0% 0%",
        animation: `gradient ${speed * 3}s ease infinite`,
      }}
    >
      {children}
    </span>
  )
}