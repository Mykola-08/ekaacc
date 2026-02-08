
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 overflow-hidden relative">
            {/* Background blobs for "sensations" */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="max-w-md w-full text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/60 backdrop-blur-2xl border border-white/40 p-12 rounded-3xl shadow-2xl space-y-8"
                >
                    <div className="space-y-4">
                        <h1 className="text-8xl font-light tracking-tighter text-foreground/20">404</h1>
                        <h2 className="text-3xl font-semibold text-foreground tracking-tight">Page Not Found</h2>
                        <p className="text-muted-foreground font-light leading-relaxed">
                            It seems the path to your wellbeing took an unexpected turn. Let's get you back on track.
                        </p>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <Link href="/">
                            <Button
                                size="lg"
                                className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl py-6 shadow-lg shadow-primary/25 border-none"
                            >
                                <Home className="mr-2 w-5 h-5" />
                                Back to Home
                            </Button>
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="w-full flex items-center justify-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                        >
                            <ArrowLeft className="mr-2 w-4 h-4" />
                            Go Back
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

