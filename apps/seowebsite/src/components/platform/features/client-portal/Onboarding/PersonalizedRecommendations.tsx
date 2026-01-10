import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/platform/ui/button';
import { Sparkles, ArrowRight, Star, Clock, TrendingUp, Target, Calendar, Heart, CheckCircle2, Zap, Brain } from 'lucide-react';
import { api } from '@/lib/platform/mobile/api';
import { seedInitialData } from '@/lib/platform/mobile/seedData';

interface PersonalizedRecommendationsProps {
  userId: string;
  goals: string[];
  preferences: any;
  useTemplates?: boolean;
  onComplete: () => void;
}

export function PersonalizedRecommendations({ 
  userId, 
  goals, 
  preferences,
  useTemplates = false,
  onComplete 
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, [userId]);

  const loadRecommendations = async () => {
    try {
      // Save preferences
      await api.updatePreferences(userId, preferences);

      // Seed initial data (goals and upcoming appointment)
      await seedInitialData(userId, goals, useTemplates);

      // Get personalized recommendations
      const response = await api.refreshRecommendations(userId);
      setRecommendations(response.recommendations);
      
      // Show celebration after loading
      setTimeout(() => setShowCelebration(true), 500);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-rotate insights
  useEffect(() => {
    if (!recommendations?.insights || recommendations.insights.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentInsight((prev) => 
        (prev + 1) % recommendations.insights.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [recommendations]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-blue-200/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
            className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-green-200/40 to-teal-200/30 rounded-full blur-3xl"
          />
        </div>

        <div className="text-center relative z-10">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-20 h-20 mx-auto mb-6"
          >
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center shadow-xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-900 mb-3"
          >
            Creating your wellness plan...
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            Analyzing your goals and preferences
          </motion.p>

          {/* Loading progress */}
          <div className="max-w-xs mx-auto mt-8">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-gray-900 to-gray-600 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const recommendedSessions = recommendations?.recommendedSessions || [];
  const insights = recommendations?.insights || [];
  const focusAreas = recommendations?.focusAreas || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-green-200/20 to-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {showCelebration && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="text-center mb-12"
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2, duration: 0.8 }}
                className="w-20 h-20 mx-auto mb-6 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-xl" />
                <div className="relative w-full h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-900 mb-3"
              >
                Your wellness plan is ready! 🎉
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-lg"
              >
                Here's what we've personalized for you
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Insights Carousel */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-white" />
                  <h3 className="text-white">Personalized Insights</h3>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentInsight}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-lg text-white/90 leading-relaxed mb-6">
                      {insights[currentInsight]}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Progress indicators */}
                <div className="flex items-center gap-2">
                  {insights.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentInsight(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentInsight 
                          ? 'w-8 bg-white' 
                          : 'w-1.5 bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Go to insight ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Focus Areas */}
        {focusAreas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-gray-900 mb-6">Your Focus Areas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {focusAreas.map((area: string, index: number) => {
                const icons = [Heart, Brain, Zap];
                const Icon = icons[index % icons.length];
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-900">{area}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Recommended Sessions */}
        {recommendedSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-gray-900" />
              <h3 className="text-gray-900">Recommended for You</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedSessions.slice(0, 4).map((session: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 hover:border-gray-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 mb-2">{session.title || session.sessionType}</h4>
                      {session.reason && (
                        <p className="text-sm text-gray-600 mb-3">{session.reason}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {session.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.duration} min
                          </span>
                        )}
                        {session.price && (
                          <span>€{session.price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/60 text-center"
        >
          <Target className="w-12 h-12 text-gray-900 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-3">Ready to begin?</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Your personalized wellness plan is set up. Let's start your journey to better health and balance.
          </p>
          
          <Button
            onClick={onComplete}
            className="bg-gray-900 hover:bg-gray-800 text-white h-14 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all group"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>

      {/* Progress Indicator */}
      <div className="fixed bottom-8 left-0 right-0 text-center z-20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <div className="w-2 h-2 bg-gray-900 rounded-full" />
        </div>
        <p className="text-xs text-gray-500">Step 4 of 4</p>
      </div>
    </div>
  );
}



