import { LoginForm } from "@/components/login-form"
import { FeatureService } from "@/services/feature-service"
import RedirectIfAuthenticated from "@/components/auth/redirect-if-authenticated"
import SiteFooter from "@/components/layout/site-footer"

export default async function LoginPage() {
  const featureService = new FeatureService()
  const features = await featureService.getPublicFeatures()
  
  // If feature flags are not configured yet, enable providers by default
  const hasFeatureFlags = features && features.length > 0
  const enabledProviders = {
    google: hasFeatureFlags ? features.some(f => f.key === 'auth_google' && f.isEnabled) : true,
    x: hasFeatureFlags ? features.some(f => f.key === 'auth_x' && f.isEnabled) : true,
    linkedin: hasFeatureFlags ? features.some(f => f.key === 'auth_linkedin' && f.isEnabled) : true,
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[#f4f7fb] p-6 md:p-10 bg-[radial-gradient(circle_at_top_left,#e7f0ff,transparent_35%),radial-gradient(circle_at_bottom_right,#dbeafe,transparent_30%)]">
      <RedirectIfAuthenticated />
      <div className="w-full max-w-xl">
        <LoginForm enabledProviders={enabledProviders} />
      </div>
      <SiteFooter />
    </div>
  )
}
