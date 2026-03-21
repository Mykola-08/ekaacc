import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LogoutPage() {
  return (
    <div className="auth-page">
      <div className="auth-page-gradient" />
      <Card className="border-border/20 bg-card/70 relative z-10 w-full max-w-md rounded-[var(--radius)] text-center backdrop-blur-2xl">
        <CardHeader className="flex flex-col items-center pb-2">
          <div className="border-border/10 bg-card rounded-[var(--radius)] border p-1">
            <Image
              src="/images/eka_logo.png"
              alt="EKA Balance"
              width={56}
              height={56}
              priority
              className="rounded-[var(--radius)]"
            />
          </div>
          <div className="bg-success/20 rounded-full p-2">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="text-success size-8" />
          </div>
          <div className="">
            <CardTitle className="text-2xl font-semibold tracking-tight">Signed Out</CardTitle>
            <CardDescription className="text-base">
              You have been successfully signed out of your account.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <p className="text-muted-foreground text-sm">
            Thank you for using EKA Balance. Your session has been securely terminated.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col">
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
