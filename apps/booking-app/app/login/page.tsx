import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Login - EKA Balance',
    description: 'Sign in to your account',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex">
            {/* Visual Side */}
            <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full text-white">
                    <div className="flex items-center gap-2 text-rose-300">
                        <Sparkles className="w-6 h-6" />
                        <span className="text-xl font-bold tracking-wider">EKA BALANCE</span>
                    </div>

                    <div className="space-y-6 max-w-lg">
                        <h2 className="text-4xl font-light leading-tight">
                            "The greatest wealth is <span className="text-rose-300 font-serif italic">health</span>."
                        </h2>
                        <p className="text-white/70 text-lg">
                            Return to your sanctuary. Track your progress, book sessions, and manage your wellness journey.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-white/50">
                        <span>© 2026 EKA Balance</span>
                        <span className="w-1 h-1 bg-white/50 rounded-full" />
                        <span>Privacy Policy</span>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 bg-background relative">
                <div className="absolute top-8 left-8 lg:hidden">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                </div>

                <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="mb-8 text-center lg:text-left">
                        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-muted-foreground">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-rose-600 hover:text-rose-700 font-medium underline-offset-4 hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <LoginForm />

                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
