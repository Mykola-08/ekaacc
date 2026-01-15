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
    <Button className="w-full h-12 rounded-xl text-base font-medium bg-[#0d9488] hover:bg-[#0f766e] shadow-lg shadow-teal-500/20" type="submit" disabled={pending}>
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in fade-in zoom-in duration-500 border-white/40 shadow-2xl shadow-black/5 bg-white/60 backdrop-blur-xl">
        <CardHeader className="space-y-4 text-center pb-8 border-b border-black/5">
           <div className="flex flex-col items-center gap-2 mb-2">
                <div className="w-12 h-12 bg-[#0d9488] rounded-[18px] flex items-center justify-center text-white font-sans font-bold text-xl shadow-lg shadow-teal-900/10">
                    E
                </div>
            </div>
          <CardTitle className="text-2xl font-sans font-semibold tracking-tight text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-base font-light text-muted-foreground">
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form action={clientAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80 font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="m@example.com"
                required
                type="email"
                className="h-12 bg-white/50 border-black/5 focus:border-[#0d9488]/50 focus:ring-[#0d9488]/20 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground/80 font-medium">Password</Label>
                <Link href="#" className="text-sm text-[#0d9488] hover:underline font-medium">
                    Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                required
                type="password"
                className="h-12 bg-white/50 border-black/5 focus:border-[#0d9488]/50 focus:ring-[#0d9488]/20 rounded-xl"
              />
            </div>
            {errorMessage && (
                <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100">
                    {errorMessage}
                </div>
            )}
            <SubmitButton />
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-black/5 pt-6 bg-black/1">
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-[#0d9488] hover:text-[#0f766e] font-medium">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
