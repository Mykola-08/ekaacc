import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "@/components/platform/auth/login-form"
import SiteFooter from "@/components/platform/layout/site-footer"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100/20 via-transparent to-transparent dark:from-purple-900/10 pointer-events-none" />
      
      <div className="flex w-full max-w-sm flex-col gap-6 relative z-10">
        <LoginForm />
      </div>
      <div className="relative z-10">
        <SiteFooter />
      </div>
    </div>
  )
}
