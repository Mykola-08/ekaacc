"use client";

/**
 * AI Chat Message Component
 *
 * Renders a single chat message with avatar, markdown content,
 * tool call visual blocks, and motion animations.
 */

import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageActions,
  MessageAction,
} from "@/components/prompt-kit/message";
import { VisualBlockRenderer } from "@/components/ai/blocks";
import { Copy, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import type { UIMessage } from "ai";

interface ChatMessageProps {
  message: UIMessage;
  isLast?: boolean;
  onCopy?: (content: string) => void;
  onRegenerate?: () => void;
}

export function ChatMessage({ message, isLast, onCopy, onRegenerate }: ChatMessageProps) {
  const isUser = message.role === "user";

  // Extract visual blocks from tool invocations
  const visualBlocks: Array<{ type: string; [key: string]: unknown }> = [];
  if (message.parts) {
    for (const part of message.parts) {
      if (part.type === "tool-invocation") {
        const result = (part as any).result;
        if (result?._visualBlock) {
          visualBlocks.push(result._visualBlock);
        }
      }
    }
  }

  // Get text content
  const textContent =
    message.parts
      ?.filter((p) => p.type === "text")
      .map((p) => (p as any).text)
      .join("") || message.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn("group", isUser ? "flex justify-end" : "")}
    >
      <Message
        className={cn(
          "max-w-[85%]",
          isUser ? "flex-row-reverse" : ""
        )}
      >
        {!isUser && (
          <MessageAvatar
            src="/images/eka-avatar.png"
            fallback="E"
            className="bg-primary/10 text-primary"
          />
        )}

        <div className={cn("flex flex-col gap-2", isUser ? "items-end" : "items-start")}>
          {/* Text content */}
          {textContent && (
            <div
              className={cn(
                "rounded-2xl px-4 py-2.5",
                isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/70"
              )}
            >
              <MessageContent markdown={!isUser}>{textContent}</MessageContent>
            </div>
          )}

          {/* Visual blocks from tool calls */}
          {visualBlocks.map((block, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
            >
              <VisualBlockRenderer block={block} />
            </motion.div>
          ))}

          {/* Message actions for assistant messages */}
          {!isUser && textContent && (
            <MessageActions className="opacity-0 transition-opacity group-hover:opacity-100">
              <MessageAction
                tooltip="Copy"
                onClick={() => onCopy?.(textContent)}
              >
                <Copy className="h-3.5 w-3.5" />
              </MessageAction>
              <MessageAction tooltip="Good response">
                <ThumbsUp className="h-3.5 w-3.5" />
              </MessageAction>
              <MessageAction tooltip="Bad response">
                <ThumbsDown className="h-3.5 w-3.5" />
              </MessageAction>
              {isLast && (
                <MessageAction tooltip="Regenerate" onClick={onRegenerate}>
                  <RotateCcw className="h-3.5 w-3.5" />
                </MessageAction>
              )}
            </MessageActions>
          )}
        </div>
      </Message>
    </motion.div>
  );
}
