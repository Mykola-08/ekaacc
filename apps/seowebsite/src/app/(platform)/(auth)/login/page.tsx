import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "@/components/platform/auth/login-form"
import SiteFooter from "@/components/platform/layout/site-footer"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-background">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
      <SiteFooter />
    </div>
  )
}
