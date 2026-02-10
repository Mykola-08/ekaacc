'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InlineFeedback } from '@/components/ui/inline-feedback';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import { Loader2, Mail, Lock, User } from 'lucide-react';

export function SignupForm() {
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
    const fullName = formData.get('fullName') as string;

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess('Account created! Please check your email.');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <User className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Input
            id="fullName"
            name="fullName"
            placeholder="John Doe"
            required
            className="bg-muted/30 border-input/60 focus:bg-background h-11 pl-10 transition-all"
          />
        </div>
      </div>

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
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="bg-muted/30 border-input/60 focus:bg-background h-11 pl-10 transition-all"
          />
        </div>
        <p className="text-muted-foreground text-xs">Must be at least 6 characters</p>
      </div>

      <InlineFeedback status={feedback.status} message={feedback.message} onDismiss={reset} />

      <Button
        type="submit"
        className="shadow-primary/20 h-11 w-full text-base font-medium shadow-lg"
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
      </Button>
    </form>
  );
}
