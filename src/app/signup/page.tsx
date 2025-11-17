'use client'

import { useRouter } from 'next/navigation'
import { SignupForm03 } from '@/components/auth/signup-form-03'

export default function SignUpPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // After successful signup, redirect to onboarding
    router.push('/onboarding')
  }

  return <SignupForm03 onSuccess={handleSuccess} />
}