'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/platform/utils/css-utils'
import { Button } from '@/components/platform/ui/button'
import { Card, CardContent } from '@/components/platform/ui/card'
import { Input } from '@/components/platform/ui/input'
import { Label } from '@/components/platform/ui/label'
import { useSimpleAuth } from '@/hooks/platform/auth/use-simple-auth'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

type LoginFormProps = React.ComponentProps<'div'> & {
  enabledProviders?: {
    google: boolean
    x: boolean
    linkedin: boolean
  }
}

export function LoginForm({ className, enabledProviders = { google: true, x: true, linkedin: true }, ...props }: LoginFormProps) {
  const router = useRouter()
  const { signIn, signInWithPasskey, isAuthenticated, isLoading: authLoading } = useSimpleAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/')
    }
  }, [authLoading, isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await signIn({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push('/')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, type: 'spring', bounce: 0, stiffness: 100 }}
      className={cn('flex flex-col gap-6 w-full max-w-sm mx-auto', className)} 
      {...props}
    >
      <Card className='rounded-3xl border-0 shadow-2xl shadow-blue-900/5 overflow-hidden bg-white/80 backdrop-blur-xl'>
        <CardContent className='p-8 md:p-10'>
            <form onSubmit={handleLogin} className='flex flex-col gap-6'>
              <div className='flex flex-col items-center text-center gap-4 mb-4'>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Image src='/eka_logo.png' alt='EKA' width={48} height={48} className='rounded-xl shadow-md' />
                </motion.div>
                <div className='space-y-1'>
                  <motion.h1 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className='text-2xl font-bold tracking-tight text-slate-900'
                  >
                    Welcome back
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className='text-sm text-slate-500'
                  >
                    Enter your credentials to access your account
                  </motion.p>
                </div>
              </div>

              <div className='space-y-4'>
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor='email' className='sr-only'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='name@example.com'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='rounded-xl bg-slate-50 border-slate-200 h-11 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder:text-slate-400'
                  />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className='space-y-2'
                >
                  <Label htmlFor='password' className='sr-only'>Password</Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='Password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='rounded-xl bg-slate-50 border-slate-200 h-11 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder:text-slate-400'
                  />
                  <div className='flex justify-end'>
                    <Link
                      href='/forgot-password'
                      className='text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors'
                    >
                      Forgot password?
                    </Link>
                  </div>
                </motion.div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className='text-sm text-red-500 text-center font-medium bg-red-50 p-2 rounded-lg'
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.7 }}
              >
                <Button 
                  type='submit' 
                  className='w-full rounded-xl h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]'
                  disabled={loading}
                >
                  {loading ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Sign In'}
                </Button>
              </motion.div>

              
            </form>
        </CardContent>
      </Card>
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.8 }}
        className='text-center'
      >
        <p className='text-sm text-slate-500'>
          Don&apos;t have an account?{' '}
          <Link href='/signup' className='font-semibold text-slate-900 hover:text-blue-600 transition-colors'>
            Sign up
          </Link>
        </p>
      </motion.div>
    </motion.div>
  )
}

