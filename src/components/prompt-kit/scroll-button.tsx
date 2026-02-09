"use client"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStickToBottomContext } from "use-stick-to-bottom"

const scrollButtonVariants = cva(
  "rounded-full shadow-md transition-opacity duration-200",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
        secondary: "",
        ghost: "",
      },
      size: {
        default: "",
        sm: "",
        lg: "",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "sm",
    },
  }
)

export type ScrollButtonProps = {
  className?: string
  threshold?: number
} & VariantProps<typeof scrollButtonVariants> &
  React.ButtonHTMLAttributes<HTMLButtonElement>

function ScrollButton({
  className,
  variant = "outline",
  size = "sm",
  ...props
}: ScrollButtonProps) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()

  if (isAtBottom) return null

  return (
    <Button
      variant={variant}
      size="icon"
      className={cn(scrollButtonVariants({ variant, size }), className)}
      onClick={() => scrollToBottom()}
      aria-label="Scroll to bottom"
      {...props}
    >
      <ArrowDown className="h-4 w-4" />
    </Button>
  )
}

export { ScrollButton }
