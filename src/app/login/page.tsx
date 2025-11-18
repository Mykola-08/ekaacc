'use client'

import { useRouter } from 'next/navigation'
import { LoginFormModern } from '@/components/auth/login-form-modern'

export default function LoginPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // After successful login, redirect to dashboard
    router.push('/dashboard')
  }

  return <LoginFormModern onSuccess={handleSuccess} />
}
