"use client";

/**
 * Wellness Insights Card
 *
 * Displays AI-generated wellness insights with action items.
 */

import * as motion from "motion/react-client";
import { Brain, ChevronRight, Lightbulb, TrendingUp, Heart, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
  type: string;
  title: string;
  description: string;
  actionItems?: string[];
}

interface WellnessInsightsProps {
  insights: Insight[];
}

const typeConfig: Record<string, { icon: typeof Brain; color: string }> = {
  wellness: { icon: Heart, color: "text-rose-500" },
  therapy: { icon: Brain, color: "text-violet-500" },
  behavioral: { icon: Target, color: "text-amber-500" },
  progress: { icon: TrendingUp, color: "text-emerald-500" },
  recommendation: { icon: Lightbulb, color: "text-blue-500" },
  mood: { icon: Zap, color: "text-orange-500" },
  engagement: { icon: TrendingUp, color: "text-cyan-500" },
};

export function WellnessInsightsCard({ insights }: WellnessInsightsProps) {
  if (insights.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card w-full max-w-md space-y-3 rounded-2xl border p-4"
    >
      <div className="flex items-center gap-2">
        <Brain className="text-primary h-4 w-4" />
        <p className="text-sm font-semibold">Wellness Insights</p>
      </div>

      {insights.map((insight, i) => {
        const cfg = typeConfig[insight.type] || typeConfig.wellness;
        const Icon = cfg.icon;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="bg-muted/50 rounded-xl p-3"
          >
            <div className="mb-1.5 flex items-center gap-2">
              <Icon className={cn("h-4 w-4", cfg.color)} />
              <p className="text-sm font-medium">{insight.title}</p>
            </div>
            <p className="text-muted-foreground mb-2 text-xs leading-relaxed">
              {insight.description}
            </p>
            {insight.actionItems && insight.actionItems.length > 0 && (
              <ul className="space-y-1">
                {insight.actionItems.map((item, j) => (
                  <li key={j} className="flex items-start gap-1.5 text-xs">
                    <ChevronRight className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
