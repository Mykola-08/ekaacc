'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, initiateAnonymousSignIn, initiateGoogleSignIn, signInWithEmailAndPassword } from '@/firebase';
import { useUserContext } from '@/context/user-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Package2, VenetianMask } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const auth = useAuth();
  const { currentUser } = useUserContext();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (currentUser) {
      router.push('/home');
    }
  }, [currentUser, router]);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (auth) {
        signInWithEmailAndPassword(auth, email, password);
    }
  };
  
  const handleAnonymousLogin = () => {
    initiateAnonymousSignIn(auth);
  };

  const handleGoogleLogin = () => {
    initiateGoogleSignIn(auth);
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
            <Package2 className="mx-auto h-8 w-8 text-primary" />
          <CardTitle className="text-2xl">Welcome to EKA</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full" type="button" onClick={handleGoogleLogin}>
              Login with Google
            </Button>
          </form>
           <Separator className="my-6" />
           <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Or sign in directly for testing</p>
                <Button variant="secondary" className="w-full" onClick={handleAnonymousLogin}>
                    <VenetianMask className="mr-2 h-4 w-4"/>
                    Sign in Anonymously
                </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
