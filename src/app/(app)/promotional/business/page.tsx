'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Clock, Users, TrendingUp, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TextEffect } from '@/components/motion-primitives/text-effect';
import { AnimatedNumber } from '@/components/motion-primitives/animated-number';
import { InView } from '@/components/motion-primitives/in-view';
import { useUser } from '@/context/user-context';
import { supabase } from '@/lib/supabase';

interface PersonalizationData {
  user_name?: string;
  company_name?: string;
  role?: string;
  pain_points?: string[];
  goals?: string[];
  preferred_session_length?: string;
}

export default function BusinessPromotionalPage() {
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
        .select('name, company_name, role, onboarding_data')
        .eq('id', user?.id)
        .single();

      if (userData) {
        // Fetch persona-specific content
        const { data: personaData } = await supabase
          .from('user_personas')
          .select('pain_points, goals, preferences')
          .eq('name', 'business_professional')
          .single();

        const preferences = personaData?.preferences || {};
        
        setPersonalization({
          user_name: userData.name,
          company_name: userData.company_name,
          role: userData.role,
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
    ? `${personalization.user_name}, Transform Your Leadership with Mindful Therapy`
    : 'Transform Your Leadership with Mindful Therapy';

  const heroSubtitle = personalization.company_name
    ? `Built for busy professionals at ${personalization.company_name}`
    : 'Built for busy professionals who demand results';

  const benefits = [
    {
      icon: Clock,
      title: 'Time-Efficient Sessions',
      description: `Flexible ${personalization.preferred_session_length || '30-45min'} sessions that fit your busy schedule`,
      color: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Performance Enhancement',
      description: 'Boost productivity and decision-making through mindfulness techniques',
      color: 'text-green-600'
    },
    {
      icon: Users,
      title: 'Executive Coaching',
      description: 'Leadership-focused therapy for high-performing professionals',
      color: 'text-purple-600'
    },
    {
      icon: Shield,
      title: 'Stress Management',
      description: 'Proven strategies to handle work pressure and prevent burnout',
      color: 'text-orange-600'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO, TechCorp',
      content: 'Mindful therapy helped me reduce stress by 70% and improve my leadership decisions.',
      metric: '70%',
      metricLabel: 'Stress Reduction'
    },
    {
      name: 'Michael Rodriguez',
      role: 'VP Operations',
      content: 'The flexibility and business-focused approach made therapy finally work for my schedule.',
      metric: '95%',
      metricLabel: 'Session Satisfaction'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Loading personalized experience...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <InView>
              <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-800">
                <Briefcase className="w-4 h-4 mr-2" />
                Business Professional
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
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  View Pricing Plans
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
                We Understand Your Challenges
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
                          We have specific strategies to address this challenge
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

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InView>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Designed for Business Success
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
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <InView>
              <AnimatedNumber value={85} className="text-4xl font-bold mb-2" as="span" />
              <p className="text-blue-100">% of clients report improved work performance</p>
            </InView>
            
            <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}>
              <AnimatedNumber value={70} className="text-4xl font-bold mb-2" as="span" />
              <p className="text-blue-100">% reduction in stress levels</p>
            </InView>
            
            <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}>
              <AnimatedNumber value={95} className="text-4xl font-bold mb-2" as="span" />
              <p className="text-blue-100">% client satisfaction rate</p>
            </InView>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InView>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Success Stories from Business Leaders
            </h2>
          </InView>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <InView key={index} transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}>
                <Card className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl text-yellow-400 mr-4">"</div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
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
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3" />
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
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <InView>
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Leadership?
            </h2>
          </InView>
          
          <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of business professionals who have enhanced their performance through mindful therapy
            </p>
          </InView>
          
          <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <CheckCircle className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Schedule Consultation
              </Button>
            </div>
          </InView>
          
          <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}>
            <p className="text-sm text-blue-100 mt-6">
              ✓ No credit card required ✓ Cancel anytime ✓ HIPAA compliant
            </p>
          </InView>
        </div>
      </section>
    </div>
  );
}