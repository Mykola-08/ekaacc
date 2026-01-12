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
    <div 
      className={cn('flex flex-col gap-6 w-full max-w-sm mx-auto animate-scale-in', className)} 
      {...props}
    >
      <Card className='rounded-3xl border shadow-2xl bg-card text-card-foreground overflow-hidden'>
        <CardContent className='p-8 md:p-10'>
            <form onSubmit={handleLogin} className='flex flex-col gap-6'>
              <div className='flex flex-col items-center text-center gap-4 mb-4'>
                <div className="animate-slide-up">
                  <Image src='/eka_logo.png' alt='EKA' width={48} height={48} className='rounded-xl shadow-md' />
                </div>
                <div className='space-y-1 animate-slide-up' style={{ animationDelay: '100ms' }}>
                  <div className='text-2xl font-bold tracking-tight text-foreground'>
                    Welcome back
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Enter your credentials to access your account
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                  <Label htmlFor='email' className='sr-only'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='name@example.com'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='rounded-xl h-11'
                  />
                </div>
                
                <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                  <Label htmlFor='password' className='sr-only'>Password</Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='Password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='rounded-xl h-11'
                  />
                  <div className='flex justify-end mt-1'>
                    <Link
                      href='/forgot-password'
                      className='text-xs font-medium text-primary hover:text-primary/80 transition-colors'
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className='text-sm text-destructive text-center font-medium bg-destructive/10 p-2 rounded-lg'
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
                <Button 
                  type='submit' 
                  className='w-full rounded-xl h-11 font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]'
                  disabled={loading}
                >
                  {loading ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Sign In'}
                </Button>
              </div>
            </form>
        </CardContent>
      </Card>
      
      <div className='text-center animate-fade-in' style={{ animationDelay: '500ms' }}>
        <p className='text-sm text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <Link href='/signup' className='font-semibold text-primary hover:text-primary/80 transition-colors'>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
