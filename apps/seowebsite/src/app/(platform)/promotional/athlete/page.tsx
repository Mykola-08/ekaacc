'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Trophy, Target, Zap, Shield, CheckCircle, Heart, Timer } from 'lucide-react';
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
  sport?: string;
  level?: string;
  team?: string;
  pain_points?: string[];
  goals?: string[];
  preferred_session_length?: string;
}

export default function AthletePromotionalPage() {
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
        .select('name, sport, athletic_level, team, onboarding_data')
        .eq('id', user?.id)
        .single();

      if (userData) {
        // Fetch persona-specific content
        const { data: personaData } = await supabase
          .from('user_personas')
          .select('pain_points, goals, preferences')
          .eq('name', 'athlete')
          .single();

        const preferences = personaData?.preferences || {};
        
        setPersonalization({
          user_name: userData.name || '',
          sport: userData.sport || '',
          level: userData.athletic_level || '',
          team: userData.team || '',
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
    ? `${personalization.user_name}, Optimize Your Athletic Performance with Mental Training`
    : 'Optimize Your Athletic Performance with Mental Training';

  const heroSubtitle = personalization.sport
    ? `Specialized support for ${personalization.level || ''} ${personalization.sport} athletes`
    : 'Specialized mental training for athletes seeking peak performance';

  const benefits = [
    {
      icon: Target,
      title: 'Performance Focus',
      description: 'Enhance concentration, mental toughness, and competitive edge',
      color: 'text-blue-600'
    },
    {
      icon: Heart,
      title: 'Injury Recovery',
      description: 'Mental strategies for coping with injuries and setbacks',
      color: 'text-red-600'
    },
    {
      icon: Zap,
      title: 'Pre-Game Preparation',
      description: 'Visualization and mental rehearsal techniques',
      color: 'text-yellow-600'
    },
    {
      icon: Shield,
      title: 'Pressure Management',
      description: 'Handle competition stress and performance anxiety',
      color: 'text-green-600'
    }
  ];

  const performanceChallenges = [
    {
      title: 'Performance Anxiety',
      description: 'Manage nerves and anxiety before competitions',
      solution: 'Breathing techniques and mental preparation'
    },
    {
      title: 'Injury Recovery',
      description: 'Mental rehabilitation during physical recovery',
      solution: 'Goal setting and positive mindset training'
    },
    {
      title: 'Slump Breaking',
      description: 'Overcome performance plateaus and slumps',
      solution: 'Mental reframing and confidence building'
    },
    {
      title: 'Team Dynamics',
      description: 'Navigate team relationships and communication',
      solution: 'Interpersonal skills and leadership training'
    }
  ];

  const testimonials = [
    {
      name: 'Alex Rodriguez',
      role: 'Professional Basketball Player',
      content: 'Mental training helped me improve my free throw percentage by 15% under pressure.',
      metric: '15%',
      metricLabel: 'Performance Improvement'
    },
    {
      name: 'Sarah Kim',
      role: 'Collegiate Swimmer',
      content: 'The visualization techniques helped me break through my personal records.',
      metric: '3',
      metricLabel: 'Personal Records Broken'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Loading personalized experience...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <InView>
              <Badge variant="secondary" className="mb-6 bg-green-100 text-green-800">
                <Trophy className="w-4 h-4 mr-2" />
                Athletic Performance
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
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Start Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  View Athlete Plans
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
                Athletic Challenges We Address
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
                          Specialized mental training for athletic performance
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

      {/* Performance Challenges Solutions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InView>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Mental Training for Peak Performance
            </h2>
          </InView>
          
          <div className="grid md:grid-cols-2 gap-8">
            {performanceChallenges.map((challenge, index) => (
              <InView key={index} transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}>
                <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
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
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-green-800">
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
              Athletic Performance Benefits
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
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <InView>
              <AnimatedNumber value={25} className="text-4xl font-bold mb-2" as="span" />
              <p className="text-green-100">% average performance improvement</p>
            </InView>
            
            <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}>
              <AnimatedNumber value={40} className="text-4xl font-bold mb-2" as="span" />
              <p className="text-green-100">% faster injury recovery time</p>
            </InView>
            
            <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}>
              <AnimatedNumber value={90} className="text-4xl font-bold mb-2" as="span" />
              <p className="text-green-100">% improved mental resilience</p>
            </InView>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InView>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Athletic Success Stories
            </h2>
          </InView>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <InView key={index} transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}>
                <Card className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl text-yellow-400 mr-4">"</div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
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
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-3" />
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
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <InView>
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Elevate Your Athletic Performance?
            </h2>
          </InView>
          
          <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}>
            <p className="text-xl text-green-100 mb-8">
              Join elite athletes who have gained a mental edge through sports psychology and mindfulness training
            </p>
          </InView>
          
          <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <CheckCircle className="mr-2 h-5 w-5" />
                Start Free Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                View Athlete Plans
              </Button>
            </div>
          </InView>
          
          <InView transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}>
            <p className="text-sm text-green-100 mt-6">
              ✓ Sports psychology expertise ✓ Flexible scheduling around training ✓ Performance-focused approach
            </p>
          </InView>
        </div>
      </section>
    </div>
  );
}