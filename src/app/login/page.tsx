'use client'

import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form-shadcn'

export default function LoginPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // After successful login, redirect to dashboard
    // TODO: Check if onboarding is complete, if not redirect to /onboarding
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm onSuccess={handleSuccess} />
    </div>
  )
}
