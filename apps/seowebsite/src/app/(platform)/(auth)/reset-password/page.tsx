'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/platform/supabase'
import { Button } from '@/components/platform/ui/button'
import { Input } from '@/components/platform/ui/input'
import { Card, CardContent } from '@/components/platform/ui/card'
import Link from 'next/link'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Lock, CheckCircle2, ArrowLeft, Sparkles, Shield } from 'lucide-react'

export default function ResetPasswordPage() {
 const router = useRouter()
 const [password, setPassword] = useState('')
 const [confirmPassword, setConfirmPassword] = useState('')
 const [isLoading, setIsLoading] = useState(false)
 const [isValidSession, setIsValidSession] = useState(false)
 const [isCheckingSession, setIsCheckingSession] = useState(true)

 useEffect(() => {
  // Check if we have a valid session for password reset
  const checkSession = async () => {
   const { data: { session } } = await supabase.auth.getSession()
   if (session) {
    setIsValidSession(true)
   } else {
    toast.error('Invalid or expired reset link')
    setTimeout(() => router.push('/forgot-password'), 2000)
   }
   setIsCheckingSession(false)
  }
  checkSession()
 }, [router])

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  
  if (password.length < 6) {
   toast.error('Password must be at least 6 characters')
   return
  }

  if (password !== confirmPassword) {
   toast.error('Passwords do not match')
   return
  }

  setIsLoading(true)

  try {
   const { error } = await supabase.auth.updateUser({
    password: password
   })

   if (error) {
    toast.error(error.message)
   } else {
    toast.success('Password updated successfully!')
    // Sign out and redirect to login
    await supabase.auth.signOut()
    router.push('/login?message=password_updated')
   }
  } catch (error) {
   toast.error('An unexpected error occurred')
  } finally {
   setIsLoading(false)
  }
 }

 if (isCheckingSession || !isValidSession) {
  return (
   <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30 p-6 relative overflow-hidden">
    {/* Decorative background */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10 pointer-events-none" />
    
    <motion.div
     initial={{ opacity: 0, scale: 0.95 }}
     animate={{ opacity: 1, scale: 1 }}
     className="relative z-10"
    >
     <Card className="w-full max-w-md mx-auto rounded-2xl border-0 shadow-2xl bg-card/95 backdrop-blur-xl">
      <CardContent className="p-10">
       <div className="flex flex-col items-center text-center gap-4">
        <motion.div
         animate={{ rotate: 360 }}
         transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
         className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg"
        >
         <Shield className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold">
         {isCheckingSession ? 'Verifying...' : 'Redirecting...'}
        </h2>
        <p className="text-muted-foreground">
         {isCheckingSession ? 'Please wait while we verify your reset link' : 'Taking you to password reset'}
        </p>
       </div>
      </CardContent>
     </Card>
    </motion.div>
   </div>
  )
 }

 return (
  <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-teal-50/50 via-blue-50/30 to-cyan-50/30 dark:from-teal-950/30 dark:via-blue-950/30 dark:to-cyan-950/30 p-6 relative overflow-hidden">
   {/* Decorative background elements */}
   <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-100/20 via-transparent to-transparent dark:from-teal-900/10 pointer-events-none" />
   <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-cyan-100/20 via-transparent to-transparent dark:from-cyan-900/10 pointer-events-none" />
   
   <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    className="w-full max-w-md mx-auto relative z-10"
   >
    <Card className="rounded-2xl border-0 shadow-2xl bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-xl overflow-hidden relative">
     {/* Decorative gradient overlay */}
     <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-blue-500/5 to-cyan-500/5 pointer-events-none" />
     <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
     
     <CardContent className="p-8 md:p-10 relative">
      {/* Header */}
      <motion.div
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
       className='flex flex-col items-center text-center gap-4 mb-8'
      >
       <div className="relative">
        <motion.div 
         className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl blur-xl opacity-30"
         animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
         transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative bg-gradient-to-br from-teal-500 to-cyan-600 p-4 rounded-2xl shadow-lg">
         <Shield className='w-8 h-8 text-white' />
        </div>
       </div>
       <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent'>
         Reset Password
        </h1>
        <p className='text-sm text-muted-foreground font-medium'>
         Enter your new password below
        </p>
       </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
       <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="space-y-2"
       >
        <label htmlFor="password" className="text-sm font-semibold text-foreground/90 block">
         New Password
        </label>
        <div className="relative">
         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
         <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
          minLength={6}
          autoComplete="new-password"
          className="rounded-xl h-12 pl-10 bg-muted/40 border-border/50 focus:bg-background transition-colors"
         />
        </div>
        <p className="text-xs text-muted-foreground font-medium">
         Must be at least 6 characters
        </p>
       </motion.div>

       <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="space-y-2"
       >
        <label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground/90 block">
         Confirm New Password
        </label>
        <div className="relative">
         <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
         <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          required
          minLength={6}
          autoComplete="new-password"
          className="rounded-xl h-12 pl-10 bg-muted/40 border-border/50 focus:bg-background transition-colors"
         />
        </div>
       </motion.div>

       <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="pt-2"
       >
        <Button
         type="submit"
         className="w-full rounded-xl h-12 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-teal-500/30"
         disabled={isLoading}
        >
         {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
         ) : (
          <span className="flex items-center gap-2">
           <Sparkles className="w-4 h-4" />
           Update Password
          </span>
         )}
        </Button>
       </motion.div>
      </form>

      <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       transition={{ delay: 0.5 }}
       className="mt-6 text-center"
      >
       <Link 
        href="/login" 
        className="text-sm font-semibold text-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors inline-flex items-center gap-1"
       >
        <ArrowLeft className='h-3 w-3' />
        Back to Sign In
       </Link>
      </motion.div>
     </CardContent>
    </Card>
   </motion.div>
  </div>
 )
}
