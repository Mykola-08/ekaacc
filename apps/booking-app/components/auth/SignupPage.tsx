'use client'

import { useFormStatus } from 'react-dom'
import { signup } from '@/server/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2, Mail, Lock, User, Sparkles, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      className="w-full text-base font-semibold transition-all active:scale-[0.98]"
      type="submit"
      disabled={pending}
      size="lg"
    >
      {pending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        "Create Account"
      )}
    </Button>
  )
}

export function SignupPage() {
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  async function clientAction(formData: FormData) {
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const result = await signup(null, formData)
      if (result.success) {
        setSuccessMessage(result.message)
        toast.success("Account Created", { description: result.message })
      } else {
        setErrorMessage(result.message)
        toast.error("Signup Failed", { description: result.message })
      }
    } catch (e) {
      setErrorMessage("An error occurred")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-black text-lg italic">E</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Create account</h1>
            <p className="text-sm text-muted-foreground">Join EKA Balance today</p>
          </div>
        </div>

        <Card className="border border-border bg-surface shadow-sm rounded-2xl">
          <CardContent className="pt-6">
            {successMessage ? (
              <div className="flex flex-col items-center justify-center space-y-6 py-8">
                <div className="bg-success/10 p-4 rounded-full">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-bold text-foreground">Check your email</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">{successMessage}</p>
                </div>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link href="/login">Return to Login</Link>
                </Button>
              </div>
            ) : (
              <form action={clientAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    placeholder="John Doe"
                    required
                    className="bg-transparent"
                  />
                </div>

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

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    required
                    type="password"
                    minLength={6}
                    className="bg-transparent"
                  />
                  <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                </div>

                {errorMessage && (
                  <div className="text-sm font-medium bg-danger/10 text-danger p-3 rounded-md border border-danger/20">
                    {errorMessage}
                  </div>
                )}

                <SubmitButton />
              </form>
            )}
          </CardContent>

          {!successMessage && (
            <CardFooter className="border-t border-border bg-muted/20 px-6 py-4 rounded-b-2xl">
              <div className="text-center text-sm text-muted-foreground w-full">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Log in
                </Link>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
