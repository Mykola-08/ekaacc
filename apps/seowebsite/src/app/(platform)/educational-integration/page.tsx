'use client';

import { motion } from 'framer-motion';
import { BookOpen, Users, Award, TrendingUp, ArrowRight, Check, Star, Play, Clock, Target } from 'lucide-react';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Badge } from '@/components/platform/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/platform/ui/tabs';
import { useRouter } from 'next/navigation';
import { AnimatedGradientText } from '@/components/platform/magicui/animated-gradient-text';
import { BlurIn } from '@/components/platform/magicui/blur-in';

export default function EducationalIntegrationPage() {
  const router = useRouter();

  const almsFeatures = [
    {
      title: "AI-Powered Learning Paths",
      description: "Personalized educational journeys adapted to individual learning styles",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      features: [
        "Adaptive content delivery",
        "Learning style assessment",
        "Progress-based difficulty adjustment",
        "Real-time performance analytics"
      ]
    },
    {
      title: "Collaborative Learning Hub",
      description: "Connect learners with peers and mentors in meaningful ways",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      features: [
        "Peer-to-peer learning groups",
        "Expert mentorship matching",
        "Collaborative project spaces",
        "Discussion forums and Q&A"
      ]
    },
    {
      title: "Gamified Achievement System",
      description: "Motivate learners through engaging challenges and rewards",
      icon: Award,
      color: "from-purple-500 to-pink-500",
      features: [
        "Achievement badges and certificates",
        "Leaderboards and competitions",
        "Skill progression tracking",
        "Milestone celebrations"
      ]
    },
    {
      title: "Advanced Analytics Dashboard",
      description: "Comprehensive insights for educators and administrators",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      features: [
        "Learning outcome tracking",
        "Engagement metrics",
        "Completion rate analysis",
        "Predictive performance modeling"
      ]
    }
  ];

  const educationalPrograms = [
    {
      title: "Mental Health Education",
      description: "Comprehensive mental wellness curriculum for schools and organizations",
      duration: "12 weeks",
      level: "All levels",
      students: "2,847 enrolled",
      rating: 4.9,
      modules: [
        "Understanding Mental Health",
        "Stress Management Techniques",
        "Building Resilience",
        "Supporting Others",
        "Professional Resources"
      ]
    },
    {
      title: "Therapeutic Skills Training",
      description: "Professional development for healthcare providers and therapists",
      duration: "8 weeks",
      level: "Intermediate",
      students: "892 enrolled",
      rating: 4.8,
      modules: [
        "Evidence-Based Therapies",
        "Patient Communication",
        "Crisis Intervention",
        "Documentation Best Practices"
      ]
    },
    {
      title: "Wellness Coaching Certification",
      description: "Become a certified wellness coach with our comprehensive program",
      duration: "16 weeks",
      level: "Advanced",
      students: "456 enrolled",
      rating: 4.9,
      modules: [
        "Coaching Fundamentals",
        "Behavioral Change Theory",
        "Goal Setting Strategies",
        "Ethics and Professional Standards",
        "Business Development"
      ]
    }
  ];

  const integrationBenefits = [
    {
      title: "Seamless Integration",
      description: "Connect with existing educational platforms and tools",
      icon: BookOpen
    },
    {
      title: "Scalable Architecture",
      description: "Support thousands of learners simultaneously",
      icon: TrendingUp
    },
    {
      title: "Mobile-First Design",
      description: "Learn anywhere, anytime on any device",
      icon: Play
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock assistance for learners and educators",
      icon: Clock
    }
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
            <Star className="w-4 h-4 mr-2" />
            Advanced Learning Management System
          </AnimatedGradientText>
          
          <BlurIn>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Transform Education with AI
            </h1>
          </BlurIn>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Integrate our cutting-edge ALMS platform to deliver personalized, engaging, 
            and effective educational experiences that drive real learning outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => router.push('#programs')}
            >
              Explore Programs
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
      </section>

      {/* ALMS Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Advanced Learning Features
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Our ALMS platform combines artificial intelligence with proven pedagogical methods 
              to create unparalleled learning experiences
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {almsFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow border-2 hover:border-blue-200 dark:hover:border-blue-800">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-600 dark:text-slate-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Programs Section */}
      <section id="programs" className="py-16 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Featured Educational Programs
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Comprehensive courses designed by industry experts
            </p>
          </motion.div>

          <Tabs defaultValue="mental-health" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="mental-health">Mental Health</TabsTrigger>
              <TabsTrigger value="therapeutic">Therapeutic Skills</TabsTrigger>
              <TabsTrigger value="wellness">Wellness Coaching</TabsTrigger>
            </TabsList>
            
            {educationalPrograms.map((program, index) => (
              <TabsContent key={program.title} value={index === 0 ? 'mental-health' : index === 1 ? 'therapeutic' : 'wellness'}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-6">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="secondary">{program.level}</Badge>
                          <Badge variant="outline">{program.duration}</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium">{program.rating}</span>
                          </div>
                        </div>
                        <CardTitle className="text-2xl mb-2">{program.title}</CardTitle>
                        <CardDescription className="text-base mb-4">{program.description}</CardDescription>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <Users className="w-4 h-4" />
                          <span>{program.students}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col justify-center">
                        <h4 className="font-semibold mb-3">Program Modules:</h4>
                        <ul className="space-y-2 mb-6">
                          {program.modules.map((module, moduleIndex) => (
                            <li key={moduleIndex} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-slate-600 dark:text-slate-300">{module}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => router.push(`/checkout?program=${program.title.toLowerCase().replace(' ', '-')}`)}
                        >
                          Enroll Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Integration Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Integration Benefits
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Our ALMS platform seamlessly integrates with your existing infrastructure
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrationBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow border-2 hover:border-blue-200 dark:hover:border-blue-800">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
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
              Ready to Transform Education?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Join leading educational institutions that are already using our ALMS platform 
              to deliver exceptional learning experiences and measurable outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => router.push('/onboarding')}
              >
                Request Integration Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push('/contact')}
              >
                Contact Our Team
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}