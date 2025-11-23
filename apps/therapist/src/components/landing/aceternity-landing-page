import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, 
  Star, 
  Shield, 
  Zap, 
  Users, 
  TrendingUp,
  Play,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { BlurIn } from '@/components/ui/blur-in';
import { NumberTicker } from '@/components/ui/number-ticker';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay?: number;
}

function FeatureCard({ icon, title, description, color, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
      className="group"
    >
      <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 h-full">
        <CardHeader>
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110",
            color
          )}>
            {icon}
          </div>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base leading-relaxed">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface StatItemProps {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}

function StatItem({ value, label, suffix = '', delay = 0 }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        <NumberTicker value={value} />
        {suffix}
      </div>
      <div className="text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
}

export default function AceternityLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-8">
            <BlurIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 mb-6">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-muted-foreground">Powered by AceternityUI</span>
              </div>
            </BlurIn>

            <BlurIn delay={0.1}>
              <AnimatedGradientText className="text-5xl md:text-7xl font-bold leading-tight">
                Transform Your Business
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  with Modern UI
                </span>
              </AnimatedGradientText>
            </BlurIn>

            <BlurIn delay={0.2}>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Experience the perfect blend of beauty and functionality with our cutting-edge UI components. 
                Built with React, TypeScript, and Tailwind CSS for developers who demand excellence.
              </p>
            </BlurIn>

            <BlurIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 px-8 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </BlurIn>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value={10000} label="Active Users" suffix="+" delay={0.1} />
            <StatItem value={99.9} label="Uptime" suffix="%" delay={0.2} />
            <StatItem value={24} label="Support" suffix="/7" delay={0.3} />
            <StatItem value={50} label="Components" suffix="+" delay={0.4} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <BlurIn>
              <AnimatedGradientText className="text-4xl font-bold mb-4">
                Everything You Need
              </AnimatedGradientText>
            </BlurIn>
            <BlurIn delay={0.1}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Beautiful, responsive, and accessible components that work seamlessly together.
              </p>
            </BlurIn>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-white" />}
              title="Lightning Fast"
              description="Optimized for performance with minimal bundle size and maximum efficiency. Every component is built with speed in mind."
              color="bg-gradient-to-br from-yellow-400 to-orange-500"
              delay={0.1}
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-white" />}
              title="Secure & Reliable"
              description="Built with security best practices and thoroughly tested. Your data and users are always protected."
              color="bg-gradient-to-br from-green-400 to-emerald-500"
              delay={0.2}
            />
            <FeatureCard
              icon={<Users className="h-6 w-6 text-white" />}
              title="Community Driven"
              description="Join thousands of developers using and contributing to our open-source component library."
              color="bg-gradient-to-br from-blue-400 to-indigo-500"
              delay={0.3}
            />
            <FeatureCard
              icon={<Star className="h-6 w-6 text-white" />}
              title="Beautiful Design"
              description="Carefully crafted with attention to detail. Every pixel is perfectly placed for an exceptional user experience."
              color="bg-gradient-to-br from-purple-400 to-pink-500"
              delay={0.4}
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6 text-white" />}
              title="Scalable Architecture"
              description="Built to grow with your business. Our components scale from small projects to enterprise applications."
              color="bg-gradient-to-br from-cyan-400 to-blue-500"
              delay={0.5}
            />
            <FeatureCard
              icon={<CheckCircle className="h-6 w-6 text-white" />}
              title="Easy Integration"
              description="Drop-in components that integrate seamlessly with your existing React applications. No complex setup required."
              color="bg-gradient-to-br from-emerald-400 to-teal-500"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of developers who are already building beautiful applications with AceternityUI.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-blue-600 hover:bg-slate-100 px-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 px-8 backdrop-blur-sm"
            >
              View Documentation
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}