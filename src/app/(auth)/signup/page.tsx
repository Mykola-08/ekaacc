import { SignUpForm } from '@/components/platform/auth/signup-form';
import SiteFooter from '@/components/platform/layout/site-footer';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;

  return (
    <div className="auth-page">
      {/* Subtle Apple-like gradient background */}
      <div className="auth-page-gradient" />
      
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center">
         <SignUpForm planId={plan} />
      </div>
      
      <div className="relative z-10 w-full mt-auto">
        <SiteFooter />
      </div>
    </div>
  );
}
