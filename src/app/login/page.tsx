'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth, initiateEmailSignIn, initiateEmailSignUp, initiateAnonymousSignIn, initiateGoogleSignIn } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="24px"
        height="24px"
        {...props}
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        />
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.138,44,30.025,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        />
      </svg>
    );
  }

export default function LoginPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
        if(isSigningUp) {
            initiateEmailSignUp(auth, values.email, values.password);
        } else {
            initiateEmailSignIn(auth, values.email, values.password);
        }
        
        // Non-blocking, onAuthStateChanged will handle redirect
        toast({
            title: isSigningUp ? "Creating account..." : "Signing in...",
            description: "You will be redirected shortly."
        });

        // Simple way to wait for auth state change
        setTimeout(() => {
            router.push(searchParams.get('redirect') || '/home');
        }, 2000)

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Authentication failed",
            description: error.message || "Please check your credentials and try again."
        });
        setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    initiateGoogleSignIn(auth);
     toast({
        title: "Redirecting to Google...",
        description: "You will be redirected shortly."
    });
     setTimeout(() => {
        router.push(searchParams.get('redirect') || '/home');
    }, 2000)
  }

  const handleAnonymousSignIn = () => {
    setIsLoading(true);
    initiateAnonymousSignIn(auth);
    toast({
        title: "Signing in anonymously...",
        description: "You will be redirected shortly."
    });
    setTimeout(() => {
        router.push(searchParams.get('redirect') || '/home');
    }, 2000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{isSigningUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
          <CardDescription>
            {isSigningUp ? 'Enter your details to get started.' : 'Sign in to access your EKA account.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSigningUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>
          </Form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
            
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2" />}
                Google
            </Button>

            <Button variant="outline" onClick={handleAnonymousSignIn} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Anonymous
            </Button>
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isSigningUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsSigningUp(!isSigningUp)} className="underline hover:text-primary">
              {isSigningUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

