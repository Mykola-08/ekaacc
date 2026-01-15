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
    <Button className="w-full h-12 text-base font-medium" type="submit" disabled={pending}>
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
    <div className="flex min-h-screen items-center justify-center p-4 bg-background/50 backdrop-blur-sm">
      <Card className="w-full max-w-md animate-slide-up border-white/20 shadow-xl bg-card/80 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center pb-8 border-b border-white/10">
          <CardTitle className="text-3xl font-serif text-primary">Create an account</CardTitle>
          <CardDescription className="text-lg">
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
                    <Button asChild variant="outline" className="mt-4">
                        <Link href="/login">Return to Login</Link>
                    </Button>
                 </div>
            ) : (
                <form action={clientAction} className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                    id="full_name"
                    name="full_name"
                    placeholder="John Doe"
                    required
                    className="h-12 bg-white/50 border-white/20 focus:border-primary/50 focus:ring-primary/20"
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
                    className="h-12 bg-white/50 border-white/20 focus:border-primary/50 focus:ring-primary/20"
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
