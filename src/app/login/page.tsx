import { LoginForm } from "@/components/login-form"
import { FeatureService } from "@/services/feature-service"

export default async function LoginPage() {
  const featureService = new FeatureService()
  const features = await featureService.getPublicFeatures()
  
  const enabledProviders = {
    google: features.some(f => f.key === 'auth_google'),
    apple: features.some(f => f.key === 'auth_apple'),
    meta: features.some(f => f.key === 'auth_meta'),
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm enabledProviders={enabledProviders} />
      </div>
    </div>
  )
}
