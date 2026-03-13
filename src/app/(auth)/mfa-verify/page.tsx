'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { MFAVerifyForm } from '@/components/platform/auth/mfa-verify-form';
import { Loader2 } from 'lucide-react';

export default function MFAVerifyPage() {
  const router = useRouter();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMFA = async () => {
      const supabase = createClient();

      // Check assurance level
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (!aal) {
        router.push('/login');
        return;
      }

      // If already at aal2, go to dashboard
      if (aal.currentLevel === 'aal2') {
        router.push('/dashboard');
        return;
      }

      // If aal1 and nextLevel is aal2, need MFA
      if (aal.currentLevel === 'aal1' && aal.nextLevel === 'aal2') {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const totpFactor = factors?.totp?.find((f) => f.status === 'verified');

        if (totpFactor) {
          setFactorId(totpFactor.id);
        } else {
          // No MFA factor set up, shouldn't be here
          router.push('/dashboard');
        }
      } else {
        // No MFA required
        router.push('/dashboard');
      }

      setLoading(false);
    };

    checkMFA();
  }, [router]);

  if (loading || !factorId) {
    return (
      <div className="auth-page">
        <div className="auth-page-gradient" />
        <div className="relative z-10 flex items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-page-gradient" />
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center">
        <MFAVerifyForm
          factorId={factorId}
          onCancel={() => {
            const supabase = createClient();
            supabase.auth.signOut();
            router.push('/login');
          }}
        />
      </div>
    </div>
  );
}
