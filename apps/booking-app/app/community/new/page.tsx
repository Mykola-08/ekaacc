import { CreatePost } from '@/components/community/CreatePost';
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from 'next/navigation';
import { Card } from "@/components/ui/card";

export const metadata = {
  title: 'Create Post - Community',
  description: 'Share your thoughts with the community',
};

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center space-y-6">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto text-2xl">
            🔒
          </div>
          <div>
            <h2 className="text-xl font-medium mb-2 text-foreground">Login Required</h2>
            <p className="text-muted-foreground">Please log in to share with the community.</p>
          </div>
          <Button asChild className="rounded-full w-full py-6 text-base shadow-md">
            <Link href="/login?next=/community/new">Login to Continue</Link>
          </Button>
          <div className="text-sm">
            <Link href="/community" className="text-muted-foreground hover:text-foreground">
              ← Back to Community
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return <CreatePost userId={user.id} />;
}

