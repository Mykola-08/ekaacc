"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border">
          <div className="space-y-2 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Community Forum</h1>
              <p className="text-muted-foreground text-lg">Connect with others on the journey to balance.</p>
          </div>
          <Link href="/community/new">
              <Button className="rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
              </Button>
          </Link>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-20 bg-card border-2 border-dashed border-muted rounded-3xl shadow-none">
                <MessageSquare className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">No posts yet</h3>
                <p className="text-muted-foreground">Be the first to share your thoughts.</p>
            </Card>
        ) : (
            posts.map((post, idx) => (
                <Link 
                    href={`/community/${post.id}`} 
                    key={post.id} 
                    className="group block"       
                >
                    <Card className="p-6 md:p-8 bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden rounded-2xl">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Avatar Placeholder */}
                            <div className="shrink-0">
                                <div className="w-12 h-12 rounded-full bg-card text-foreground flex items-center justify-center text-lg font-black border border-muted">
                                    {post.userId ? post.userId.substring(0,1).toUpperCase() : 'U'}
                                </div>
                            </div>
                            
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    <Badge variant="secondary" className="font-normal">
                                        {post.category || 'General'}
                                    </Badge>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                                </div>

                                <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                                    {post.title}
                                </h3>
                                
                                <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                                    {post.content}
                                </p>

                                <div className="flex items-center gap-6 text-muted-foreground text-sm">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        <span>{post.comments || 0} Comments</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end md:justify-center">
                                <Button size="icon" variant="ghost" className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    <ArrowRight className="w-4 h-4" />
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

