'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Heart, Brain, GraduationCap, Sparkles, Users, Star } from 'lucide-react';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Badge } from '@/components/platform/ui/badge';
import { useRouter } from 'next/navigation';
import { ShimmerButton } from '@/components/platform/magicui/shimmer-button';
import { AnimatedGradientText } from '@/components/platform/magicui/animated-gradient-text';

export function PromotionalShowcase() {
  const router = useRouter();

  const promotionalPages = [
    {
      title: "EI Plans",
      description: "Transform your emotional intelligence with AI-powered training programs",
      icon: Brain,
      color: "from-blue-500 to-purple-500",
      gradient: "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950",
      features: [
        "AI-powered emotional intelligence training",
        "Personalized learning paths",
        "Professional coaching support",
        "Progress tracking and analytics"
      ],
      cta: "Explore EI Plans",
      href: "/ei-plans",
      badge: "Popular"
    },
    {
      title: "Donation Plans",
      description: "Make a meaningful impact on mental health support and therapy access",
      icon: Heart,
      color: "from-rose-500 to-pink-500",
      gradient: "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950",
      features: [
        "Support mental health initiatives",
        "Track your impact with detailed reports",
        "Tax-deductible contributions",
        "Join a community of changemakers"
      ],
      cta: "Start Donating",
      href: "/donation-plans",
      badge: "Impact"
    },
    {
      title: "Educational Integration",
      description: "Advanced Learning Management System with AI-powered educational tools",
      icon: GraduationCap,
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
      features: [
        "AI-powered learning paths",
        "Collaborative learning hub",
        "Gamified achievement system",
        "Advanced analytics dashboard"
      ],
      cta: "Explore ALMS",
      href: "/educational-integration",
      badge: "AI-Powered"
    }
  ];

  const stats = [
    { label: "Active Users", value: "15K+", icon: Users },
    { label: "Success Rate", value: "94%", icon: Star },
    { label: "Programs Offered", value: "25+", icon: Sparkles },
    { label: "Countries Served", value: "12", icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 dark:from-blue-600/10 dark:to-purple-600/10" />
        <motion.div 
          className="relative max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatedGradientText className="mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Premium Experience Platform
          </AnimatedGradientText>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Transform Your Journey
          </motion.h1>
          
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Discover our comprehensive suite of programs designed to enhance your emotional intelligence, 
            support meaningful causes, and provide cutting-edge educational experiences powered by AI.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ShimmerButton 
              className="shadow-primary/20"
              onClick={() => router.push('#programs')}
            >
              Explore All Programs
              <ArrowRight className="w-4 h-4 ml-2" />
            </ShimmerButton>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              View Dashboard
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Choose Your Transformation Path
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each program is carefully designed to provide maximum value and lasting impact 
              through evidence-based approaches and cutting-edge technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotionalPages.map((page, index) => (
              <motion.div
                key={page.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full relative hover:shadow-xl transition-all duration-300 hover:bg-muted/50 ${page.gradient}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${page.color} rounded-xl flex items-center justify-center`}>
                        <page.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {page.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{page.title}</CardTitle>
                    <CardDescription className="text-sm">{page.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {page.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter>
                    <ShimmerButton 
                      className="w-full shadow-blue-500/20"
                      onClick={() => router.push(page.href)}
                    >
                      {page.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </ShimmerButton>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Ready to Begin Your Transformation?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Join thousands of individuals who have already transformed their lives through our 
              innovative programs. Your journey to personal growth starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ShimmerButton 
                className="shadow-blue-500/20"
                onClick={() => router.push('/onboarding')}
              >
                Start Your Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </ShimmerButton>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push('/contact')}
              >
                Speak with an Advisor
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}