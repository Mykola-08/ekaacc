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
    <div className="eka-dashboard-container bg-muted flex items-center justify-center p-6 md:p-10">
      <RedirectIfAuthenticated />
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm enabledProviders={enabledProviders} />
      </div>
      <SiteFooter />
    </div>
  )
}
