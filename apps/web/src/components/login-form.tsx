"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSimpleAuth } from "@/hooks/use-simple-auth"
import Image from "next/image"

interface LoginFormProps extends React.ComponentProps<"div"> {
  enabledProviders?: {
    google: boolean
    x: boolean
    linkedin: boolean
  }
}

export function LoginForm({ className, enabledProviders = { google: true, x: true, linkedin: true }, ...props }: LoginFormProps) {
  const router = useRouter()
  const { signIn, signInWithPasskey } = useSimpleAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await signIn({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push("/")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handlePasskeyLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await signInWithPasskey(email || undefined)
      if (error) {
        setError(error.message)
      } else {
        router.push("/")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden glass-premium border-white/20 dark:border-white/10">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center gap-3">
                <Image src="/eka_logo.png" alt="EKA" width={56} height={56} className="rounded-md" />
                <h1 className="text-2xl font-bold">Welcome</h1>
                <p className="text-balance text-muted-foreground">Sign in to your account</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <div className="grid gap-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={handlePasskeyLogin} disabled={loading}>
                  Sign in with Passkey
                </Button>
              </div>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>

              <div className={cn(
                "grid gap-4",
                {
                  "grid-cols-1": [enabledProviders.google, enabledProviders.x, enabledProviders.linkedin].filter(Boolean).length === 1,
                  "grid-cols-2": [enabledProviders.google, enabledProviders.x, enabledProviders.linkedin].filter(Boolean).length === 2,
                  "grid-cols-3": [enabledProviders.google, enabledProviders.x, enabledProviders.linkedin].filter(Boolean).length === 3,
                }
              )}>
                {enabledProviders.google && (
                  <Button variant="outline" className="w-full" type="button" disabled>
                    <span className="ml-2">Google</span>
                  </Button>
                )}
                {enabledProviders.x && (
                  <Button variant="outline" className="w-full" type="button" disabled>
                    <span className="ml-2">X</span>
                  </Button>
                )}
                {enabledProviders.linkedin && (
                  <Button variant="outline" className="w-full" type="button" disabled>
                    <span className="ml-2">LinkedIn</span>
                  </Button>
                )}
              </div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">Sign up</a>
              </div>
            </form>
          </div>
          <div className="relative hidden bg-muted md:block">
            <img src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop" alt="Illustration" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5]" />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By continuing, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
      </div>
    </div>
  )
}
