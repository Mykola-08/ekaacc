import { createPost } from "@/server/community/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewPostPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-xl font-semibold mb-4">Please log in to post</h2>
                <Button asChild>
                    <Link href="/login?next=/community/new">Login</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container max-w-2xl py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Create New Post</h1>
                <p className="text-muted-foreground">Share your thoughts with the community.</p>
            </div>
            
            <form action={createPost} className="space-y-6 border p-6 rounded-lg bg-card">
                <input type="hidden" name="userId" value={user.id} />
                
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required placeholder="What's on your mind?" />
                </div>
                
                <div className="space-y-2">
                     <Label htmlFor="category">Category</Label>
                     <select 
                        id="category" 
                        name="category" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="general">General</option>
                        <option value="question">Question</option>
                        <option value="success_story">Success Story</option>
                        <option value="tips">Tips & Advice</option>
                     </select>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                        id="content" 
                        name="content" 
                        required 
                        placeholder="Share your details..." 
                        className="min-h-[200px]" 
                    />
                </div>
                
                <div className="flex gap-4 pt-4">
                    <Button type="submit">Post to Community</Button>
                    <Button variant="outline" asChild>
                        <Link href="/community">Cancel</Link>
                    </Button>
                </div>
            </form>
        </div>
    )
}
