import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Heart, Target, Calendar, TrendingUp } from 'lucide-react';
const logoImage = 'https://placehold.co/400';

interface WelcomeProps {
  onNext: () => void;
  userName: string;
}

export function Welcome({ onNext, userName }: WelcomeProps) {
  const benefits = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Schedule sessions with expert practitioners in seconds',
    },
    {
      icon: Target,
      title: 'Track Progress',
      description: 'Set wellness goals and monitor your journey',
    },
    {
      icon: Heart,
      title: 'Personalized Care',
      description: 'AI-powered recommendations tailored to your needs',
    },
    {
      icon: TrendingUp,
      title: 'Measurable Results',
      description: 'See your growth with detailed insights and analytics',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-gray-200/40 to-gray-300/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-gray-200/40 to-gray-300/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-20 h-20 mx-auto mb-8 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-gray-600/10 rounded-3xl blur-xl" />
            <div className="relative w-full h-full bg-white rounded-3xl shadow-lg p-3 flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="EKA Balance Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/5 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Welcome to EKA Balance</span>
            </div>
            
            <h1 className="text-gray-900 mb-4">
              Hello, {userName}! 👋
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We're excited to help you on your wellness journey. Let's personalize your experience in just a few steps.
            </p>
          </motion.div>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 hover:border-gray-300/60 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/60 text-center"
        >
          <h3 className="text-gray-900 mb-3">Let's Get Started</h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Answer a few quick questions to help us understand your wellness goals and preferences.
          </p>
          
          <Button
            onClick={onNext}
            className="bg-gray-900 hover:bg-gray-800 text-white h-14 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all group"
          >
            <span>Begin Your Journey</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-xs text-gray-500 mt-4">
            Takes less than 2 minutes • Your data is private and secure
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-gray-900 rounded-full" />
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
          </div>
          <p className="text-xs text-gray-500">Step 1 of 4</p>
        </motion.div>
      </div>
    </div>
  );
}


