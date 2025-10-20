'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Plus,
  ThumbsUp,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Post = {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  category: 'success' | 'question' | 'support' | 'general';
};

type Group = {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  isJoined: boolean;
};

export default function CommunityPage() {
  const { toast } = useToast();
  const [newPost, setNewPost] = useState('');

  // Mock data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        role: 'Member',
      },
      content: 'Just completed my 10th therapy session! The progress has been amazing. My back pain has reduced by 60%. Thank you to this wonderful community for all the support! 🎉',
      timestamp: new Date(Date.now() - 3600000),
      likes: 24,
      comments: 8,
      category: 'success',
    },
    {
      id: '2',
      author: {
        name: 'Mike Chen',
        avatar: 'https://i.pravatar.cc/150?u=mike',
        role: 'Member',
      },
      content: 'Does anyone have tips for staying motivated with daily exercises? I\'ve been struggling to maintain consistency.',
      timestamp: new Date(Date.now() - 7200000),
      likes: 12,
      comments: 15,
      category: 'question',
    },
    {
      id: '3',
      author: {
        name: 'Emma Wilson',
        avatar: 'https://i.pravatar.cc/150?u=emma',
        role: 'Therapist',
      },
      content: 'Reminder: Consistency is more important than intensity! Even 5 minutes of gentle stretching daily is better than an hour once a week. Start small and build from there. 💪',
      timestamp: new Date(Date.now() - 10800000),
      likes: 45,
      comments: 6,
      category: 'general',
    },
  ]);

  const groups: Group[] = [
    {
      id: '1',
      name: 'Back Pain Support',
      description: 'A community for those dealing with chronic back pain',
      members: 234,
      category: 'Support',
      isJoined: true,
    },
    {
      id: '2',
      name: 'Post-Surgery Recovery',
      description: 'Share experiences and tips for post-surgical rehabilitation',
      members: 156,
      category: 'Recovery',
      isJoined: false,
    },
    {
      id: '3',
      name: 'Athletes Corner',
      description: 'For athletes focusing on injury prevention and performance',
      members: 189,
      category: 'Performance',
      isJoined: true,
    },
    {
      id: '4',
      name: 'Daily Motivation',
      description: 'Share progress, wins, and encourage each other daily',
      members: 412,
      category: 'Motivation',
      isJoined: false,
    },
  ];

  const handlePost = () => {
    if (!newPost.trim()) {
      toast({
        variant: 'destructive',
        title: 'Cannot post empty content',
      });
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?u=you',
        role: 'Member',
      },
      content: newPost,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      category: 'general',
    };

    setPosts([post, ...posts]);
    setNewPost('');
    toast({
      title: 'Posted successfully!',
      description: 'Your post has been shared with the community.',
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'success':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'question':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'support':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-muted-foreground">
          Connect with others on their wellness journey
        </p>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="groups">Support Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6 mt-6">
          {/* Create Post */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Share with the community</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Share your progress, ask a question, or offer support..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    Success Story
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    Question
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    Support
                  </Badge>
                </div>
                <Button onClick={handlePost}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{post.author.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {post.author.role} • {post.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{post.content}</p>
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{group.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {group.members} members
                    </div>
                    {group.isJoined ? (
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4 mr-2 fill-current" />
                        Joined
                      </Button>
                    ) : (
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Join Group
                      </Button>
                    )}
                  </div>
                  {group.isJoined && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-muted-foreground">
                          5 new posts this week
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
