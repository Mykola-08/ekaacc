'use client';

import { useFormStatus } from 'react-dom';
import { login } from '@/server/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Mail, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="w-full text-base font-semibold transition-all active:scale-95"
      type="submit"
      disabled={pending}
      size="lg"
    >
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
    </Button>
  );
}

export function LoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  async function clientAction(formData: FormData) {
    setErrorMessage('');

    const result = await login(null, formData);
    if (result?.success) {
      toast.success('Welcome back!');
      router.push('/dashboard');
      return;
    }

    if (result && !result.success) {
      setErrorMessage(result.message || 'An error occurred');
      toast.error('Login Failed', { description: result.message });
    }
  }

  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
      <div className="from-primary/10 via-background to-background absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]"></div>

      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link href="/" className="mb-4">
            <div className="bg-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl shadow-sm transition-transform hover:scale-105">
              <span className="text-primary-foreground text-lg font-black italic">E</span>
            </div>
          </Link>
          <div className="space-y-1">
            <h1 className="text-foreground text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to access your account
            </p>
          </div>
        </div>

        <Card className="border-border bg-surface/50 rounded-2xl border shadow-sm backdrop-blur-sm">
          <CardContent className="pt-6">
            <form action={clientAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  type="email"
                  className="bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-primary text-xs font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  required
                  type="password"
                  className="bg-transparent"
                />
              </div>

              {errorMessage && (
                <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border p-3 text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              <SubmitButton />
            </form>
          </CardContent>
          <CardFooter className="border-border bg-muted/20 rounded-b-2xl border-t px-6 py-4">
            <div className="text-muted-foreground w-full text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary font-semibold hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
