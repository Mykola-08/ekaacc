"use client"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Sparkles } from "lucide-react"

const promptSuggestionVariants = cva(
  "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border-input bg-background hover:bg-accent hover:text-accent-foreground",
        highlight:
          "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type PromptSuggestionProps = {
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
  highlight?: string
} & VariantProps<typeof promptSuggestionVariants> &
  React.ButtonHTMLAttributes<HTMLButtonElement>

function PromptSuggestion({
  children,
  className,
  variant,
  icon,
  highlight,
  ...props
}: PromptSuggestionProps) {
  const content =
    highlight && typeof children === "string" ? (
      <>
        <span className="font-semibold">{highlight}</span>
        <span>{children.replace(highlight, "").trim()}</span>
      </>
    ) : (
      children
    )

  return (
    <button
      className={cn(promptSuggestionVariants({ variant }), className)}
      {...props}
    >
      {icon || (variant === "highlight" && <Sparkles className="h-4 w-4" />)}
      {content}
    </button>
  )
}

export { PromptSuggestion }
