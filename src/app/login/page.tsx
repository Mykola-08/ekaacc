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
import { useData } from '@/context/unified-data-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Package2, UserCircle, Stethoscope } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { currentUser, login, dataSource } = useData();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      router.push('/home');
    }
  }, [currentUser, router]);

  const handleLogin = async (loginFn: () => Promise<any>) => {
    setIsLoading(true);
    try {
      await loginFn();
      router.push('/home');
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(() => login(email, password));
  };
  
  const handlePatientLogin = () => {
    handleLogin(() => login('demo@eka.com', 'password'));
  };

  const handleTherapistLogin = () => {
    handleLogin(() => login('therapist@eka.com', 'password'));
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
          <Package2 className="mx-auto h-8 w-8 text-primary" />
          <CardTitle className="text-2xl">Welcome to EKA</CardTitle>
          <CardDescription>
            Enter your credentials or use quick login
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <Separator className="my-6" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">Quick Demo Login</p>
            <div className="grid gap-2">
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={handlePatientLogin} 
                disabled={isLoading}
              >
                <UserCircle className="mr-2 h-4 w-4"/>
                Login as Patient
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleTherapistLogin} 
                disabled={isLoading}
              >
                <Stethoscope className="mr-2 h-4 w-4"/>
                Login as Therapist
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Mock data - no server required
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
