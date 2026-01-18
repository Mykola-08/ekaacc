
'use client';

import { motion } from 'framer-motion';
import { Button } from '@ekaacc/shared-ui';
import { ArrowRight, Globe, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AgenyzPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <Zap className="w-4 h-4" />
                            <span>Next Generation Wellbeing</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground mb-8">
                            Agenyz <span className="text-primary">&</span> EKA Balance
                        </h1>
                        <p className="text-xl text-muted-foreground font-light leading-relaxed mb-10">
                            Innovative therapies and products for the modern world. We combine ancient wisdom with cutting-edge technology to optimize your health.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" className="rounded-2xl px-8 h-14 bg-primary text-white border-none shadow-lg shadow-primary/20">
                                Discover More
                            </Button>
                            <Link href="/services">
                                <Button variant="outline" size="lg" className="rounded-2xl px-8 h-14 backdrop-blur-sm border-foreground/10">
                                    View Our Services
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6 bg-muted/30">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
                    {[
                        {
                            icon: <Globe className="w-8 h-8 text-primary" />,
                            title: "Global Reach",
                            desc: "Connecting international expertise with local practice."
                        },
                        {
                            icon: <Shield className="w-8 h-8 text-primary" />,
                            title: "Certified Quality",
                            desc: "All products and therapies meet the highest global standards."
                        },
                        {
                            icon: <Zap className="w-8 h-8 text-primary" />,
                            title: "Rapid Results",
                            desc: "Efficient protocols designed for your busy lifestyle."
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/60 backdrop-blur-md p-10 rounded-[40px] border border-white/40 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="mb-6">{item.icon}</div>
                            <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                            <p className="text-muted-foreground font-light leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
