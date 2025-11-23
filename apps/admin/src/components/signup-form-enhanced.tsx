"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface SignupFormProps extends React.ComponentProps<"div"> { }

export function SignupFormEnhanced({ className, ...props }: SignupFormProps) {
  const router = useRouter()

  const handleSignup = () => {
    router.push('/api/auth/login?screen_hint=signup')
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
          <CardDescription>Join EKA Account using Auth0</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Button type="button" className="w-full" onClick={handleSignup}>Create account with Auth0</Button>
            </div>
            <div className="text-center text-sm">
              Already have an account? <a href="/login" className="font-medium underline underline-offset-4 hover:text-primary">Sign in</a>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By continuing, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
      </div>
    </div>
  )
}
