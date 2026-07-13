export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          date_of_birth: string | null
          onboarded: boolean
          guest: boolean
          premium: boolean
          premium_until: string | null
          streak_count: number
          longest_streak: number
          total_focus_minutes: number
          freezes_remaining: number
          leaderboard_opt_in: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          onboarded?: boolean
          guest?: boolean
          premium?: boolean
          premium_until?: string | null
          streak_count?: number
          longest_streak?: number
          total_focus_minutes?: number
          freezes_remaining?: number
          leaderboard_opt_in?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          onboarded?: boolean
          guest?: boolean
          premium?: boolean
          premium_until?: string | null
          streak_count?: number
          longest_streak?: number
          total_focus_minutes?: number
          freezes_remaining?: number
          leaderboard_opt_in?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          exam_track: string
          icon: string
          color: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          exam_track: string
          icon?: string
          color?: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          exam_track?: string
          icon?: string
          color?: string
          order_index?: number
          created_at?: string
        }
      }
      units: {
        Row: {
          id: string
          subject_id: string
          name: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          name: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          name?: string
          order_index?: number
          created_at?: string
        }
      }
      topics: {
        Row: {
          id: string
          unit_id: string
          name: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          name: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          name?: string
          order_index?: number
          created_at?: string
        }
      }
      topic_progress: {
        Row: {
          id: string
          user_id: string
          topic_id: string
          completed: boolean
          confidence: number | null
          last_reviewed: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          topic_id: string
          completed?: boolean
          confidence?: number | null
          last_reviewed?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          topic_id?: string
          completed?: boolean
          confidence?: number | null
          last_reviewed?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          subject_id: string | null
          topic_id: string | null
          duration_seconds: number
          started_at: string
          ended_at: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id?: string | null
          topic_id?: string | null
          duration_seconds: number
          started_at: string
          ended_at?: string | null
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string | null
          topic_id?: string | null
          duration_seconds?: number
          started_at?: string
          ended_at?: string | null
          date?: string
          created_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          name: string
          description: string | null
          invite_code: string
          created_by: string
          max_members: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          invite_code: string
          created_by: string
          max_members?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          invite_code?: string
          created_by?: string
          max_members?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      room_members: {
        Row: {
          id: string
          room_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      room_messages: {
        Row: {
          id: string
          room_id: string
          user_id: string
          content: string
          file_url: string | null
          file_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          content: string
          file_url?: string | null
          file_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          content?: string
          file_url?: string | null
          file_type?: string | null
          created_at?: string
        }
      }
      user_blocks: {
        Row: {
          id: string
          user_id: string
          blocked_user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          blocked_user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          blocked_user_id?: string
          created_at?: string
        }
      }
      user_reports: {
        Row: {
          id: string
          reporter_id: string
          reported_user_id: string
          room_id: string | null
          message_id: string | null
          reason: string
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          reported_user_id: string
          room_id?: string | null
          message_id?: string | null
          reason: string
          created_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          reported_user_id?: string
          room_id?: string | null
          message_id?: string | null
          reason?: string
          created_at?: string
        }
      }
      study_streaks: {
        Row: {
          id: string
          user_id: string
          date: string
          total_minutes: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          total_minutes: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          total_minutes?: number
          created_at?: string
        }
      }
      referral_codes: {
        Row: {
          id: string
          user_id: string
          code: string
          uses_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          code: string
          uses_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          code?: string
          uses_count?: number
          created_at?: string
        }
      }
      referral_uses: {
        Row: {
          id: string
          referral_code_id: string
          referred_user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          referral_code_id: string
          referred_user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          referral_code_id?: string
          referred_user_id?: string
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          lemon_squeezy_id: string | null
          status: string
          plan: string
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lemon_squeezy_id?: string | null
          status?: string
          plan?: string
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lemon_squeezy_id?: string | null
          status?: string
          plan?: string
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
