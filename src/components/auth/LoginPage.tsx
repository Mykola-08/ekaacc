'use client'

import { useFormStatus } from 'react-dom'
import { login } from '@/server/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2, Mail, Lock, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

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
        "Sign In"
      )}
    </Button>
  )
}

export function LoginPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  async function clientAction(formData: FormData) {
    setErrorMessage('')

    const result = await login(null, formData)
    if (result?.success) {
      toast.success("Welcome back!")
      router.push('/dashboard')
      return
    }

    if (result && !result.success) {
      setErrorMessage(result.message || 'An error occurred')
      toast.error("Login Failed", { description: result.message })
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
          </div>
        </div>

        <Card className="border border-border bg-surface/50 backdrop-blur-sm shadow-sm rounded-2xl">
          <CardContent className="pt-6">
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  required
                  type="password"
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
          </CardContent>
          <CardFooter className="border-t border-border bg-muted/20 px-6 py-4 rounded-b-2xl">
            <div className="text-center text-sm text-muted-foreground w-full">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
