import { SignUpForm } from "@/components/platform/auth/signup-form"
import SiteFooter from "@/components/platform/layout/site-footer"

export default function SignupPage({ searchParams }: { searchParams: { plan?: string } }) {
 return (
  <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-emerald-50/50 via-blue-50/30 to-purple-50/30 dark:from-emerald-950/30 dark:via-blue-950/30 dark:to-purple-950/30 p-6 md:p-10 gap-6 relative overflow-hidden">
   {/* Decorative background elements */}
   <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-100/20 via-transparent to-transparent dark:from-emerald-900/10 pointer-events-none" />
   <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-100/20 via-transparent to-transparent dark:from-purple-900/10 pointer-events-none" />
   
   <div className="w-full max-w-lg relative z-10">
    <SignUpForm planId={searchParams.plan} />
   </div>
   <div className="relative z-10">
    <SiteFooter />
   </div>
  </div>
 )
}