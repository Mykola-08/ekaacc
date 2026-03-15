import { LoginForm } from '@/components/platform/auth/login-form';
import { SuspenseBoundary } from '@/components/ui/suspense-boundary';

export default function LoginPage() {
  return (
    <div className="auth-page">
      {/* Subtle Apple-like gradient background */}
      <div className="auth-page-gradient" />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center">
        <SuspenseBoundary>
          <LoginForm />
        </SuspenseBoundary>
      </div>
    </div>
  );
}
