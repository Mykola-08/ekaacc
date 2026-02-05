'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { createPost } from '@/server/community/actions';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

// Submit button component to handle loading state
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className={cn(
        "rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
      )}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
          />
          Posting...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Post to Community <Send className="w-4 h-4 ml-1" />
        </span>
      )}
    </Button>
  );
}

interface CreatePostProps {
  userId: string;
}

export function CreatePost({ userId }: CreatePostProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between pb-6 border-b border-border"
      >
        <Link 
          href="/community" 
          className="group flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Button variant="ghost" size="icon" className="rounded-full mr-2">
             <ArrowLeft className="w-4 h-4" />
          </Button>
          Back to Community
        </Link>
        <div className="text-sm font-medium text-muted-foreground">Draft</div>
      </motion.div>

      <main className="max-w-2xl mx-auto w-full py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-center md:text-left"
        >
          <h1 className="text-3xl font-serif text-foreground mb-2">Create New Post</h1>
          <p className="text-muted-foreground">Share your thoughts, questions, or success stories.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8">
            <form action={createPost} className="space-y-8">
                <input type="hidden" name="userId" value={userId} />

                <div className="space-y-4">
                <Label htmlFor="title" className="text-base font-medium">Title</Label>
                <Input 
                    id="title" 
                    name="title" 
                    required 
                    placeholder="What's on your mind?" 
                    className="h-14 text-lg"
                />
                </div>

                <div className="space-y-4">
                <Label htmlFor="category" className="text-base font-medium">Category</Label>
                <div className="relative">
                    <select 
                    id="category" 
                    name="category"
                    className={cn(
                        "flex h-14 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        "appearance-none"
                    )}
                    >
                    <option value="general">General</option>
                    <option value="question">Question</option>
                    <option value="success_story">Success Story</option>
                    <option value="tips">Tips & Advice</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    </div>
                </div>
                </div>

                <div className="space-y-4">
                <Label htmlFor="content" className="text-base font-medium">Content</Label>
                <Textarea 
                    id="content" 
                    name="content" 
                    required 
                    placeholder="Share the details..." 
                    className="min-h-[250px] text-base leading-relaxed resize-none p-5"
                />
                </div>

                <div className="pt-4 flex items-center gap-4">
                <SubmitButton />
                <Button type="button" variant="ghost" asChild className="rounded-full px-6 py-6 h-auto">
                    <Link href="/community">Cancel</Link>
                </Button>
                </div>
            </form>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
