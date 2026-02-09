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
    <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4 dark:bg-background">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-4 pb-2">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">Signed Out</CardTitle>
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
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full" size="lg">
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
