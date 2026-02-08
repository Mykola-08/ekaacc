'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, MessageSquare, Share2, Heart, Flag } from 'lucide-react';
import { Post } from '@/server/community/actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CommunityPostProps {
  post: Post;
}

export function CommunityPost({ post }: CommunityPostProps) {
  return (
    <div className="animate-fade-in flex flex-col gap-8 pb-24">
      {/* Header / Nav */}
      <div className="pt-8">
        <Link href="/community">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Forum
          </Button>
        </Link>
      </div>

      <div className="mx-auto w-full max-w-4xl">
        <Card className="border-border animate-slide-up overflow-hidden shadow-xl">
          {/* Post Header */}
          <div className="border-border bg-muted/30 border-b p-8 md:p-12">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="outline" className="tracking-wider uppercase">
                {post.category || 'Discussion'}
              </Badge>
              <span className="text-muted-foreground text-sm">•</span>
              <span className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>

            <h1 className="text-foreground mb-6 font-serif text-3xl leading-tight md:text-5xl">
              {post.title}
            </h1>

            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {post.userId ? post.userId.substring(0, 1).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="text-foreground font-semibold">Community Member</p>
                <p className="text-muted-foreground">Author</p>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="min-h-[300px] p-8 md:p-12">
            <div className="prose dark:prose-invert prose-lg text-foreground max-w-none leading-relaxed font-light">
              {post.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="bg-muted/10 border-border flex items-center justify-between border-t p-6 md:px-12">
            <div className="text-muted-foreground flex items-center gap-4 md:gap-6">
              <Button variant="ghost" size="sm" className="hover:text-primary gap-2">
                <Heart className="h-5 w-5" />
                <span className="hidden font-medium md:inline">{post.likesCount || 0} Likes</span>
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-primary gap-2">
                <MessageSquare className="h-5 w-5" />
                <span className="hidden font-medium md:inline">Comment</span>
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-primary gap-2">
                <Share2 className="h-5 w-5" />
                <span className="hidden font-medium md:inline">Share</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              title="Report Post"
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Comments Placeholder */}
        <div className="text-muted-foreground mt-12 text-center">
          <p>Comments section coming soon...</p>
        </div>
      </div>
    </div>
  );
}
