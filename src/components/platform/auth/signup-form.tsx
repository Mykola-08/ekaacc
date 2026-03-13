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
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { fadeInUpLarge, scaleIn, fadeInLeft, fadeInUpSmall, fadeIn, withDelay } from '@/lib/motion';

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
      form.setError('root', {
        message: error.message,
      });
    } else {
      onSuccess?.();
    }
  }

  return (
    <motion.div
      variants={fadeInUpLarge}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-120"
    >
      <Card className="border-border/20 bg-card/70 relative overflow-hidden rounded-3xl border shadow-sm backdrop-blur-2xl">
        <CardContent className="relative p-8 md:p-10">
          {/* Header */}
          <motion.div
            variants={withDelay(scaleIn, 0.1)}
            initial="hidden"
            animate="visible"
            className="mb-8 flex flex-col items-center gap-4 text-center"
          >
            <div className="relative mb-2">
              <div className="border-border/10 bg-card relative overflow-hidden rounded-2xl border p-1 shadow-sm">
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
                Create Account
              </h1>
              <p className="text-muted-foreground text-sm">Join EKA Balance today</p>
            </div>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              {/* Full Name & Username */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <motion.div
                  variants={withDelay(fadeInLeft, 0.2)}
                  initial="hidden"
                  animate="visible"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className=".5">
                        <FormLabel className="text-foreground text-sm font-medium">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            autoComplete="name"
                            className="border-input bg-muted/50 focus:border-primary focus:bg-background focus:ring-primary/10 h-11 rounded-md px-4 text-base transition-all focus:ring-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  variants={withDelay(fadeInLeft, 0.25)}
                  initial="hidden"
                  animate="visible"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className=".5">
                        <FormLabel className="text-foreground text-sm font-medium">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="johndoe"
                            autoComplete="username"
                            className="border-input bg-muted/50 focus:border-primary focus:bg-background focus:ring-primary/10 h-11 rounded-md px-4 text-base transition-all focus:ring-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              <motion.div variants={withDelay(fadeInLeft, 0.3)} initial="hidden" animate="visible">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className=".5">
                      <FormLabel className="text-foreground text-sm font-medium">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          autoComplete="email"
                          className="border-input bg-muted/50 focus:border-primary focus:bg-background focus:ring-primary/10 h-11 rounded-md px-4 text-base transition-all focus:ring-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <motion.div
                  variants={withDelay(fadeInLeft, 0.35)}
                  initial="hidden"
                  animate="visible"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className=".5">
                        <FormLabel className="text-foreground text-sm font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            className="border-input bg-muted/50 focus:border-primary focus:bg-background focus:ring-primary/10 h-11 rounded-md px-4 text-base transition-all focus:ring-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  variants={withDelay(fadeInLeft, 0.4)}
                  initial="hidden"
                  animate="visible"
                >
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className=".5">
                        <FormLabel className="text-foreground text-sm font-medium">
                          Confirm
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            className="border-input bg-muted/50 focus:border-primary focus:bg-background focus:ring-primary/10 h-11 rounded-md px-4 text-base transition-all focus:ring-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              {/* Referral Code */}
              <motion.div variants={withDelay(fadeInLeft, 0.42)} initial="hidden" animate="visible">
                <FormField
                  control={form.control}
                  name="referralCode"
                  render={({ field }) => (
                    <FormItem className=".5">
                      <FormLabel className="text-foreground text-sm font-medium">
                        Referral Code{' '}
                        <span className="text-muted-foreground font-normal">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ABCD1234"
                          className="border-input bg-muted/50 focus:border-primary focus:bg-background focus:ring-primary/10 h-11 rounded-md px-4 font-mono text-base tracking-wider uppercase transition-all focus:ring-4"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Have a friend&apos;s referral code? Enter it to earn rewards.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <AnimatePresence mode="wait">
                {form.formState.errors.root && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FormMessage className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-center text-sm font-medium">
                      {form.formState.errors.root.message}
                    </FormMessage>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                variants={withDelay(fadeInUpSmall, 0.45)}
                initial="hidden"
                animate="visible"
                className="pt-2"
              >
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full rounded-full text-sm font-semibold shadow-sm transition-all hover:shadow active:scale-[0.98] disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
                </Button>
              </motion.div>
            </form>
          </Form>

          <motion.div
            variants={withDelay(fadeIn, 0.5)}
            initial="hidden"
            animate="visible"
            className="mt-6 text-center"
          >
            <p className="text-muted-foreground text-sm">
              Already have an account?{' '}
              <Link
                href={nextUrl ? `/login?next=${encodeURIComponent(nextUrl)}` : '/login'}
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </CardContent>
      </Card>

      {/* Footer / Terms */}
      <motion.div
        variants={withDelay(fadeIn, 0.6)}
        initial="hidden"
        animate="visible"
        className="mt-6 text-center"
      >
        <p className="text-muted-foreground px-4 text-xs">
          By creating an account, you agree to our{' '}
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
      </motion.div>
    </motion.div>
  );
}
