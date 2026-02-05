"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, MessageSquare, Share2, Heart, Flag } from "lucide-react";
import { Post } from "@/server/community/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CommunityPostProps {
  post: Post;
}

export function CommunityPost({ post }: CommunityPostProps) {
  return (
    <div className="flex flex-col gap-8 pb-24 animate-fade-in">
      {/* Header / Nav */}
      <div className="pt-8">
         <Link href="/community">
            <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Forum
            </Button>
         </Link>
      </div>

      <div className="w-full max-w-4xl mx-auto">
         <Card className="overflow-hidden shadow-xl border-border animate-slide-up">
            
            {/* Post Header */}
            <div className="p-8 md:p-12 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2 mb-4">
                     <Badge variant="outline" className="uppercase tracking-wider">
                        {post.category || "Discussion"}
                     </Badge>
                     <span className="text-muted-foreground text-sm">•</span>
                     <span className="text-muted-foreground text-sm">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                     </span>
                </div>

                <h1 className="font-serif text-3xl md:text-5xl text-foreground mb-6 leading-tight">
                    {post.title}
                </h1>

                <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {post.userId ? post.userId.substring(0,1).toUpperCase() : 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                        <p className="font-semibold text-foreground">Community Member</p>
                        <p className="text-muted-foreground">Author</p>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="p-8 md:p-12 min-h-[300px]">
                <div className="prose dark:prose-invert max-w-none prose-lg text-foreground leading-relaxed font-light">
                    {post.content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                </div>
            </div>

            {/* Actions Bar */}
            <div className="bg-muted/10 p-6 md:px-12 flex items-center justify-between border-t border-border">
                <div className="flex items-center gap-4 md:gap-6 text-muted-foreground">
                    <Button variant="ghost" size="sm" className="gap-2 hover:text-primary">
                        <Heart className="w-5 h-5" />
                        <span className="font-medium hidden md:inline">{post.likesCount || 0} Likes</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 hover:text-primary">
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-medium hidden md:inline">Comment</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 hover:text-primary">
                        <Share2 className="w-5 h-5" />
                        <span className="font-medium hidden md:inline">Share</span>
                    </Button>
                </div>
                
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" title="Report Post">
                    <Flag className="w-4 h-4" />
                </Button>
            </div>

         </Card>

         {/* Comments Placeholder */}
         <div className="mt-12 text-center text-muted-foreground">
            <p>Comments section coming soon...</p>
         </div>

      </div>
    </div>
  );
}
