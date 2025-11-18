'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSimpleAuth } from '@/hooks/use-simple-auth'
import { OAuthButtons } from '@/components/auth/oauth-buttons-improved'
import { Loader2, Sparkles, Heart, Brain } from 'lucide-react'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { BlurIn } from '@/components/ui/blur-in'
import { motion } from 'framer-motion'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginForm03Props {
  onSuccess?: () => void
  onError?: (error: string) => void
}

/**
 * Modern Login Form - Style 03
 * Clean, minimal design with split layout
 */
export function LoginForm03({ onSuccess, onError }: LoginForm03Props) {
  const { signIn, isLoading } = useSimpleAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: LoginFormValues) {
    const { error } = await signIn(values)
    
    if (error) {
      onError?.(error.message)
      form.setError('root', {
        message: error.message,
      })
    } else {
      onSuccess?.()
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left side - Enhanced Branding with AceternityUI */}
      <div className="hidden lg:flex lg:flex-col lg:justify-between bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <BlurIn>
          <div className="flex items-center gap-3 relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-center justify-center">
                <Heart className="h-6 w-6 text-pink-300" />
                <Brain className="h-6 w-6 text-blue-300 ml-1" />
              </div>
            </div>
            <AnimatedGradientText className="text-2xl font-bold">
              EKA Wellness
            </AnimatedGradientText>
          </div>
        </BlurIn>
        
        <BlurIn delay={0.2} className="relative z-10">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight lg:text-6xl">
              Transform Your
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Wellness Journey
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-lg leading-relaxed">
              Sign in to access your personalized dashboard, track your progress, and connect with your care team. 
              Your mental health matters.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-medium">Personalized Care</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-300" />
                <span className="text-sm font-medium">Mental Health Support</span>
              </div>
            </div>
          </div>
        </BlurIn>
        
        <BlurIn delay={0.4} className="relative z-10">
          <div className="text-sm text-white/70">
            © 2024 EKA Wellness. All rights reserved. | Privacy Policy | Terms of Service
          </div>
        </BlurIn>
      </div>

      {/* Right side - Enhanced Form */}
      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <BlurIn>
            <div className="text-center space-y-2">
              <AnimatedGradientText className="text-3xl font-bold">
                Welcome Back
              </AnimatedGradientText>
              <p className="text-muted-foreground text-lg">
                Sign in to continue your wellness journey
              </p>
            </div>
          </BlurIn>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-700/50"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          autoComplete="email"
                          className="bg-white/50 dark:bg-slate-700/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-lg"
                          {...field}
                        />
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
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-base font-medium">Password</FormLabel>
                        <Link 
                          href="/forgot-password" 
                          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your secure password"
                          autoComplete="current-password"
                          className="bg-white/50 dark:bg-slate-700/50 border-0 focus:ring-2 focus:ring-blue-500 rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400"
                  >
                    {form.formState.errors.root.message}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg py-6 text-lg font-medium"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In to Continue'
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 dark:bg-slate-800 px-2 text-muted-foreground font-medium">
                Or continue with
              </span>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <OAuthButtons />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center text-sm text-muted-foreground"
          >
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">
              Create your wellness account
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
