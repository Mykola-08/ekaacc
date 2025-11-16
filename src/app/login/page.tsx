'use client';

;
;
;
;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Tabs, TabsContent, TabsItem, TabsList } from '@/components/keep';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
;
import { useAuth } from '@/context/auth-context';
import { Sparkles, Mail, Lock, User, Package2, Chrome, Linkedin, Twitter, ArrowRight, Heart, Brain, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

function LoginForm() {
  const { signIn, signInWithOAuth } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      router.push('/home');
    } catch (error: any) {
      let errorMessage = 'An unknown error occurred.';
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please try again.';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'Incorrect email or password.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          default:
            errorMessage = 'Login failed. Please try again.';
        }
      }
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await signInWithOAuth('google');
    } catch (error) {
      // Error is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInSignup = async () => {
    setIsLoading(true);
    try {
      await signInWithOAuth('linkedin');
    } catch (error) {
      // Error is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwitterSignup = async () => {
    setIsLoading(true);
    try {
      await signInWithOAuth('twitter');
    } catch (error) {
      // Error is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithOAuth('google');
    } catch (error) {
      // Error is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithOAuth('linkedin');
    } catch (error) {
      // Error is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwitterLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithOAuth('twitter');
    } catch (error) {
      // Error is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <Input
              id="login-email" 
              type="email" 
              placeholder="Enter your email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-12 px-4 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                Forgot password?
              </a>
            </div>
            <Input
              id="login-password" 
              type="password" 
              placeholder="Enter your password" 
              required
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="h-12 px-4 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Signing in...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </Button>
      </form>
      
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-gray-900 px-4 text-gray-500 dark:text-gray-400 font-medium">
            Or continue with
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-center gap-3">
            <Chrome className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Continue with Google</span>
          </div>
        </Button>
        <Button
          variant="outline"
          onClick={handleLinkedInLogin}
          disabled={isLoading}
          className="w-full h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-center gap-3">
            <Linkedin className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Continue with LinkedIn</span>
          </div>
        </Button>
        <Button
          variant="outline"
          onClick={handleTwitterLogin}
          disabled={isLoading}
          className="w-full h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-center gap-3">
            <Twitter className="h-5 w-5 text-black" />
            <span className="font-medium">Continue with X</span>
          </div>
        </Button>
      </div>
    </motion.div>
  );
}

function SignupForm() {
  const { toast } = useToast();
  const { signUp, signInWithOAuth } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Passwords do not match' });
      return;
    }
    if (password.length < 6) {
      toast({ variant: 'destructive', title: 'Password too short', description: 'Must be at least 6 characters.' });
      return;
    }
    
    setIsLoading(true);
    try {
      await signUp(email, password, { displayName: name });
      
      toast({
        title: '🎉 Account created!',
        description: 'Welcome to EKA! Redirecting...',
      });
      
      setTimeout(() => router.push('/home'), 1000);
      
    } catch (error: any) {
      let errorMessage = 'An unknown error occurred.';
      if (error.message) {
        errorMessage = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSignup} className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </Label>
            <Input
              id="signup-name" 
              type="text" 
              placeholder="Enter your full name" 
              required
              value={name} 
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="h-12 px-4 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <Input
              id="signup-email" 
              type="email" 
              placeholder="Enter your email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-12 px-4 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </Label>
            <Input
              id="signup-password" 
              type="password" 
              placeholder="Create a password" 
              required
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="h-12 px-4 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-confirm-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </Label>
            <Input
              id="signup-confirm-password" 
              type="password" 
              placeholder="Confirm your password" 
              required
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="h-12 px-4 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating account...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </Button>
      </form>
      
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-gray-900 px-4 text-gray-500 dark:text-gray-400 font-medium">
            Or sign up with
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <Button
          variant="outline"
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-center gap-3">
            <Chrome className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Continue with Google</span>
          </div>
        </Button>
        <Button
          variant="outline"
          onClick={handleLinkedInSignup}
          disabled={isLoading}
          className="w-full h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-center gap-3">
            <Linkedin className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Continue with LinkedIn</span>
          </div>
        </Button>
        <Button
          variant="outline"
          onClick={handleTwitterSignup}
          disabled={isLoading}
          className="w-full h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-center gap-3">
            <Twitter className="h-5 w-5 text-black" />
            <span className="font-medium">Continue with X</span>
          </div>
        </Button>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [defaultTab, setDefaultTab] = useState('login');

  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [user, router]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup') {
      setDefaultTab('signup');
    }
  }, [searchParams]);

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 lg:flex flex-col items-center justify-center p-12 text-center relative overflow-hidden dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-100/20 to-pink-100/20 dark:from-blue-800/10 dark:via-purple-800/10 dark:to-pink-800/10"></div>
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl">
              <Brain className="h-10 w-10" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Transform Your Mind
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto leading-relaxed">
              Join thousands on their journey to better mental health with personalized insights and AI-powered wellness tools.
            </p>
          </motion.div>
          
          <motion.div 
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-blue-500 mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Mental Wellness</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Track your mood and build healthy habits</p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Safe & Secure</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Your privacy is our top priority</p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-500 mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Powered</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Personalized insights just for you</p>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <div className="mx-auto w-full max-w-md">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <Brain className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Sign in to continue your wellness journey
            </p>
          </motion.div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-8">
                <TabsItem value="login" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm transition-all">
                  Sign In
                </TabsItem>
                <TabsItem value="signup" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm transition-all">
                  Sign Up
                </TabsItem>
              </TabsList>
              <TabsContent value="login" className="mt-0">
                <LoginForm />
              </TabsContent>
              <TabsContent value="signup" className="mt-0">
                <SignupForm />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By continuing, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
