'use client';

import { motion } from 'framer-motion';
import { Heart, Gift, Users, Sparkles, ArrowRight, Check, Star, HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { NumberTicker } from '@/components/magicui/number-ticker';

export default function DonationPlansPage() {
  const router = useRouter();

  const donationPlans = [
    {
      title: "Monthly Supporter",
      description: "Make a lasting impact with monthly donations",
      amount: "€10-50/month",
      icon: Heart,
      color: "from-green-500 to-emerald-500",
      features: [
        "Monthly recurring donation",
        "Tax-deductible receipts",
        "Quarterly impact reports",
        "Supporter newsletter",
        "Access to donor community"
      ],
      popular: false,
      impact: "Provides 5 therapy sessions monthly"
    },
    {
      title: "Champion Donor",
      description: "Champion mental health with significant support",
      amount: "€100-500/month",
      icon: HandHeart,
      color: "from-blue-500 to-cyan-500",
      features: [
        "Everything from Monthly Supporter",
        "Personalized impact updates",
        "Direct communication with beneficiaries",
        "VIP access to events",
        "Named recognition (optional)",
        "Quarterly video calls with team",
        "Custom donation allocation"
      ],
      popular: true,
      impact: "Funds complete therapy programs"
    },
    {
      title: "Transformation Partner",
      description: "Transform lives through major philanthropic support",
      amount: "€1000+/month",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      features: [
        "Everything from Champion Donor",
        "Dedicated partnership manager",
        "Monthly strategic updates",
        "Board observer rights",
        "Program co-design opportunities",
        "Annual impact summit invitation",
        "Legacy planning support",
        "Public recognition opportunities"
      ],
      popular: false,
      impact: "Transforms entire communities"
    }
  ];

  const stats = [
    { label: "Lives Impacted", value: 15420, suffix: "+" },
    { label: "Therapy Sessions Funded", value: 8930, suffix: "+" },
    { label: "Active Donors", value: 1247, suffix: "" },
    { label: "Success Rate", value: 94, suffix: "%" }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Monthly Supporter for 2 years",
      quote: "Knowing that my monthly donation helps someone access therapy gives me incredible satisfaction. The impact reports show me exactly how my contribution makes a difference."
    },
    {
      name: "Dr. James L.",
      role: "Champion Donor",
      quote: "As a mental health professional, I understand the importance of accessible therapy. This platform connects donors directly with those who need help most."
    },
    {
      name: "The Johnson Foundation",
      role: "Transformation Partner",
      quote: "Our partnership has allowed us to scale mental health support to underserved communities. The transparency and measurable outcomes are exceptional."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900 dark:to-pink-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 to-pink-600/20 dark:from-rose-600/10 dark:to-pink-600/10" />
        <motion.div 
          className="relative max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium">Make a Difference Today</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Transform Lives Through Giving
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Your donation helps provide essential mental health support to those who need it most. 
            Join our community of changemakers creating lasting impact in mental wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ShimmerButton 
              className="shadow-rose-500/20"
              onClick={() => router.push('#plans')}
            >
              Start Donating
              <ArrowRight className="w-4 h-4 ml-2" />
            </ShimmerButton>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/donations/reports')}
            >
              View Impact Reports
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Our Collective Impact
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Together, we're changing lives every day
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  <NumberTicker value={stat.value} />{stat.suffix}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Plans Section */}
      <section id="plans" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Choose Your Impact Level
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Every contribution makes a meaningful difference
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donationPlans.map((plan, index) => (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full relative ${plan.popular ? 'border-2 border-blue-500 shadow-xl' : 'hover:shadow-lg'} transition-all`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                        Most Impactful
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{plan.title}</CardTitle>
                    <CardDescription className="text-sm">{plan.description}</CardDescription>
                    <div className="text-3xl font-bold mt-4">{plan.amount}</div>
                    <p className="text-sm text-rose-600 dark:text-rose-400 font-medium mt-2">
                      {plan.impact}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter>
                    {plan.popular ? (
                      <ShimmerButton 
                        className="w-full shadow-blue-500/20"
                        onClick={() => router.push(`/checkout?plan=donation-${plan.title.toLowerCase().replace(' ', '-')}`)}
                      >
                        Start Donating
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </ShimmerButton>
                    ) : (
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' : ''}`}
                        onClick={() => router.push(`/checkout?plan=donation-${plan.title.toLowerCase().replace(' ', '-')}`)}
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              What Our Donors Say
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Hear from those who are making a difference
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <CardDescription className="text-sm italic">
                      "{testimonial.quote}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Ready to Create Lasting Impact?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Join our community of compassionate donors who are transforming mental health support. 
              Every donation, no matter the size, creates ripples of positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ShimmerButton 
                className="shadow-rose-500/20"
                onClick={() => router.push('/onboarding')}
              >
                Start Your Donation Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </ShimmerButton>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push('/donation-seeker')}
              >
                Learn About Receiving Support
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}