'use client';

/**
 * Wellness Insights Card
 *
 * Displays AI-generated wellness insights with action items.
 */

import * as motion from 'motion/react-client';
import { cn } from '@/lib/utils';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
  AnalyticsUpIcon,
  ArrowRight01Icon,
  Brain01Icon,
  BulbIcon,
  FavouriteIcon,
  Idea01Icon,
  Target01Icon,
  ZapIcon,
} from '@hugeicons/core-free-icons';

interface Insight {
  type: string;
  title: string;
  description: string;
  actionItems?: string[];
}

interface WellnessInsightsProps {
  insights: Insight[];
}

const typeConfig: Record<string, { icon: IconSvgElement; color: string }> = {
  wellness: { icon: FavouriteIcon, color: 'text-destructive' },
  therapy: { icon: Brain01Icon, color: 'text-chart-4' },
  behavioral: { icon: Target01Icon, color: 'text-warning' },
  progress: { icon: AnalyticsUpIcon, color: 'text-success' },
  recommendation: { icon: BulbIcon, color: 'text-primary' },
  mood: { icon: ZapIcon, color: 'text-warning' },
  engagement: { icon: AnalyticsUpIcon, color: 'text-info' },
};

export function WellnessInsightsCard({ insights }: WellnessInsightsProps) {
  if (insights.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card w-full max-w-md rounded-[calc(var(--radius)*0.8)] border p-4"
    >
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={Brain01Icon} className="text-primary size-4" />
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
            className="bg-muted/50 rounded-[var(--radius)] p-3"
          >
            <div className="mb-1.5 flex items-center gap-2">
              <HugeiconsIcon icon={Icon} className={cn('h-4 w-4', cfg.color)} />
              <p className="text-sm font-medium">{insight.title}</p>
            </div>
            <p className="text-muted-foreground mb-2 text-xs leading-relaxed">
              {insight.description}
            </p>
            {insight.actionItems && insight.actionItems.length > 0 && (
              <ul className="">
                {insight.actionItems.map((item, j) => (
                  <li key={j} className="flex items-start gap-1.5 text-xs">
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className="text-primary mt-0.5 size-3 shrink-0"
                    />
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
