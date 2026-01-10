'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Monitor, Users, Clock, Shield, CheckCircle, Activity, Zap, Coffee, StretchHorizontal } from 'lucide-react';
import { Button } from '@/components/platform/ui/button';
import { Card } from '@/components/platform/ui/card';
import { Badge } from '@/components/platform/ui/badge';
import { TextEffect } from '@/components/platform/motion-primitives/text-effect';
import { AnimatedNumber } from '@/components/platform/motion-primitives/animated-number';
import { InView } from '@/components/platform/motion-primitives/in-view';
import { useUser } from '@/context/platform/user-context';
import { supabase } from '@/lib/platform/supabase';

interface PersonalizationData {
  user_name?: string;
  company_name?: string;
  role?: string;
  work_environment?: string;
  pain_points?: string[];
  goals?: string[];
  preferred_session_length?: string;
}

export default function OfficeWorkerPromotionalPage() {
  const { user } = useUser();
  const [personalization, setPersonalization] = useState<PersonalizationData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPersonalization();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadPersonalization = async () => {
    try {
      // Fetch user persona data from database
      const { data: userData } = await supabase
        .from('users')
        .select('name, company_name, role, work_environment, onboarding_data')
        .eq('id', user?.id)
        .single();

      if (userData) {
        // Fetch persona-specific content
        const { data: personaData } = await supabase
          .from('user_personas')
          .select('pain_points, goals, preferences')
          .eq('name', 'office_worker')
          .single();

        const preferences = personaData?.preferences || {};
        
        setPersonalization({
          user_name: userData.name,
          company_name: userData.company_name,
          role: userData.role,
          work_environment: userData.work_environment,
          pain_points: personaData?.pain_points || [],
          goals: personaData?.goals || [],
          preferred_session_length: preferences.preferred_session_length || '30-45min'
        });
      }
    } catch (error) {
      console.error('Error loading personalization:', error);
    } finally {
      setLoading(false);
    }
  };

  const heroTitle = personalization.user_name 
    ? `${personalization.user_name}, Transform Your Work Life with Ergonomic Wellness`
    : 'Transform Your Work Life with Ergonomic Wellness';

  const heroSubtitle = personalization.role
    ? `Designed for ${personalization.role}s navigating modern workplace challenges`
    : 'Designed for professionals dealing with desk work, screen time, and workplace stress';

  const benefits = [
    {
      icon: Monitor,
      title: 'Digital Wellness',
      description: 'Manage screen fatigue, eye strain, and digital overwhelm',
      color: 'text-blue-600'
    },
    {
      icon: StretchHorizontal,
      title: 'Ergonomic Health',
      description: 'Prevent and address posture-related issues and physical strain',
      color: 'text-green-600'
    },
    {
      icon: Coffee,
      title: 'Stress Management',
      description: 'Handle workplace pressure, deadlines, and office dynamics',
      color: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'Work-Life Balance',
      description: 'Create boundaries and maintain personal well-being',
      color: 'text-orange-600'
    }
  ];

  const workplaceChallenges = [
    {
      title: 'Sedentary Lifestyle',
      description: 'Combat the health risks of prolonged sitting and inactivity',
      solution: 'Movement breaks and ergonomic exercises'
    },
    {
      title: 'Screen Fatigue',
      description: 'Reduce eye strain, headaches, and digital overwhelm',
      solution: '20-20-20 rule and digital wellness techniques'
    },
    {
      title: 'Workplace Stress',
      description: 'Manage deadlines, office politics, and performance pressure',
      solution: 'Mindfulness and stress reduction strategies'
    },
    {
      title: 'Posture Problems',
      description: 'Address back pain, neck strain, and repetitive stress injuries',
      solution: 'Posture correction and strengthening exercises'
    }
  ];

  const testimonials = [
    {
      name: 'Jennifer Martinez',
      role: 'Software Developer',
      content: 'Therapy helped me eliminate chronic back pain and improve my focus at work.',
      metric: '90%',
      metricLabel: 'Pain Reduction'
    },
    {
      name: 'David Chen',
      role: 'Marketing Manager',
      content: 'The ergonomic coaching transformed my home office setup and productivity.',
      metric: '40%',
      metricLabel: 'Productivity Increase'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Loading personalized experience...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-indigo-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <InView>
              <Badge variant="secondary" className="mb-6 bg-indigo-100 text-indigo-800">
                <Monitor className="w-4 h-4 mr-2" />
                Office Professional
              </Badge>
            </InView>
            
            <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}>
              <TextEffect 
                preset="blur" 
                className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              >
                {heroTitle}
              </TextEffect>
            </InView>

            <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {heroSubtitle}
              </p>
            </InView>

            <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  Start Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  View Office Plans
                </Button>
              </div>
            </InView>
          </div>
        </div>
      </section>

      {/* Personalized Pain Points */}
      {personalization.pain_points && personalization.pain_points.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <InView>
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Office Challenges We Address
              </h2>
            </InView>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalization.pain_points.slice(0, 6).map((painPoint, index) => (
                <InView key={index} transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}>
                  <Card className="p-6 border-l-4 border-red-400 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-bold">!</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {painPoint.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Specialized solutions for workplace wellness
                        </p>
                      </div>
                    </div>
                  </Card>
                </InView>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Workplace Challenges Solutions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InView>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Transform Your Workplace Experience
            </h2>
          </InView>
          
          <div className="grid md:grid-cols-2 gap-8">
            {workplaceChallenges.map((challenge, index) => (
              <InView key={index} transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}>
                <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {challenge.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {challenge.description}
                      </p>
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-indigo-800">
                          Solution: {challenge.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InView>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Workplace Wellness Benefits
            </h2>
          </InView>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <InView key={index} transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}>
                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <benefit.icon className={`w-12 h-12 mx-auto mb-4 ${benefit.color}`} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </Card>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <InView>
              <AnimatedNumber value={65} className="text-4xl font-bold mb-2" as="span" />
              <p className="text-indigo-100">% reduction in workplace stress</p>
            </InView>
            
            <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}>
              <AnimatedNumber value={80} className="text-4xl font-bold mb-2" as="span" />
              <p className="text-indigo-100">% improvement in posture and comfort</p>
            </InView>
            
            <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}>
              <AnimatedNumber value={45} className="text-4xl font-bold mb-2" as="span" />
              <p className="text-indigo-100">% increase in productivity</p>
            </InView>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InView>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Workplace Wellness Success Stories
            </h2>
          </InView>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <InView key={index} transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}>
                <Card className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl text-yellow-400 mr-4">"</div>
                    <div>
                      <div className="text-2xl font-bold text-indigo-600">
                        {testimonial.metric}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.metricLabel}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6 italic">
                    {testimonial.content}
                  </p>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-3" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </Card>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <InView>
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Work Life?
            </h2>
          </InView>
          
          <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of office professionals who have improved their workplace wellness through ergonomic therapy
            </p>
          </InView>
          
          <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                <CheckCircle className="mr-2 h-5 w-5" />
                Start Free Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
                View Office Plans
              </Button>
            </div>
          </InView>
          
          <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}>
            <p className="text-sm text-indigo-100 mt-6">
              ✓ Ergonomic assessment included ✓ Flexible scheduling around work ✓ Corporate wellness programs
            </p>
          </InView>
        </div>
      </section>
    </div>
  );
}