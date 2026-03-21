'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Comment01Icon,
  PlusSignIcon,
  ThumbsUpIcon,
  Search01Icon,
  Loading03Icon,
  UserCircleIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';
import {
  createCommunityPost,
  likePost,
  reactToPost,
  createReply,
  reportCommunityPost,
} from '@/app/actions/community-actions';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type Post = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[] | null;
  likes_count: number | null;
  reactions?: { like?: number; heart?: number; pray?: number } | null;
  parent_id?: string | null;
  is_anonymous: boolean | null;
  created_at: string;
  author: { full_name: string | null; avatar_url: string | null } | null;
};

function normalizePost(post: any): Post {
  return {
    ...post,
    author: Array.isArray(post.author) ? (post.author[0] ?? null) : (post.author ?? null),
  } as Post;
}

const CATEGORIES = [
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'depression', label: 'Depression' },
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'sleep', label: 'Sleep' },
  { value: 'stress', label: 'Stress' },
  { value: 'general', label: 'General' },
];

const CATEGORY_COLORS: Record<string, string> = {
  anxiety: 'bg-warning/10 text-warning-foreground',
  depression: 'bg-primary/10 text-primary',
  mindfulness: 'bg-success/10 text-success',
  relationships: 'bg-secondary text-secondary-foreground',
  sleep: 'bg-muted text-muted-foreground',
  stress: 'bg-destructive/10 text-destructive',
  general: 'bg-muted text-muted-foreground',
};

