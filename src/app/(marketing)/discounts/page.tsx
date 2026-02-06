
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { Ticket, Users, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function DiscountsPage() {
    const { t } = useLanguage();

    const discounts = [
        {
            icon: <Ticket className="w-8 h-8 text-primary" />,
            title: "First Time Session",
            desc: "Enjoy a special discount on your first holistic consultation or massage.",
            badge: "20% OFF",
            link: "/first-time"
        },
        {
            icon: <Calendar className="w-8 h-8 text-primary" />,
            title: "Subscription Plans",
            desc: "Regular wellness is easier with our monthly plans. Save more with consistency.",
            badge: "Save 15%",
            link: "/pricing"
        },
        {
            icon: <Users className="w-8 h-8 text-primary" />,
            title: "Referral Program",
            desc: "Share the balance. Refer a friend and both receive credit for your next session.",
            badge: "10 EUR Credit",
            link: "/referrals"
        }
    ];

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                        Exclusive <span className="text-primary text-glow">Benefits</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                        We believe wellness should be accessible. Explore our current offers and loyalty programs.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {discounts.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/60 backdrop-blur-md p-10 rounded-3xl border border-white/40 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all"
                        >
                            <div className="mb-6 p-4 bg-primary/5 rounded-2xl group-hover:scale-110 transition-transform">{item.icon}</div>
                            <div className="mb-4 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-widest">
                                {item.badge}
                            </div>
                            <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                            <p className="text-muted-foreground font-light leading-relaxed mb-8 grow">
                                {item.desc}
                            </p>
                            <Link href={item.link}>
                                <Button variant="outline" className="rounded-2xl border-primary/20 text-primary hover:bg-primary/5">
                                    Learn More
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* VIP Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-24 p-12 rounded-3xl bg-linear-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-amber-500/20 shadow-2xl relative overflow-hidden text-center"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px]" />
                    <div className="relative z-10">
                        <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">VIP Ultra Premium</h2>
                        <p className="text-amber-100/60 font-light max-w-xl mx-auto mb-10 text-lg">
                            Unlock exclusive access to our most sophisticated treatments and prioritized scheduling.
                        </p>
                        <Link href="/vip/gold">
                            <Button size="lg" className="gold-shimmer rounded-2xl px-12 h-14 border-amber-500/30">
                                Apply for VIP
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

