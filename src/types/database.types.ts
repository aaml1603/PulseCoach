export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      client_exercise_logs: {
        Row: {
          client_workout_log_id: string
          created_at: string
          id: string
          notes: string | null
          reps_completed: number | null
          sets_completed: number | null
          updated_at: string
          weight: number | null
          workout_exercise_id: string
        }
        Insert: {
          client_workout_log_id: string
          created_at?: string
          id?: string
          notes?: string | null
          reps_completed?: number | null
          sets_completed?: number | null
          updated_at?: string
          weight?: number | null
          workout_exercise_id: string
        }
        Update: {
          client_workout_log_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          reps_completed?: number | null
          sets_completed?: number | null
          updated_at?: string
          weight?: number | null
          workout_exercise_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_exercise_logs_client_workout_log_id_fkey"
            columns: ["client_workout_log_id"]
            isOneToOne: false
            referencedRelation: "client_workout_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_exercise_logs_workout_exercise_id_fkey"
            columns: ["workout_exercise_id"]
            isOneToOne: false
            referencedRelation: "workout_exercises"
            referencedColumns: ["id"]
          }
        ]
      }
      client_goals: {
        Row: {
          client_id: string
          created_at: string
          current_value: number | null
          description: string | null
          id: string
          metric_type: string | null
          start_date: string
          status: string
          target_date: string | null
          target_value: number | null
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          current_value?: number | null
          description?: string | null
          id?: string
          metric_type?: string | null
          start_date?: string
          status?: string
          target_date?: string | null
          target_value?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          current_value?: number | null
          description?: string | null
          id?: string
          metric_type?: string | null
          start_date?: string
          status?: string
          target_date?: string | null
          target_value?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_goals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      client_metrics: {
        Row: {
          arm_measurement: number | null
          body_fat_percentage: number | null
          chest_measurement: number | null
          client_id: string
          created_at: string
          date: string
          hip_measurement: number | null
          id: string
          notes: string | null
          thigh_measurement: number | null
          updated_at: string
          waist_measurement: number | null
          weight: number | null
        }
        Insert: {
          arm_measurement?: number | null
          body_fat_percentage?: number | null
          chest_measurement?: number | null
          client_id: string
          created_at?: string
          date?: string
          hip_measurement?: number | null
          id?: string
          notes?: string | null
          thigh_measurement?: number | null
          updated_at?: string
          waist_measurement?: number | null
          weight?: number | null
        }
        Update: {
          arm_measurement?: number | null
          body_fat_percentage?: number | null
          chest_measurement?: number | null
          client_id?: string
          created_at?: string
          date?: string
          hip_measurement?: number | null
          id?: string
          notes?: string | null
          thigh_measurement?: number | null
          updated_at?: string
          waist_measurement?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_metrics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      client_workout_logs: {
        Row: {
          client_workout_id: string
          completed_date: string
          created_at: string
          difficulty_rating: number | null
          duration: number | null
          feedback: string | null
          id: string
          updated_at: string
        }
        Insert: {
          client_workout_id: string
          completed_date?: string
          created_at?: string
          difficulty_rating?: number | null
          duration?: number | null
          feedback?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          client_workout_id?: string
          completed_date?: string
          created_at?: string
          difficulty_rating?: number | null
          duration?: number | null
          feedback?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_workout_logs_client_workout_id_fkey"
            columns: ["client_workout_id"]
            isOneToOne: false
            referencedRelation: "client_workouts"
            referencedColumns: ["id"]
          }
        ]
      }
      client_workouts: {
        Row: {
          assigned_date: string
          client_id: string
          created_at: string
          due_date: string | null
          id: string
          notes: string | null
          status: string
          updated_at: string
          workout_id: string
        }
        Insert: {
          assigned_date?: string
          client_id: string
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          workout_id: string
        }
        Update: {
          assigned_date?: string
          client_id?: string
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_workouts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_workouts_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          }
        ]
      }
      clients: {
        Row: {
          coach_id: string
          created_at: string
          email: string | null
          goal: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          email?: string | null
          goal?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          email?: string | null
          goal?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      exercises: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          equipment: string | null
          id: string
          instructions: string | null
          muscle_group: string | null
          name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          equipment?: string | null
          id?: string
          instructions?: string | null
          muscle_group?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          equipment?: string | null
          id?: string
          instructions?: string | null
          muscle_group?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          check_in_reminders: boolean
          created_at: string
          email_notifications: boolean
          id: string
          milestone_alerts: boolean
          missed_workout_alerts: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          check_in_reminders?: boolean
          created_at?: string
          email_notifications?: boolean
          id?: string
          milestone_alerts?: boolean
          missed_workout_alerts?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          check_in_reminders?: boolean
          created_at?: string
          email_notifications?: boolean
          id?: string
          milestone_alerts?: boolean
          missed_workout_alerts?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          amount: number | null
          cancel_at_period_end: boolean | null
          canceled_at: number | null
          created_at: string
          currency: string | null
          current_period_end: number | null
          current_period_start: number | null
          custom_field_data: Json | null
          customer_cancellation_comment: string | null
          customer_cancellation_reason: string | null
          customer_id: string | null
          ended_at: number | null
          ends_at: number | null
          id: string
          interval: string | null
          metadata: Json | null
          price_id: string | null
          started_at: number | null
          status: string | null
          stripe_id: string | null
          stripe_price_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          cancel_at_period_end?: boolean | null
          canceled_at?: number | null
          created_at?: string
          currency?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          custom_field_data?: Json | null
          customer_cancellation_comment?: string | null
          customer_cancellation_reason?: string | null
          customer_id?: string | null
          ended_at?: number | null
          ends_at?: number | null
          id?: string
          interval?: string | null
          metadata?: Json | null
          price_id?: string | null
          started_at?: number | null
          status?: string | null
          stripe_id?: string | null
          stripe_price_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          cancel_at_period_end?: boolean | null
          canceled_at?: number | null
          created_at?: string
          currency?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          custom_field_data?: Json | null
          customer_cancellation_comment?: string | null
          customer_cancellation_reason?: string | null
          customer_id?: string | null
          ended_at?: number | null
          ends_at?: number | null
          id?: string
          interval?: string | null
          metadata?: Json | null
          price_id?: string | null
          started_at?: number | null
          status?: string | null
          stripe_id?: string | null
          stripe_price_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: string | null
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          subscription: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          subscription?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          subscription?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          data: Json | null
          event_type: string
          id: string
          modified_at: string
          stripe_event_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          event_type: string
          id?: string
          modified_at?: string
          stripe_event_id?: string | null
          type: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          event_type?: string
          id?: string
          modified_at?: string
          stripe_event_id?: string | null
          type?: string
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          created_at: string
          exercise_id: string
          id: string
          notes: string | null
          order_index: number
          reps: number
          rest_time: number
          sets: number
          updated_at: string
          workout_id: string
        }
        Insert: {
          created_at?: string
          exercise_id: string
          id?: string
          notes?: string | null
          order_index?: number
          reps?: number
          rest_time?: number
          sets?: number
          updated_at?: string
          workout_id: string
        }
        Update: {
          created_at?: string
          exercise_id?: string
          id?: string
          notes?: