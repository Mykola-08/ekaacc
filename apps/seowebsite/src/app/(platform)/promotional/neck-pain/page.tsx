'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Shield, Activity, Zap, CheckCircle, Target, Clock } from 'lucide-react';
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
  pain_severity?: string;
  pain_duration?: string;
  pain_triggers?: string[];
  pain_points?: string[];
  goals?: string[];
  preferred_session_length?: string;
}

export default function NeckPainPromotionalPage() {
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
        .select('name, pain_severity, pain_duration, pain_triggers, onboarding_data')
        .eq('id', user?.id)
        .single();

      if (userData) {
        // Fetch persona-specific content
        const { data: personaData } = await supabase
          .from('user_personas')
          .select('pain_points, goals, preferences')
          .eq('name', 'chronic_pain')
          .single();

        const preferences = personaData?.preferences || {};
        
        setPersonalization({
          user_name: userData.name,
          pain_severity: userData.pain_severity,
          pain_duration: userData.pain_duration,
          pain_triggers: userData.pain_triggers || [],
          pain_points: personaData?.pain_points || [],
          goals: personaData?.goals || [],
          preferred_session_length: preferences.preferred_session_length || '45-60min'
        });
      }
    } catch (error) {
      console.error('Error loading personalization:', error);
    } finally {
      setLoading(false);
    }
  };

  const heroTitle = personalization.user_name 
    ? `${personalization.user_name}, Find Relief from Neck Pain with Specialized Therapy`
    : 'Find Relief from Neck Pain with Specialized Therapy';

  const heroSubtitle = personalization.pain_severity
    ? `Personalized treatment for ${personalization.pain_severity} neck pain lasting ${personalization.pain_duration}`
    : 'Evidence-based therapy for chronic neck pain, tension, and discomfort';

  const benefits = [
    {
      icon: Heart,
      title: 'Pain Reduction',
      description: 'Targeted techniques to reduce neck pain and muscle tension',
      color: 'text-red-600'
    },
    {
      icon: Shield,
      title: 'Posture Correction',
      description: 'Improve posture and prevent future neck strain',
      color: 'text-blue-600'
    },
    {
      icon: Activity,
      title: 'Mobility Restoration',
      description: 'Restore full range of motion and flexibility',
      color: 'text-green-600'
    },
    {
      icon: Zap,
      title: 'Stress Relief',
      description: 'Address emotional factors contributing to neck tension',
      color: 'text-purple-600'
    }
  ];

  const painManagementStrategies = [
    {
      title: 'Mindfulness-Based Pain Management',
      description: 'Learn to observe pain without judgment and reduce suffering',
      solution: 'Meditation and body scan techniques'
    },
    {
      title: 'Progressive Muscle Relaxation',
      description: 'Systematically release tension in neck and shoulder muscles',
      solution: 'Guided relaxation and breathing exercises'
    },
    {
      title: 'Cognitive Behavioral Techniques',
      description: 'Change thought patterns that amplify pain perception',
      solution: 'Thought reframing and coping strategies'
    },
    {
      title: 'Ergonomic Assessment',
      description: 'Identify and modify environmental factors causing strain',
      solution: 'Workstation optimization and movement coaching'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Rodriguez',
      role: 'Office Manager',
      content: 'After 6 sessions, my chronic neck pain reduced by 80%. I can finally sleep through the night.',
      metric: '80%',
      metricLabel: 'Pain Reduction'
    },
    {
      name: 'Robert Johnson',
      role: 'Teacher',
      content: 'The mindfulness techniques helped me manage stress-related neck tension effectively.',
      metric: '95%',
      metricLabel: 'Stress Relief'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Loading personalized experience...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-teal-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <InView>
              <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-800">
                <Heart className="w-4 h-4 mr-2" />
                Neck Pain Relief
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
                  View Pain Management Plans
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
                We Understand Your Neck Pain Challenges
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
                          Specialized therapy approaches for lasting relief
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

      {/* Pain Management Strategies */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InView>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Comprehensive Pain Management Strategies
            </h2>
          </InView>
          
          <div className="grid md:grid-cols-2 gap-8">
            {painManagementStrategies.map((strategy, index) => (
              <InView key={index} transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}>
                <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {strategy.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {strategy.description}
                      </p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">
                          Solution: {strategy.solution}
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
              Neck Pain Relief Benefits
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
              <AnimatedNumber value={75} className="text-4xl font-bold mb-2" as="span" />
              <p className="text-blue-100">% average pain reduction</p>
            </InView>
            
            <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}>
              <AnimatedNumber value={85} className="text-4xl font-bold mb-2" as="span" />
              <p className="text-blue-100">% improvement in mobility</p>
            </InView>
            
            <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}>
              <AnimatedNumber value={90} className="text-4xl font-bold mb-2" as="span" />
              <p className="text-blue-100">% client satisfaction rate</p>
            </InView>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InView>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Neck Pain Relief Success Stories
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
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mr-3" />
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
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <InView>
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Find Relief from Neck Pain?
            </h2>
          </InView>
          
          <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands who have found lasting relief through specialized neck pain therapy and mindfulness techniques
            </p>
          </InView>
          
          <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <CheckCircle className="mr-2 h-5 w-5" />
                Start Free Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                View Pain Management Plans
              </Button>
            </div>
          </InView>
          
          <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}>
            <p className="text-sm text-blue-100 mt-6">
              ✓ Evidence-based techniques ✓ Personalized treatment plans ✓ Insurance accepted
            </p>
          </InView>
        </div>
      </section>
    </div>
  );
}