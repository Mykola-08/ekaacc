'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InlineFeedback } from '@/components/ui/inline-feedback';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import { HugeiconsIcon } from '@hugeicons/react';
import { Message01Icon, FavouriteIcon, MoreHorizontalIcon, SentIcon } from '@hugeicons/core-free-icons';
import {
  createCommunityPost,
  togglePostLike,
  addPostComment,
  getPostComments,
} from '@/server/community/actions';

export function CommunityFeed({ channelId, posts }: { channelId: string; posts: any[] }) {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [expandedComments, setExpandedComments] = useState<Record<string, any[]>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const { feedback, setLoading, setSuccess, setError, reset } = useMorphingFeedback();

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      setError('Please fill in both title and content');
      return;
    }
    setLoading('Creating post...');
    const result = await createCommunityPost({
      title: newTitle.trim(),
      content: newContent.trim(),
    });
    if (result.success) {
      setSuccess('Post created!');
      setNewTitle('');
      setNewContent('');
    } else {
      setError(result.error || 'Failed to create post');
    }
  };

  const handleLike = (postId: string) => {
    startTransition(async () => {
      await togglePostLike(postId);
    });
  };

  const handleToggleComments = async (postId: string) => {
    if (expandedComments[postId]) {
      setExpandedComments((prev) => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
    } else {
      const comments = await getPostComments(postId);
      setExpandedComments((prev) => ({ ...prev, [postId]: comments }));
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text) return;
    const result = await addPostComment(postId, text);
    if (result.success) {
      setCommentText((prev) => ({ ...prev, [postId]: '' }));
      // Refresh comments
      const comments = await getPostComments(postId);
      setExpandedComments((prev) => ({ ...prev, [postId]: comments }));
    }
  };

  return (
    <div className="bg-muted flex h-full flex-1 flex-col">
      {/* Feed Header */}
      <div className="bg-card sticky top-0 z-10 flex h-16 items-center px-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          # {channelId === 'general' ? 'General' : 'Channel'}
          <Badge variant="outline" className="ml-2 text-xs font-normal">
            {posts.length} Posts
          </Badge>
        </h2>
      </div>

      {/* Feed Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Create Post */}
        <Card>
          <CardContent className="pt-6 flex flex-col gap-4">
            <Input
              placeholder="Post title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="font-medium"
            />
            <Textarea
              placeholder="Share something with the community..."
              className="min-h-20 resize-none"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <InlineFeedback status={feedback.status} message={feedback.message} onDismiss={reset} />
          </CardContent>
          <CardFooter className="bg-muted flex justify-between py-3">
            <div className="text-muted-foreground text-xs">Markdown supported</div>
            <Button size="sm" onClick={handleCreatePost} disabled={feedback.status === 'loading'}>
              {feedback.status === 'loading' ? 'Posting...' : 'Post'}
            </Button>
          </CardFooter>
        </Card>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-muted-foreground py-12 text-center">
            <HugeiconsIcon icon={Message01Icon} className="mx-auto mb-4 size-12 opacity-30"  />
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-sm">Be the first to share something with the community!</p>
          </div>
        )}

        {/* Posts */}
        {posts.map((post: any) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
              <Avatar>
                <AvatarFallback>{post.author?.full_name?.[0] || '?'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">
                      {post.author?.full_name || 'Anonymous'}
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {post.is_pinned && (
                    <Badge variant="secondary" className="text-xs">
                      Pinned
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <h4 className="mb-2 text-lg font-bold">{post.title}</h4>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </CardContent>
            <CardFooter className="bg-muted flex flex-col gap-0 py-2">
              <div className="flex w-full gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary gap-2"
                  onClick={() => handleLike(post.id)}
                  disabled={isPending}
                >
                  <HugeiconsIcon icon={FavouriteIcon} className="size-4"  /> {post.likes || 0}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary gap-2"
                  onClick={() => handleToggleComments(post.id)}
                >
                  <HugeiconsIcon icon={Message01Icon} className="size-4"  /> {post.replies_count || 0}
                </Button>
              </div>

              {/* Comments Section */}
              {expandedComments[post.id] && (
                <div className="mt-3 w-full pt-3">
                  {expandedComments[post.id].map((comment: any) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs">
                          {comment.author?.full_name?.[0] || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-medium">
                            {comment.author?.full_name || 'Anonymous'}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Write a comment..."
                      className="h-9 text-sm"
                      value={commentText[post.id] || ''}
                      onChange={(e) =>
                        setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment(post.id);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9"
                      onClick={() => handleAddComment(post.id)}
                    >
                      <HugeiconsIcon icon={SentIcon} className="size-4"  />
                    </Button>
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
