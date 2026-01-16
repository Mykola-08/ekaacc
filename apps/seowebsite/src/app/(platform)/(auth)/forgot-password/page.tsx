'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/platform/supabase'
import { Button } from '@/components/platform/ui/button'
import { Input } from '@/components/platform/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card'
import Link from 'next/link'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'

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
   const { error } = await (supabase.auth as any).resetPasswordForEmail(email, {
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
  <div className='flex min-h-svh flex-col items-center justify-center p-6 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900'>
   <motion.div 
    initial={{ opacity: 0, scale: 0.95, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.4, type: 'spring', bounce: 0, stiffness: 100 }}
    className='w-full max-w-sm mx-auto'
   >
    <Card className='rounded-[32px] border-none shadow-2xl shadow-blue-900/5 overflow-hidden bg-card/80 backdrop-blur-xl'>
     <CardHeader className='pb-0 pt-8 px-8 flex flex-col items-center text-center'>
       <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className='mb-4 bg-blue-50 p-3 rounded-2xl'
       >
        {emailSent ? <CheckCircle2 className='w-8 h-8 text-blue-600' /> : <Mail className='w-8 h-8 text-blue-600' />}
       </motion.div>
      <CardTitle className='text-2xl font-bold text-foreground'>
        {emailSent ? 'Check Your Email' : 'Forgot Password?'}
      </CardTitle>
      <CardDescription className='mt-2 text-muted-foreground'>
        {emailSent 
          ? `We've sent password reset instructions to`
          : 'Enter your email address and we will send you a link to reset your password'
        }
      </CardDescription>
     </CardHeader>
     <CardContent className='p-8 pt-6'>
      <AnimatePresence mode='wait'>
        {emailSent ? (
          <motion.div 
            key='sent'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='space-y-4'
          >
            <p className='text-sm text-center text-muted-foreground bg-blue-50/50 p-4 rounded-xl border border-blue-100'>
              Click the link in the email to reset your password. If you don't see it, check your spam folder.
            </p>
            <Button
              variant='outline'
              onClick={() => setEmailSent(false)}
              className='w-full rounded-xl h-11 border-border text-foreground/90 hover:bg-muted/40'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Try another email
            </Button>
          </motion.div>
        ) : (
          <motion.form 
            key='form'
            onSubmit={handleSubmit} 
            className='space-y-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className='space-y-2'>
            <Input
              id='email'
              type='email'
              placeholder='name@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
               className='rounded-xl bg-muted/40 border-border h-11 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-foreground placeholder:text-muted-foreground/80'
            />
            </div>
            <Button 
              type='submit' 
              className='w-full rounded-xl h-11 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]'
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Send Reset Link'}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

       <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className='mt-6 text-center'
       >
        <Link href='/login' className='text-sm font-semibold text-foreground hover:text-blue-600 transition-colors inline-flex items-center'>
          {!emailSent && <ArrowLeft className='mr-1 h-3 w-3' />} Back to Sign In
        </Link>
       </motion.div>
     </CardContent>
    </Card>
   </motion.div>
  </div>
 )
}
