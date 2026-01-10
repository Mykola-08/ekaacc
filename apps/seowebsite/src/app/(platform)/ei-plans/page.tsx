'use client';

import { motion } from 'framer-motion';
import { Brain, Heart, Users, Sparkles, ArrowRight, Check, Star } from 'lucide-react';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Badge } from '@/components/platform/ui/badge';
import { PageContainer } from '@/components/platform/eka/page-container';
import { PageHeader } from '@/components/platform/eka/page-header';
import { SurfacePanel } from '@/components/platform/eka/surface-panel';
import { useRouter } from 'next/navigation';

export default function EIPlansPage() {
  const router = useRouter();

  const eiPlans = [
    {
      title: "EI Foundation",
      description: "Build essential emotional intelligence skills",
      price: "€19.99/month",
      icon: Heart,
      color: "from-blue-500 to-cyan-500",
      features: [
        "Self-awareness assessments",
        "Basic emotion regulation techniques",
        "Weekly EI exercises",
        "Progress tracking dashboard",
        "Community support access"
      ],
      popular: false
    },
    {
      title: "EI Professional",
      description: "Advanced emotional intelligence for career growth",
      price: "€39.99/month",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      features: [
        "Everything in Foundation",
        "Advanced empathy training",
        "Leadership EI modules",
        "Professional relationship building",
        "1-on-1 monthly coaching",
        "Workplace conflict resolution",
        "Career advancement tools"
      ],
      popular: true
    },
    {
      title: "EI Mastery",
      description: "Complete emotional intelligence transformation",
      price: "€69.99/month",
      icon: Sparkles,
      color: "from-amber-500 to-orange-500",
      features: [
        "Everything in Professional",
        "Personal EI coach",
        "Unlimited assessments",
        "Advanced meditation programs",
        "Executive leadership training",
        "Team EI workshops",
        "Priority support",
        "Exclusive masterclasses"
      ],
      popular: false
    }
  ];

  const benefits = [
    {
      title: "Enhanced Self-Awareness",
      description: "Understand your emotions and their impact on decisions",
      icon: Heart
    },
    {
      title: "Improved Relationships",
      description: "Build stronger, more meaningful connections",
      icon: Users
    },
    {
      title: "Better Decision Making",
      description: "Make choices aligned with your values and goals",
      icon: Brain
    },
    {
      title: "Stress Management",
      description: "Handle pressure and challenges with grace",
      icon: Sparkles
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Emotional Intelligence Plans"
        description="AI-powered programs for personal and professional growth"
        badge="EI Programs"
      />
      {/* Hero Section */}
      <SurfacePanel className="py-12">
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
            <Star className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Transform Your Emotional Intelligence</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Master Your Emotions
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Unlock your full potential with our AI-powered emotional intelligence training programs. 
            Build stronger relationships, make better decisions, and lead with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className=""
              onClick={() => router.push('#plans')}
            >
              Explore Plans
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              View Demo
            </Button>
          </div>
        </motion.div>
      </SurfacePanel>

      {/* Benefits Section */}
      <SurfacePanel className="py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Why Emotional Intelligence Matters
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Develop the skills that separate good leaders from great ones
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-blue-200 dark:hover:border-blue-800">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </SurfacePanel>

      {/* Pricing Plans Section */}
      <SurfacePanel className="py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Choose Your EI Journey
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Start your transformation today with our comprehensive programs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eiPlans.map((plan, index) => (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full relative ${plan.popular ? 'border-2 border-purple-500 shadow-xl' : 'hover:shadow-lg'} transition-all`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{plan.title}</CardTitle>
                    <CardDescription className="text-sm">{plan.description}</CardDescription>
                    <div className="text-3xl font-bold mt-4">{plan.price}</div>
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
                    <Button 
                      className={`w-full ${plan.popular ? '' : ''}`}
                      onClick={() => router.push(`/checkout?plan=ei-${plan.title.toLowerCase().replace(' ', '-')}`)}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </SurfacePanel>

      {/* CTA Section */}
      <SurfacePanel className="py-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Ready to Transform Your Life?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Join thousands of people who have already improved their emotional intelligence and changed their lives for the better.
            </p>
            <Button 
              size="lg"
              className=""
              onClick={() => router.push('/onboarding')}
            >
              Start Your Journey Today
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </SurfacePanel>
    </PageContainer>
  );
}