function formatRelative(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function PostCard({
  post,
  replies,
  onLike,
  onReact,
  onReply,
  onReport,
}: {
  post: Post;
  replies: Post[];
  onLike: (id: string) => void;
  onReact: (id: string, reaction: 'like' | 'heart' | 'pray') => void;
  onReply: (id: string, content: string) => Promise<void>;
  onReport: (
    id: string,
    reason: 'spam' | 'harassment' | 'misinformation' | 'unsafe' | 'other'
  ) => void;
}) {
  const [replyText, setReplyText] = useState('');
  const [showReply, setShowReply] = useState(false);

  return (
    <Card className="rounded-[var(--radius)]">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-foreground text-sm leading-snug font-semibold">{post.title}</h3>
          {post.category && (
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                CATEGORY_COLORS[post.category] ?? 'bg-muted text-muted-foreground'
              )}
            >
              {post.category}
            </span>
          )}
        </div>
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <HugeiconsIcon icon={UserCircleIcon} className="size-3.5" />
          <span>
            {post.is_anonymous ? 'Anonymous' : (post.author?.full_name ?? 'Community Member')}
          </span>
          <span>·</span>
          <span>{formatRelative(post.created_at)}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{post.content}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {post.tags.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary gap-1.5 rounded-[calc(var(--radius)*0.8)] transition-colors"
          onClick={() => onLike(post.id)}
        >
          <HugeiconsIcon icon={ThumbsUpIcon} className="size-3.5" />
          <span className="text-xs tabular-nums">{post.likes_count ?? 0}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground ml-1 gap-1.5 rounded-[calc(var(--radius)*0.8)]"
        >
          <HugeiconsIcon icon={Comment01Icon} className="size-3.5" />
          <span className="text-xs">Discuss {replies.length > 0 ? `(${replies.length})` : ''}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground gap-1.5 rounded-[calc(var(--radius)*0.8)]"
          onClick={() => onReact(post.id, 'heart')}
        >
          <HugeiconsIcon icon={ThumbsUpIcon} className="size-3.5" />
          <span className="text-xs tabular-nums">{post.reactions?.heart ?? 0}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground gap-1.5 rounded-[calc(var(--radius)*0.8)]"
          onClick={() => onReact(post.id, 'pray')}
        >
          <HugeiconsIcon icon={Comment01Icon} className="size-3.5" />
          <span className="text-xs tabular-nums">{post.reactions?.pray ?? 0}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground gap-1.5 rounded-[calc(var(--radius)*0.8)]"
          onClick={() => onReport(post.id, 'other')}
        >
          <span className="text-xs">Report</span>
        </Button>
      </CardFooter>
      <CardContent className="space-y-2 pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-[calc(var(--radius)*0.8)] text-xs"
          onClick={() => setShowReply((v) => !v)}
        >
          {showReply ? 'Hide replies' : 'Reply'}
        </Button>
        {showReply && (
          <div className="space-y-2">
            {replies.map((reply) => (
              <div
                key={reply.id}
                className="border-border/60 text-muted-foreground rounded-[var(--radius)] border p-2 text-xs"
              >
                <span className="text-foreground mr-1 font-medium">
                  {reply.is_anonymous ? 'Anonymous' : (reply.author?.full_name ?? 'Member')}:
                </span>
                {reply.content}
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply…"
                className="h-8 rounded-[calc(var(--radius)*0.8)] text-xs"
              />
              <Button
                size="sm"
                className="rounded-[calc(var(--radius)*0.8)] text-xs"
                onClick={async () => {
                  if (!replyText.trim()) return;
                  await onReply(post.id, replyText.trim());
                  setReplyText('');
                }}
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CommunityPageClient({ posts: initial }: { posts: Post[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initial.map(normalizePost));
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [, startTransition] = useTransition();

  // New post form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const filtered = posts.filter((p) => {
    if (p.parent_id) return false;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      setCreateError('Please enter a title.');
      return;
    }
    if (!newContent.trim()) {
      setCreateError('Please enter some content.');
      return;
    }
    setCreating(true);
    setCreateError(null);
    const res = await createCommunityPost({
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory || undefined,
      is_anonymous: isAnonymous,
    });
    setCreating(false);
    if (!res.success) {
      setCreateError(res.error ?? 'Failed to post');
      return;
    }
    setPosts((prev) => [res.data as Post, ...prev]);
    setNewTitle('');
    setNewContent('');
    setNewCategory('');
    setIsAnonymous(false);
    setShowNewDialog(false);
    router.refresh();
  };

  const handleLike = (id: string) => {
    startTransition(async () => {
      await likePost(id);
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, likes_count: (p.likes_count ?? 0) + 1 } : p))
      );
    });
  };

  const handleReact = (id: string, reaction: 'like' | 'heart' | 'pray') => {
    startTransition(async () => {
      const result = await reactToPost(id, reaction);
      if (!result.success) return;
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, reactions: result.reactions as any } : p))
      );
    });
  };

  const handleReply = async (parentId: string, content: string) => {
    const result = await createReply({ parent_id: parentId, content });
    if (!result.success) return;
    setPosts((prev) => [...prev, normalizePost(result.data)]);
  };

  const handleReport = (
    id: string,
    reason: 'spam' | 'harassment' | 'misinformation' | 'unsafe' | 'other'
  ) => {
    startTransition(async () => {
      await reportCommunityPost({ post_id: id, reason });
    });
  };

  const categoryCounts = CATEGORIES.map((c) => ({
    ...c,
    count: posts.filter((p) => p.category === c.value).length,
  })).filter((c) => c.count > 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <HugeiconsIcon icon={UserGroupIcon} className="text-muted-foreground size-5" />
            Community Forums
          </h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Connect with others, share experiences, and get support.
          </p>
        </div>
        <Button
          onClick={() => setShowNewDialog(true)}
          className="shrink-0 gap-2 rounded-[calc(var(--radius)*0.8)]"
        >
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          New Topic
        </Button>
      </div>

      <div className="grid gap-4 @xl/main:grid-cols-12">
        {/* Main feed */}
        <div className="space-y-4 @xl/main:col-span-8">
          {/* Search */}
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="rounded-[var(--radius)] pl-9"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-[var(--radius)] border border-dashed py-16 text-center">
              <HugeiconsIcon icon={UserGroupIcon} className="text-muted-foreground/30 size-10" />
              <p className="text-muted-foreground text-sm">
                {search || categoryFilter !== 'all'
                  ? 'No posts match your search.'
                  : 'No posts yet. Be the first to start a discussion!'}
              </p>
              {!search && categoryFilter === 'all' && (
                <Button
                  onClick={() => setShowNewDialog(true)}
                  variant="outline"
                  className="gap-2 rounded-[calc(var(--radius)*0.8)]"
                >
                  <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                  Start a Discussion
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  replies={posts.filter((item) => item.parent_id === p.id)}
                  onLike={handleLike}
                  onReact={handleReact}
                  onReply={handleReply}
                  onReport={handleReport}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 @xl/main:col-span-4">
          <Card className="rounded-[var(--radius)]">
            <CardHeader className="pb-3">
              <h3 className="text-sm font-semibold">Filter by Topic</h3>
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              <button
                onClick={() => setCategoryFilter('all')}
                className={cn(
                  'w-full rounded-[var(--radius)] px-3 py-2 text-left text-sm transition-colors',
                  categoryFilter === 'all'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                All Topics
                <span className="float-right text-xs tabular-nums">{posts.length}</span>
              </button>
              {categoryCounts.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategoryFilter(c.value)}
                  className={cn(
                    'w-full rounded-[var(--radius)] px-3 py-2 text-left text-sm capitalize transition-colors',
                    categoryFilter === c.value
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {c.label}
                  <span className="float-right text-xs tabular-nums">{c.count}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5 rounded-[var(--radius)]">
            <CardContent className="text-muted-foreground p-4 text-sm">
              <p className="text-foreground mb-1 font-medium">Community Guidelines</p>
              <p className="text-xs leading-relaxed">
                Be respectful, supportive, and kind. This is a safe space for everyone. If you're in
                crisis, please contact emergency services.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Post Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="rounded-[var(--radius)]">
          <DialogHeader>
            <DialogTitle>Start a Discussion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What's on your mind?"
                className="h-10 rounded-[var(--radius)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Share your thoughts, experiences, or questions…"
                className="min-h-28 resize-none rounded-[var(--radius)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger className="h-10 rounded-[var(--radius)]">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Visibility</Label>
                <Select
                  value={isAnonymous ? 'anonymous' : 'public'}
                  onValueChange={(v) => setIsAnonymous(v === 'anonymous')}
                >
                  <SelectTrigger className="h-10 rounded-[var(--radius)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Show my name</SelectItem>
                    <SelectItem value="anonymous">Post anonymously</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {createError && (
              <Alert variant="destructive">
                <AlertDescription>{createError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              className="rounded-[calc(var(--radius)*0.8)]"
              onClick={() => setShowNewDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={creating}
              className="gap-2 rounded-[calc(var(--radius)*0.8)]"
            >
              {creating && <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />}
              {creating ? 'Posting…' : 'Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
