'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/platform/supabase'
import { saveProviderTokens } from '@/lib/platform/services/provider-tokens-service'

export default function AuthCallback() {
 const router = useRouter()

 useEffect(() => {
  // Handle the OAuth callback
  const handleAuthCallback = async () => {
   try {
    // Get the code from the URL
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code) {
     // Exchange code for session
     const { data, error } = await supabase.auth.exchangeCodeForSession(code)

     if (error) {
      console.error('Error exchanging code for session:', error)
      router.push('/login?error=auth_failed')
      return
     }

     // Extract provider tokens if available (especially for Google OAuth)
     // See: https://supabase.com/docs/guides/auth/social-login/auth-google#saving-google-tokens
     if (data?.session) {
      const { user, provider_token, provider_refresh_token } = data.session
      
      // Determine which OAuth provider was used
      const identities = user?.identities || []
      const oauthIdentity = identities.find(identity => 
       ['google', 'github', 'twitter', 'linkedin', 'apple', 'facebook'].includes(identity.provider)
      )

      // Save provider tokens if we have them
      if (oauthIdentity && (provider_token || provider_refresh_token)) {
       const provider = oauthIdentity.provider as 'google' | 'github' | 'twitter' | 'linkedin' | 'apple' | 'facebook'
       
       await saveProviderTokens({
        userId: user.id,
        provider,
        providerToken: provider_token || null,
        providerRefreshToken: provider_refresh_token || null,
        expiresIn: 3600, // Google tokens typically expire in 1 hour
       })

       console.log(`Saved ${provider} tokens for user ${user.id}`)
      }
     }

     // Successfully authenticated
     const returnTo = params.get('returnTo') || '/dashboard'
     router.push(returnTo)
    } else {
     // No code provided, check if there's already a session
     const { data: { session } } = await supabase.auth.getSession()
     if (session) {
      const returnTo = params.get('returnTo') || '/dashboard'
      router.push(returnTo)
     } else {
      router.push('/login')
     }
    }
   } catch (error) {
    console.error('Error handling auth callback:', error)
    router.push('/login?error=auth_failed')
   }
  }

  handleAuthCallback()
 }, [router])

 return (
  <div className="min-h-screen flex items-center justify-center bg-muted/30">
   <div className="max-w-md w-full space-y-8">
    <div className="text-center">
     <h2 className="mt-6 text-3xl font-extrabold text-foreground">
      Completing sign in...
     </h2>
     <p className="mt-2 text-sm text-muted-foreground">
      Please wait while we complete your authentication.
     </p>
    </div>
   </div>
  </div>
 )
}
