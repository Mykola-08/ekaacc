'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/platform/supabase'
import { Button } from '@/components/platform/ui/button'
import { Input } from '@/components/platform/ui/input'
import { Card, CardContent } from '@/components/platform/ui/card'
import Link from 'next/link'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Mail, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react'

export default function ForgotPasswordPage() {
 const router = useRouter()
 const [email, setEmail] = useState('')
 const [isLoading, setIsLoading] = useState(false)
 const [emailSent, setEmailSent] = useState(false)

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  
  if (!email) {
   toast.error('Please enter your email address')
   return
  }

  setIsLoading(true)

  try {
   const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
   })

   if (error) {
    toast.error(error.message)
   } else {
    setEmailSent(true)
    toast.success('Password reset email sent! Check your inbox.')
   }
  } catch (error) {
   toast.error('An unexpected error occurred')
  } finally {
   setIsLoading(false)
  }
 }

 return (
  <div className='flex min-h-svh flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-blue-50/30 to-purple-50/30 dark:from-indigo-950/30 dark:via-blue-950/30 dark:to-purple-950/30 relative overflow-hidden'>
   {/* Decorative background elements */}
   <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/20 via-transparent to-transparent dark:from-indigo-900/10 pointer-events-none" />
   <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-100/20 via-transparent to-transparent dark:from-purple-900/10 pointer-events-none" />
   
   <motion.div 
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    className='w-full max-w-md mx-auto relative z-10'
   >
    <Card className='rounded-[2rem] border-0 shadow-2xl bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-xl overflow-hidden relative'>
     {/* Decorative gradient overlay */}
     <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-blue-500/5 to-purple-500/5 pointer-events-none" />
     <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
     
     <CardContent className='p-8 md:p-10 relative'>
      {/* Header */}
      <motion.div
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
       className='flex flex-col items-center text-center gap-4 mb-8'
      >
       <div className="relative">
        <motion.div 
         className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-30"
         animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
         transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
         className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg"
         animate={emailSent ? { scale: [1, 1.05, 1] } : {}}
         transition={{ duration: 0.5 }}
        >
         <AnimatePresence mode="wait">
          {emailSent ? (
           <motion.div
            key="success"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
           >
            <CheckCircle2 className='w-8 h-8 text-white' />
           </motion.div>
          ) : (
           <motion.div
            key="mail"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
           >
            <Mail className='w-8 h-8 text-white' />
           </motion.div>
          )}
         </AnimatePresence>
        </motion.div>
       </div>
       <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent'>
         {emailSent ? 'Check Your Email' : 'Forgot Password?'}
        </h1>
        <p className='text-sm text-muted-foreground font-medium max-w-sm'>
         {emailSent 
           ? "We've sent password reset instructions to your email"
           : 'Enter your email and we\'ll send you a link to reset your password'
         }
        </p>
       </div>
      </motion.div>

      <AnimatePresence mode='wait'>
       {emailSent ? (
        <motion.div 
         key='sent'
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
         className='space-y-4'
        >
         <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className='text-sm text-center text-muted-foreground bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50'
         >
          <p className="font-medium">
           Click the link in the email to reset your password.
          </p>
          <p className="mt-2 text-xs">
           If you don't see it, check your spam folder.
          </p>
         </motion.div>
         <Button
          variant='outline'
          onClick={() => setEmailSent(false)}
          className='w-full rounded-xl h-11 border-border/50 bg-muted/20 hover:bg-muted/40 transition-all'
         >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Try another email
         </Button>
        </motion.div>
       ) : (
        <motion.form 
         key='form'
         onSubmit={handleSubmit} 
         className='space-y-6'
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
        >
         <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className='space-y-2'
         >
          <label htmlFor='email' className='text-sm font-semibold text-foreground/90 block'>
           Email Address
          </label>
          <div className="relative">
           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input
            id='email'
            type='email'
            placeholder='name@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='rounded-xl h-12 pl-10 bg-muted/40 border-border/50 focus:bg-background transition-colors'
           />
          </div>
         </motion.div>
         <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
         >
          <Button 
           type='submit' 
           className='w-full rounded-xl h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-indigo-500/30'
           disabled={isLoading}
          >
           {isLoading ? (
            <Loader2 className='w-5 h-5 animate-spin' />
           ) : (
            <span className="flex items-center gap-2">
             <Sparkles className="w-4 h-4" />
             Send Reset Link
            </span>
           )}
          </Button>
         </motion.div>
        </motion.form>
       )}
      </AnimatePresence>

      <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       transition={{ delay: 0.4 }}
       className='mt-6 text-center'
      >
       <Link 
        href='/login' 
        className='text-sm font-semibold text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1'
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
