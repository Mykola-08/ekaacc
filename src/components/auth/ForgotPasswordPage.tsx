'use client';

import { useFormStatus } from 'react-dom';
import { forgotPassword } from '@/server/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { useState } from 'react';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="w-full text-base font-semibold transition-all active:scale-95"
      type="submit"
      disabled={pending}
      size="lg"
    >
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Reset Link'}
    </Button>
  );
}

export function ForgotPasswordPage() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function clientAction(formData: FormData) {
    setErrorMessage('');
    setSuccessMessage('');

    const result = await forgotPassword(null, formData);

    if (result.success) {
      setSuccessMessage(result.message || 'Check your email');
      toast.success('Email Sent', { description: result.message });
    } else {
      setErrorMessage(result.message || 'An error occurred');
      toast.error('Error', { description: result.message });
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
            <h1 className="text-foreground text-2xl font-bold tracking-tight">Forgot Password</h1>
            <p className="text-muted-foreground text-sm">
              Enter your email to receive a reset link
            </p>
          </div>
        </div>

        <Card className="border-border bg-surface/50 rounded-2xl border shadow-sm backdrop-blur-sm">
          <CardContent className="pt-6">
            {successMessage ? (
              <div className="flex flex-col items-center justify-center space-y-6 py-4">
                <div className="bg-success/10 rounded-full p-4">
                  <CheckCircle2 className="text-success h-10 w-10" />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-foreground text-lg font-semibold">Check your email</h3>
                  <p className="text-muted-foreground text-sm">{successMessage}</p>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Return to Login</Link>
                </Button>
              </div>
            ) : (
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

                {errorMessage && (
                  <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border p-3 text-sm font-medium">
                    {errorMessage}
                  </div>
                )}

                <SubmitButton />
              </form>
            )}
          </CardContent>
          <CardFooter className="border-border bg-muted/20 flex justify-center rounded-b-2xl border-t px-6 py-4">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground group flex items-center gap-2 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
