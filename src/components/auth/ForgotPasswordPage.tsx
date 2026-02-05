'use client'

import { useFormStatus } from 'react-dom'
import { forgotPassword } from '@/server/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import { useState } from 'react'
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      className="w-full text-base font-semibold transition-all active:scale-95"
      type="submit"
      disabled={pending}
      size="lg"
    >
      {pending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        "Send Reset Link"
      )}
    </Button>
  )
}

export function ForgotPasswordPage() {
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  async function clientAction(formData: FormData) {
    setErrorMessage('')
    setSuccessMessage('')

    const result = await forgotPassword(null, formData)
    
    if (result.success) {
      setSuccessMessage(result.message || 'Check your email')
      toast.success("Email Sent", { description: result.message })
    } else {
      setErrorMessage(result.message || 'An error occurred')
      toast.error("Error", { description: result.message })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
            <Link href="/" className="mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                    <span className="text-primary-foreground font-black text-lg italic">E</span>
                </div>
            </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Forgot Password</h1>
            <p className="text-sm text-muted-foreground">Enter your email to receive a reset link</p>
          </div>
        </div>

        <Card className="border border-border bg-surface/50 backdrop-blur-sm shadow-sm rounded-2xl">
          <CardContent className="pt-6">
            {successMessage ? (
              <div className="flex flex-col items-center justify-center space-y-6 py-4">
                <div className="bg-success/10 p-4 rounded-full">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">Check your email</h3>
                  <p className="text-muted-foreground text-sm">{successMessage}</p>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Return to Login</Link>
                </Button>
              </div>
            ) : (
              <form action={clientAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                    type="email"
                    className="bg-transparent"
                  />
                </div>

                {errorMessage && (
                  <div className="text-sm font-medium bg-destructive/10 text-destructive p-3 rounded-md border border-destructive/20">
                    {errorMessage}
                  </div>
                )}

                <SubmitButton />
              </form>
            )}
          </CardContent>
          <CardFooter className="border-t border-border bg-muted/20 px-6 py-4 rounded-b-2xl flex justify-center">
              <Link href="/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
