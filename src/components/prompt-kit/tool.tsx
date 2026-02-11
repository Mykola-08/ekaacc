"use client"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import {
  CheckCircle,
  ChevronDown,
  Loader2,
  Settings,
  XCircle,
} from "lucide-react"
import { useState } from "react"

export type ToolPart = {
  type: string
  state:
    | "input-streaming"
    | "input-available"
    | "output-available"
    | "output-error"
  input?: Record<string, unknown>
  output?: Record<string, unknown>
  toolCallId?: string
  errorText?: string
}

export type ToolProps = {
  toolPart: ToolPart
  defaultOpen?: boolean
  className?: string
}

const formatValue = (value: unknown): string => {
  if (typeof value === "string") return value
  return JSON.stringify(value, null, 2)
}

const Tool = ({ toolPart, defaultOpen = false, className }: ToolProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const { state, input, output, toolCallId } = toolPart

  const isLoading =
    state === "input-streaming" || state === "input-available"
  const isError = state === "output-error"
  const isComplete = state === "output-available"

  const toolName =
    toolCallId?.replace(/^call_/, "").replace(/_/g, " ") || "Tool"

  const StatusIcon = isError
    ? XCircle
    : isComplete
      ? CheckCircle
      : isLoading
        ? Loader2
        : Settings

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <div
        className={cn(
          "border-border overflow-hidden rounded-lg border",
          isError && "border-destructive/40",
          isComplete && "border-success/30"
        )}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex w-full items-center justify-between p-3 text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <StatusIcon
                className={cn(
                  "h-4 w-4",
                  isLoading && "animate-spin",
                  isError && "text-destructive",
                  isComplete && "text-success"
                )}
              />
              <span className="truncate">{toolName}</span>
            </div>
            <ChevronDown
              className={cn("h-4 w-4", isOpen && "rotate-180")}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent
          className={cn(
            "border-border border-t",
            "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden"
          )}
        >
          <div className="bg-background space-y-3 p-3">
            {input && Object.keys(input).length > 0 && (
              <div>
                <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                  Input
                </h4>
                <div className="bg-muted rounded border p-2 font-mono text-sm">
                  {Object.entries(input).map(([key, value]) => (
                    <div key={key} className="mb-1">
                      <span className="text-muted-foreground">{key}:</span>{" "}
                      <span>{formatValue(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {output && (
              <div>
                <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                  Output
                </h4>
                <div className="bg-muted rounded border p-2 font-mono text-sm">
                  <pre className="overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(output, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {toolPart.errorText && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-destructive">Error</h4>
                <div className="rounded border border-destructive/30 bg-destructive/10 p-2 text-sm text-destructive dark:border-destructive/30 dark:bg-destructive/10 dark:text-destructive">
                  {toolPart.errorText}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

export { Tool }
