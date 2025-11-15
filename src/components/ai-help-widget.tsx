/**
 * @file AI Help Widget - Motion Primitives Component
 * @description Interactive AI help widget with glow effects using motion-primitives
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Sparkles, MessageCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  getAIHelpRecommendations, 
  getSupportiveMessage,
  type AIHelpRecommendation,
  type AIHelpRequest 
} from '@/ai/ai-help-service';

interface AIHelpWidgetProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  initialQuery?: string;
  showGlow?: boolean;
  glowColor?: string;
  context?: string;
  page?: string;
}

export function AIHelpWidget({
  className,
  position = 'bottom-right',
  initialQuery = '',
  showGlow = true,
  glowColor = 'rgb(59, 130, 246)', // blue-500
  context = '',
  page = ''
}: AIHelpWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [recommendations, setRecommendations] = useState<AIHelpRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [supportiveMessage, setSupportiveMessage] = useState('');
  const [showSupportiveMessage, setShowSupportiveMessage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Position styles
  const positionStyles = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  // Handle AI recommendations
  const handleGetRecommendations = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const request: AIHelpRequest = {
        query: query.trim(),
        context,
        page
      };

      const [recs, message] = await Promise.all([
        getAIHelpRecommendations(query.trim(), context, page),
        getSupportiveMessage(query.trim())
      ]);

      setRecommendations(recs);
      setSupportiveMessage(message);
      setShowSupportiveMessage(true);
    } catch (error) {
      console.error('Failed to get AI recommendations:', error);
      // Fallback to basic recommendations
      setRecommendations([
        {
          id: 'fallback-1',
          title: 'Contact Support',
          description: 'Reach out to our support team for assistance',
          category: 'general',
          confidence: 0.8
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGetRecommendations();
    }
  };

  // Glow effect variants
  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  // Widget variants
  const widgetVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      x: position.includes('left') ? -20 : 20
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      x: position.includes('left') ? -20 : 20,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  // Recommendation item variants
  const recommendationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      {/* Glow effect background */}
      {showGlow && (
        <motion.div
          className={cn(
            "fixed z-50 pointer-events-none",
            positionStyles[position]
          )}
          variants={glowVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <div 
            className="w-24 h-24 rounded-full blur-xl opacity-30"
            style={{ backgroundColor: glowColor }}
          />
        </motion.div>
      )}

      {/* Main widget */}
      <motion.div
        className={cn(
          "fixed z-50",
          positionStyles[position],
          className
        )}
      >
        {/* Floating action button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600",
            "shadow-lg hover:shadow-xl transition-shadow duration-300",
            "flex items-center justify-center text-white",
            "border-2 border-white/20 backdrop-blur-sm"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="help"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <HelpCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulsing animation when not open */}
          {!isOpen && (
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.button>

        {/* AI Help Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={cn(
                "absolute bottom-20 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg",
                "rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50",
                "overflow-hidden"
              )}
              variants={widgetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5 text-blue-500" />
                    </motion.div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      AI Help Assistant
                    </h3>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                  </div>
                </div>
              </div>

              {/* Supportive Message */}
              <AnimatePresence>
                {showSupportiveMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {supportiveMessage}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Search Input */}
              <div className="p-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="How can I help you today?"
                    className={cn(
                      "w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                      "rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      "transition-all duration-200"
                    )}
                  />
                  <MessageCircle className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  
                  {/* Search button */}
                  <motion.button
                    onClick={handleGetRecommendations}
                    disabled={isLoading || !query.trim()}
                    className={cn(
                      "absolute right-2 top-2 p-1.5 rounded-lg bg-blue-500 text-white",
                      "hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
                      "transition-colors duration-200"
                    )}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Recommendations */}
              <div className="px-4 pb-4 max-h-80 overflow-y-auto">
                <AnimatePresence>
                  {recommendations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Suggestions for you
                      </h4>
                      <div className="space-y-2">
                        {recommendations.map((rec, index) => (
                          <motion.div
                            key={rec.id}
                            custom={index}
                            variants={recommendationVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            onClick={() => rec.action?.()}
                            className={cn(
                              "p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                              "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200",
                              rec.action && "hover:shadow-md"
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                  {rec.title}
                                </h5>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {rec.description}
                                </p>
                              </div>
                              <div className="ml-3 flex-shrink-0">
                                <div className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium",
                                  rec.category === 'therapy' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                                  rec.category === 'technical' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                                  rec.category === 'navigation' && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
                                  rec.category === 'general' && "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                )}>
                                  {rec.category}
                                </div>
                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
                                  {Math.round(rec.confidence * 100)}%
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Empty state */}
                {recommendations.length === 0 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ask me anything about therapy, navigation, or account help
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

/**
 * AI Help Button - Minimal version for embedding in other components
 */
export function AIHelpButton({
  onClick,
  className,
  showGlow = true,
  glowColor = 'rgb(59, 130, 246)'
}: {
  onClick: () => void;
  className?: string;
  showGlow?: boolean;
  glowColor?: string;
}) {
  return (
    <div className="relative">
      {showGlow && (
        <motion.div
          className="absolute inset-0 rounded-full blur-xl opacity-30"
          style={{ backgroundColor: glowColor }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      <motion.button
        onClick={onClick}
        className={cn(
          "relative p-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white",
          "shadow-lg hover:shadow-xl transition-shadow duration-300",
          "hover:scale-110 transition-transform duration-200",
          className
        )}
        whileTap={{ scale: 0.95 }}
      >
        <HelpCircle className="w-5 h-5" />
      </motion.button>
    </div>
  );
}