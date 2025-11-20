import Image from "next/image"
import { SignupFormEnhanced } from "@/components/signup-form-enhanced"
import RedirectIfAuthenticated from "@/components/auth/redirect-if-authenticated"
import SiteFooter from "@/components/layout/site-footer"

export default function SignupPage() {
  return (
    <div className="eka-dashboard-container bg-muted flex items-center justify-center p-6 md:p-10">
      <RedirectIfAuthenticated />
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-3 self-center font-semibold text-foreground eka-transition hover:opacity-80">
          <Image src="/eka_logo.png" alt="EKA" width={36} height={36} className="rounded-md" />
          <span>EKA Account</span>
        </a>
        <SignupFormEnhanced />
      </div>
      <SiteFooter />
    </div>
  )
}