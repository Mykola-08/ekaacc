'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useSimpleAuth } from '@/hooks/platform/auth/use-simple-auth';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';

const signUpSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
      .optional(),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  planId?: string;
}

export function SignUpForm({ onSuccess, onError, planId }: SignUpFormProps) {
  const { signUp, isLoading, isAuthenticated } = useSimpleAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const refCode = searchParams.get('ref') || '';
  const nextUrl = searchParams.get('next');

  useEffect(() => {
    if (isAuthenticated) {
      if (nextUrl && nextUrl.startsWith('/')) {
        router.push(nextUrl);
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, router, nextUrl]);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      referralCode: refCode,
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    const { error } = await signUp({
      email: values.email,
      password: values.password,
      fullName: values.fullName,
      username: values.username,
      planId: planId,
    });

    if (error) {
      onError?.(error.message);
      form.setError('root', { message: error.message });
    } else {
      onSuccess?.();
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <Card className="overflow-hidden rounded-2xl border border-border/30 bg-card/80 shadow-lg backdrop-blur-2xl">
        <CardContent className="p-7 sm:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <div className="rounded-xl border border-border/20 bg-card p-1.5 shadow-sm">
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
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Create your account
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Join EKA Balance today
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              {/* Full Name & Username */}
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jane Smith"
                          autoComplete="name"
                          className="h-10 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-medium">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="janesmith"
                          autoComplete="username"
                          className="h-10 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        autoComplete="email"
                        className="h-10 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-medium">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="h-10 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-medium">Confirm</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="h-10 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="referralCode"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-medium">
                      Referral Code{' '}
                      <span className="font-normal text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ABCD1234"
                        className="h-10 rounded-xl font-mono tracking-wider uppercase"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Have a referral code? Enter it to earn rewards.
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <div className="rounded-xl bg-destructive/10 px-4 py-3 text-center text-sm font-medium text-destructive">
                  {form.formState.errors.root.message}
                </div>
              )}

              <div className="pt-1">
                <Button
                  type="submit"
                  className="h-11 w-full rounded-full text-sm font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href={nextUrl ? `/login?next=${encodeURIComponent(nextUrl)}` : '/login'}
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>

      <p className="mt-4 px-4 text-center text-xs text-muted-foreground/70">
        By creating an account, you agree to our{' '}
        <Link href="/legal/terms" className="underline hover:text-foreground transition-colors">
          Terms
        </Link>
        ,{' '}
        <Link href="/legal/privacy" className="underline hover:text-foreground transition-colors">
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link
          href="/legal/cookie-policy"
          className="underline hover:text-foreground transition-colors"
        >
          Cookie Policy
        </Link>
        .
      </p>
    </div>
  );
}
