'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash parameters from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        if (error) {
          throw new Error(errorDescription || error);
        }

        if (accessToken && refreshToken) {
          // Exchange the code for a session
          const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(
            window.location.origin + window.location.pathname + window.location.search
          );

          if (sessionError) {
            throw sessionError;
          }

          if (data.user) {
            toast({
              title: 'Success!',
              description: 'You have been successfully logged in.',
            });
            
            // Redirect to home page
            router.push('/home');
            return;
          }
        }

        // If no access token, check if user is already logged in
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          toast({
            title: 'Success!',
            description: 'You have been successfully logged in.',
          });
          router.push('/home');
        } else {
          throw new Error('Authentication failed. Please try again.');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        toast({
          title: 'Authentication Failed',
          description: error.message || 'Unable to complete authentication.',
          variant: 'destructive',
        });
        router.push('/login');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [router, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Completing Authentication</CardTitle>
          <CardDescription>
            Please wait while we complete your login process...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isProcessing ? 'Processing your login...' : 'Redirecting...'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}