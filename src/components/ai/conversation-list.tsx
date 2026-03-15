'use client';

/**
 * AI Chat Conversation Sidebar
 *
 * Lists past conversations and allows creating new ones.
 */

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Message01Icon, Delete01Icon } from '@hugeicons/core-free-icons';

interface Conversation {
  id: string;
  title: string | null;
  updatedAt: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: ConversationListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-3">
        <h2 className="text-sm font-semibold">Conversations</h2>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onNew}>
          <HugeiconsIcon icon={Add01Icon} className="size-4"  />
        </Button>
      </div>

      <div className=".5 flex-1 overflow-y-auto px-2 pb-2">
        
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                'group flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                activeId === conv.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <HugeiconsIcon icon={Message01Icon} className="size-3.5 shrink-0"  />
              <span className="min-w-0 flex-1 truncate">{conv.title || 'New conversation'}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                className="text-muted-foreground hover:text-destructive shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <HugeiconsIcon icon={Delete01Icon} className="size-3"  />
              </button>
            </button>
          ))}
        

        {conversations.length === 0 && (
          <p className="text-muted-foreground px-3 py-4 text-center text-xs">
            No conversations yet
          </p>
        )}
      </div>
    </div>
  );
}
