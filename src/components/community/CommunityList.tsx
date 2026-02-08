'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  category: string;
  likes: number;
  comments: number;
}

interface CommunityListProps {
  posts: Post[];
}

export function CommunityList({ posts }: CommunityListProps) {
  return (
    <div className="animate-fade-in flex flex-col gap-8">
      {/* Header */}
      <div className="border-border flex flex-col items-center justify-between gap-6 border-b pb-8 md:flex-row">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
            Community Forum
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect with others on the journey to balance.
          </p>
        </div>
        <Link href="/community/new">
          <Button className="rounded-full shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="bg-card border-muted flex flex-col items-center justify-center rounded-[20px] border-2 border-dashed py-20 shadow-none">
            <MessageSquare className="text-muted-foreground/50 mb-4 h-12 w-12" />
            <h3 className="text-foreground mb-2 text-xl font-bold tracking-tight">No posts yet</h3>
            <p className="text-muted-foreground">Be the first to share your thoughts.</p>
          </Card>
        ) : (
          posts.map((post, idx) => (
            <Link href={`/community/${post.id}`} key={post.id} className="group block">
              <Card className="bg-card border-border overflow-hidden rounded-[20px] border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8">
                <div className="flex flex-col gap-6 md:flex-row">
                  {/* Avatar Placeholder */}
                  <div className="shrink-0">
                    <div className="bg-card text-foreground border-muted flex h-12 w-12 items-center justify-center rounded-full border text-lg font-black">
                      {post.userId ? post.userId.substring(0, 1).toUpperCase() : 'U'}
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="text-muted-foreground flex items-center gap-3 text-xs font-medium tracking-wider uppercase">
                      <Badge variant="secondary" className="font-normal">
                        {post.category || 'General'}
                      </Badge>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    <h3 className="text-foreground group-hover:text-primary text-2xl leading-tight font-bold tracking-tight transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                      {post.content}
                    </p>

                    <div className="text-muted-foreground flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments || 0} Comments</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end md:justify-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="group-hover:bg-primary group-hover:text-primary-foreground rounded-full transition-all"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
