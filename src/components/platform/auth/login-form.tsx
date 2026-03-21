'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSimpleAuth } from '@/hooks/platform/auth/use-simple-auth';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';
import { Eye, EyeOff } from 'lucide-react';

type LoginFormProps = React.ComponentProps<'div'> & {
  enabledProviders?: {
    google: boolean;
    x: boolean;
    linkedin: boolean;
  };
};

export function LoginForm({
  className,
  enabledProviders = { google: true, x: true, linkedin: true },
  ...props
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next');
  const { signIn, signInWithPasskey, isAuthenticated, isLoading: authLoading } = useSimpleAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (nextUrl && nextUrl.startsWith('/')) {
        router.push(nextUrl);
      } else {
        router.push('/dashboard');
      }
    }
  }, [authLoading, isAuthenticated, router, nextUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn({ email, password });
      if (error) {
        setError(error.message);
      } else {
        const supabase = createClient();
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aal && aal.currentLevel === 'aal1' && aal.nextLevel === 'aal2') {
          const mfaUrl = nextUrl
            ? `/mfa-verify?next=${encodeURIComponent(nextUrl)}`
            : '/mfa-verify';
          router.push(mfaUrl);
        } else {
          if (nextUrl && nextUrl.startsWith('/')) {
            router.push(nextUrl);
          } else {
            router.push('/dashboard');
          }
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('mx-auto flex w-full max-w-sm flex-col gap-5', className)} {...props}>
      <Card className="border-border/30 bg-card/80 overflow-hidden rounded-[var(--radius)] border shadow-lg backdrop-blur-2xl">
        <CardContent className="p-7 sm:p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Logo + header */}
            <div className="mb-2 flex flex-col items-center gap-3 text-center">
              <div className="border-border/20 bg-card rounded-[var(--radius)] border p-1.5 shadow-sm">
                <Image
                  src="/images/eka_logo.png"
                  alt="EKA Balance"
                  width={52}
                  height={52}
                  className="h-13 w-13 object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-foreground text-xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-muted-foreground mt-0.5 text-sm">Sign in to your EKA account</p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-destructive/10 text-destructive rounded-[var(--radius)] px-4 py-3 text-center text-sm font-medium">
                {error}
              </div>
            )}

            {/* Fields */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-[var(--radius)]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-primary hover:text-primary/80 text-xs font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-[var(--radius)] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="h-11 w-full rounded-full text-sm font-semibold"
              disabled={loading}
            >
              {loading ? (
                <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Sign-up link */}
      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link
          href={nextUrl ? `/signup?next=${encodeURIComponent(nextUrl)}` : '/signup'}
          className="text-primary font-semibold hover:underline"
        >
          Sign up
        </Link>
      </p>

      {/* Legal */}
      <p className="text-muted-foreground/70 px-4 text-center text-xs">
        By signing in, you agree to our{' '}
        <Link href="/legal/terms" className="hover:text-foreground underline transition-colors">
          Terms
        </Link>
        ,{' '}
        <Link href="/legal/privacy" className="hover:text-foreground underline transition-colors">
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link
          href="/legal/cookie-policy"
          className="hover:text-foreground underline transition-colors"
        >
          Cookie Policy
        </Link>
        .
      </p>
    </div>
  );
}
