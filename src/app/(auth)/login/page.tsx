import Image from 'next/image';
import Link from 'next/link';
import { LoginForm } from '@/components/platform/auth/login-form';
import SiteFooter from '@/components/platform/layout/site-footer';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 p-6 md:p-10 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100/20 via-transparent to-transparent dark:from-purple-900/10" />

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
      <div className="relative z-10">
        <SiteFooter />
      </div>
    </div>
  );
}
