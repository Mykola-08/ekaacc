"use client"

import { cn } from "@/lib/utils"
import React from "react"
import ReactMarkdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"

export type MarkdownProps = {
  children: string
  className?: string
} & React.ComponentProps<typeof ReactMarkdown>

function Markdown({ children, className, ...props }: MarkdownProps) {
  return (
    <div
      className={cn(
        "prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
        p({ children: pChildren }) {
          return <p className="mb-2 last:mb-0">{pChildren}</p>
        },
        a({ children: aChildren, href }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              {aChildren}
            </a>
          )
        },
        ul({ children: ulChildren }) {
          return <ul className="mb-2 list-disc pl-4">{ulChildren}</ul>
        },
        ol({ children: olChildren }) {
          return <ol className="mb-2 list-decimal pl-4">{olChildren}</ol>
        },
        code({ children: codeChildren, className: codeClassName }) {
          const isInline = !codeClassName
          if (isInline) {
            return (
              <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">
                {codeChildren}
              </code>
            )
          }
          return (
            <code className={cn("block font-mono text-sm", codeClassName)}>
              {codeChildren}
            </code>
          )
        },
        pre({ children: preChildren }) {
          return (
            <pre className="bg-muted mt-2 mb-2 overflow-x-auto rounded-lg p-4">
              {preChildren}
            </pre>
          )
        },
      }}
      {...props}
    >
      {children}
    </ReactMarkdown>
    </div>
  )
}

export { Markdown }
