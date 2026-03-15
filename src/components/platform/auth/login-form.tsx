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
        // Check if MFA is required
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
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn('mx-auto flex w-full max-w-100 flex-col gap-6', className)}
      {...props}
    >
      <Card className="border-border/20 bg-card/70 relative overflow-hidden rounded-lg border backdrop-blur-2xl">
        <CardContent className="relative p-8 md:p-10">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Header */}
            <div
              className="mb-4 flex flex-col items-center gap-4 text-center"
            >
              <div className="relative mb-2">
                <div className="border-border/10 bg-card relative overflow-hidden rounded-lg border p-1">
                  <Image
                    src="/images/eka_logo.png"
                    alt="EKA Balance"
                    width={56}
                    height={56}
                    className="h-14 w-14 object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="">
                <h1 className="text-foreground text-2xl font-semibold tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-muted-foreground text-sm">Sign in to your account</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="">
              <div
                className=".5"
              >
                <Label htmlFor="email" className="text-foreground text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-input bg-muted/50 focus:border-primary focus:bg-background focus:ring-primary/10 h-12 rounded-xl px-4 text-base transition-all focus:ring-4"
                  />
                </div>
              </div>

              <div
                className=".5"
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-input bg-muted/50 focus:border-primary focus:bg-background focus:ring-primary/10 h-12 rounded-xl px-4 text-base transition-all focus:ring-4"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            
              {error && (
                <div
                  className="bg-destructive/10 text-destructive rounded-xl px-4 py-3 text-center text-sm font-medium"
                >
                  {error}
                </div>
              )}
            

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full rounded-full text-sm font-semibold transition-all hover:shadow active:scale-[0.98] disabled:opacity-70"
                disabled={loading}
              >
                {loading ? <HugeiconsIcon icon={Loading03Icon} className="size-5 animate-spin"  /> : 'Sign In'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Sign Up Link */}
      <div
        className="text-center"
      >
        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{' '}
          <Link
            href={nextUrl ? `/signup?next=${encodeURIComponent(nextUrl)}` : '/signup'}
            className="text-primary font-medium hover:underline"
          >
            Sign up now
          </Link>
        </p>
      </div>

      <div
        className="mt-6 text-center"
      >
        <p className="text-muted-foreground px-4 text-xs">
          By logging in, you agree to our{' '}
          <Link href="/legal/terms" className="hover:text-foreground :text-foreground underline">
            Terms of Service
          </Link>
          ,{' '}
          <Link href="/legal/privacy" className="hover:text-foreground :text-foreground underline">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link
            href="/legal/cookie-policy"
            className="hover:text-foreground :text-foreground underline"
          >
            Cookie Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
