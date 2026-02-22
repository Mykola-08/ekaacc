'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MessageCircle, Heart, Share2, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function CommunityFeed({ channelId, posts }: any) {
  return (
    <div className="flex-1 flex flex-col h-full bg-muted/10">
      {/* Feed Header */}
      <div className="h-16 border-b flex items-center px-6 bg-card sticky top-0 z-10">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          # {channelId === 'general' ? 'General' : 'Channel'}
          <Badge variant="outline" className="ml-2 font-normal text-xs">24 Members</Badge>
        </h2>
      </div>

      {/* Feed Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Create Post */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex gap-4">
              <Avatar>
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <Textarea placeholder="Share something with the community..." className="min-h-[100px] border-none focus-visible:ring-0 resize-none p-0 text-base" />
            </div>
          </CardContent>
          <CardFooter className="border-t py-3 bg-muted/20 flex justify-between">
            <div className="text-xs text-muted-foreground">Markdown supported</div>
            <Button size="sm">Post</Button>
          </CardFooter>
        </Card>

        {/* Posts */}
        {posts?.map((post: any) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
              <Avatar>
                <AvatarFallback>{post.author?.full_name?.[0] || '?'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm">{post.author?.full_name}</h3>
                    <p className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreHorizontal className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <h4 className="font-bold text-lg mb-2">{post.title}</h4>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </CardContent>
            <CardFooter className="border-t py-2 bg-muted/10 flex gap-4">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                <Heart className="w-4 h-4" /> {post.likes || 0}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                <MessageCircle className="w-4 h-4" /> {post.replies_count || 0}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground ml-auto">
                <Share2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
