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
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          status: string
          plan_type: string
          created_at: string
          updated_at: string
          current_period_start: string | null
          current_period_end: string | null
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status: string
          plan_type: string
          created_at?: string
          updated_at?: string
          current_period_start?: string | null
          current_period_end?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: string
          plan_type?: string
          created_at?: string
          updated_at?: string
          current_period_start?: string | null
          current_period_end?: string | null
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
      community_posts: {
        Row: {
          id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
          likes: number
          is_approved: boolean
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
          likes?: number
          is_approved?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
          likes?: number
          is_approved?: boolean
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