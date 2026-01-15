'use client'

import { useFormStatus } from 'react-dom'
import { login } from '@/server/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full h-12 text-base font-medium" type="submit" disabled={pending}>
      {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
      {pending ? 'Signing In...' : 'Sign In'}
    </Button>
  )
}

export function LoginPage() {
  const [errorMessage, setErrorMessage] = useState('')

  async function clientAction(formData: FormData) {
    setErrorMessage('')
    // We wrap the server action to handle the response (since redirect throws)
    // Actually, redirect inside server action throws NEXT_REDIRECT which we shouldn't catch.
    // Ideally we use a wrapper or handle state differently.
    
    const result = await login(null, formData)
    if (result && !result.success) {
        setErrorMessage(result.message)
        toast.error("Login Failed", { description: result.message })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background/50 backdrop-blur-sm">
      <Card className="w-full max-w-md animate-slide-up border-white/20 shadow-xl bg-card/80 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center pb-8 border-b border-white/10">
          <CardTitle className="text-3xl font-serif text-primary">Welcome Back</CardTitle>
          <CardDescription className="text-lg">
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form action={clientAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="m@example.com"
                required
                type="email"
                className="h-12 bg-white/50 border-white/20 focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                required
                type="password"
                className="h-12 bg-white/50 border-white/20 focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
            {errorMessage && (
                <div className="text-destructive text-sm font-medium bg-destructive/10 p-3 rounded-md">
                    {errorMessage}
                </div>
            )}
            <SubmitButton />
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-white/10 pt-6">
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-primary hover:text-primary/80 font-medium">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
