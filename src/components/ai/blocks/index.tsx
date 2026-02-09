"use client";

/**
 * Visual Block Renderer
 *
 * Maps tool call _visualBlock data to the appropriate prebuilt visual component.
 */

import { MoodLoggedCard } from "./mood-logged-card";
import { MoodTrendCard } from "./mood-trend-card";
import { UpcomingBookingsCard } from "./upcoming-bookings-card";
import { WalletBalanceCard } from "./wallet-balance-card";
import { ServicesListCard } from "./services-list-card";
import { WellnessInsightsCard } from "./wellness-insights-card";

interface VisualBlockData {
  type: string;
  [key: string]: unknown;
}

interface VisualBlockRendererProps {
  block: VisualBlockData;
}

export function VisualBlockRenderer({ block }: VisualBlockRendererProps) {
  switch (block.type) {
    case "mood-logged":
      return (
        <MoodLoggedCard
          mood={block.mood as string}
          score={block.score as number}
          energy={block.energy as number | undefined}
          stress={block.stress as number | undefined}
        />
      );

    case "mood-trend":
      return (
        <MoodTrendCard
          moods={block.moods as any[]}
          averageScore={block.averageScore as number}
          trend={block.trend as "improving" | "declining" | "stable"}
          days={block.days as number}
        />
      );

    case "upcoming-bookings":
      return (
        <UpcomingBookingsCard bookings={block.bookings as any[]} />
      );

    case "wallet-balance":
      return (
        <WalletBalanceCard
          balance={block.balance as number}
          currency={block.currency as string}
        />
      );

    case "services-list":
      return (
        <ServicesListCard services={block.services as any[]} />
      );

    case "wellness-insights":
      return (
        <WellnessInsightsCard insights={block.insights as any[]} />
      );

    default:
      return null;
  }
}

export {
  MoodLoggedCard,
  MoodTrendCard,
  UpcomingBookingsCard,
  WalletBalanceCard,
  ServicesListCard,
  WellnessInsightsCard,
};
