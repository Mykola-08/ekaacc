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
      wallets: {
        Row: {
          id: string
          user_id: string
          balance: number
          currency: string
          is_active: boolean
          is_paused: boolean
          pause_reason: string | null
          created_at: string
          updated_at: string
          last_transaction_at: string | null
          total_credits: number
          total_debits: number
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          currency?: string
          is_active?: boolean
          is_paused?: boolean
          pause_reason?: string | null
          created_at?: string
          updated_at?: string
          last_transaction_at?: string | null
          total_credits?: number
          total_debits?: number
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          currency?: string
          is_active?: boolean
          is_paused?: boolean
          pause_reason?: string | null
          created_at?: string
          updated_at?: string
          last_transaction_at?: string | null
          total_credits?: number
          total_debits?: number
        }
      }
      wallet_transactions: {
        Row: {
          id: string
          user_id: string
          type: 'credit' | 'debit'
          amount: number
          balance_after: number
          status: 'pending' | 'completed' | 'failed' | 'cancelled'
          description: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'credit' | 'debit'
          amount: number
          balance_after: number
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          description: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'credit' | 'debit'
          amount?: number
          balance_after?: number
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          description?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      purchasable_items: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          currency: string
          type: string
          category: string | null
          is_active: boolean
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          currency?: string
          type?: string
          category?: string | null
          is_active?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          currency?: string
          type?: string
          category?: string | null
          is_active?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          user_name: string | null
          item_id: string
          item_type: string
          item_name: string
          quantity: number
          price: number
          total_amount: number
          discount_percentage: number
          currency: string
          status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          payment_method: string
          transaction_id: string | null
          metadata: Json | null
          fulfilled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_name?: string | null
          item_id: string
          item_type?: string
          item_name: string
          quantity?: number
          price: number
          total_amount: number
          discount_percentage?: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          payment_method?: string
          transaction_id?: string | null
          metadata?: Json | null
          fulfilled_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_name?: string | null
          item_id?: string
          item_type?: string
          item_name?: string
          quantity?: number
          price?: number
          total_amount?: number
          discount_percentage?: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          payment_method?: string
          transaction_id?: string | null
          metadata?: Json | null
          fulfilled_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          content: string
          message_type: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          content: string
          message_type?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          content?: string
          message_type?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          mood: string | null
          tags: string[]
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          mood?: string | null
          tags?: string[]
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          mood?: string | null
          tags?: string[]
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          target_date: string | null
          status: string
          progress: number
          category: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          target_date?: string | null
          status?: string
          progress?: number
          category?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          target_date?: string | null
          status?: string
          progress?: number
          category?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          report_type: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          report_type: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          report_type?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      donations: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          recipient_id: string | null
          message: string | null
          status: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          currency?: string
          recipient_id?: string | null
          message?: string | null
          status?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          currency?: string
          recipient_id?: string | null
          message?: string | null
          status?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string | null
          type: string
          status: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          type?: string
          status?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          type?: string
          status?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      sync_metadata: {
        Row: {
          id: string
          entity_type: string
          local_id: string
          external_id: string
          external_system: string
          entity_status: 'active' | 'deleted' | 'archived'
          sync_status: 'pending' | 'synced' | 'error' | 'conflict'
          last_sync_at: string | null
          last_sync_error: string | null
          sync_version: number
          external_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          entity_type: string
          local_id: string
          external_id: string
          external_system?: string
          entity_status?: 'active' | 'deleted' | 'archived'
          sync_status?: 'pending' | 'synced' | 'error' | 'conflict'
          last_sync_at?: string | null
          last_sync_error?: string | null
          sync_version?: number
          external_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          entity_type?: string
          local_id?: string
          external_id?: string
          external_system?: string
          entity_status?: 'active' | 'deleted' | 'archived'
          sync_status?: 'pending' | 'synced' | 'error' | 'conflict'
          last_sync_at?: string | null
          last_sync_error?: string | null
          sync_version?: number
          external_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      sync_conflicts: {
        Row: {
          id: string
          entity_type: string
          local_id: string
          external_id: string
          external_system: string
          conflict_type: 'data_mismatch' | 'deleted_remotely' | 'deleted_locally'
          local_data: Json
          external_data: Json
          resolution_strategy: 'local_wins' | 'external_wins' | 'merge' | null
          resolved_data: Json | null
          resolved_at: string | null
          resolved_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          entity_type: string
          local_id: string
          external_id: string
          external_system?: string
          conflict_type: 'data_mismatch' | 'deleted_remotely' | 'deleted_locally'
          local_data: Json
          external_data: Json
          resolution_strategy?: 'local_wins' | 'external_wins' | 'merge' | null
          resolved_data?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          entity_type?: string
          local_id?: string
          external_id?: string
          external_system?: string
          conflict_type?: 'data_mismatch' | 'deleted_remotely' | 'deleted_locally'
          local_data?: Json
          external_data?: Json
          resolution_strategy?: 'local_wins' | 'external_wins' | 'merge' | null
          resolved_data?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          created_at?: string
        }
      }
      sync_queue: {
        Row: {
          id: string
          entity_type: string
          entity_id: string
          operation: 'create' | 'update' | 'delete'
          direction: 'to_external' | 'from_external'
          external_system: string
          payload: Json
          status: 'pending' | 'processing' | 'completed' | 'failed'
          retry_count: number
          max_retries: number
          error_message: string | null
          scheduled_at: string
          processed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          entity_type: string
          entity_id: string
          operation: 'create' | 'update' | 'delete'
          direction: 'to_external' | 'from_external'
          external_system?: string
          payload: Json
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          retry_count?: number
          max_retries?: number
          error_message?: string | null
          scheduled_at?: string
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          entity_type?: string
          entity_id?: string
          operation?: 'create' | 'update' | 'delete'
          direction?: 'to_external' | 'from_external'
          external_system?: string
          payload?: Json
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          retry_count?: number
          max_retries?: number
          error_message?: string | null
          scheduled_at?: string
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sync_statistics: {
        Row: {
          id: string
          external_system: string
          entity_type: string
          sync_direction: 'inbound' | 'outbound'
          operation: 'create' | 'update' | 'delete'
          success_count: number
          error_count: number
          conflict_count: number
          avg_sync_time_ms: number | null
          last_sync_at: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          external_system?: string
          entity_type: string
          sync_direction: 'inbound' | 'outbound'
          operation: 'create' | 'update' | 'delete'
          success_count?: number
          error_count?: number
          conflict_count?: number
          avg_sync_time_ms?: number | null
          last_sync_at?: string | null
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          external_system?: string
          entity_type?: string
          sync_direction?: 'inbound' | 'outbound'
          operation?: 'create' | 'update' | 'delete'
          success_count?: number
          error_count?: number
          conflict_count?: number
          avg_sync_time_ms?: number | null
          last_sync_at?: string | null
          date?: string
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          user_id: string | null
          therapist_id: string | null
          start_time: string
          end_time: string | null
          status: string
          notes: string | null
          location: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          therapist_id?: string | null
          start_time: string
          end_time?: string | null
          status?: string
          notes?: string | null
          location?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          therapist_id?: string | null
          start_time?: string
          end_time?: string | null
          status?: string
          notes?: string | null
          location?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          email: string | null
          phone: string | null
          address: Json | null
          emergency_contact: Json | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          address?: Json | null
          emergency_contact?: Json | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          address?: Json | null
          emergency_contact?: Json | null
          metadata?: Json | null
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