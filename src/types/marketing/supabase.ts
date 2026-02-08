export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      content_blocks: {
        Row: {
          id: string;
          key: string;
          data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          data: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          data?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      user_onboarding: {
        Row: {
          id: string;
          user_id: string;
          data: Json;
          recommendations: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          data: Json;
          recommendations?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          data?: Json;
          recommendations?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_onboarding_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      discounts: {
        Row: {
          id: string;
          name: string;
          code: string;
          percentage: number;
          is_active: boolean;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          percentage: number;
          is_active?: boolean;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          percentage?: number;
          is_active?: boolean;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      academy_applications: {
        Row: {
          application_date: string | null;
          application_status: string;
          availability_description: string | null;
          cover_letter: string | null;
          created_at: string | null;
          decision_notes: string | null;
          desired_hourly_rate: number | null;
          id: string;
          organization_id: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          subjects_offered: string[] | null;
          teacher_id: string;
        };
        Insert: {
          application_date?: string | null;
          application_status?: string;
          availability_description?: string | null;
          cover_letter?: string | null;
          created_at?: string | null;
          decision_notes?: string | null;
          desired_hourly_rate?: number | null;
          id?: string;
          organization_id: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          subjects_offered?: string[] | null;
          teacher_id: string;
        };
        Update: {
          application_date?: string | null;
          application_status?: string;
          availability_description?: string | null;
          cover_letter?: string | null;
          created_at?: string | null;
          decision_notes?: string | null;
          desired_hourly_rate?: number | null;
          id?: string;
          organization_id?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          subjects_offered?: string[] | null;
          teacher_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'academy_applications_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'academy_applications_reviewed_by_fkey';
            columns: ['reviewed_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'academy_applications_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      academy_billing_settings: {
        Row: {
          allow_custom_price_override: boolean | null;
          auto_invoice: boolean | null;
          billing_model: string;
          bundle_pricing_enabled: boolean | null;
          created_at: string | null;
          currency: string | null;
          default_hourly_rate: number | null;
          default_session_rate: number | null;
          default_teacher_hourly_rate: number | null;
          default_teacher_percentage: number | null;
          id: string;
          invoice_frequency: string | null;
          late_payment_days: number | null;
          late_payment_fee: number | null;
          organization_id: string;
          tax_rate: number | null;
          teacher_pay_model: string | null;
          updated_at: string | null;
        };
        Insert: {
          allow_custom_price_override?: boolean | null;
          auto_invoice?: boolean | null;
          billing_model?: string;
          bundle_pricing_enabled?: boolean | null;
          created_at?: string | null;
          currency?: string | null;
          default_hourly_rate?: number | null;
          default_session_rate?: number | null;
          default_teacher_hourly_rate?: number | null;
          default_teacher_percentage?: number | null;
          id?: string;
          invoice_frequency?: string | null;
          late_payment_days?: number | null;
          late_payment_fee?: number | null;
          organization_id: string;
          tax_rate?: number | null;
          teacher_pay_model?: string | null;
          updated_at?: string | null;
        };
        Update: {
          allow_custom_price_override?: boolean | null;
          auto_invoice?: boolean | null;
          billing_model?: string;
          bundle_pricing_enabled?: boolean | null;
          created_at?: string | null;
          currency?: string | null;
          default_hourly_rate?: number | null;
          default_session_rate?: number | null;
          default_teacher_hourly_rate?: number | null;
          default_teacher_percentage?: number | null;
          id?: string;
          invoice_frequency?: string | null;
          late_payment_days?: number | null;
          late_payment_fee?: number | null;
          organization_id?: string;
          tax_rate?: number | null;
          teacher_pay_model?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'academy_billing_settings_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: true;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      academy_branding: {
        Row: {
          accent_color: string | null;
          created_at: string | null;
          custom_css: string | null;
          font_family: string | null;
          id: string;
          logo_url: string | null;
          organization_id: string;
          primary_color: string | null;
          secondary_color: string | null;
          terminology: Json | null;
          updated_at: string | null;
        };
        Insert: {
          accent_color?: string | null;
          created_at?: string | null;
          custom_css?: string | null;
          font_family?: string | null;
          id?: string;
          logo_url?: string | null;
          organization_id: string;
          primary_color?: string | null;
          secondary_color?: string | null;
          terminology?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          accent_color?: string | null;
          created_at?: string | null;
          custom_css?: string | null;
          font_family?: string | null;
          id?: string;
          logo_url?: string | null;
          organization_id?: string;
          primary_color?: string | null;
          secondary_color?: string | null;
          terminology?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'academy_branding_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: true;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      academy_modules: {
        Row: {
          attendance_tracking_enabled: boolean | null;
          behaviour_tracking_enabled: boolean | null;
          calendar_integration_enabled: boolean | null;
          created_at: string | null;
          email_notifications_enabled: boolean | null;
          gamification_enabled: boolean | null;
          homework_tracking_enabled: boolean | null;
          id: string;
          marketplace_visibility_enabled: boolean | null;
          open_study_tracking_enabled: boolean | null;
          organization_id: string;
          parent_messaging_enabled: boolean | null;
          payment_module_enabled: boolean | null;
          progress_tracking_enabled: boolean | null;
          sms_notifications_enabled: boolean | null;
          student_self_reflection_enabled: boolean | null;
          student_teacher_reviews_enabled: boolean | null;
          teacher_student_notes_enabled: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          attendance_tracking_enabled?: boolean | null;
          behaviour_tracking_enabled?: boolean | null;
          calendar_integration_enabled?: boolean | null;
          created_at?: string | null;
          email_notifications_enabled?: boolean | null;
          gamification_enabled?: boolean | null;
          homework_tracking_enabled?: boolean | null;
          id?: string;
          marketplace_visibility_enabled?: boolean | null;
          open_study_tracking_enabled?: boolean | null;
          organization_id: string;
          parent_messaging_enabled?: boolean | null;
          payment_module_enabled?: boolean | null;
          progress_tracking_enabled?: boolean | null;
          sms_notifications_enabled?: boolean | null;
          student_self_reflection_enabled?: boolean | null;
          student_teacher_reviews_enabled?: boolean | null;
          teacher_student_notes_enabled?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          attendance_tracking_enabled?: boolean | null;
          behaviour_tracking_enabled?: boolean | null;
          calendar_integration_enabled?: boolean | null;
          created_at?: string | null;
          email_notifications_enabled?: boolean | null;
          gamification_enabled?: boolean | null;
          homework_tracking_enabled?: boolean | null;
          id?: string;
          marketplace_visibility_enabled?: boolean | null;
          open_study_tracking_enabled?: boolean | null;
          organization_id?: string;
          parent_messaging_enabled?: boolean | null;
          payment_module_enabled?: boolean | null;
          progress_tracking_enabled?: boolean | null;
          sms_notifications_enabled?: boolean | null;
          student_self_reflection_enabled?: boolean | null;
          student_teacher_reviews_enabled?: boolean | null;
          teacher_student_notes_enabled?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'academy_modules_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: true;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      academy_payment_methods: {
        Row: {
          created_at: string | null;
          display_name: string | null;
          display_order: number | null;
          enabled: boolean | null;
          fee_percentage: number | null;
          id: string;
          method: string;
          organization_id: string;
          paypal_client_id: string | null;
          stripe_account_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          display_name?: string | null;
          display_order?: number | null;
          enabled?: boolean | null;
          fee_percentage?: number | null;
          id?: string;
          method: string;
          organization_id: string;
          paypal_client_id?: string | null;
          stripe_account_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          display_name?: string | null;
          display_order?: number | null;
          enabled?: boolean | null;
          fee_percentage?: number | null;
          id?: string;
          method?: string;
          organization_id?: string;
          paypal_client_id?: string | null;
          stripe_account_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'academy_payment_methods_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      academy_student_fields: {
        Row: {
          category: string | null;
          created_at: string | null;
          default_value: string | null;
          display_order: number | null;
          enabled: boolean | null;
          field_name: string;
          field_type: string;
          id: string;
          options: Json | null;
          organization_id: string;
          required: boolean | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          default_value?: string | null;
          display_order?: number | null;
          enabled?: boolean | null;
          field_name: string;
          field_type: string;
          id?: string;
          options?: Json | null;
          organization_id: string;
          required?: boolean | null;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          default_value?: string | null;
          display_order?: number | null;
          enabled?: boolean | null;
          field_name?: string;
          field_type?: string;
          id?: string;
          options?: Json | null;
          organization_id?: string;
          required?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'academy_student_fields_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      agent_actions: {
        Row: {
          action_type: string;
          agent_id: string | null;
          created_at: string | null;
          id: string;
          input_data: Json | null;
          output_data: Json | null;
          status: string | null;
          user_id: string | null;
        };
        Insert: {
          action_type: string;
          agent_id?: string | null;
          created_at?: string | null;
          id?: string;
          input_data?: Json | null;
          output_data?: Json | null;
          status?: string | null;
          user_id?: string | null;
        };
        Update: {
          action_type?: string;
          agent_id?: string | null;
          created_at?: string | null;
          id?: string;
          input_data?: Json | null;
          output_data?: Json | null;
          status?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      ai_insights: {
        Row: {
          action_items: Json;
          confidence: number | null;
          created_at: string;
          description: string;
          expires_at: string | null;
          id: string;
          insight_id: string;
          is_active: boolean;
          metadata: Json | null;
          title: string;
          type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          action_items?: Json;
          confidence?: number | null;
          created_at?: string;
          description: string;
          expires_at?: string | null;
          id?: string;
          insight_id: string;
          is_active?: boolean;
          metadata?: Json | null;
          title: string;
          type: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          action_items?: Json;
          confidence?: number | null;
          created_at?: string;
          description?: string;
          expires_at?: string | null;
          id?: string;
          insight_id?: string;
          is_active?: boolean;
          metadata?: Json | null;
          title?: string;
          type?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      ai_personalization_profiles: {
        Row: {
          adaptive_settings: Json;
          behavior_patterns: Json;
          created_at: string;
          last_updated: string;
          preferences: Json;
          user_id: string;
          wellness_insights: Json;
        };
        Insert: {
          adaptive_settings?: Json;
          behavior_patterns?: Json;
          created_at?: string;
          last_updated?: string;
          preferences?: Json;
          user_id: string;
          wellness_insights?: Json;
        };
        Update: {
          adaptive_settings?: Json;
          behavior_patterns?: Json;
          created_at?: string;
          last_updated?: string;
          preferences?: Json;
          user_id?: string;
          wellness_insights?: Json;
        };
        Relationships: [];
      };
      appointments: {
        Row: {
          created_at: string | null;
          date: string | null;
          duration: number | null;
          feedback_id: string | null;
          follow_up_notes: string | null;
          guest_email: string | null;
          guest_name: string | null;
          guest_phone: string | null;
          id: string;
          is_first_time: boolean | null;
          is_guest: boolean | null;
          last_updated_by_system: string | null;
          location: string | null;
          meeting_link: string | null;
          notes: string | null;
          payment_status: string | null;
          practitioner: string | null;
          practitioner_id: string | null;
          preferences: Json | null;
          preparation_notes: string | null;
          price: number | null;
          rating: number | null;
          service_id: string | null;
          session_outcome: string | null;
          session_type: string | null;
          status: string | null;
          stripe_payment_intent_id: string | null;
          time: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          date?: string | null;
          duration?: number | null;
          feedback_id?: string | null;
          follow_up_notes?: string | null;
          guest_email?: string | null;
          guest_name?: string | null;
          guest_phone?: string | null;
          id?: string;
          is_first_time?: boolean | null;
          is_guest?: boolean | null;
          last_updated_by_system?: string | null;
          location?: string | null;
          meeting_link?: string | null;
          notes?: string | null;
          payment_status?: string | null;
          practitioner?: string | null;
          practitioner_id?: string | null;
          preferences?: Json | null;
          preparation_notes?: string | null;
          price?: number | null;
          rating?: number | null;
          service_id?: string | null;
          session_outcome?: string | null;
          session_type?: string | null;
          status?: string | null;
          stripe_payment_intent_id?: string | null;
          time?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          date?: string | null;
          duration?: number | null;
          feedback_id?: string | null;
          follow_up_notes?: string | null;
          guest_email?: string | null;
          guest_name?: string | null;
          guest_phone?: string | null;
          id?: string;
          is_first_time?: boolean | null;
          is_guest?: boolean | null;
          last_updated_by_system?: string | null;
          location?: string | null;
          meeting_link?: string | null;
          notes?: string | null;
          payment_status?: string | null;
          practitioner?: string | null;
          practitioner_id?: string | null;
          preferences?: Json | null;
          preparation_notes?: string | null;
          price?: number | null;
          rating?: number | null;
          service_id?: string | null;
          session_outcome?: string | null;
          session_type?: string | null;
          status?: string | null;
          stripe_payment_intent_id?: string | null;
          time?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'appointments_service_id_fkey';
            columns: ['service_id'];
            isOneToOne: false;
            referencedRelation: 'services';
            referencedColumns: ['id'];
          },
        ];
      };
      assessments: {
        Row: {
          completed_at: string | null;
          completed_by: string | null;
          created_at: string;
          id: string;
          interpretation: string | null;
          is_completed: boolean;
          metadata: Json | null;
          questions: Json;
          responses: Json | null;
          scores: Json | null;
          title: string;
          type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          completed_by?: string | null;
          created_at?: string;
          id?: string;
          interpretation?: string | null;
          is_completed?: boolean;
          metadata?: Json | null;
          questions?: Json;
          responses?: Json | null;
          scores?: Json | null;
          title: string;
          type: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          completed_by?: string | null;
          created_at?: string;
          id?: string;
          interpretation?: string | null;
          is_completed?: boolean;
          metadata?: Json | null;
          questions?: Json;
          responses?: Json | null;
          scores?: Json | null;
          title?: string;
          type?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          created_at: string | null;
          id: string;
          new_data: Json | null;
          old_data: Json | null;
          operation: string;
          organization_id: string | null;
          performed_by: string | null;
          record_id: string | null;
          table_name: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          new_data?: Json | null;
          old_data?: Json | null;
          operation: string;
          organization_id?: string | null;
          performed_by?: string | null;
          record_id?: string | null;
          table_name: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          new_data?: Json | null;
          old_data?: Json | null;
          operation?: string;
          organization_id?: string | null;
          performed_by?: string | null;
          record_id?: string | null;
          table_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'audit_logs_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      availability_slots: {
        Row: {
          created_at: string | null;
          day_of_week: number | null;
          end_time: string;
          id: string;
          max_bookings: number | null;
          organization_id: string;
          recurring: boolean | null;
          slot_type: string | null;
          specific_date: string | null;
          start_time: string;
          teacher_id: string;
        };
        Insert: {
          created_at?: string | null;
          day_of_week?: number | null;
          end_time: string;
          id?: string;
          max_bookings?: number | null;
          organization_id: string;
          recurring?: boolean | null;
          slot_type?: string | null;
          specific_date?: string | null;
          start_time: string;
          teacher_id: string;
        };
        Update: {
          created_at?: string | null;
          day_of_week?: number | null;
          end_time?: string;
          id?: string;
          max_bookings?: number | null;
          organization_id?: string;
          recurring?: boolean | null;
          slot_type?: string | null;
          specific_date?: string | null;
          start_time?: string;
          teacher_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'availability_slots_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'availability_slots_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      behavioral_patterns: {
        Row: {
          confidence_score: number;
          created_at: string;
          evidence: Json;
          first_detected: string;
          id: string;
          last_updated: string;
          metadata: Json | null;
          pattern_type: string;
          severity: string | null;
          status: string;
          user_id: string;
        };
        Insert: {
          confidence_score: number;
          created_at?: string;
          evidence?: Json;
          first_detected?: string;
          id?: string;
          last_updated?: string;
          metadata?: Json | null;
          pattern_type: string;
          severity?: string | null;
          status?: string;
          user_id: string;
        };
        Update: {
          confidence_score?: number;
          created_at?: string;
          evidence?: Json;
          first_detected?: string;
          id?: string;
          last_updated?: string;
          metadata?: Json | null;
          pattern_type?: string;
          severity?: string | null;
          status?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      behaviour_events: {
        Row: {
          action_taken: string | null;
          behaviour_level: string;
          behaviour_score: number | null;
          category: string | null;
          class_id: string | null;
          created_at: string | null;
          created_by: string;
          description: string;
          event_date: string;
          id: string;
          notify_parent: boolean | null;
          organization_id: string;
          parent_notified_at: string | null;
          student_id: string;
          tags: string[] | null;
          teacher_id: string | null;
          updated_at: string | null;
          visible_to_student: boolean | null;
        };
        Insert: {
          action_taken?: string | null;
          behaviour_level: string;
          behaviour_score?: number | null;
          category?: string | null;
          class_id?: string | null;
          created_at?: string | null;
          created_by: string;
          description: string;
          event_date?: string;
          id?: string;
          notify_parent?: boolean | null;
          organization_id: string;
          parent_notified_at?: string | null;
          student_id: string;
          tags?: string[] | null;
          teacher_id?: string | null;
          updated_at?: string | null;
          visible_to_student?: boolean | null;
        };
        Update: {
          action_taken?: string | null;
          behaviour_level?: string;
          behaviour_score?: number | null;
          category?: string | null;
          class_id?: string | null;
          created_at?: string | null;
          created_by?: string;
          description?: string;
          event_date?: string;
          id?: string;
          notify_parent?: boolean | null;
          organization_id?: string;
          parent_notified_at?: string | null;
          student_id?: string;
          tags?: string[] | null;
          teacher_id?: string | null;
          updated_at?: string | null;
          visible_to_student?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'behaviour_events_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'behaviour_events_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'behaviour_events_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'behaviour_events_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'behaviour_events_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      billing_invoices: {
        Row: {
          amount: number;
          created_at: string;
          currency: string;
          due_date: string;
          id: string;
          invoice_number: string;
          issued_at: string;
          metadata: Json | null;
          paid_at: string | null;
          status: string;
          tax_amount: number | null;
          total_amount: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          currency?: string;
          due_date: string;
          id?: string;
          invoice_number: string;
          issued_at?: string;
          metadata?: Json | null;
          paid_at?: string | null;
          status?: string;
          tax_amount?: number | null;
          total_amount: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          currency?: string;
          due_date?: string;
          id?: string;
          invoice_number?: string;
          issued_at?: string;
          metadata?: Json | null;
          paid_at?: string | null;
          status?: string;
          tax_amount?: number | null;
          total_amount?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      billing_transactions: {
        Row: {
          amount: number;
          created_at: string;
          currency: string;
          description: string;
          gateway: string | null;
          gateway_transaction_id: string | null;
          id: string;
          metadata: Json | null;
          reference_id: string | null;
          status: string;
          type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          currency?: string;
          description: string;
          gateway?: string | null;
          gateway_transaction_id?: string | null;
          id?: string;
          metadata?: Json | null;
          reference_id?: string | null;
          status?: string;
          type: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          currency?: string;
          description?: string;
          gateway?: string | null;
          gateway_transaction_id?: string | null;
          id?: string;
          metadata?: Json | null;
          reference_id?: string | null;
          status?: string;
          type?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          admin_notes: string | null;
          amount_paid: number | null;
          booking_type: string | null;
          confirmed_at: string | null;
          confirmed_by: string | null;
          created_at: string | null;
          deposit_amount: number | null;
          id: string;
          notes: string | null;
          organization_id: string;
          parent_id: string | null;
          payment_method: string | null;
          payment_status: string | null;
          price_quoted: number | null;
          requested_end_time: string;
          requested_start_time: string;
          status: string | null;
          stripe_payment_intent_id: string | null;
          student_id: string | null;
          subject_id: string | null;
          teacher_id: string;
          updated_at: string | null;
        };
        Insert: {
          admin_notes?: string | null;
          amount_paid?: number | null;
          booking_type?: string | null;
          confirmed_at?: string | null;
          confirmed_by?: string | null;
          created_at?: string | null;
          deposit_amount?: number | null;
          id?: string;
          notes?: string | null;
          organization_id: string;
          parent_id?: string | null;
          payment_method?: string | null;
          payment_status?: string | null;
          price_quoted?: number | null;
          requested_end_time: string;
          requested_start_time: string;
          status?: string | null;
          stripe_payment_intent_id?: string | null;
          student_id?: string | null;
          subject_id?: string | null;
          teacher_id: string;
          updated_at?: string | null;
        };
        Update: {
          admin_notes?: string | null;
          amount_paid?: number | null;
          booking_type?: string | null;
          confirmed_at?: string | null;
          confirmed_by?: string | null;
          created_at?: string | null;
          deposit_amount?: number | null;
          id?: string;
          notes?: string | null;
          organization_id?: string;
          parent_id?: string | null;
          payment_method?: string | null;
          payment_status?: string | null;
          price_quoted?: number | null;
          requested_end_time?: string;
          requested_start_time?: string;
          status?: string | null;
          stripe_payment_intent_id?: string | null;
          student_id?: string | null;
          subject_id?: string | null;
          teacher_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'bookings_confirmed_by_fkey';
            columns: ['confirmed_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_subject_id_fkey';
            columns: ['subject_id'];
            isOneToOne: false;
            referencedRelation: 'subjects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      broadcasts: {
        Row: {
          content: string;
          created_at: string | null;
          created_by: string | null;
          group_id: string | null;
          id: string;
          metadata: Json | null;
          sent_at: string | null;
          subject: string;
          topic: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          created_by?: string | null;
          group_id?: string | null;
          id?: string;
          metadata?: Json | null;
          sent_at?: string | null;
          subject: string;
          topic?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          created_by?: string | null;
          group_id?: string | null;
          id?: string;
          metadata?: Json | null;
          sent_at?: string | null;
          subject?: string;
          topic?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'broadcasts_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'user_groups';
            referencedColumns: ['id'];
          },
        ];
      };
      class_enrollments: {
        Row: {
          attendance_status: string | null;
          class_id: string;
          enrolled_at: string | null;
          enrollment_status: string | null;
          id: string;
          notes: string | null;
          organization_id: string;
          payment_status: string | null;
          price_paid: number | null;
          student_id: string;
        };
        Insert: {
          attendance_status?: string | null;
          class_id: string;
          enrolled_at?: string | null;
          enrollment_status?: string | null;
          id?: string;
          notes?: string | null;
          organization_id: string;
          payment_status?: string | null;
          price_paid?: number | null;
          student_id: string;
        };
        Update: {
          attendance_status?: string | null;
          class_id?: string;
          enrolled_at?: string | null;
          enrollment_status?: string | null;
          id?: string;
          notes?: string | null;
          organization_id?: string;
          payment_status?: string | null;
          price_paid?: number | null;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'class_enrollments_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'class_enrollments_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'class_enrollments_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      classes: {
        Row: {
          capacity: number | null;
          class_type: string;
          created_at: string | null;
          current_enrollment: number | null;
          description: string | null;
          duration_minutes: number | null;
          end_time: string;
          id: string;
          notes: string | null;
          organization_id: string;
          price_override: number | null;
          price_per_student: number | null;
          recurring_id: string | null;
          room_id: string | null;
          start_time: string;
          status: string | null;
          subject_id: string | null;
          tags: string[] | null;
          teacher_id: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          capacity?: number | null;
          class_type: string;
          created_at?: string | null;
          current_enrollment?: number | null;
          description?: string | null;
          duration_minutes?: number | null;
          end_time: string;
          id?: string;
          notes?: string | null;
          organization_id: string;
          price_override?: number | null;
          price_per_student?: number | null;
          recurring_id?: string | null;
          room_id?: string | null;
          start_time: string;
          status?: string | null;
          subject_id?: string | null;
          tags?: string[] | null;
          teacher_id?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          capacity?: number | null;
          class_type?: string;
          created_at?: string | null;
          current_enrollment?: number | null;
          description?: string | null;
          duration_minutes?: number | null;
          end_time?: string;
          id?: string;
          notes?: string | null;
          organization_id?: string;
          price_override?: number | null;
          price_per_student?: number | null;
          recurring_id?: string | null;
          room_id?: string | null;
          start_time?: string;
          status?: string | null;
          subject_id?: string | null;
          tags?: string[] | null;
          teacher_id?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'classes_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'classes_room_id_fkey';
            columns: ['room_id'];
            isOneToOne: false;
            referencedRelation: 'rooms';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'classes_subject_id_fkey';
            columns: ['subject_id'];
            isOneToOne: false;
            referencedRelation: 'subjects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'classes_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      community_posts: {
        Row: {
          category: string | null;
          content: string;
          created_at: string;
          edited_at: string | null;
          edited_by: string | null;
          id: string;
          is_approved: boolean | null;
          is_locked: boolean | null;
          is_pinned: boolean | null;
          likes: number | null;
          metadata: Json | null;
          replies_count: number | null;
          tags: string[] | null;
          title: string;
          updated_at: string;
          user_id: string;
          views_count: number | null;
        };
        Insert: {
          category?: string | null;
          content: string;
          created_at?: string;
          edited_at?: string | null;
          edited_by?: string | null;
          id?: string;
          is_approved?: boolean | null;
          is_locked?: boolean | null;
          is_pinned?: boolean | null;
          likes?: number | null;
          metadata?: Json | null;
          replies_count?: number | null;
          tags?: string[] | null;
          title: string;
          updated_at?: string;
          user_id: string;
          views_count?: number | null;
        };
        Update: {
          category?: string | null;
          content?: string;
          created_at?: string;
          edited_at?: string | null;
          edited_by?: string | null;
          id?: string;
          is_approved?: boolean | null;
          is_locked?: boolean | null;
          is_pinned?: boolean | null;
          likes?: number | null;
          metadata?: Json | null;
          replies_count?: number | null;
          tags?: string[] | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
          views_count?: number | null;
        };
        Relationships: [];
      };
      custom_roles: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean;
          is_system_role: boolean;
          name: string;
          permissions: Json;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          is_system_role?: boolean;
          name: string;
          permissions?: Json;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          is_system_role?: boolean;
          name?: string;
          permissions?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      direct_messages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          is_deleted_by_recipient: boolean;
          is_deleted_by_sender: boolean;
          is_read: boolean;
          message_type: string | null;
          metadata: Json | null;
          read_at: string | null;
          recipient_id: string;
          sender_id: string;
          subject: string | null;
          updated_at: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          is_deleted_by_recipient?: boolean;
          is_deleted_by_sender?: boolean;
          is_read?: boolean;
          message_type?: string | null;
          metadata?: Json | null;
          read_at?: string | null;
          recipient_id: string;
          sender_id: string;
          subject?: string | null;
          updated_at?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          is_deleted_by_recipient?: boolean;
          is_deleted_by_sender?: boolean;
          is_read?: boolean;
          message_type?: string | null;
          metadata?: Json | null;
          read_at?: string | null;
          recipient_id?: string;
          sender_id?: string;
          subject?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      donations: {
        Row: {
          amount: number;
          cause: string | null;
          created_at: string;
          currency: string;
          donor_id: string;
          id: string;
          is_anonymous: boolean;
          message: string | null;
          metadata: Json | null;
          recipient_id: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          amount: number;
          cause?: string | null;
          created_at?: string;
          currency?: string;
          donor_id: string;
          id?: string;
          is_anonymous?: boolean;
          message?: string | null;
          metadata?: Json | null;
          recipient_id?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          cause?: string | null;
          created_at?: string;
          currency?: string;
          donor_id?: string;
          id?: string;
          is_anonymous?: boolean;
          message?: string | null;
          metadata?: Json | null;
          recipient_id?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      exercises: {
        Row: {
          category: string | null;
          created_at: string;
          description: string | null;
          difficulty_level: string | null;
          duration_minutes: number | null;
          id: string;
          instructions: string | null;
          is_active: boolean;
          media_urls: Json | null;
          metadata: Json | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          difficulty_level?: string | null;
          duration_minutes?: number | null;
          id?: string;
          instructions?: string | null;
          is_active?: boolean;
          media_urls?: Json | null;
          metadata?: Json | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          difficulty_level?: string | null;
          duration_minutes?: number | null;
          id?: string;
          instructions?: string | null;
          is_active?: boolean;
          media_urls?: Json | null;
          metadata?: Json | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      features: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          is_enabled: boolean | null;
          key: string;
          min_role: string | null;
          name: string;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_enabled?: boolean | null;
          key: string;
          min_role?: string | null;
          name: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_enabled?: boolean | null;
          key?: string;
          min_role?: string | null;
          name?: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      feedback: {
        Row: {
          category: string;
          comment: string | null;
          context_data: Json | null;
          created_at: string | null;
          id: string;
          rating: number | null;
          status: string | null;
          user_id: string | null;
        };
        Insert: {
          category: string;
          comment?: string | null;
          context_data?: Json | null;
          created_at?: string | null;
          id?: string;
          rating?: number | null;
          status?: string | null;
          user_id?: string | null;
        };
        Update: {
          category?: string;
          comment?: string | null;
          context_data?: Json | null;
          created_at?: string | null;
          id?: string;
          rating?: number | null;
          status?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      goals: {
        Row: {
          achieved_at: string | null;
          category: string | null;
          created_at: string;
          description: string | null;
          id: string;
          is_achieved: boolean;
          metadata: Json | null;
          progress_percentage: number | null;
          status: string;
          target_date: string | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          achieved_at?: string | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_achieved?: boolean;
          metadata?: Json | null;
          progress_percentage?: number | null;
          status?: string;
          target_date?: string | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          achieved_at?: string | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_achieved?: boolean;
          metadata?: Json | null;
          progress_percentage?: number | null;
          status?: string;
          target_date?: string | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      invoice_items: {
        Row: {
          class_id: string | null;
          created_at: string | null;
          description: string;
          id: string;
          invoice_id: string;
          quantity: number;
          service_id: string | null;
          total_price: number | null;
          unit_price: number;
        };
        Insert: {
          class_id?: string | null;
          created_at?: string | null;
          description: string;
          id?: string;
          invoice_id: string;
          quantity?: number;
          service_id?: string | null;
          total_price?: number | null;
          unit_price: number;
        };
        Update: {
          class_id?: string | null;
          created_at?: string | null;
          description?: string;
          id?: string;
          invoice_id?: string;
          quantity?: number;
          service_id?: string | null;
          total_price?: number | null;
          unit_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'invoice_items_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invoice_items_invoice_id_fkey';
            columns: ['invoice_id'];
            isOneToOne: false;
            referencedRelation: 'invoices';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invoice_items_service_id_fkey';
            columns: ['service_id'];
            isOneToOne: false;
            referencedRelation: 'services';
            referencedColumns: ['id'];
          },
        ];
      };
      invoices: {
        Row: {
          amount_due: number | null;
          amount_paid: number | null;
          created_at: string | null;
          discount_amount: number | null;
          due_date: string | null;
          id: string;
          invoice_number: string;
          issue_date: string;
          last_updated_by_system: string | null;
          notes: string | null;
          organization_id: string;
          paid_at: string | null;
          parent_id: string | null;
          payment_method: string | null;
          status: string;
          stripe_invoice_id: string | null;
          stripe_payment_intent_id: string | null;
          student_id: string | null;
          tax_amount: number | null;
          terms: string | null;
          total_amount: number;
          updated_at: string | null;
        };
        Insert: {
          amount_due?: number | null;
          amount_paid?: number | null;
          created_at?: string | null;
          discount_amount?: number | null;
          due_date?: string | null;
          id?: string;
          invoice_number: string;
          issue_date?: string;
          last_updated_by_system?: string | null;
          notes?: string | null;
          organization_id: string;
          paid_at?: string | null;
          parent_id?: string | null;
          payment_method?: string | null;
          status?: string;
          stripe_invoice_id?: string | null;
          stripe_payment_intent_id?: string | null;
          student_id?: string | null;
          tax_amount?: number | null;
          terms?: string | null;
          total_amount: number;
          updated_at?: string | null;
        };
        Update: {
          amount_due?: number | null;
          amount_paid?: number | null;
          created_at?: string | null;
          discount_amount?: number | null;
          due_date?: string | null;
          id?: string;
          invoice_number?: string;
          issue_date?: string;
          last_updated_by_system?: string | null;
          notes?: string | null;
          organization_id?: string;
          paid_at?: string | null;
          parent_id?: string | null;
          payment_method?: string | null;
          status?: string;
          stripe_invoice_id?: string | null;
          stripe_payment_intent_id?: string | null;
          student_id?: string | null;
          tax_amount?: number | null;
          terms?: string | null;
          total_amount?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'invoices_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invoices_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invoices_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      journal_entries: {
        Row: {
          ai_analysis: Json | null;
          content: string;
          created_at: string;
          id: string;
          is_private: boolean;
          metadata: Json | null;
          mood: string | null;
          mood_score: number | null;
          tags: string[] | null;
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          ai_analysis?: Json | null;
          content: string;
          created_at?: string;
          id?: string;
          is_private?: boolean;
          metadata?: Json | null;
          mood?: string | null;
          mood_score?: number | null;
          tags?: string[] | null;
          title?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          ai_analysis?: Json | null;
          content?: string;
          created_at?: string;
          id?: string;
          is_private?: boolean;
          metadata?: Json | null;
          mood?: string | null;
          mood_score?: number | null;
          tags?: string[] | null;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      knowledge_base: {
        Row: {
          category: string | null;
          content: string;
          created_at: string | null;
          embedding: string | null;
          id: string;
          metadata: Json | null;
          updated_at: string | null;
        };
        Insert: {
          category?: string | null;
          content: string;
          created_at?: string | null;
          embedding?: string | null;
          id?: string;
          metadata?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          category?: string | null;
          content?: string;
          created_at?: string | null;
          embedding?: string | null;
          id?: string;
          metadata?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      mood_logs: {
        Row: {
          created_at: string;
          energy_level: number | null;
          factors: string[] | null;
          id: string;
          logged_at: string;
          metadata: Json | null;
          mood: string;
          mood_score: number;
          notes: string | null;
          sleep_quality: number | null;
          stress_level: number | null;
          tags: string[] | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          energy_level?: number | null;
          factors?: string[] | null;
          id?: string;
          logged_at?: string;
          metadata?: Json | null;
          mood: string;
          mood_score: number;
          notes?: string | null;
          sleep_quality?: number | null;
          stress_level?: number | null;
          tags?: string[] | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          energy_level?: number | null;
          factors?: string[] | null;
          id?: string;
          logged_at?: string;
          metadata?: Json | null;
          mood?: string;
          mood_score?: number;
          notes?: string | null;
          sleep_quality?: number | null;
          stress_level?: number | null;
          tags?: string[] | null;
          user_id?: string;
        };
        Relationships: [];
      };
      notification_queue: {
        Row: {
          created_at: string | null;
          data: Json | null;
          error_message: string | null;
          id: string;
          processed_at: string | null;
          recipient_email: string;
          status: string | null;
          template_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          data?: Json | null;
          error_message?: string | null;
          id?: string;
          processed_at?: string | null;
          recipient_email: string;
          status?: string | null;
          template_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          data?: Json | null;
          error_message?: string | null;
          id?: string;
          processed_at?: string | null;
          recipient_email?: string;
          status?: string | null;
          template_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_queue_template_id_fkey';
            columns: ['template_id'];
            isOneToOne: false;
            referencedRelation: 'notification_templates';
            referencedColumns: ['id'];
          },
        ];
      };
      notification_templates: {
        Row: {
          body_template: string;
          created_at: string | null;
          id: string;
          name: string;
          subject: string;
        };
        Insert: {
          body_template: string;
          created_at?: string | null;
          id?: string;
          name: string;
          subject: string;
        };
        Update: {
          body_template?: string;
          created_at?: string | null;
          id?: string;
          name?: string;
          subject?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          category: string | null;
          created_at: string | null;
          id: string;
          is_read: boolean | null;
          link: string | null;
          message: string;
          metadata: Json | null;
          title: string;
          type: string;
          user_id: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          id?: string;
          is_read?: boolean | null;
          link?: string | null;
          message: string;
          metadata?: Json | null;
          title: string;
          type: string;
          user_id?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          id?: string;
          is_read?: boolean | null;
          link?: string | null;
          message: string;
          metadata?: Json | null;
          title: string;
          type: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          address: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string | null;
          currency: string | null;
          description: string | null;
          id: string;
          logo_url: string | null;
          name: string;
          owner_id: string;
          settings: Json | null;
          slug: string;
          status: string | null;
          timezone: string | null;
          updated_at: string | null;
          website: string | null;
        };
        Insert: {
          address?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string | null;
          currency?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: string | null;
          name: string;
          owner_id: string;
          settings?: Json | null;
          slug: string;
          status?: string | null;
          timezone?: string | null;
          updated_at?: string | null;
          website?: string | null;
        };
        Update: {
          address?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string | null;
          currency?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: string | null;
          name?: string;
          owner_id?: string;
          settings?: Json | null;
          slug?: string;
          status?: string | null;
          timezone?: string | null;
          updated_at?: string | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'organizations_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      payments: {
        Row: {
          amount: number;
          created_at: string | null;
          currency: string;
          id: string;
          invoice_id: string | null;
          metadata: Json | null;
          organization_id: string;
          payment_date: string;
          payment_method: string;
          processed_by: string | null;
          status: string;
          stripe_payment_intent_id: string | null;
          student_id: string | null;
          transaction_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          currency?: string;
          id?: string;
          invoice_id?: string | null;
          metadata?: Json | null;
          organization_id: string;
          payment_date?: string;
          payment_method: string;
          processed_by?: string | null;
          status?: string;
          stripe_payment_intent_id?: string | null;
          student_id?: string | null;
          transaction_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          currency?: string;
          id?: string;
          invoice_id?: string | null;
          metadata?: Json | null;
          organization_id?: string;
          payment_date?: string;
          payment_method?: string;
          processed_by?: string | null;
          status?: string;
          stripe_payment_intent_id?: string | null;
          student_id?: string | null;
          transaction_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'payments_invoice_id_fkey';
            columns: ['invoice_id'];
            isOneToOne: false;
            referencedRelation: 'invoices';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payments_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payments_processed_by_fkey';
            columns: ['processed_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payments_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      permissions: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          key: string;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          key: string;
          name: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          key?: string;
          name?: string;
        };
        Relationships: [];
      };
      predictive_insights: {
        Row: {
          confidence: number | null;
          contributing_factors: Json;
          created_at: string;
          expires_at: string;
          id: string;
          insight_type: string;
          metadata: Json | null;
          probability: number;
          recommended_actions: Json;
          timeframe: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          confidence?: number | null;
          contributing_factors?: Json;
          created_at?: string;
          expires_at: string;
          id?: string;
          insight_type: string;
          metadata?: Json | null;
          probability: number;
          recommended_actions?: Json;
          timeframe: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          confidence?: number | null;
          contributing_factors?: Json;
          created_at?: string;
          expires_at?: string;
          id?: string;
          insight_type?: string;
          metadata?: Json | null;
          probability?: number;
          recommended_actions?: Json;
          timeframe?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      pricing_plans: {
        Row: {
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          organization_id: string | null;
          price_total: number;
          total_hours: number;
          type: Database['public']['Enums']['plan_type'];
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          organization_id?: string | null;
          price_total: number;
          total_hours: number;
          type: Database['public']['Enums']['plan_type'];
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          organization_id?: string | null;
          price_total?: number;
          total_hours?: number;
          type?: Database['public']['Enums']['plan_type'];
        };
        Relationships: [
          {
            foreignKeyName: 'pricing_plans_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      pricing_settings: {
        Row: {
          created_at: string | null;
          default_self_study_price_per_hour: number;
          default_with_teacher_price_per_hour: number;
          id: string;
        };
        Insert: {
          created_at?: string | null;
          default_self_study_price_per_hour?: number;
          default_with_teacher_price_per_hour?: number;
          id?: string;
        };
        Update: {
          created_at?: string | null;
          default_self_study_price_per_hour?: number;
          default_with_teacher_price_per_hour?: number;
          id?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          created_at: string;
          currency: string;
          description: string | null;
          id: string;
          is_active: boolean;
          metadata: Json | null;
          name: string;
          price: number;
          sku: string | null;
          stripe_product_id: string | null;
          type: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          currency?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          metadata?: Json | null;
          name: string;
          price: number;
          sku?: string | null;
          stripe_product_id?: string | null;
          type?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          currency?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          metadata?: Json | null;
          name?: string;
          price?: number;
          sku?: string | null;
          stripe_product_id?: string | null;
          type?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          last_updated_by_system: string | null;
          no_show_count: number | null;
          organization_id: string | null;
          permissions: string[] | null;
          phone: string | null;
          reputation_score: number | null;
          role: Database['public']['Enums']['user_role'];
          stripe_customer_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          last_updated_by_system?: string | null;
          no_show_count?: number | null;
          organization_id?: string | null;
          permissions?: string[] | null;
          phone?: string | null;
          reputation_score?: number | null;
          role?: Database['public']['Enums']['user_role'];
          stripe_customer_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          last_updated_by_system?: string | null;
          no_show_count?: number | null;
          organization_id?: string | null;
          permissions?: string[] | null;
          phone?: string | null;
          reputation_score?: number | null;
          role?: Database['public']['Enums']['user_role'];
          stripe_customer_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      purchasable_items: {
        Row: {
          category: string | null;
          created_at: string;
          currency: string;
          description: string | null;
          id: string;
          is_active: boolean;
          metadata: Json | null;
          name: string;
          price: number;
          type: string;
          updated_at: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          currency?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          metadata?: Json | null;
          name: string;
          price: number;
          type: string;
          updated_at?: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          currency?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          metadata?: Json | null;
          name?: string;
          price?: number;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      purchases: {
        Row: {
          created_at: string;
          currency: string;
          discount_percentage: number | null;
          fulfilled_at: string | null;
          id: string;
          item_id: string;
          metadata: Json | null;
          quantity: number;
          status: string;
          total_amount: number;
          unit_price: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          currency?: string;
          discount_percentage?: number | null;
          fulfilled_at?: string | null;
          id?: string;
          item_id: string;
          metadata?: Json | null;
          quantity?: number;
          status?: string;
          total_amount: number;
          unit_price: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          currency?: string;
          discount_percentage?: number | null;
          fulfilled_at?: string | null;
          id?: string;
          item_id?: string;
          metadata?: Json | null;
          quantity?: number;
          status?: string;
          total_amount?: number;
          unit_price?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'purchases_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'purchasable_items';
            referencedColumns: ['id'];
          },
        ];
      };
      push_subscriptions: {
        Row: {
          auth: string;
          created_at: string | null;
          endpoint: string;
          id: string;
          p256dh: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          auth: string;
          created_at?: string | null;
          endpoint: string;
          id?: string;
          p256dh: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          auth?: string;
          created_at?: string | null;
          endpoint?: string;
          id?: string;
          p256dh?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          content: string;
          created_at: string;
          generated_by: string | null;
          id: string;
          is_confidential: boolean;
          is_generated: boolean;
          metadata: Json | null;
          title: string;
          type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          generated_by?: string | null;
          id?: string;
          is_confidential?: boolean;
          is_generated?: boolean;
          metadata?: Json | null;
          title: string;
          type: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          generated_by?: string | null;
          id?: string;
          is_confidential?: boolean;
          is_generated?: boolean;
          metadata?: Json | null;
          title?: string;
          type?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      role_assignments_log: {
        Row: {
          action: string;
          id: string;
          metadata: Json | null;
          performed_by: string | null;
          reason: string | null;
          role_name: string | null;
          role_type: string;
          timestamp: string;
          user_id: string;
        };
        Insert: {
          action: string;
          id?: string;
          metadata?: Json | null;
          performed_by?: string | null;
          reason?: string | null;
          role_name?: string | null;
          role_type: string;
          timestamp?: string;
          user_id: string;
        };
        Update: {
          action?: string;
          id?: string;
          metadata?: Json | null;
          performed_by?: string | null;
          reason?: string | null;
          role_name?: string | null;
          role_type?: string;
          timestamp?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      role_permissions: {
        Row: {
          permission_key: string;
          role: string;
        };
        Insert: {
          permission_key: string;
          role: string;
        };
        Update: {
          permission_key?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'role_permissions_permission_key_fkey';
            columns: ['permission_key'];
            isOneToOne: false;
            referencedRelation: 'permissions';
            referencedColumns: ['key'];
          },
        ];
      };
      rooms: {
        Row: {
          active: boolean | null;
          capacity: number | null;
          code: string | null;
          created_at: string | null;
          equipment: Json | null;
          id: string;
          name: string;
          organization_id: string;
          room_type: string | null;
        };
        Insert: {
          active?: boolean | null;
          capacity?: number | null;
          code?: string | null;
          created_at?: string | null;
          equipment?: Json | null;
          id?: string;
          name: string;
          organization_id: string;
          room_type?: string | null;
        };
        Update: {
          active?: boolean | null;
          capacity?: number | null;
          code?: string | null;
          created_at?: string | null;
          equipment?: Json | null;
          id?: string;
          name?: string;
          organization_id?: string;
          room_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'rooms_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      saas_subscriptions: {
        Row: {
          created_at: string | null;
          current_period_end: string | null;
          id: string;
          last_updated_by_system: string | null;
          organization_id: string;
          plan_id: string;
          status: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          current_period_end?: string | null;
          id?: string;
          last_updated_by_system?: string | null;
          organization_id: string;
          plan_id?: string;
          status?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          current_period_end?: string | null;
          id?: string;
          last_updated_by_system?: string | null;
          organization_id?: string;
          plan_id?: string;
          status?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'saas_subscriptions_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: true;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      services: {
        Row: {
          active: boolean | null;
          created_at: string | null;
          description: string | null;
          duration_minutes: number | null;
          duration_sessions: number | null;
          featured: boolean | null;
          id: string;
          last_updated_by_system: string | null;
          level: string | null;
          name: string;
          organization_id: string;
          popular: boolean | null;
          price: number;
          service_type: string;
          stripe_price_id: string | null;
          stripe_product_id: string | null;
          subject_id: string | null;
          tags: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string | null;
          description?: string | null;
          duration_minutes?: number | null;
          duration_sessions?: number | null;
          featured?: boolean | null;
          id?: string;
          last_updated_by_system?: string | null;
          level?: string | null;
          name: string;
          organization_id: string;
          popular?: boolean | null;
          price: number;
          service_type: string;
          stripe_price_id?: string | null;
          stripe_product_id?: string | null;
          subject_id?: string | null;
          tags?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          active?: boolean | null;
          created_at?: string | null;
          description?: string | null;
          duration_minutes?: number | null;
          duration_sessions?: number | null;
          featured?: boolean | null;
          id?: string;
          last_updated_by_system?: string | null;
          level?: string | null;
          name?: string;
          organization_id?: string;
          popular?: boolean | null;
          price?: number;
          service_type?: string;
          stripe_price_id?: string | null;
          stripe_product_id?: string | null;
          subject_id?: string | null;
          tags?: string[] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'services_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'services_subject_id_fkey';
            columns: ['subject_id'];
            isOneToOne: false;
            referencedRelation: 'subjects';
            referencedColumns: ['id'];
          },
        ];
      };
      special_prices: {
        Row: {
          active: boolean | null;
          created_at: string | null;
          id: string;
          price_per_hour: number;
          session_mode: Database['public']['Enums']['plan_type'];
          student_id: string;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string | null;
          id?: string;
          price_per_hour: number;
          session_mode: Database['public']['Enums']['plan_type'];
          student_id: string;
        };
        Update: {
          active?: boolean | null;
          created_at?: string | null;
          id?: string;
          price_per_hour?: number;
          session_mode?: Database['public']['Enums']['plan_type'];
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'special_prices_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
        ];
      };
      student_bundles: {
        Row: {
          created_at: string | null;
          hours_remaining: number | null;
          hours_total: number;
          hours_used: number | null;
          id: string;
          organization_id: string | null;
          pricing_plan_id: string;
          purchase_price: number;
          status: Database['public']['Enums']['bundle_status'] | null;
          student_id: string;
        };
        Insert: {
          created_at?: string | null;
          hours_remaining?: number | null;
          hours_total: number;
          hours_used?: number | null;
          id?: string;
          organization_id?: string | null;
          pricing_plan_id: string;
          purchase_price: number;
          status?: Database['public']['Enums']['bundle_status'] | null;
          student_id: string;
        };
        Update: {
          created_at?: string | null;
          hours_remaining?: number | null;
          hours_total?: number;
          hours_used?: number | null;
          id?: string;
          organization_id?: string | null;
          pricing_plan_id?: string;
          purchase_price?: number;
          status?: Database['public']['Enums']['bundle_status'] | null;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'student_bundles_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_bundles_pricing_plan_id_fkey';
            columns: ['pricing_plan_id'];
            isOneToOne: false;
            referencedRelation: 'pricing_plans';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_bundles_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
        ];
      };
      student_parents: {
        Row: {
          created_at: string | null;
          id: string;
          parent_profile_id: string | null;
          student_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          parent_profile_id?: string | null;
          student_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          parent_profile_id?: string | null;
          student_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'student_parents_parent_profile_id_fkey';
            columns: ['parent_profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_parents_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
        ];
      };
      student_performance_logs: {
        Row: {
          category: string;
          created_at: string | null;
          id: string;
          notes: string | null;
          organization_id: string | null;
          rating: number | null;
          session_id: string | null;
          student_id: string;
          teacher_id: string;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          organization_id?: string | null;
          rating?: number | null;
          session_id?: string | null;
          student_id: string;
          teacher_id: string;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          organization_id?: string | null;
          rating?: number | null;
          session_id?: string | null;
          student_id?: string;
          teacher_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'student_performance_logs_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_performance_logs_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'student_sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_performance_logs_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_performance_logs_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'teachers';
            referencedColumns: ['id'];
          },
        ];
      };
      student_self_reflections: {
        Row: {
          class_id: string | null;
          created_at: string | null;
          focus_rating: number | null;
          goals_for_next_session: string | null;
          how_did_you_feel: string | null;
          id: string;
          mood_rating: number | null;
          organization_id: string;
          reflection_date: string;
          student_id: string;
          tags: string[] | null;
          visible_to_parent: boolean | null;
          visible_to_teacher: boolean | null;
          what_to_improve: string | null;
          what_was_challenging: string | null;
          what_went_well: string | null;
        };
        Insert: {
          class_id?: string | null;
          created_at?: string | null;
          focus_rating?: number | null;
          goals_for_next_session?: string | null;
          how_did_you_feel?: string | null;
          id?: string;
          mood_rating?: number | null;
          organization_id: string;
          reflection_date?: string;
          student_id: string;
          tags?: string[] | null;
          visible_to_parent?: boolean | null;
          visible_to_teacher?: boolean | null;
          what_to_improve?: string | null;
          what_was_challenging?: string | null;
          what_went_well?: string | null;
        };
        Update: {
          class_id?: string | null;
          created_at?: string | null;
          focus_rating?: number | null;
          goals_for_next_session?: string | null;
          how_did_you_feel?: string | null;
          id?: string;
          mood_rating?: number | null;
          organization_id?: string;
          reflection_date?: string;
          student_id?: string;
          tags?: string[] | null;
          visible_to_parent?: boolean | null;
          visible_to_teacher?: boolean | null;
          what_to_improve?: string | null;
          what_was_challenging?: string | null;
          what_went_well?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'student_self_reflections_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_self_reflections_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_self_reflections_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      student_sessions: {
        Row: {
          bundle_id: string | null;
          created_at: string | null;
          duration_hours: number | null;
          end_time: string | null;
          id: string;
          mode: Database['public']['Enums']['session_mode'];
          notes: string | null;
          organization_id: string | null;
          override_price_per_hour: number | null;
          start_time: string;
          status: Database['public']['Enums']['session_status'] | null;
          student_id: string;
          teacher_id: string | null;
          topic: string | null;
        };
        Insert: {
          bundle_id?: string | null;
          created_at?: string | null;
          duration_hours?: number | null;
          end_time?: string | null;
          id?: string;
          mode: Database['public']['Enums']['session_mode'];
          notes?: string | null;
          organization_id?: string | null;
          override_price_per_hour?: number | null;
          start_time: string;
          status?: Database['public']['Enums']['session_status'] | null;
          student_id: string;
          teacher_id?: string | null;
          topic?: string | null;
        };
        Update: {
          bundle_id?: string | null;
          created_at?: string | null;
          duration_hours?: number | null;
          end_time?: string | null;
          id?: string;
          mode?: Database['public']['Enums']['session_mode'];
          notes?: string | null;
          organization_id?: string | null;
          override_price_per_hour?: number | null;
          start_time?: string;
          status?: Database['public']['Enums']['session_status'] | null;
          student_id?: string;
          teacher_id?: string | null;
          topic?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'student_sessions_bundle_id_fkey';
            columns: ['bundle_id'];
            isOneToOne: false;
            referencedRelation: 'student_bundles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_sessions_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_sessions_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_sessions_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'teachers';
            referencedColumns: ['id'];
          },
        ];
      };
      student_teacher_reviews: {
        Row: {
          anonymous: boolean | null;
          attitude_rating: number | null;
          clarity_rating: number | null;
          class_id: string | null;
          comment: string | null;
          created_at: string | null;
          helpfulness_rating: number | null;
          id: string;
          organization_id: string;
          punctuality_rating: number | null;
          rating: number;
          student_id: string;
          tags: string[] | null;
          teacher_id: string;
          visible_to_teacher: boolean | null;
        };
        Insert: {
          anonymous?: boolean | null;
          attitude_rating?: number | null;
          clarity_rating?: number | null;
          class_id?: string | null;
          comment?: string | null;
          created_at?: string | null;
          helpfulness_rating?: number | null;
          id?: string;
          organization_id: string;
          punctuality_rating?: number | null;
          rating: number;
          student_id: string;
          tags?: string[] | null;
          teacher_id: string;
          visible_to_teacher?: boolean | null;
        };
        Update: {
          anonymous?: boolean | null;
          attitude_rating?: number | null;
          clarity_rating?: number | null;
          class_id?: string | null;
          comment?: string | null;
          created_at?: string | null;
          helpfulness_rating?: number | null;
          id?: string;
          organization_id?: string;
          punctuality_rating?: number | null;
          rating?: number;
          student_id?: string;
          tags?: string[] | null;
          teacher_id?: string;
          visible_to_teacher?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'student_teacher_reviews_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_teacher_reviews_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_teacher_reviews_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_teacher_reviews_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      student_time_logs: {
        Row: {
          class_id: string | null;
          created_at: string | null;
          duration_minutes: number | null;
          end_time: string;
          id: string;
          log_date: string;
          log_type: string;
          logged_by: string;
          notes: string | null;
          organization_id: string;
          start_time: string;
          student_id: string;
        };
        Insert: {
          class_id?: string | null;
          created_at?: string | null;
          duration_minutes?: number | null;
          end_time: string;
          id?: string;
          log_date: string;
          log_type: string;
          logged_by: string;
          notes?: string | null;
          organization_id: string;
          start_time: string;
          student_id: string;
        };
        Update: {
          class_id?: string | null;
          created_at?: string | null;
          duration_minutes?: number | null;
          end_time?: string;
          id?: string;
          log_date?: string;
          log_type?: string;
          logged_by?: string;
          notes?: string | null;
          organization_id?: string;
          start_time?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'student_time_logs_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_time_logs_logged_by_fkey';
            columns: ['logged_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_time_logs_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_time_logs_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      students: {
        Row: {
          created_at: string | null;
          email: string | null;
          full_name: string;
          grade_level: string | null;
          id: string;
          is_active: boolean | null;
          notes: string | null;
          organization_id: string | null;
          phone: string | null;
          profile_id: string | null;
          subjects_of_interest: string[] | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          full_name: string;
          grade_level?: string | null;
          id?: string;
          is_active?: boolean | null;
          notes?: string | null;
          organization_id?: string | null;
          phone?: string | null;
          profile_id?: string | null;
          subjects_of_interest?: string[] | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          full_name?: string;
          grade_level?: string | null;
          id?: string;
          is_active?: boolean | null;
          notes?: string | null;
          organization_id?: string | null;
          phone?: string | null;
          profile_id?: string | null;
          subjects_of_interest?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'students_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'students_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      subjects: {
        Row: {
          active: boolean | null;
          code: string | null;
          color: string | null;
          created_at: string | null;
          description: string | null;
          icon: string | null;
          id: string;
          level: string | null;
          name: string;
          organization_id: string;
          updated_at: string | null;
        };
        Insert: {
          active?: boolean | null;
          code?: string | null;
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          level?: string | null;
          name: string;
          organization_id: string;
          updated_at?: string | null;
        };
        Update: {
          active?: boolean | null;
          code?: string | null;
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          level?: string | null;
          name: string;
          organization_id: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'subjects_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      subscription_tiers: {
        Row: {
          benefits: Json;
          created_at: string;
          currency: string | null;
          id: string;
          is_active: boolean;
          monthly_price: number | null;
          name: string;
          requirements: Json;
          sort_order: number;
          stripe_monthly_price_id: string | null;
          stripe_product_id: string | null;
          stripe_yearly_price_id: string | null;
          type: string;
          updated_at: string;
          yearly_price: number | null;
        };
        Insert: {
          benefits?: Json;
          created_at?: string;
          currency?: string | null;
          id?: string;
          is_active?: boolean;
          monthly_price?: number | null;
          name: string;
          requirements?: Json;
          sort_order?: number;
          stripe_monthly_price_id?: string | null;
          stripe_product_id?: string | null;
          stripe_yearly_price_id?: string | null;
          type: string;
          updated_at?: string;
          yearly_price?: number | null;
        };
        Update: {
          benefits?: Json;
          created_at?: string;
          currency?: string | null;
          id?: string;
          is_active?: boolean;
          monthly_price?: number | null;
          name?: string;
          requirements?: Json;
          sort_order?: number;
          stripe_monthly_price_id?: string | null;
          stripe_product_id?: string | null;
          stripe_yearly_price_id?: string | null;
          type?: string;
          updated_at?: string;
          yearly_price?: number | null;
        };
        Relationships: [];
      };
      subscription_usage: {
        Row: {
          ai_interactions: number | null;
          id: string;
          last_updated: string;
          period_end: string;
          period_start: string;
          rewards_earned: number | null;
          session_count: number | null;
          subscription_id: string;
          themes_accessed: string[] | null;
          type: string;
          user_id: string;
        };
        Insert: {
          ai_interactions?: number | null;
          id?: string;
          last_updated?: string;
          period_end: string;
          period_start: string;
          rewards_earned?: number | null;
          session_count?: number | null;
          subscription_id: string;
          themes_accessed?: string[] | null;
          type: string;
          user_id: string;
        };
        Update: {
          ai_interactions?: number | null;
          id?: string;
          last_updated?: string;
          period_end?: string;
          period_start?: string;
          rewards_earned?: number | null;
          session_count?: number | null;
          subscription_id?: string;
          themes_accessed?: string[] | null;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscription_usage_subscription_id_fkey';
            columns: ['subscription_id'];
            isOneToOne: false;
            referencedRelation: 'subscriptions';
            referencedColumns: ['id'];
          },
        ];
      };
      subscriptions: {
        Row: {
          auto_renew: boolean | null;
          cancel_reason: string | null;
          canceled_at: string | null;
          created_at: string;
          current_period_end: string | null;
          current_period_start: string | null;
          id: string;
          metadata: Json | null;
          payment_failure_count: number | null;
          payment_method_id: string | null;
          plan_type: string;
          status: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          tier_id: string | null;
          trial_end: string | null;
          trial_start: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          auto_renew?: boolean | null;
          cancel_reason?: string | null;
          canceled_at?: string | null;
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          metadata?: Json | null;
          payment_failure_count?: number | null;
          payment_method_id?: string | null;
          plan_type: string;
          status: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          tier_id?: string | null;
          trial_end?: string | null;
          trial_start?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          auto_renew?: boolean | null;
          cancel_reason?: string | null;
          canceled_at?: string | null;
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          metadata?: Json | null;
          payment_failure_count?: number | null;
          payment_method_id?: string | null;
          plan_type?: string;
          status?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          tier_id?: string | null;
          trial_end?: string | null;
          trial_start?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscriptions_tier_id_fkey';
            columns: ['tier_id'];
            isOneToOne: false;
            referencedRelation: 'subscription_tiers';
            referencedColumns: ['id'];
          },
        ];
      };
      sync_metadata: {
        Row: {
          external_id: string;
          external_system: string;
          id: string;
          last_sync_time: string | null;
          record_id: string;
          sync_direction: string | null;
          sync_status: string | null;
          table_name: string;
        };
        Insert: {
          external_id: string;
          external_system: string;
          id?: string;
          last_sync_time?: string | null;
          record_id: string;
          sync_direction?: string | null;
          sync_status?: string | null;
          table_name: string;
        };
        Update: {
          external_id?: string;
          external_system?: string;
          id?: string;
          last_sync_time?: string | null;
          record_id?: string;
          sync_direction?: string | null;
          sync_status?: string | null;
          table_name?: string;
        };
        Relationships: [];
      };
      system_audit_logs: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string | null;
          details: Json | null;
          id: string;
          ip_address: string | null;
          resource_id: string | null;
          resource_type: string | null;
          user_agent: string | null;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string | null;
          details?: Json | null;
          id?: string;
          ip_address?: string | null;
          resource_id?: string | null;
          resource_type?: string | null;
          user_agent?: string | null;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string | null;
          details?: Json | null;
          id?: string;
          ip_address?: string | null;
          resource_id?: string | null;
          resource_type?: string | null;
          user_agent?: string | null;
        };
        Relationships: [];
      };
      system_logs: {
        Row: {
          context: Json | null;
          created_at: string;
          error_stack: string | null;
          id: string;
          ip_address: unknown;
          level: string;
          message: string;
          request_id: string | null;
          timestamp: string;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          context?: Json | null;
          created_at?: string;
          error_stack?: string | null;
          id?: string;
          ip_address?: unknown;
          level: string;
          message: string;
          request_id?: string | null;
          timestamp?: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          context?: Json | null;
          created_at?: string;
          error_stack?: string | null;
          id?: string;
          ip_address?: unknown;
          level?: string;
          message?: string;
          request_id?: string | null;
          timestamp?: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      teacher_academy_links: {
        Row: {
          active: boolean | null;
          base_hourly_rate: number | null;
          contract_type: string | null;
          created_at: string | null;
          custom_pay_percentage: number | null;
          end_date: string | null;
          hours_per_week_target: number | null;
          id: string;
          notes: string | null;
          organization_id: string;
          payment_model: string | null;
          start_date: string | null;
          teacher_id: string;
          updated_at: string | null;
        };
        Insert: {
          active?: boolean | null;
          base_hourly_rate?: number | null;
          contract_type?: string | null;
          created_at?: string | null;
          custom_pay_percentage?: number | null;
          end_date?: string | null;
          hours_per_week_target?: number | null;
          id?: string;
          notes?: string | null;
          organization_id: string;
          payment_model?: string | null;
          start_date?: string | null;
          teacher_id: string;
          updated_at?: string | null;
        };
        Update: {
          active?: boolean | null;
          base_hourly_rate?: number | null;
          contract_type?: string | null;
          created_at?: string | null;
          custom_pay_percentage?: number | null;
          end_date?: string | null;
          hours_per_week_target?: number | null;
          id?: string;
          notes?: string | null;
          organization_id?: string;
          payment_model?: string | null;
          start_date?: string | null;
          teacher_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'teacher_academy_links_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'teacher_academy_links_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      teacher_marketplace_profiles: {
        Row: {
          accepted_payment_methods: string[] | null;
          available_for_in_person: boolean | null;
          available_for_online: boolean | null;
          bio: string | null;
          created_at: string | null;
          deposit_percentage: number | null;
          hourly_rate_max: number | null;
          hourly_rate_min: number | null;
          id: string;
          languages_spoken: string[] | null;
          levels_taught: string[] | null;
          payment_policy: string | null;
          profile_image_url: string | null;
          qualifications: Json | null;
          rating_average: number | null;
          specializations: string[] | null;
          subjects_taught: string[] | null;
          tagline: string | null;
          teacher_id: string;
          teaching_experience_years: number | null;
          total_reviews: number | null;
          total_students_taught: number | null;
          updated_at: string | null;
          video_intro_url: string | null;
          visible: boolean | null;
        };
        Insert: {
          accepted_payment_methods?: string[] | null;
          available_for_in_person?: boolean | null;
          available_for_online?: boolean | null;
          bio?: string | null;
          created_at?: string | null;
          deposit_percentage?: number | null;
          hourly_rate_max?: number | null;
          hourly_rate_min?: number | null;
          id?: string;
          languages_spoken?: string[] | null;
          levels_taught?: string[] | null;
          payment_policy?: string | null;
          profile_image_url?: string | null;
          qualifications?: Json | null;
          rating_average?: number | null;
          specializations?: string[] | null;
          subjects_taught?: string[] | null;
          tagline?: string | null;
          teacher_id: string;
          teaching_experience_years?: number | null;
          total_reviews?: number | null;
          total_students_taught?: number | null;
          updated_at?: string | null;
          video_intro_url?: string | null;
          visible?: boolean | null;
        };
        Update: {
          accepted_payment_methods?: string[] | null;
          available_for_in_person?: boolean | null;
          available_for_online?: boolean | null;
          bio?: string | null;
          created_at?: string | null;
          deposit_percentage?: number | null;
          hourly_rate_max?: number | null;
          hourly_rate_min?: number | null;
          id?: string;
          languages_spoken?: string[] | null;
          levels_taught?: string[] | null;
          payment_policy?: string | null;
          profile_image_url?: string | null;
          qualifications?: Json | null;
          rating_average?: number | null;
          specializations?: string[] | null;
          subjects_taught?: string[] | null;
          tagline?: string | null;
          teacher_id?: string;
          teaching_experience_years?: number | null;
          total_reviews?: number | null;
          total_students_taught?: number | null;
          updated_at?: string | null;
          video_intro_url?: string | null;
          visible?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'teacher_marketplace_profiles_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      teacher_shifts: {
        Row: {
          created_at: string | null;
          duration_hours: number | null;
          end_time: string | null;
          id: string;
          mode: Database['public']['Enums']['shift_mode'];
          notes: string | null;
          organization_id: string | null;
          start_time: string;
          teacher_id: string;
        };
        Insert: {
          created_at?: string | null;
          duration_hours?: number | null;
          end_time?: string | null;
          id?: string;
          mode?: Database['public']['Enums']['shift_mode'];
          notes?: string | null;
          organization_id?: string | null;
          start_time: string;
          teacher_id: string;
        };
        Update: {
          created_at?: string | null;
          duration_hours?: number | null;
          end_time?: string | null;
          id?: string;
          mode?: Database['public']['Enums']['shift_mode'];
          notes?: string | null;
          organization_id?: string | null;
          start_time?: string;
          teacher_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'teacher_shifts_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'teacher_shifts_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'teachers';
            referencedColumns: ['id'];
          },
        ];
      };
      teacher_student_notes: {
        Row: {
          class_id: string | null;
          created_at: string | null;
          id: string;
          note_text: string;
          note_type: string;
          organization_id: string;
          priority: string | null;
          student_id: string;
          subject_id: string | null;
          tags: string[] | null;
          teacher_id: string;
          updated_at: string | null;
          visibility: string;
        };
        Insert: {
          class_id?: string | null;
          created_at?: string | null;
          id?: string;
          note_text: string;
          note_type: string;
          organization_id: string;
          priority?: string | null;
          student_id: string;
          subject_id?: string | null;
          tags?: string[] | null;
          teacher_id: string;
          updated_at?: string | null;
          visibility?: string;
        };
        Update: {
          class_id?: string | null;
          created_at?: string | null;
          id?: string;
          note_text?: string;
          note_type?: string;
          organization_id?: string;
          priority?: string | null;
          student_id?: string;
          subject_id?: string | null;
          tags?: string[] | null;
          teacher_id?: string;
          updated_at?: string | null;
          visibility?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'teacher_student_notes_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'teacher_student_notes_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'teacher_student_notes_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'teacher_student_notes_subject_id_fkey';
            columns: ['subject_id'];
            isOneToOne: false;
            referencedRelation: 'subjects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'teacher_student_notes_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      teacher_time_logs: {
        Row: {
          amount_earned: number | null;
          approved: boolean | null;
          approved_at: string | null;
          approved_by: string | null;
          class_id: string | null;
          created_at: string | null;
          duration_minutes: number | null;
          end_time: string;
          hourly_rate: number | null;
          id: string;
          log_date: string;
          log_type: string;
          logged_by: string;
          notes: string | null;
          organization_id: string;
          start_time: string;
          teacher_id: string;
        };
        Insert: {
          amount_earned?: number | null;
          approved?: boolean | null;
          approved_at?: string | null;
          approved_by?: string | null;
          class_id?: string | null;
          created_at?: string | null;
          duration_minutes?: number | null;
          end_time: string;
          hourly_rate?: number | null;
          id?: string;
          log_date: string;
          log_type: string;
          logged_by: string;
          notes?: string | null;
          organization_id: string;
          start_time: string;
          teacher_id: string;
        };
        Update: {
          amount_earned?: number | null;
          approved?: boolean | null;
          approved_at?: string | null;
          approved_by?: string | null;
          class_id?: string | null;
          created_at?: string | null;
          duration_minutes?: number | null;
          end_time?: string;
          hourly_rate?: number | null;
          id?: string;
          log_date?: string;
          log_type?: string;
          logged_by?: string;
          notes?: string | null;
          organization_id?: string;
          start_time?: string;
          teacher_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'teacher_time_logs_approved_by_fkey';
            columns: ['approved_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'teacher_time_logs_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'teacher_time_logs_logged_by_fkey';
            columns: ['logged_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'teacher_time_logs_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'teacher_time_logs_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      teachers: {
        Row: {
          bio: string | null;
          created_at: string | null;
          email: string | null;
          full_name: string;
          hourly_rate: number;
          id: string;
          is_active: boolean | null;
          notes: string | null;
          organization_id: string | null;
          profile_id: string | null;
          skills: string[] | null;
        };
        Insert: {
          bio?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name: string;
          hourly_rate?: number;
          id?: string;
          is_active?: boolean | null;
          notes?: string | null;
          organization_id?: string | null;
          profile_id?: string | null;
          skills?: string[] | null;
        };
        Update: {
          bio?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string;
          hourly_rate?: number;
          id?: string;
          is_active?: boolean | null;
          notes?: string | null;
          organization_id?: string | null;
          profile_id?: string | null;
          skills?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'teachers_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'teachers_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      templates: {
        Row: {
          category: string | null;
          content: Json;
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          is_active: boolean;
          is_system_template: boolean;
          metadata: Json | null;
          name: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          category?: string | null;
          content: Json;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          is_system_template?: boolean;
          metadata?: Json | null;
          name: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          category?: string | null;
          content?: Json;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          is_system_template?: boolean;
          metadata?: Json | null;
          name?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tier_audit_logs: {
        Row: {
          action: string;
          id: string;
          metadata: Json | null;
          performed_by: string | null;
          reason: string | null;
          tier_name: string | null;
          tier_type: string;
          timestamp: string;
          user_id: string;
        };
        Insert: {
          action: string;
          id?: string;
          metadata?: Json | null;
          performed_by?: string | null;
          reason?: string | null;
          tier_name?: string | null;
          tier_type: string;
          timestamp?: string;
          user_id: string;
        };
        Update: {
          action?: string;
          id?: string;
          metadata?: Json | null;
          performed_by?: string | null;
          reason?: string | null;
          tier_name?: string | null;
          tier_type?: string;
          timestamp?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_custom_permissions: {
        Row: {
          is_granted: boolean;
          permission_key: string;
          user_id: string;
        };
        Insert: {
          is_granted: boolean;
          permission_key: string;
          user_id: string;
        };
        Update: {
          is_granted?: boolean;
          permission_key?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_custom_permissions_permission_key_fkey';
            columns: ['permission_key'];
            isOneToOne: false;
            referencedRelation: 'permissions';
            referencedColumns: ['key'];
          },
        ];
      };
      user_exercise_completions: {
        Row: {
          completed_at: string;
          created_at: string;
          duration_minutes: number | null;
          exercise_id: string;
          id: string;
          metadata: Json | null;
          notes: string | null;
          satisfaction_score: number | null;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          created_at?: string;
          duration_minutes?: number | null;
          exercise_id: string;
          id?: string;
          metadata?: Json | null;
          notes?: string | null;
          satisfaction_score?: number | null;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          created_at?: string;
          duration_minutes?: number | null;
          exercise_id?: string;
          id?: string;
          metadata?: Json | null;
          notes?: string | null;
          satisfaction_score?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_exercise_completions_exercise_id_fkey';
            columns: ['exercise_id'];
            isOneToOne: false;
            referencedRelation: 'exercises';
            referencedColumns: ['id'];
          },
        ];
      };
      user_feature_enrollment: {
        Row: {
          enrolled_at: string | null;
          program: string;
          user_id: string;
        };
        Insert: {
          enrolled_at?: string | null;
          program: string;
          user_id: string;
        };
        Update: {
          enrolled_at?: string | null;
          program?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_feature_overrides: {
        Row: {
          created_at: string | null;
          feature_key: string;
          is_enabled: boolean;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          feature_key: string;
          is_enabled: boolean;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          feature_key?: string;
          is_enabled?: boolean;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_feature_overrides_feature_key_fkey';
            columns: ['feature_key'];
            isOneToOne: false;
            referencedRelation: 'features';
            referencedColumns: ['key'];
          },
        ];
      };
      user_group_members: {
        Row: {
          group_id: string;
          joined_at: string | null;
          user_id: string;
        };
        Insert: {
          group_id: string;
          joined_at?: string | null;
          user_id: string;
        };
        Update: {
          group_id?: string;
          joined_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_group_members_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'user_groups';
            referencedColumns: ['id'];
          },
        ];
      };
      user_groups: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      user_interactions: {
        Row: {
          created_at: string;
          device_type: string | null;
          element_id: string | null;
          element_text: string | null;
          id: string;
          interaction_type: string;
          metadata: Json | null;
          page_path: string;
          referrer: string | null;
          session_id: string | null;
          timestamp: string;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          device_type?: string | null;
          element_id?: string | null;
          element_text?: string | null;
          id?: string;
          interaction_type: string;
          metadata?: Json | null;
          page_path: string;
          referrer?: string | null;
          session_id?: string | null;
          timestamp?: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          device_type?: string | null;
          element_id?: string | null;
          element_text?: string | null;
          id?: string;
          interaction_type?: string;
          metadata?: Json | null;
          page_path?: string;
          referrer?: string | null;
          session_id?: string | null;
          timestamp?: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      user_memory: {
        Row: {
          content: string;
          created_at: string | null;
          embedding: string | null;
          id: string;
          importance: number | null;
          memory_type: string | null;
          metadata: Json | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          embedding?: string | null;
          id?: string;
          importance?: number | null;
          memory_type?: string | null;
          metadata?: Json | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          embedding?: string | null;
          id?: string;
          importance?: number | null;
          memory_type?: string | null;
          metadata?: Json | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      user_notification_settings: {
        Row: {
          created_at: string | null;
          marketing_email: boolean | null;
          marketing_in_app: boolean | null;
          marketing_push: boolean | null;
          product_updates_email: boolean | null;
          promotional_email: boolean | null;
          security_email: boolean | null;
          security_in_app: boolean | null;
          security_push: boolean | null;
          updated_at: string | null;
          updates_email: boolean | null;
          updates_in_app: boolean | null;
          updates_push: boolean | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          marketing_email?: boolean | null;
          marketing_in_app?: boolean | null;
          marketing_push?: boolean | null;
          product_updates_email?: boolean | null;
          promotional_email?: boolean | null;
          security_email?: boolean | null;
          security_in_app?: boolean | null;
          security_push?: boolean | null;
          updated_at?: string | null;
          updates_email?: boolean | null;
          updates_in_app?: boolean | null;
          updates_push?: boolean | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          marketing_email?: boolean | null;
          marketing_in_app?: boolean | null;
          marketing_push?: boolean | null;
          product_updates_email?: boolean | null;
          promotional_email?: boolean | null;
          security_email?: boolean | null;
          security_in_app?: boolean | null;
          security_push?: boolean | null;
          updated_at?: string | null;
          updates_email?: boolean | null;
          updates_in_app?: boolean | null;
          updates_push?: boolean | null;
          user_id: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          accessibility_needs: string[] | null;
          concerns: string[] | null;
          created_at: string;
          emergency_contact: Json | null;
          goals: string[] | null;
          id: string;
          language_preference: string;
          metadata: Json | null;
          notification_frequency: string | null;
          notify_achievements: boolean | null;
          notify_community: boolean | null;
          notify_reminders: boolean | null;
          notify_tips: boolean | null;
          preferred_communication: string | null;
          preferred_session_duration: number | null;
          preferred_therapist_gender: string | null;
          preferred_therapy_type: string | null;
          privacy_level: string | null;
          role: string | null;
          theme_preference: string | null;
          timezone: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          accessibility_needs?: string[] | null;
          concerns?: string[] | null;
          created_at?: string;
          emergency_contact?: Json | null;
          goals?: string[] | null;
          id?: string;
          language_preference?: string;
          metadata?: Json | null;
          notification_frequency?: string | null;
          notify_achievements?: boolean | null;
          notify_community?: boolean | null;
          notify_reminders?: boolean | null;
          notify_tips?: boolean | null;
          preferred_communication?: string | null;
          preferred_session_duration?: number | null;
          preferred_therapist_gender?: string | null;
          preferred_therapy_type?: string | null;
          privacy_level?: string | null;
          role?: string | null;
          theme_preference?: string | null;
          timezone?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          accessibility_needs?: string[] | null;
          concerns?: string[] | null;
          created_at?: string;
          emergency_contact?: Json | null;
          goals?: string[] | null;
          id?: string;
          language_preference?: string;
          metadata?: Json | null;
          notification_frequency?: string | null;
          notify_achievements?: boolean | null;
          notify_community?: boolean | null;
          notify_reminders?: boolean | null;
          notify_tips?: boolean | null;
          preferred_communication?: string | null;
          preferred_session_duration?: number | null;
          preferred_therapist_gender?: string | null;
          preferred_therapy_type?: string | null;
          privacy_level?: string | null;
          role?: string | null;
          theme_preference?: string | null;
          timezone?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          certifications: string[] | null;
          created_at: string;
          date_of_birth: string | null;
          education: string[] | null;
          email: string;
          full_name: string;
          gender: string | null;
          id: string;
          is_therapist: boolean;
          language: string | null;
          license_number: string | null;
          location: string | null;
          metadata: Json | null;
          phone: string | null;
          specialties: string[] | null;
          therapist_verified: boolean;
          timezone: string | null;
          updated_at: string;
          user_id: string;
          years_of_experience: number | null;
          vip_tier: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          certifications?: string[] | null;
          created_at?: string;
          date_of_birth?: string | null;
          education?: string[] | null;
          email: string;
          full_name: string;
          gender?: string | null;
          id?: string;
          is_therapist?: boolean;
          language?: string | null;
          license_number?: string | null;
          location?: string | null;
          metadata?: Json | null;
          phone?: string | null;
          specialties?: string[] | null;
          therapist_verified?: boolean;
          timezone?: string | null;
          updated_at?: string;
          user_id: string;
          years_of_experience?: number | null;
          vip_tier?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          certifications?: string[] | null;
          created_at?: string;
          date_of_birth?: string | null;
          education?: string[] | null;
          email?: string;
          full_name?: string;
          gender?: string | null;
          id?: string;
          is_therapist?: boolean;
          language?: string | null;
          license_number?: string | null;
          location?: string | null;
          metadata?: Json | null;
          phone?: string | null;
          specialties?: string[] | null;
          therapist_verified?: boolean;
          timezone?: string | null;
          updated_at?: string;
          user_id?: string;
          years_of_experience?: number | null;
          vip_tier?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          assigned_at: string;
          assigned_by: string | null;
          created_at: string;
          expires_at: string | null;
          id: string;
          is_active: boolean;
          metadata: Json | null;
          role: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          assigned_at?: string;
          assigned_by?: string | null;
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean;
          metadata?: Json | null;
          role: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          assigned_at?: string;
          assigned_by?: string | null;
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean;
          metadata?: Json | null;
          role?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          accessibility_settings: Json;
          created_at: string;
          last_updated: string;
          notification_settings: Json;
          preferences: Json;
          privacy_settings: Json;
          theme_preferences: Json;
          user_id: string;
        };
        Insert: {
          accessibility_settings?: Json;
          created_at?: string;
          last_updated?: string;
          notification_settings?: Json;
          preferences?: Json;
          privacy_settings?: Json;
          theme_preferences?: Json;
          user_id: string;
        };
        Update: {
          accessibility_settings?: Json;
          created_at?: string;
          last_updated?: string;
          notification_settings?: Json;
          preferences?: Json;
          privacy_settings?: Json;
          theme_preferences?: Json;
          user_id?: string;
        };
        Relationships: [];
      };
      user_tiers: {
        Row: {
          assigned_at: string;
          assigned_by: string | null;
          created_at: string;
          deactivated_at: string | null;
          id: string;
          is_active: boolean;
          metadata: Json | null;
          reason: string | null;
          tier_name: string;
          tier_type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          assigned_at?: string;
          assigned_by?: string | null;
          created_at?: string;
          deactivated_at?: string | null;
          id?: string;
          is_active?: boolean;
          metadata?: Json | null;
          reason?: string | null;
          tier_name: string;
          tier_type: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          assigned_at?: string;
          assigned_by?: string | null;
          created_at?: string;
          deactivated_at?: string | null;
          id?: string;
          is_active?: boolean;
          metadata?: Json | null;
          reason?: string | null;
          tier_name?: string;
          tier_type?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      wallet_transactions: {
        Row: {
          amount: number;
          created_at: string | null;
          description: string | null;
          id: string;
          metadata: Json | null;
          stripe_payment_intent_id: string | null;
          type: string;
          wallet_id: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          metadata?: Json | null;
          stripe_payment_intent_id?: string | null;
          type: string;
          wallet_id?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          metadata?: Json | null;
          stripe_payment_intent_id?: string | null;
          type?: string;
          wallet_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'wallet_transactions_wallet_id_fkey';
            columns: ['wallet_id'];
            isOneToOne: false;
            referencedRelation: 'wallets';
            referencedColumns: ['id'];
          },
        ];
      };
      wallets: {
        Row: {
          balance: number | null;
          created_at: string | null;
          currency: string | null;
          id: string;
          is_active: boolean | null;
          is_paused: boolean | null;
          pause_reason: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          balance?: number | null;
          created_at?: string | null;
          currency?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_paused?: boolean | null;
          pause_reason?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          balance?: number | null;
          created_at?: string | null;
          currency?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_paused?: boolean | null;
          pause_reason?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'wallets_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      webhook_events: {
        Row: {
          created_at: string | null;
          error_message: string | null;
          event_type: string;
          id: string;
          payload: Json;
          processed_at: string | null;
          source: string;
          status: string | null;
        };
        Insert: {
          created_at?: string | null;
          error_message?: string | null;
          event_type: string;
          id?: string;
          payload: Json;
          processed_at?: string | null;
          source: string;
          status?: string | null;
        };
        Update: {
          created_at?: string | null;
          error_message?: string | null;
          event_type?: string;
          id?: string;
          payload?: Json;
          processed_at?: string | null;
          source?: string;
          status?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      analytics_daily_sessions: {
        Row: {
          active_students: number | null;
          day: string | null;
          total_hours: number | null;
          total_sessions: number | null;
        };
        Relationships: [];
      };
      analytics_teacher_performance: {
        Row: {
          full_name: string | null;
          total_hours: number | null;
          total_sessions: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      accept_invite: {
        Args: { lookup_token: string; user_id: string };
        Returns: boolean;
      };
      calculate_user_engagement_score: {
        Args: { p_user_id: string };
        Returns: Json;
      };
      check_user_permission: {
        Args: { permission_name: string; user_id: string };
        Returns: boolean;
      };
      create_notification:
        | {
            Args: {
              p_link?: string;
              p_message: string;
              p_metadata?: Json;
              p_title: string;
              p_type: string;
              p_user_id: string;
            };
            Returns: string;
          }
        | {
            Args: {
              p_category?: string;
              p_link?: string;
              p_message: string;
              p_metadata?: Json;
              p_title: string;
              p_type: string;
              p_user_id: string;
            };
            Returns: string;
          };
      generate_personalized_recommendations: {
        Args: { p_user_id: string };
        Returns: Json;
      };
      get_invite_by_token: {
        Args: { lookup_token: string };
        Returns: {
          email: string;
          id: string;
          org_name: string;
          organization_id: string;
          role: Database['public']['Enums']['user_role'];
        }[];
      };
      get_user_permissions: {
        Args: { user_id: string };
        Returns: {
          permission_key: string;
        }[];
      };
      has_any_org_role: {
        Args: { org_id: string; required_roles: string[] };
        Returns: boolean;
      };
      has_org_role: {
        Args: { org_id: string; required_role: string };
        Returns: boolean;
      };
      has_permission: {
        Args: { permission_key: string; user_id: string };
        Returns: boolean;
      };
      is_admin: { Args: never; Returns: boolean };
      is_admin_or_teacher: { Args: { org_id: string }; Returns: boolean };
      is_feature_enabled: {
        Args: { feature_key: string; user_id: string };
        Returns: boolean;
      };
      is_org_member: { Args: { org_id: string }; Returns: boolean };
      match_knowledge_base: {
        Args: {
          match_count: number;
          match_threshold: number;
          query_embedding: string;
        };
        Returns: {
          content: string;
          id: string;
          metadata: Json;
          similarity: number;
        }[];
      };
      match_user_memory: {
        Args: {
          match_count: number;
          match_threshold: number;
          p_user_id: string;
          query_embedding: string;
        };
        Returns: {
          content: string;
          id: string;
          metadata: Json;
          similarity: number;
        }[];
      };
      monitor_wellness_alerts: { Args: { p_user_id: string }; Returns: Json };
      process_real_time_mood_analysis: {
        Args: { p_user_id: string };
        Returns: Json;
      };
      show_limit: { Args: never; Returns: number };
      show_trgm: { Args: { '': string }; Returns: string[] };
    };
    Enums: {
      bundle_status: 'active' | 'used' | 'expired';
      plan_type: 'self_study' | 'with_teacher' | 'any';
      session_mode: 'self_study' | 'with_teacher';
      session_status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
      shift_mode: 'individual_sessions' | 'duty_helping_many' | 'mixed';
      user_role: 'admin' | 'teacher' | 'student' | 'parent';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      bundle_status: ['active', 'used', 'expired'],
      plan_type: ['self_study', 'with_teacher', 'any'],
      session_mode: ['self_study', 'with_teacher'],
      session_status: ['pending', 'confirmed', 'completed', 'cancelled'],
      shift_mode: ['individual_sessions', 'duty_helping_many', 'mixed'],
      user_role: ['admin', 'teacher', 'student', 'parent'],
    },
  },
} as const;
