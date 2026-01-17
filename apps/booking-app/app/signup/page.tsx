import { Metadata } from 'next';
import Link from 'next/link';
import { SignupForm } from '@/components/auth/SignupForm';
import { ArrowLeft, Sparkles, Star } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Sign Up - EKA Balance',
    description: 'Create your wellness account',
};

export default function SignupPage() {
    return (
        <div className="min-h-screen w-full flex">
            {/* Form Side - Left on Signup for variety */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 bg-background relative order-2 lg:order-1">
                <div className="absolute top-8 left-8 lg:hidden">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                </div>

                <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="mb-8 text-center lg:text-left">
                        <h1 className="text-3xl font-bold mb-2">Join EKA Balance</h1>
                        <p className="text-muted-foreground">
                            Already a member?{' '}
                            <Link href="/login" className="text-rose-600 hover:text-rose-700 font-medium underline-offset-4 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>

                    <SignupForm />

                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        By joining, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                    </div>
                </div>
            </div>

            {/* Visual Side */}
            <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden order-1 lg:order-2">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full text-white">
                    <div className="flex justify-end">
                        <div className="flex items-center gap-2 text-rose-300">
                            <Sparkles className="w-6 h-6" />
                            <span className="text-xl font-bold tracking-wider">EKA BALANCE</span>
                        </div>
                    </div>

                    <div className="space-y-6 max-w-lg ml-auto text-right">
                        <div className="flex gap-1 justify-end text-amber-400 mb-2">
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                        </div>
                        <h2 className="text-4xl font-light leading-tight">
                            Start your journey to <span className="text-rose-300 font-serif italic">inner peace</span> today.
                        </h2>
                        <p className="text-white/70 text-lg">
                            "EKA Balance changed my life. The therapists are world-class and the atmosphere is pure serenity."
                        </p>
                        <p className="font-medium text-white">— Elena K., Verified Member</p>
                    </div>

                    <div className="flex items-center justify-end gap-4 text-sm text-white/50">
                        <span>Wellness Redefined</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
