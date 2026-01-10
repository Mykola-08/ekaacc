'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Users, Target, Award, CheckCircle, Brain, Coffee } from 'lucide-react';
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
  university?: string;
  major?: string;
  year?: string;
  pain_points?: string[];
  goals?: string[];
  preferred_session_length?: string;
}

export default function StudentPromotionalPage() {
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
        .select('name, university, major, year, onboarding_data')
        .eq('id', user?.id)
        .single();

      if (userData) {
        // Fetch persona-specific content
        const { data: personaData } = await supabase
          .from('user_personas')
          .select('pain_points, goals, preferences')
          .eq('name', 'student')
          .single();

        const preferences = personaData?.preferences || {};
        
        setPersonalization({
          user_name: userData.name,
          university: userData.university,
          major: userData.major,
          year: userData.year,
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
    ? `${personalization.user_name}, Excel Academically with Mindful Support`
    : 'Excel Academically with Mindful Support';

  const heroSubtitle = personalization.university
    ? `Tailored for ${personalization.year || ''} students at ${personalization.university}`
    : 'Tailored for students navigating academic challenges and personal growth';

  const benefits = [
    {
      icon: Brain,
      title: 'Academic Performance',
      description: 'Enhance focus, memory retention, and study efficiency through mindfulness',
      color: 'text-blue-600'
    },
    {
      icon: Coffee,
      title: 'Stress Management',
      description: 'Handle exam anxiety, deadlines, and academic pressure effectively',
      color: 'text-green-600'
    },
    {
      icon: Target,
      title: 'Goal Achievement',
      description: 'Set and achieve academic goals with personalized support',
      color: 'text-purple-600'
    },
    {
      icon: Award,
      title: 'Confidence Building',
      description: 'Build self-confidence and overcome imposter syndrome',
      color: 'text-orange-600'
    }
  ];

  const studyChallenges = [
    {
      title: 'Exam Anxiety',
      description: 'Learn techniques to stay calm and focused during exams',
      solution: 'Mindfulness-based stress reduction'
    },
    {
      title: 'Procrastination',
      description: 'Overcome avoidance and build consistent study habits',
      solution: 'Behavioral activation strategies'
    },
    {
      title: 'Imposter Syndrome',
      description: 'Build confidence in your academic abilities',
      solution: 'Cognitive restructuring techniques'
    },
    {
      title: 'Work-Life Balance',
      description: 'Manage academics, social life, and self-care',
      solution: 'Time management and boundary setting'
    }
  ];

  const testimonials = [
    {
      name: 'Emma Thompson',
      role: 'Computer Science Major',
      content: 'Therapy helped me manage my anxiety and improve my GPA from 3.2 to 3.8.',
      metric: '3.8',
      metricLabel: 'GPA Achieved'
    },
    {
      name: 'James Liu',
      role: 'Pre-Med Student',
      content: 'The mindfulness techniques helped me stay focused during MCAT preparation.',
      metric: '520',
      metricLabel: 'MCAT Score'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Loading personalized experience...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <InView>
              <Badge variant="secondary" className="mb-6 bg-purple-100 text-purple-800">
                <BookOpen className="w-4 h-4 mr-2" />
                Student Support
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
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Start Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  View Student Plans
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
                Common Student Challenges We Address
              </h2>
            </InView>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalization.pain_points.slice(0, 6).map((painPoint, index) => (
                <InView key={index} transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}>
                  <Card className="p-6 border-l-4 border-orange-400 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-bold">!</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {painPoint.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Specialized support for student-specific challenges
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

      {/* Study Challenges Solutions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InView>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Transform Your Academic Experience
            </h2>
          </InView>
          
          <div className="grid md:grid-cols-2 gap-8">
            {studyChallenges.map((challenge, index) => (
              <InView key={index} transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}>
                <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {challenge.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {challenge.description}
                      </p>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-purple-800">
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
              Student-Centered Benefits
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
      <section className="py-16 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <InView>
              <AnimatedNumber value={90} className="text-4xl font-bold mb-2" as="span" />
              <p className="text-purple-100">% improvement in academic performance</p>
            </InView>
            
            <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}>
              <AnimatedNumber value={75} className="text-4xl font-bold mb-2" as="span" />
              <p className="text-purple-100">% reduction in test anxiety</p>
            </InView>
            
            <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}>
              <AnimatedNumber value={88} className="text-4xl font-bold mb-2" as="span" />
              <p className="text-purple-100">% improvement in study efficiency</p>
            </InView>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InView>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Real Student Success Stories
            </h2>
          </InView>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <InView key={index} transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}>
                <Card className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl text-yellow-400 mr-4">"</div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
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
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3" />
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
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <InView>
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Excel in Your Studies?
            </h2>
          </InView>
          
          <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}>
            <p className="text-xl text-purple-100 mb-8">
              Join thousands of students who have improved their academic performance through mindful therapy
            </p>
          </InView>
          
          <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <CheckCircle className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                View Student Plans
              </Button>
            </div>
          </InView>
          
          <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}>
            <p className="text-sm text-purple-100 mt-6">
              ✓ Student-friendly pricing ✓ Flexible scheduling around classes ✓ Confidential support
            </p>
          </InView>
        </div>
      </section>
    </div>
  );
}