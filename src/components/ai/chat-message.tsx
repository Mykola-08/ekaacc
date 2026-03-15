'use client';

/**
 * AI Chat Message Component
 *
 * Uses AI Elements Message primitives for rendering chat messages
 * with visual blocks for tool results and streaming markdown.
 */

import * as motion from 'motion/react-client';
import {
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
  MessageResponse,
} from '@/components/ai-elements/message';
import { VisualBlockRenderer } from '@/components/ai/blocks';
import { Copy, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import type { UIMessage } from 'ai';

interface ChatMessageProps {
  message: UIMessage;
  isLast?: boolean;
  isStreaming?: boolean;
  onCopy?: (content: string) => void;
  onRegenerate?: () => void;
}

export function ChatMessage({
  message,
  isLast,
  isStreaming,
  onCopy,
  onRegenerate,
}: ChatMessageProps) {
  const isUser = message.role === 'user';

  // Extract visual blocks from tool invocations
  const visualBlocks: Array<{ type: string; [key: string]: unknown }> = [];
  if (message.parts) {
    for (const part of message.parts) {
      if (part.type === 'tool-invocation') {
        const result = (part as any).result;
        if (result?._visualBlock) {
          visualBlocks.push(result._visualBlock);
        }
      }
    }
  }

  // Get text content from parts
  const textContent =
    message.parts
      ?.filter((p) => p.type === 'text')
      .map((p) => (p as any).text)
      .join('') || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <Message from={message.role}>
        <MessageContent>
          {/* Text content with streaming markdown */}
          {textContent &&
            (isUser ? (
              <p>{textContent}</p>
            ) : (
              <MessageResponse isAnimating={isStreaming && isLast}>
                {textContent}
              </MessageResponse>
            ))}

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
        </MessageContent>

        {/* Message actions for assistant messages */}
        {!isUser && textContent && (
          <MessageActions className="opacity-0 transition-opacity group-hover:opacity-100">
            <MessageAction
              tooltip="Copy"
              onClick={() => onCopy?.(textContent)}
            >
              <Copy className="size-3.5" />
            </MessageAction>
            <MessageAction tooltip="Good response">
              <ThumbsUp className="size-3.5" />
            </MessageAction>
            <MessageAction tooltip="Bad response">
              <ThumbsDown className="size-3.5" />
            </MessageAction>
            {isLast && (
              <MessageAction tooltip="Regenerate" onClick={onRegenerate}>
                <RotateCcw className="size-3.5" />
              </MessageAction>
            )}
          </MessageActions>
        )}
      </Message>
    </motion.div>
  );
}
