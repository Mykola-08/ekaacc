import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
const logoImage = 'https://placehold.co/400';
import { signIn } from '@/lib/auth';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (userId: string, email: string, name: string) => void;
  onSignup: () => void;
}

export function Login({ onLogin, onSignup }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const { user, error: authError } = await signIn(email, password);

      if (authError) {
        setError(authError);
        toast.error(authError);
        setIsLoading(false);
        return;
      }

      if (user) {
        toast.success('Welcome back!');
        onLogin(user.id, user.email, user.name || 'User');
      }
    } catch (err) {
      console.error('Login error:', err);
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
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 flex items-center justify-center">
            <img 
              src={logoImage} 
              alt="EKA Balance Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to continue your wellness journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="bg-white rounded-3xl p-6 lg:p-8 mb-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-700 mb-2 block text-sm">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="border-0 bg-gray-50 rounded-xl h-12"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="text-gray-700 mb-2 block text-sm">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-0 bg-gray-50 rounded-xl h-12"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white border-0 h-14 rounded-2xl mt-6"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Switch to Signup */}
        <p className="text-center text-gray-500">
          Don't have an account?{' '}
          <button
            onClick={onSignup}
            className="text-gray-900 hover:underline"
            disabled={isLoading}
          >
            Sign up
          </button>
        </p>
      </motion.div>
    </div>
  );
}



