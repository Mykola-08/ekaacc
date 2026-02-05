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
import { Loader2, Mail, Lock, Sparkles } from 'lucide-react'

type LoginFormProps = React.ComponentProps<'div'> & {
  enabledProviders?: {
    google: boolean
    x: boolean
    linkedin: boolean
  }
}

export function LoginForm({ className, enabledProviders = { google: true, x: true, linkedin: true }, ...props }: any) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={cn('flex flex-col gap-6 w-full max-w-sm mx-auto', className)} 
      {...props}
    >
      <Card className='rounded-[2rem] border-0 shadow-2xl bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-xl overflow-hidden relative'>
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <CardContent className='p-8 md:p-10 relative'>
            <form onSubmit={handleLogin} className='flex flex-col gap-6'>
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className='flex flex-col items-center text-center gap-4 mb-2'
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                  <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                    <Image 
                      src='/eka_logo.png' 
                      alt='EKA' 
                      width={40} 
                      height={40} 
                      className='rounded-lg'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <h1 className='text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent'>
                    Welcome back
                  </h1>
                  <p className='text-sm text-muted-foreground font-medium'>
                    Sign in to continue your wellness journey
                  </p>
                </div>
              </motion.div>

              {/* Form Fields */}
              <div className='space-y-4'>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="relative"
                >
                  <Label htmlFor='email' className='text-sm font-semibold text-foreground/90 mb-2 block'>
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id='email'
                      type='email'
                      placeholder='name@example.com'
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='rounded-xl h-12 pl-10 bg-muted/40 border-border/50 focus:bg-background transition-colors'
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor='password' className='text-sm font-semibold text-foreground/90'>
                      Password
                    </Label>
                    <Link
                      href='/forgot-password'
                      className='text-xs font-semibold text-primary hover:text-primary/80 transition-colors'
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id='password'
                      type='password'
                      placeholder='Enter your password'
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='rounded-xl h-12 pl-10 bg-muted/40 border-border/50 focus:bg-background transition-colors'
                    />
                  </div>
                </motion.div>
              </div>

              {/* Error Message */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.2 }}
                    className='text-sm text-destructive text-center font-medium bg-destructive/10 px-4 py-3 rounded-xl border border-destructive/20'
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <Button 
                  type='submit' 
                  className='w-full rounded-xl h-12 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-blue-500/30'
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className='w-5 h-5 animate-spin' />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Sign In
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
        </CardContent>
      </Card>
      
      {/* Sign Up Link */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className='text-center'
      >
        <p className='text-sm text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <Link href='/signup' className='font-bold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1'>
            Sign up
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </p>
      </motion.div>
    </motion.div>
  )
}
