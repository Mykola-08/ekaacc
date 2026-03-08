'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MessageCircle, Heart, MoreHorizontal, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { InlineFeedback } from '@/components/ui/inline-feedback';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
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
    <div className="flex-1 flex flex-col h-full bg-muted/10">
      {/* Feed Header */}
      <div className="h-16 border-b flex items-center px-6 bg-card sticky top-0 z-10">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          # {channelId === 'general' ? 'General' : 'Channel'}
          <Badge variant="outline" className="ml-2 font-normal text-xs">{posts.length} Posts</Badge>
        </h2>
      </div>

      {/* Feed Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Create Post */}
        <Card>
          <CardContent className="pt-4 space-y-3">
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
          <CardFooter className="border-t py-3 bg-muted/20 flex justify-between">
            <div className="text-xs text-muted-foreground">Markdown supported</div>
            <Button size="sm" onClick={handleCreatePost} disabled={feedback.status === 'loading'}>
              {feedback.status === 'loading' ? 'Posting...' : 'Post'}
            </Button>
          </CardFooter>
        </Card>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
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
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm">{post.author?.full_name || 'Anonymous'}</h3>
                    <p className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                  {post.is_pinned && <Badge variant="secondary" className="text-[10px]">Pinned</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <h4 className="font-bold text-lg mb-2">{post.title}</h4>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </CardContent>
            <CardFooter className="border-t py-2 bg-muted/10 flex flex-col gap-0">
              <div className="flex gap-4 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-primary"
                  onClick={() => handleLike(post.id)}
                  disabled={isPending}
                >
                  <Heart className="w-4 h-4" /> {post.likes || 0}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-primary"
                  onClick={() => handleToggleComments(post.id)}
                >
                  <MessageCircle className="w-4 h-4" /> {post.replies_count || 0}
                </Button>
              </div>

              {/* Comments Section */}
              {expandedComments[post.id] && (
                <div className="w-full mt-3 border-t pt-3 space-y-3">
                  {expandedComments[post.id].map((comment: any) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs">{comment.author?.full_name?.[0] || '?'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-medium">{comment.author?.full_name || 'Anonymous'}</span>
                          <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Write a comment..."
                      className="text-sm h-9"
                      value={commentText[post.id] || ''}
                      onChange={(e) => setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment(post.id);
                        }
                      }}
                    />
                    <Button size="sm" variant="outline" className="h-9" onClick={() => handleAddComment(post.id)}>
                      <Send className="h-4 w-4" />
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
