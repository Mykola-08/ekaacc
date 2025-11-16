'use client';

import React from 'react';
import { AIChatWidget } from '@/components/ai/vercel-ai-chat-widget';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Heart, MessageCircle } from 'lucide-react';

const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, delay: 0.2 }
  }
};

export default function AIDemoPage() {
  return (
    <div className="apple-page">
      {/* Header Section */}
      <motion.div
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        className="apple-section text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="apple-icon-hero mb-8"
        >
          <Brain className="w-10 h-10 text-white" />
        </motion.div>
        
        <h1 className="apple-title-hero mb-6">
          AI Wellness Assistant
        </h1>
        
        <p className="apple-text-lead apple-max-w-2xl mx-auto mb-12">
          Experience our advanced AI-powered mental health support system, designed to provide personalized, empathetic, and professional assistance for your wellness journey.
        </p>

        <div className="apple-flex-center gap-6 mb-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="apple-badge apple-badge-blue"
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="apple-badge-text">Powered by Vercel AI SDK</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="apple-badge apple-badge-purple"
          >
            <Heart className="w-4 h-4 text-purple-500" />
            <span className="apple-badge-text">HIPAA Compliant</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="apple-badge apple-badge-green"
          >
            <MessageCircle className="w-4 h-4 text-green-500" />
            <span className="apple-badge-text">24/7 Support</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="apple-container pb-20">
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="apple-grid-3 mb-20"
        >
          <motion.div
            variants={cardVariants}
            className="apple-card apple-card-blue"
          >
            <div className="apple-card-icon apple-card-icon-blue">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="apple-card-title">Smart Conversations</h3>
            <p className="apple-card-text">
              Advanced natural language processing for meaningful, context-aware conversations about your mental health.
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="apple-card apple-card-purple"
          >
            <div className="apple-card-icon apple-card-icon-purple">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="apple-card-title">Empathetic Support</h3>
            <p className="apple-card-text">
              Trained to provide warm, supportive responses that acknowledge your feelings and offer genuine help.
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="apple-card apple-card-green"
          >
            <div className="apple-card-icon apple-card-icon-green">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="apple-card-title">Personalized Insights</h3>
            <p className="apple-card-text">
              Adapts to your unique situation and provides tailored recommendations based on your wellness journey.
            </p>
          </motion.div>
        </motion.div>

        {/* AI Chat Widget Demo */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="apple-max-w-2xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="apple-title-section mb-6">
              Try Our AI Assistant
            </h2>
            <p className="apple-text-body apple-max-w-lg mx-auto mb-8">
              Start a conversation with our AI wellness assistant and experience the future of mental health support.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            {/* Glow effect behind widget */}
            <div className="apple-glow apple-glow-blue" />
            
            <AIChatWidget
              className="apple-widget"
              context="You are demonstrating AI-powered mental health support. Be especially helpful, empathetic, and professional while showcasing your capabilities."
              onResponse={(response) => {
                console.log('AI Response:', response);
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <div className="apple-card apple-card-subtle">
              <h3 className="apple-card-title mb-4">💡 Try asking:</h3>
              <div className="apple-flex-center gap-3 flex-wrap">
                <span className="apple-tag apple-tag-blue">
                  "I'm feeling overwhelmed, can you help?"
                </span>
                <span className="apple-tag apple-tag-purple">
                  "What are some anxiety coping strategies?"
                </span>
                <span className="apple-tag apple-tag-green">
                  "How can I improve my sleep?"
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="apple-section border-t border-border/50"
      >
        <p className="apple-text-caption apple-text-center apple-max-w-3xl mx-auto">
          ⚠️ This AI assistant is for support and information purposes only. 
          It is not a substitute for professional mental health care. 
          If you're experiencing a crisis, please contact a mental health professional or crisis hotline.
        </p>
      </motion.div>
    </div>
}