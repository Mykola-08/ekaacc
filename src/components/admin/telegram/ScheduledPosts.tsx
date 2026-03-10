'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  listPostsAction,
  publishPostAction,
  deletePostAction,
} from '@/server/telegram/actions';
import type { TelegramChannel, TelegramPost } from '@/server/telegram/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface ScheduledPostsProps {
  channels: TelegramChannel[];
}

export function ScheduledPosts({ channels }: ScheduledPostsProps) {
  const [selectedChannel, setSelectedChannel] = useState(channels[0]?.id ?? '');
  const [posts, setPosts] = useState<TelegramPost[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!selectedChannel) return;
    startTransition(async () => {
      const res = await listPostsAction(selectedChannel, 'scheduled');
      if (res.success) {
        const sorted = res.data.sort(
          (a: TelegramPost, b: TelegramPost) =>
            new Date(a.scheduled_at ?? 0).getTime() - new Date(b.scheduled_at ?? 0).getTime()
        );
        setPosts(sorted);
      }
    });
  }, [selectedChannel]);

  function handlePublishNow(postId: string) {
    startTransition(async () => {
      const res = await publishPostAction(postId);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        toast.success('Post published immediately');
      } else {
        toast.error(res.error ?? 'Failed to publish');
      }
    });
  }

  function handleDelete(postId: string) {
    startTransition(async () => {
      const res = await deletePostAction(postId);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        toast.success('Scheduled post removed');
      } else {
        toast.error(res.error ?? 'Failed to delete');
      }
    });
  }

  if (channels.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          No channels connected.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={selectedChannel} onValueChange={setSelectedChannel}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Select channel" />
          </SelectTrigger>
          <SelectContent>
            {channels.map((ch) => (
              <SelectItem key={ch.id} value={ch.id}>
                {ch.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {posts.length} queued
        </span>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {isPending ? 'Loading…' : 'No scheduled posts in queue.'}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Scheduled
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">
                        {post.scheduled_at
                          ? new Date(post.scheduled_at).toLocaleString()
                          : 'No time set'}
                      </span>
                    </div>
                    <p className="line-clamp-2 whitespace-pre-wrap text-sm">
                      {post.content}
                    </p>
                    {post.media_url && (
                      <span className="text-xs text-muted-foreground">
                        📎 Media attached
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublishNow(post.id)}
                      disabled={isPending}
                    >
                      Publish Now
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(post.id)}
                      disabled={isPending}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
