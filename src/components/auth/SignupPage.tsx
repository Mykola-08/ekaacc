'use client';

import { useFormStatus } from 'react-dom';
import { signup } from '@/server/auth/actions';
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
import { InlineFeedback } from '@/components/ui/inline-feedback';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Mail, Lock, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="w-full text-base font-semibold transition-all active:scale-95"
      type="submit"
      disabled={pending}
      size="lg"
    >
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
    </Button>
  );
}

export function SignupPage() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  async function clientAction(formData: FormData) {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await signup(null, formData);
      if (result.success) {
        setSuccessMessage(result.message);
      } else {
        setErrorMessage(result.message);
      }
    } catch (e) {
      setErrorMessage('An error occurred');
    }
  }

  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
      <div className="from-primary/10 via-background to-background absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))]"></div>

      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link href="/" className="mb-4">
            <div className="bg-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl shadow-sm transition-transform hover:scale-105">
              <span className="text-primary-foreground text-lg font-black italic">E</span>
            </div>
          </Link>
          <div className="space-y-1">
            <h1 className="text-foreground text-2xl font-semibold tracking-tight">Create account</h1>
            <p className="text-muted-foreground text-sm">Join EKA Balance today</p>
          </div>
        </div>

        <Card className="border-border bg-surface/50 rounded-lg border shadow-sm backdrop-blur-sm">
          <CardContent className="pt-6">
            {successMessage ? (
              <div className="flex flex-col items-center justify-center space-y-6 py-8">
                <div className="bg-success/10 rounded-full p-4">
                  <CheckCircle2 className="text-success h-10 w-10" />
                </div>
                <div className="space-y-3 text-center">
                  <h3 className="text-foreground text-xl font-semibold">Check your email</h3>
                  <p className="text-muted-foreground max-w-sm text-sm">{successMessage}</p>
                </div>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link href="/login">Return to Login</Link>
                </Button>
              </div>
            ) : (
              <form action={clientAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    placeholder="John Doe"
                    required
                    className="bg-transparent"
                  />
                </div>

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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    required
                    type="password"
                    minLength={6}
                    className="bg-transparent"
                  />
                </div>

                {errorMessage && (
                  <InlineFeedback status="error" message={errorMessage} onDismiss={() => setErrorMessage('')} />
                )}

                <SubmitButton />
              </form>
            )}
          </CardContent>

          {!successMessage && (
            <CardFooter className="border-border bg-muted/20 rounded-b-2xl border-t px-6 py-4">
              <div className="text-muted-foreground w-full text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
