import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function LogoutPage() {
  return (
    <div className="auth-page">
      <div className="auth-page-gradient" />
      <Card className="relative z-10 w-full max-w-md rounded-3xl border-border/20 bg-card/70 text-center shadow-md backdrop-blur-2xl">
        <CardHeader className="flex flex-col items-center space-y-4 pb-2">
          <div className="rounded-2xl border border-border/10 bg-card p-1 shadow-sm">
            <Image
              src="/images/eka_logo.png"
              alt="EKA Balance"
              width={56}
              height={56}
              priority
              className="rounded-xl"
            />
          </div>
          <div className="rounded-full bg-success/20 p-2">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-semibold tracking-tight">Signed Out</CardTitle>
            <CardDescription className="text-base">
              You have been successfully signed out of your account.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <p className="text-muted-foreground text-sm">
            Thank you for using EKA Balance. Your session has been securely
            terminated.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="auth-submit-btn" size="lg">
            <Link href="/api/auth/login">Sign In Again</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="https://ekabalance.com">Return to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
