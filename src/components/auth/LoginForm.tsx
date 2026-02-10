'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InlineFeedback } from '@/components/ui/inline-feedback';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import { Loader2, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const { feedback, setSuccess, setError, reset } = useMorphingFeedback();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess('Welcome back!');
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 800);
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Input
            id="email"
            name="email"
            placeholder="you@example.com"
            type="email"
            required
            className="bg-muted/30 border-input/60 focus:bg-background h-11 pl-10 transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="bg-muted/30 border-input/60 focus:bg-background h-11 pl-10 transition-all"
          />
        </div>
      </div>

      <InlineFeedback status={feedback.status} message={feedback.message} onDismiss={reset} />

      <Button
        type="submit"
        className="shadow-primary/20 h-11 w-full text-base font-medium shadow-lg"
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
      </Button>
    </form>
  );
}
