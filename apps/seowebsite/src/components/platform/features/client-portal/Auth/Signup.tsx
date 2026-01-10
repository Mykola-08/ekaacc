import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/platform/ui/button';
import { Input } from '@/components/platform/ui/input';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
const logoImage = 'https://placehold.co/400';
import { signUp } from '@/lib/platform/mobile/auth';
import { toast } from 'sonner';

interface SignupProps {
  onSignup: (userId: string, email: string, name: string) => void;
  onLogin: () => void;
}

export function Signup({ onSignup, onLogin }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const { user, error: authError } = await signUp(email, password, name);

      if (authError) {
        setError(authError);
        toast.error(authError);
        setIsLoading(false);
        return;
      }

      if (user) {
        toast.success('Account created successfully!');
        onSignup(user.id, user.email, user.name || name);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 flex items-center justify-center">
            <img 
              src={logoImage} 
              alt="EKA Balance Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-gray-900 mb-2">EKA Balance</h1>
          <p className="text-gray-500">Begin your wellness journey</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-gray-900 mb-2">Create account</h2>
          <p className="text-gray-500 mb-8">Join us for a balanced life</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="text-sm text-gray-700 mb-2 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="pl-12 h-14 rounded-2xl border-0 bg-gray-50"
                  disabled={isLoading}
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-12 h-14 rounded-2xl border-0 bg-gray-50"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-12 h-14 rounded-2xl border-0 bg-gray-50"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">At least 6 characters</p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white h-14 rounded-2xl border-0"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </span>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Already have an account?{' '}
              <button
                onClick={onLogin}
                className="text-gray-900 hover:underline"
                disabled={isLoading}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}



