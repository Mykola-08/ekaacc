'use client'

import { useFormStatus } from 'react-dom'
import { signup } from '@/server/auth/actions'
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
    <Button className="w-full h-12 rounded-xl text-base font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-blue-500/20" type="submit" disabled={pending}>
      {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
      {pending ? 'Creating Account...' : 'Create Account'}
    </Button>
  )
}

export function SignupPage() {
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in fade-in zoom-in duration-500 border-white/40 shadow-2xl shadow-black/5 bg-white/60 backdrop-blur-xl">
        <CardHeader className="space-y-4 text-center pb-8 border-b border-black/5">
            <div className="flex flex-col items-center gap-2 mb-2">
                <div className="w-12 h-12 bg-primary rounded-[18px] flex items-center justify-center text-primary-foreground font-sans font-bold text-xl shadow-lg shadow-blue-900/10">
                    E
                </div>
            </div>
          <CardTitle className="text-2xl font-sans font-semibold tracking-tight text-foreground">Create an account</CardTitle>
          <CardDescription className="text-base font-light text-muted-foreground">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
            {successMessage ? (
                 <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-medium text-primary">Check your email</h3>
                        <p className="text-muted-foreground">{successMessage}</p>
                    </div>
                    <Button asChild variant="outline" className="mt-4 rounded-xl border-black/10 hover:bg-black/5 transition-colors">
                        <Link href="/login">Return to Login</Link>
                    </Button>
                 </div>
            ) : (
                <form action={clientAction} className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="full_name" className="text-foreground/80 font-medium">Full Name</Label>
                <Input
                    id="full_name"
                    name="full_name"
                    placeholder="John Doe"
                    required
                    className="h-12 bg-white/50 border-black/5 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/80 font-medium">Email</Label>
                <Input
                    id="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                    type="email"
                    className="h-12 bg-white/50 border-black/5 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground/80 font-medium">Password</Label>
                <Input
                    id="password"
                    name="password"
                    required
                    type="password"
                    minLength={6}
                    className="h-12 bg-white/50 border-black/5 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                />
                </div>
                {errorMessage && (
                    <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100">
                        {errorMessage}
                    </div>
                )}
                <SubmitButton />
            </form>
            )}
          
        </CardContent>
        {!successMessage && (
            <CardFooter className="flex flex-col gap-4 border-t border-white/10 pt-6">
            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="underline text-primary hover:text-primary/80 font-medium">
                Log in
                </Link>
            </div>
            </CardFooter>
        )}
      </Card>
    </div>
  )
}
