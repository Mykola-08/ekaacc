'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AIBehavioralInsights from '@/components/eka/ai-behavioral-insights';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AIInsightsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:bg-white/50"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Behavioral Insights
                </h1>
                <p className="text-muted-foreground mt-1">
                  Comprehensive analysis of your behavioral patterns and predictive insights
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"
              >
                <Brain className="w-6 h-6 text-blue-600" />
              </motion.div>
              <Badge variant="outline" className="text-xs">
                AI Powered
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AIBehavioralInsights />
        </motion.div>

        {/* Footer Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50"
        >
          <h3 className="font-semibold text-lg mb-3 flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span>About AI Behavioral Analysis</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">How It Works</h4>
              <ul className="space-y-1">
                <li>• Analyzes your interaction patterns in real-time</li>
                <li>• Detects behavioral trends and changes</li>
                <li>• Generates predictive insights using AI algorithms</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Privacy & Security</h4>
              <ul className="space-y-1">
                <li>• All data is encrypted and HIPAA compliant</li>
                <li>• Insights are personalized and confidential</li>
                <li>• You control what gets tracked and analyzed</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
