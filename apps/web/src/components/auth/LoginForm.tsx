'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Loader2, Mail, Lock } from 'lucide-react';

export function LoginForm() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error(error.message);
                return;
            }

            toast.success('Welcome back!');
            router.push('/');
            router.refresh();
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        type="email"
                        required
                        className="pl-10 h-11 bg-muted/30 border-input/60 focus:bg-background transition-all"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
                        Forgot password?
                    </a>
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="pl-10 h-11 bg-muted/30 border-input/60 focus:bg-background transition-all"
                    />
                </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
            </Button>
        </form>
    );
}
