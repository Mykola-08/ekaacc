import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { getPosts, Post } from "@/server/community/actions";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
 const posts = await getPosts();

 return (
  <div className="container py-8 max-w-4xl">
   <div className="flex items-center justify-between mb-8">
    <div>
       <h1 className="text-3xl font-bold">Community Forum</h1>
       <p className="text-muted-foreground">Connect with others on the journey to balance.</p>
    </div>
    <Button asChild>
      <Link href="/community/new">New Post</Link>
    </Button>
   </div>

   <div className="space-y-4">
    {posts.length === 0 ? (
      <div className="text-center py-10 border-none rounded-[32px] bg-muted/20">
        <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
      </div>
    ) : (
      posts.map((post) => (
        <Link href={`/community/${post.id}`} key={post.id} className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                    {post.userId.substring(0,2).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold block">Member</span>
                    <span className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full uppercase tracking-wider">{post.category}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-muted-foreground line-clamp-2">
                {post.content}
              </p>
              <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-primary pl-0"><Heart className="w-4 h-4 mr-1"/> {post.likesCount}</Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-primary"><MessageSquare className="w-4 h-4 mr-1"/> Comment</Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-primary"><Share2 className="w-4 h-4 mr-1"/> Share</Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))
    )}
   </div>
  </div>
 );
}
