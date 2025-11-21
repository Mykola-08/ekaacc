import Image from "next/image"
import { SignupFormEnhanced } from "@/components/signup-form-enhanced"
import RedirectIfAuthenticated from "@/components/auth/redirect-if-authenticated"
import SiteFooter from "@/components/layout/site-footer"

export default function SignupPage() {
  return (
    <div className="bg-[#f4f7fb] bg-[radial-gradient(circle_at_top_left,#e7f0ff,transparent_35%),radial-gradient(circle_at_bottom_right,#dbeafe,transparent_30%)] flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <RedirectIfAuthenticated />
      <div className="flex w-full max-w-xl flex-col gap-6">
        <div className="flex items-center gap-3 self-center font-semibold text-foreground">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Image src="/eka_logo.png" alt="EKA" width={32} height={32} className="rounded-full" />
          </div>
          <span className="text-lg">EKA Account</span>
        </div>
        <SignupFormEnhanced />
      </div>
      <SiteFooter />
    </div>
  )
}
