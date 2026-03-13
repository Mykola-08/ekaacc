'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/platform/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { toast } from '@/components/ui/morphing-toaster';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import { InlineFeedback } from '@/components/ui/inline-feedback';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Lock, CheckCircle2, ArrowLeft, Sparkles, Shield } from 'lucide-react';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const { feedback, setSuccess, setError, setWarning, reset } = useMorphingFeedback();

  useEffect(() => {
    // Check if we have a valid session for password reset
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      } else {
        setWarning('Invalid or expired reset link');
        setTimeout(() => router.push('/forgot-password'), 2000);
      }
      setIsCheckingSession(false);
    };
    checkSession();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Password updated successfully!');
        // Sign out and redirect to login
        await supabase.auth.signOut();
        setTimeout(() => router.push('/login?message=password_updated'), 1500);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  if (isCheckingSession || !isValidSession) {
    return (
      <div className="auth-page">
        <div className="auth-page-gradient" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10"
        >
          <Card className="border-border/20 bg-card/70 relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border shadow-sm backdrop-blur-2xl">
            <CardContent className="p-10">
              <div className="flex flex-col items-center gap-4 text-center">
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
                <h2 className="text-foreground text-2xl font-semibold">
                  {isCheckingSession ? 'Verifying...' : 'Redirecting...'}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {isCheckingSession
                    ? 'Please wait while we verify your reset link'
                    : 'Taking you to password reset'}
                </p>
                <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-page-gradient" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 mx-auto w-full max-w-md"
      >
        <Card className="border-border/20 bg-card/70 relative overflow-hidden rounded-3xl border shadow-sm backdrop-blur-2xl">
          <CardContent className="relative p-8 md:p-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="mb-8 flex flex-col items-center gap-4 text-center"
            >
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
              <div className="">
                <h1 className="text-foreground text-2xl font-semibold tracking-tight">
                  Reset Password
                </h1>
                <p className="text-muted-foreground text-sm font-medium">
                  Enter your new password below
                </p>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className=""
              >
                <label
                  htmlFor="password"
                  className="text-foreground/90 block text-sm font-semibold"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="bg-muted/40 border-border/50 focus:bg-background h-10 rounded-lg pl-10 transition-colors"
                  />
                </div>
                <p className="text-muted-foreground text-xs font-medium">
                  Must be at least 6 characters
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className=""
              >
                <label
                  htmlFor="confirmPassword"
                  className="text-foreground/90 block text-sm font-semibold"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <CheckCircle2 className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="bg-muted/40 border-border/50 focus:bg-background h-10 rounded-lg pl-10 transition-colors"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="pt-2"
              >
                <InlineFeedback
                  status={feedback.status}
                  message={feedback.message}
                  onDismiss={reset}
                />
                <Button type="submit" className="auth-submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Update Password
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <Link
                href="/login"
                className="text-foreground hover:text-primary inline-flex items-center gap-1 text-sm font-semibold transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Sign In
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
