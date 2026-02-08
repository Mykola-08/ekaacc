import { SignUpForm } from '@/components/platform/auth/signup-form';
import SiteFooter from '@/components/platform/layout/site-footer';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-br from-emerald-50/50 via-blue-50/30 to-purple-50/30 p-6 md:p-10 dark:from-emerald-950/30 dark:via-blue-950/30 dark:to-purple-950/30">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-100/20 via-transparent to-transparent dark:from-emerald-900/10" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-100/20 via-transparent to-transparent dark:from-purple-900/10" />

      <div className="relative z-10 w-full max-w-lg">
        <SignUpForm planId={plan} />
      </div>
      <div className="relative z-10">
        <SiteFooter />
      </div>
    </div>
  );
}
