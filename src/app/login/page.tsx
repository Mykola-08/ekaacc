'use client'

import { useRouter } from 'next/navigation'
import { LoginForm03 } from '@/components/auth/login-form-03'

export default function LoginPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // After successful login, redirect to dashboard
    router.push('/dashboard')
  }

  return <LoginForm03 onSuccess={handleSuccess} />
}
