import { SignUpForm } from "@/components/platform/auth/signup-form"
import SiteFooter from "@/components/platform/layout/site-footer"

export default function SignupPage({ searchParams }: { searchParams: { plan?: string } }) {
 return (
  <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10 gap-6">
   <div className="w-full max-w-sm md:max-w-3xl">
    <SignUpForm planId={searchParams.plan} />
   </div>
   <SiteFooter />
  </div>
 )
}