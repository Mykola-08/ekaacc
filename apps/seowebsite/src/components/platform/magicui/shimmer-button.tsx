"use client"

import { cn } from "@/lib/platform/utils"
import { forwardRef } from "react"

interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  duration?: string
}

const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ 
    className, 
    children, 
    shimmerColor = "#ffffff",
    shimmerSize = "100%",
    borderRadius = "8px",
    duration = "2s",
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          "relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
          className
        )}
        ref={ref}
        {...props}
      >
        <span
          className="absolute inset-[-1000%] animate-[shimmer_2s_linear_infinite]"
          style={{
            background: `conic-gradient(from 90deg at 50% 50%, ${shimmerColor} 0%, transparent 50%, ${shimmerColor} 100%)`,
            animationDuration: duration,
          }}
        />
        <span
          className={cn(
            "inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-6 py-2 text-sm font-medium text-white backdrop-blur-xl"
          )}
          style={{ borderRadius }}
        >
          {children}
        </span>
      </button>
    )
  }
)

ShimmerButton.displayName = "ShimmerButton"

export { ShimmerButton }