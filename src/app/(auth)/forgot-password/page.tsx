'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/platform/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { toast } from '@/components/ui/morphing-toaster';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Mail, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setEmailSent(true);
        toast.success('Password reset email sent! Check your inbox.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
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
        <Card className="relative overflow-hidden rounded-3xl border border-border/20 bg-card/70 shadow-sm backdrop-blur-2xl">
          <CardContent className="relative p-8 md:p-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="mb-8 flex flex-col items-center gap-4 text-center"
            >
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl border border-border/10 bg-card p-1 shadow-sm">
                  <AnimatePresence mode="wait">
                    {emailSent ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
                        className="flex h-14 w-14 items-center justify-center"
                      >
                        <CheckCircle2 className="h-8 w-8 text-success" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="logo"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image
                          src="/images/eka_logo.png"
                          alt="EKA Balance"
                          width={56}
                          height={56}
                          className="h-14 w-14 object-contain"
                          priority
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {emailSent ? 'Check Your Email' : 'Forgot Password?'}
                </h1>
                <p className="text-muted-foreground max-w-sm text-sm font-medium">
                  {emailSent
                    ? "We've sent password reset instructions to your email"
                    : "Enter your email and we'll send you a link to reset your password"}
                </p>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {emailSent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="space-y-4"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground rounded-lg border border-border/50 bg-muted/50 p-4 text-center text-sm"
                  >
                    <p className="font-medium">
                      Click the link in the email to reset your password.
                    </p>
                    <p className="mt-2 text-xs">If you don't see it, check your spam folder.</p>
                  </motion.div>
                  <Button
                    variant="outline"
                    onClick={() => setEmailSent(false)}
                    className="border-border/50 bg-muted/20 hover:bg-muted/40 h-9 w-full rounded-lg transition-all"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Try another email
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="space-y-2"
                  >
                    <label
                      htmlFor="email"
                      className="text-foreground/90 block text-sm font-semibold"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-muted/40 border-border/50 focus:bg-background h-10 rounded-lg pl-10 transition-colors"
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <Button
                      type="submit"
                      className="auth-submit-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Send Reset Link
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center"
            >
              <Link
                href="/login"
                className="text-foreground inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:text-primary"
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
