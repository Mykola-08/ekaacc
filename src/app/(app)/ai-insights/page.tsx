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
    <div className="apple-page">
      <div className="apple-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="apple-mb-12"
        >
          <div className="apple-flex-between">
            <div className="apple-flex apple-items-center apple-gap-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="apple-hover-lift"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="apple-title-section">
                  AI Behavioral Insights
                </h1>
                <p className="apple-text-body apple-mt-2">
                  Comprehensive analysis of your behavioral patterns and predictive insights
                </p>
              </div>
            </div>
            <div className="hidden sm:flex apple-items-center apple-gap-3">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="apple-card-icon apple-card-icon-blue"
              >
                <Brain className="w-6 h-6 text-blue-600" />
              </motion.div>
              <Badge variant="outline" className="apple-text-xs">
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

        {/* Apple Footer Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="apple-mt-16 apple-card apple-card-blue apple-p-8"
        >
          <h3 className="apple-title-card apple-mb-6 apple-flex apple-items-center apple-gap-3">
            <Brain className="w-5 h-5 text-blue-600" />
            <span>About AI Behavioral Analysis</span>
          </h3>
          <div className="apple-grid-2 apple-gap-6 apple-text-sm">
            <div>
              <h4 className="apple-title-subsection apple-mb-3">How It Works</h4>
              <ul className="apple-space-y-2">
                <li>• Analyzes your interaction patterns in real-time</li>
                <li>• Detects behavioral trends and changes</li>
                <li>• Generates predictive insights using AI algorithms</li>
              </ul>
            </div>
            <div>
              <h4 className="apple-title-subsection apple-mb-3">Privacy & Security</h4>
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
