'use client';

import { useEffect, useState, useTransition } from 'react';
import { listPostsAction, publishPostAction, deletePostAction } from '@/server/telegram/actions';
import type { TelegramChannel, TelegramPost } from '@/server/telegram/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface PostsListProps {
  channels: TelegramChannel[];
}

const STATUS_COLORS: Record<string, 'default' | 'outline' | 'secondary' | 'destructive'> = {
  published: 'default',
  scheduled: 'secondary',
  draft: 'outline',
  failed: 'destructive',
};

export function PostsList({ channels }: PostsListProps) {
  const [selectedChannel, setSelectedChannel] = useState(channels[0]?.id ?? '');
  const [statusFilter, setStatusFilter] = useState('all');
  const [posts, setPosts] = useState<TelegramPost[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!selectedChannel) return;
    startTransition(async () => {
      const res = await listPostsAction(
        selectedChannel,
        statusFilter === 'all' ? undefined : statusFilter
      );
      if (res.success) setPosts(res.data);
    });
  }, [selectedChannel, statusFilter]);

  function handlePublish(postId: string) {
    startTransition(async () => {
      const res = await publishPostAction(postId);
      if (res.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, status: 'published' as const } : p))
        );
        toast.success('Post published');
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
        toast.success('Post deleted');
      } else {
        toast.error(res.error ?? 'Failed to delete');
      }
    });
  }

  if (channels.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground py-12 text-center text-sm">
          No channels connected.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="">
      <div className="flex flex-wrap items-center gap-3">
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-muted-foreground text-sm">
          {posts.length} post{posts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground py-12 text-center text-sm">
            {isPending ? 'Loading…' : 'No posts found.'}
          </CardContent>
        </Card>
      ) : (
        <div className="">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={STATUS_COLORS[post.status] ?? 'outline'}
                        className="capitalize"
                      >
                        {post.status}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {post.published_at
                          ? `Published ${new Date(post.published_at).toLocaleString()}`
                          : post.scheduled_at
                            ? `Scheduled ${new Date(post.scheduled_at).toLocaleString()}`
                            : `Created ${new Date(post.created_at).toLocaleString()}`}
                      </span>
                      {post.parse_mode && (
                        <Badge variant="outline" className="text-xs">
                          {post.parse_mode}
                        </Badge>
                      )}
                    </div>
                    <p className="line-clamp-3 text-sm whitespace-pre-wrap">{post.content}</p>
                    {post.error_message && (
                      <p className="text-destructive text-xs">{post.error_message}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {(post.status === 'draft' || post.status === 'scheduled') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePublish(post.id)}
                        disabled={isPending}
                      >
                        Publish
                      </Button>
                    )}
                    {post.status === 'failed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePublish(post.id)}
                        disabled={isPending}
                      >
                        Retry
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(post.id)}
                      disabled={isPending}
                    >
                      Delete
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
