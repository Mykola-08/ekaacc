"use client"

import { cn } from "@/lib/platform/utils"
import { forwardRef } from "react"

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
}

const RainbowButton = forwardRef<HTMLButtonElement, RainbowButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    const sizeClasses = {
      default: "px-4 py-2",
      sm: "px-3 py-1.5 text-sm",
      lg: "px-6 py-3 text-lg",
      icon: "p-2",
    }

    const variantClasses = {
      default: cn(
        "bg-gradient-to-r from-[#ff668e] via-[#ff9e68] to-[#ff668e] bg-[length:200%_100%] hover:bg-right text-white",
        "animate-shimmer bg-[linear-gradient(110deg,#ff668e,45%,#ff9e68,55%,#ff668e)]"
      ),
      outline: cn(
        "border-2 border-transparent bg-gradient-to-r from-[#ff668e] via-[#ff9e68] to-[#ff668e] bg-[length:200%_100%] p-[2px] hover:bg-right"
      ),
    }

    return (
      <button
        className={cn(
          "group relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        {variant === "outline" ? (
          <span className="block rounded-md bg-background px-4 py-2 group-hover:bg-transparent">
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

RainbowButton.displayName = "RainbowButton"

export { RainbowButton }