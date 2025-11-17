'use client'

import { useRouter } from 'next/navigation'
import { SignUpForm } from '@/components/auth/signup-form-shadcn'

export default function SignUpPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // After successful signup, redirect to onboarding
    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <SignUpForm onSuccess={handleSuccess} />
    </div>
  )
}