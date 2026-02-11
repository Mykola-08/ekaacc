'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSimpleAuth } from '@/hooks/platform/auth/use-simple-auth';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { fadeInUpLarge, scaleIn, fadeInLeft, fadeInUpSmall, fadeIn, withDelay } from '@/lib/motion';

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
 const { signIn, signInWithPasskey, isAuthenticated, isLoading: authLoading } = useSimpleAuth();
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
 if (!authLoading && isAuthenticated) {
 router.push('/dashboard');
 }
 }, [authLoading, isAuthenticated, router]);

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
 router.push('/mfa-verify');
 } else {
 router.push('/dashboard');
 }
 }
 } catch (err) {
 setError('An unexpected error occurred');
 } finally {
 setLoading(false);
 }
 };

 return (
 <motion.div
 variants={fadeInUpLarge}
 initial="hidden"
 animate="visible"
 className={cn('mx-auto flex w-full max-w-100 flex-col gap-6', className)}
 {...props}
 >
 <Card className="relative overflow-hidden rounded-3xl border border-border/20 bg-card/70 shadow-sm backdrop-blur-2xl ">
 <CardContent className="relative p-8 md:p-10">
 <form onSubmit={handleLogin} className="flex flex-col gap-5">
 {/* Header */}
 <motion.div
 variants={withDelay(scaleIn, 0.1)}
 initial="hidden"
 animate="visible"
 className="mb-4 flex flex-col items-center gap-4 text-center"
 >
 <div className="relative mb-2">
 <div className="relative overflow-hidden rounded-2xl border border-border/10 bg-card p-1 shadow-sm">
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
 <div className="space-y-1">
 <h1 className="text-2xl font-semibold tracking-tight text-foreground">
 Welcome Back
 </h1>
 <p className="text-sm text-muted-foreground">
 Sign in to your account
 </p>
 </div>
 </motion.div>

 {/* Form Fields */}
 <div className="space-y-5">
 <motion.div
 variants={withDelay(fadeInLeft, 0.2)}
 initial="hidden"
 animate="visible"
 className="space-y-1.5"
 >
 <Label
 htmlFor="email"
 className="text-sm font-medium text-foreground"
 >
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
 className="h-12 rounded-md border-input bg-muted/50 px-4 text-base transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 "
 />
 </div>
 </motion.div>

 <motion.div
 variants={withDelay(fadeInLeft, 0.3)}
 initial="hidden"
 animate="visible"
 className="space-y-1.5"
 >
 <div className="flex items-center justify-between">
 <Label htmlFor="password" className="text-sm font-medium text-foreground">
 Password
 </Label>
 <Link
 href="/forgot-password"
 className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
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
 className="h-12 rounded-md border-input bg-muted/50 px-4 text-base transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 "
 />
 </div>
 </motion.div>
 </div>

 {/* Error Message */}
 <AnimatePresence mode="wait">
 {error && (
 <motion.div
 initial={{ opacity: 0, height: 0, marginTop: 0 }}
 animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
 exit={{ opacity: 0, height: 0, marginTop: 0 }}
 transition={{ duration: 0.2 }}
 className="rounded-md bg-destructive/10 px-4 py-3 text-center text-sm font-medium text-destructive dark:bg-destructive/10 dark:text-destructive"
 >
 {error}
 </motion.div>
 )}
 </AnimatePresence>

 {/* Submit Button */}
 <motion.div
 variants={withDelay(fadeInUpSmall, 0.4)}
 initial="hidden"
 animate="visible"
 >
 <Button
 type="submit"
 className="h-12 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow active:scale-[0.98] disabled:opacity-70"
 disabled={loading}
 >
 {loading ? (
 <Loader2 className="h-5 w-5 animate-spin" />
 ) : (
 'Sign In'
 )}
 </Button>
 </motion.div>
 </form>
 </CardContent>
 </Card>

 {/* Sign Up Link */}
 <motion.div
 variants={withDelay(fadeIn, 0.5)}
 initial="hidden"
 animate="visible"
 className="text-center"
 >
 <p className="text-sm text-muted-foreground">
 Don&apos;t have an account?{' '}
 <Link
 href="/signup"
 className="font-medium text-primary hover:underline"
 >
 Sign up now
 </Link>
 </p>
 </motion.div>

      <motion.div
        variants={withDelay(fadeIn, 0.6)}
        initial="hidden"
        animate="visible"
        className="mt-6 text-center"
      >
        <p className="text-xs text-muted-foreground px-4">
          By logging in, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-foreground dark:hover:text-foreground">Terms of Service</Link>
          ,{' '}
          <Link href="/privacy" className="underline hover:text-foreground dark:hover:text-foreground">Privacy Policy</Link>
          {' '}and{' '}
          <Link href="/cookie-policy" className="underline hover:text-foreground dark:hover:text-foreground">Cookie Policy</Link>.
        </p>
      </motion.div>
    </motion.div>
  );
}
