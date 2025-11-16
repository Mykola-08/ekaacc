export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          profile_data: Json | null
          subscription_status: string | null
          subscription_end_date: string | null
          is_premium: boolean
          referral_code: string | null
          referred_by: string | null
          onboarding_completed: boolean
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
          profile_data?: Json | null
          subscription_status?: string | null
          subscription_end_date?: string | null
          is_premium?: boolean
          referral_code?: string | null
          referred_by?: string | null
          onboarding_completed?: boolean
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          profile_data?: Json | null
          subscription_status?: string | null
          subscription_end_date?: string | null
          is_premium?: boolean
          referral_code?: string | null
          referred_by?: string | null
          onboarding_completed?: boolean
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          session_data: Json
          mood_rating: number | null
          notes: string | null
          duration: number | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          session_data: Json
          mood_rating?: number | null
          notes?: string | null
          duration?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          session_data?: Json
          mood_rating?: number | null
          notes?: string | null
          duration?: number | null
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          type: 'loyalty' | 'vip'
          status: 'active' | 'cancelled' | 'expired' | 'pending' | 'past_due'
          interval: 'monthly' | 'yearly'
          price: number
          currency: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_price_id: string | null
          start_date: string
          end_date: string
          current_period_start: string | null
          current_period_end: string | null
          cancelled_at: string | null
          trial_end_date: string | null
          cancel_at_period_end: boolean
          created_by: string | null
          notes: string | null
          created_at: string
          updated_at: string
          tier_id: string | null
          payment_method: string | null
          payment_status: string
          auto_renew: boolean
          renewal_reminder_sent: boolean
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          type: 'loyalty' | 'vip'
          status: 'active' | 'cancelled' | 'expired' | 'pending' | 'past_due'
          interval: 'monthly' | 'yearly'
          price: number
          currency?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          start_date: string
          end_date: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancelled_at?: string | null
          trial_end_date?: string | null
          cancel_at_period_end?: boolean
          created_by?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          tier_id?: string | null
          payment_method?: string | null
          payment_status?: string
          auto_renew?: boolean
          renewal_reminder_sent?: boolean
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'loyalty' | 'vip'
          status?: 'active' | 'cancelled' | 'expired' | 'pending' | 'past_due'
          interval?: 'monthly' | 'yearly'
          price?: number
          currency?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          start_date?: string
          end_date?: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancelled_at?: string | null
          trial_end_date?: string | null
          cancel_at_period_end?: boolean
          created_by?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          tier_id?: string | null
          payment_method?: string | null
          payment_status?: string
          auto_renew?: boolean
          renewal_reminder_sent?: boolean
          metadata?: Json
        }
      }
      subscription_tiers: {
        Row: {
          id: string
          type: 'loyalty' | 'vip'
          name: string
          display_name: string
          description: string
          monthly_price: number
          yearly_price: number
          currency: string
          stripe_monthly_price_id: string | null
          stripe_yearly_price_id: string | null
          stripe_product_id: string | null
          benefits: string[]
          features: Json
          badge: Json
          color: string
          icon: string | null
          is_active: boolean
          order: number
          popular_badge: boolean
          created_at: string
          updated_at: string
          limitations: Json
          trial_days: number
          grace_period_days: number
          is_public: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          type: 'loyalty' | 'vip'
          name: string
          display_name: string
          description: string
          monthly_price: number
          yearly_price: number
          currency?: string
          stripe_monthly_price_id?: string | null
          stripe_yearly_price_id?: string | null
          stripe_product_id?: string | null
          benefits?: string[]
          features?: Json
          badge?: Json
          color: string
          icon?: string | null
          is_active?: boolean
          order?: number
          popular_badge?: boolean
          created_at?: string
          updated_at?: string
          limitations?: Json
          trial_days?: number
          grace_period_days?: number
          is_public?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          type?: 'loyalty' | 'vip'
          name?: string
          display_name?: string
          description?: string
          monthly_price?: number
          yearly_price?: number
          currency?: string
          stripe_monthly_price_id?: string | null
          stripe_yearly_price_id?: string | null
          stripe_product_id?: string | null
          benefits?: string[]
          features?: Json
          badge?: Json
          color?: string
          icon?: string | null
          is_active?: boolean
          order?: number
          popular_badge?: boolean
          created_at?: string
          updated_at?: string
          limitations?: Json
          trial_days?: number
          grace_period_days?: number
          is_public?: boolean
          sort_order?: number
        }
      }
      subscription_usage: {
        Row: {
          id: string
          subscription_id: string
          user_id: string
          type: 'loyalty' | 'vip'
          current_period_start: string
          current_period_end: string
          loyalty_points_earned: number
          loyalty_points_spent: number
          loyalty_discount_used: number
          sessions_used: number
          sessions_remaining: number
          personal_therapist_assigned: boolean
          group_sessions_attended: number
          reports_generated: number
          themes_used: string[]
          current_theme: string | null
          rewards_claimed: Json
          total_rewards_value: number
          last_updated: string
        }
        Insert: {
          id?: string
          subscription_id: string
          user_id: string
          type: 'loyalty' | 'vip'
          current_period_start: string
          current_period_end: string
          loyalty_points_earned?: number
          loyalty_points_spent?: number
          loyalty_discount_used?: number
          sessions_used?: number
          sessions_remaining?: number
          personal_therapist_assigned?: boolean
          group_sessions_attended?: number
          reports_generated?: number
          themes_used?: string[]
          current_theme?: string | null
          rewards_claimed?: Json
          total_rewards_value?: number
          last_updated?: string
        }
        Update: {
          id?: string
          subscription_id?: string
          user_id?: string
          type?: 'loyalty' | 'vip'
          current_period_start?: string
          current_period_end?: string
          loyalty_points_earned?: number
          loyalty_points_spent?: number
          loyalty_discount_used?: number
          sessions_used?: number
          sessions_remaining?: number
          personal_therapist_assigned?: boolean
          group_sessions_attended?: number
          reports_generated?: number
          themes_used?: string[]
          current_theme?: string | null
          rewards_claimed?: Json
          total_rewards_value?: number
          last_updated?: string
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string
          created_at: string
          status: string
          reward_claimed: boolean
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_id: string
          created_at?: string
          status?: string
          reward_claimed?: boolean
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_id?: string
          created_at?: string
          status?: string
          reward_claimed?: boolean
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          currency: string
          duration: number | null
          category: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price?: number
          currency?: string
          duration?: number | null
          category?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          currency?: string
          duration?: number | null
          category?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          session_preferences: Json
          practitioner_preferences: Json
          health_goals: Json
          biases: Json
          preferred_time: string | null
          preferred_duration: string | null
          intensity_preference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_preferences?: Json
          practitioner_preferences?: Json
          health_goals?: Json
          biases?: Json
          preferred_time?: string | null
          preferred_duration?: string | null
          intensity_preference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_preferences?: Json
          practitioner_preferences?: Json
          health_goals?: Json
          biases?: Json
          preferred_time?: string | null
          preferred_duration?: string | null
          intensity_preference?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          category: string | null
          tags: string[]
          is_published: boolean
          published_at: string | null
          likes_count: number
          comments_count: number
          views_count: number
          is_featured: boolean
          is_anonymous: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          category?: string | null
          tags?: string[]
          is_published?: boolean
          published_at?: string | null
          likes_count?: number
          comments_count?: number
          views_count?: number
          is_featured?: boolean
          is_anonymous?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          category?: string | null
          tags?: string[]
          is_published?: boolean
          published_at?: string | null
          likes_count?: number
          comments_count?: number
          views_count?: number
          is_featured?: boolean
          is_anonymous?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]