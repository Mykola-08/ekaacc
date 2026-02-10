import { LoginForm } from '@/components/platform/auth/login-form';

export default function LoginPage() {
  return (
    <div className="auth-page">
      {/* Subtle Apple-like gradient background */}
      <div className="auth-page-gradient" />
      
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
