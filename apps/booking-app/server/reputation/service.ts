import { db } from '@/lib/db';

export interface ReputationScore {
  score: number;
  level: 'new' | 'risky' | 'neutral' | 'trusted' | 'vip';
  metrics: {
    completedBookings: number;
    completedValueCents: number;
    noShows: number;
    cancellations: number;
    totalBookings: number;
  };
}

export interface BookingPolicy {
  canBook: boolean;
  requiredDepositPercent: number; // 0 to 100
  allowPayLater: boolean;
  rejectionReason?: string;
}

export class ReputationService {
  
  static async getReputation(email: string): Promise<ReputationScore> {
    // Fetch detailed stats
    const { rows } = await db.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
        COALESCE(SUM(base_price_cents) FILTER (WHERE status = 'completed'), 0) as completed_value,
        COUNT(*) FILTER (WHERE status = 'no_show') as noshow_count,
        COUNT(*) FILTER (WHERE status = 'canceled') as canceled_count,
        COUNT(*) as total_count
      FROM booking
      WHERE email = $1
    `, [email]);

    const stats = rows[0];
    const completedCount = parseInt(stats.completed_count || '0');
    const completedValue = parseInt(stats.completed_value || '0');
    const noShowCount = parseInt(stats.noshow_count || '0');
    const canceledCount = parseInt(stats.canceled_count || '0');
    const totalCount = parseInt(stats.total_count || '0');

    let score = 50; // Base score (Neutral)

    // Positive factors
    // 1. Reliability
    score += completedCount * 10;
    
    // 2. Value (Price paid)
    // Add 1 point for every 100 EUR spent lifetime
    score += Math.floor(completedValue / 10000); 

    // Negative factors
    score -= noShowCount * 50; // Heavy penalty for wasting time
    score -= canceledCount * 5; // Light penalty for instability

    // Clamping
    score = Math.max(0, Math.min(100, score));

    // Determine Level based on Score and Red Flags
    let level: ReputationScore['level'] = 'neutral';
    
    // Logic hierarchy
    if (noShowCount > 2 || score < 30) {
        level = 'risky';
    } else if (totalCount === 0) {
        level = 'new';
    } else if (score >= 80) {
        level = 'vip';
    } else if (score >= 60) {
        level = 'trusted';
    } else {
        level = 'neutral';
    }

    return {
      score,
      level,
      metrics: {
        completedBookings: completedCount,
        completedValueCents: completedValue,
        noShows: noShowCount,
        cancellations: canceledCount,
        totalBookings: totalCount
      }
    };
  }

  /**
   * Calculates the required deposit and booking permission based on user reputation.
   */
  static async getPolicyForService(email: string, servicePriceCents: number): Promise<BookingPolicy> {
    const reputation = await this.getReputation(email);

    // 1. Risky Users
    if (reputation.level === 'risky') {
       // If strict no-show history, block booking
       if (reputation.metrics.noShows >= 5) {
         return { 
            canBook: false, 
            requiredDepositPercent: 100, 
            allowPayLater: false, 
            rejectionReason: 'Booking privileges suspended due to multiple no-shows.' 
         };
       }
       // Otherwise require 100% upfront
       return { 
           canBook: true, 
           requiredDepositPercent: 100, 
           allowPayLater: false 
       };
    }

    // 2. New Users
    if (reputation.level === 'new') {
        // Standard policy: 50% deposit
        return { 
            canBook: true, 
            requiredDepositPercent: 50, 
            allowPayLater: false 
        };
    }

    // 3. VIP Users
    if (reputation.level === 'vip') {
        // Benefit: No deposit required, Pay at venue available
        return { 
            canBook: true, 
            requiredDepositPercent: 0, 
            allowPayLater: true 
        };
    }

    // 4. Trusted Users
    if (reputation.level === 'trusted') {
         // Benefit: Reduced deposit (20%) or pay later for small amounts
         if (servicePriceCents < 5000) { // < 50 EUR
             return { canBook: true, requiredDepositPercent: 0, allowPayLater: true };
         }
         return { 
             canBook: true, 
             requiredDepositPercent: 20, 
             allowPayLater: false 
         };
    }

    // 5. Neutral (Default)
    return { 
        canBook: true, 
        requiredDepositPercent: 50, 
        allowPayLater: false 
    };
  }
}
