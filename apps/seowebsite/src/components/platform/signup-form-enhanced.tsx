"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/platform/utils"
import { Button } from "@/components/platform/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/platform/ui/card"
import { Input } from "@/components/platform/ui/input"
import { Label } from "@/components/platform/ui/label"
import { useSimpleAuth } from "@/hooks/platform/use-simple-auth"
import Image from "next/image"

type SignupFormProps = React.ComponentProps<"div">;

export function SignupFormEnhanced({ className, ...props }: SignupFormProps) {
  const router = useRouter()
  const { signUp } = useSimpleAuth()
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await signUp({ 
        email, 
        password,
        fullName,
        username
      })
      
      if (error) {
        setError(error.message)
      } else {
        // Redirect to login or dashboard, or show verification message
        // For now, redirect to login
        router.push("/login?message=Account created. Please sign in.")
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
            <form onSubmit={handleSignup} className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center gap-3">
                <Image src="/eka_logo.png" alt="EKA" width={56} height={56} className="rounded-md" />
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-balance text-muted-foreground">Enter your details to get started</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
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
                <Label htmlFor="password">Password</Label>
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
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </div>

              <div className="text-center text-sm">
                Already have an account? <Link href="/login" className="font-medium underline underline-offset-4 hover:text-primary">Sign in</Link>
              </div>
            </form>
          </div>
          <div className="relative hidden bg-muted md:block">
            <img src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop" alt="Illustration" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5]" />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By continuing, you agree to our <Link href="/legal/terms">Terms of Service</Link> and <Link href="/legal/privacy">Privacy Policy</Link>.
      </div>
    </div>
  )
}
