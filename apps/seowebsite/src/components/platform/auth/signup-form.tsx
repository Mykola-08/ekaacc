'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/platform/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/platform/ui/form'
import { Input } from '@/components/platform/ui/input'
import { Card, CardContent } from '@/components/platform/ui/card'
import { useSimpleAuth } from '@/hooks/platform/auth/use-simple-auth'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Mail, Lock, User, UserCircle, Sparkles, CheckCircle2 } from 'lucide-react'

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores').optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignUpFormValues = z.infer<typeof signUpSchema>

interface SignUpFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  planId?: string
}

export function SignUpForm({ onSuccess, onError, planId }: SignUpFormProps) {
  const { signUp, isLoading } = useSimpleAuth()

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: SignUpFormValues) {
    const { error } = await signUp({
      email: values.email,
      password: values.password,
      fullName: values.fullName,
      username: values.username,
      planId: planId,
    })
    
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="w-full max-w-lg mx-auto"
    >
      <Card className="rounded-2xl border-0 shadow-2xl bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-xl overflow-hidden relative">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 pointer-events-none" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <CardContent className="p-8 md:p-10 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className='flex flex-col items-center text-center gap-4 mb-8'
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
              <div className="relative bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
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
                Create Account
              </h1>
              <p className='text-sm text-muted-foreground font-medium'>
                Start your wellness journey today
              </p>
            </div>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Two-column layout for full name and username */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-foreground/90">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="John Doe"
                              autoComplete="name"
                              className="rounded-xl h-11 pl-10 bg-muted/40 border-border/50 focus:bg-background transition-colors"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">Optional</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-foreground/90">Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="johndoe"
                              autoComplete="username"
                              className="rounded-xl h-11 pl-10 bg-muted/40 border-border/50 focus:bg-background transition-colors"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">Optional</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground/90">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            autoComplete="email"
                            className="rounded-xl h-11 pl-10 bg-muted/40 border-border/50 focus:bg-background transition-colors"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-foreground/90">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              autoComplete="new-password"
                              className="rounded-xl h-11 pl-10 bg-muted/40 border-border/50 focus:bg-background transition-colors"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">Min. 6 characters</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-foreground/90">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              autoComplete="new-password"
                              className="rounded-xl h-11 pl-10 bg-muted/40 border-border/50 focus:bg-background transition-colors"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              <AnimatePresence mode="wait">
                {form.formState.errors.root && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FormMessage className="text-center bg-destructive/10 px-4 py-3 rounded-xl border border-destructive/20">
                      {form.formState.errors.root.message}
                    </FormMessage>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  className="w-full rounded-xl h-12 font-semibold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-blue-500/30"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Create Account
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-6 text-center text-sm"
          >
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1">
              Sign in
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
