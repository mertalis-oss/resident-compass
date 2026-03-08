export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_flags: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          reason: string | null
          resolved: boolean | null
          severity: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          reason?: string | null
          resolved?: boolean | null
          severity?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          reason?: string | null
          resolved?: boolean | null
          severity?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_flags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_flags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_code"] | null
          deposit_amount: number | null
          id: string
          payment_intent_id: string | null
          payment_provider:
            | Database["public"]["Enums"]["payment_provider"]
            | null
          product_id: string | null
          status: Database["public"]["Enums"]["enrollment_status"] | null
          stripe_customer_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"] | null
          deposit_amount?: number | null
          id?: string
          payment_intent_id?: string | null
          payment_provider?:
            | Database["public"]["Enums"]["payment_provider"]
            | null
          product_id?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"] | null
          stripe_customer_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"] | null
          deposit_amount?: number | null
          id?: string
          payment_intent_id?: string | null
          payment_provider?:
            | Database["public"]["Enums"]["payment_provider"]
            | null
          product_id?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"] | null
          stripe_customer_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          event_type: string | null
          id: string
          payload: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type?: string | null
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string | null
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          consent_marketing: boolean | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          interest: Database["public"]["Enums"]["visa_program_type"] | null
          ip_address: string | null
          name: string | null
          phone: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          consent_marketing?: boolean | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          interest?: Database["public"]["Enums"]["visa_program_type"] | null
          ip_address?: string | null
          name?: string | null
          phone?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          consent_marketing?: boolean | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          interest?: Database["public"]["Enums"]["visa_program_type"] | null
          ip_address?: string | null
          name?: string | null
          phone?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      ledger_transactions: {
        Row: {
          amount_cents: number
          created_at: string | null
          enrollment_id: string | null
          id: string
          stripe_event_id: string
          tx_type: Database["public"]["Enums"]["ledger_tx_type"]
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string | null
          enrollment_id?: string | null
          id?: string
          stripe_event_id: string
          tx_type: Database["public"]["Enums"]["ledger_tx_type"]
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string | null
          enrollment_id?: string | null
          id?: string
          stripe_event_id?: string
          tx_type?: Database["public"]["Enums"]["ledger_tx_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ledger_transactions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          features: string[] | null
          id: string
          is_featured: boolean | null
          is_stripe_enabled: boolean | null
          name: string
          price: number | null
          service_id: string
          sort_order: number | null
          stripe_payment_url: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          is_featured?: boolean | null
          is_stripe_enabled?: boolean | null
          name: string
          price?: number | null
          service_id: string
          sort_order?: number | null
          stripe_payment_url?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          is_featured?: boolean | null
          is_stripe_enabled?: boolean | null
          name?: string
          price?: number | null
          service_id?: string
          sort_order?: number | null
          stripe_payment_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "packages_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_code"] | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string | null
          price: number | null
          program: Database["public"]["Enums"]["visa_program_type"] | null
          stripe_link: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"] | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          price?: number | null
          program?: Database["public"]["Enums"]["visa_program_type"] | null
          stripe_link?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"] | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          price?: number | null
          program?: Database["public"]["Enums"]["visa_program_type"] | null
          stripe_link?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          preferred_language: string | null
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string | null
          cta_text: string | null
          description: string | null
          hero_image_url: string | null
          id: string
          is_active: boolean | null
          pain_points: string[] | null
          process_steps: Json | null
          schema_type: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number | null
          subtitle: string | null
          title: string
          trust_points: string[] | null
          value_propositions: string[] | null
        }
        Insert: {
          created_at?: string | null
          cta_text?: string | null
          description?: string | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean | null
          pain_points?: string[] | null
          process_steps?: Json | null
          schema_type?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number | null
          subtitle?: string | null
          title: string
          trust_points?: string[] | null
          value_propositions?: string[] | null
        }
        Update: {
          created_at?: string | null
          cta_text?: string | null
          description?: string | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean | null
          pain_points?: string[] | null
          process_steps?: Json | null
          schema_type?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number | null
          subtitle?: string | null
          title?: string
          trust_points?: string[] | null
          value_propositions?: string[] | null
        }
        Relationships: []
      }
      status_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          enrollment_id: string | null
          id: string
          new_status: Database["public"]["Enums"]["enrollment_status"] | null
          old_status: Database["public"]["Enums"]["enrollment_status"] | null
          reason: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          enrollment_id?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["enrollment_status"] | null
          old_status?: Database["public"]["Enums"]["enrollment_status"] | null
          reason?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          enrollment_id?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["enrollment_status"] | null
          old_status?: Database["public"]["Enums"]["enrollment_status"] | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "status_history_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_webhook_events: {
        Row: {
          id: string
          processed_at: string | null
          type: string | null
        }
        Insert: {
          id: string
          processed_at?: string | null
          type?: string | null
        }
        Update: {
          id?: string
          processed_at?: string | null
          type?: string | null
        }
        Relationships: []
      }
      stripe_webhook_failures: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_id: string
          event_type: string | null
          id: string
          payload: Json | null
          processing_time_ms: number | null
          resolved: boolean | null
          resolved_at: string | null
          retry_count: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_id: string
          event_type?: string | null
          id?: string
          payload?: Json | null
          processing_time_ms?: number | null
          resolved?: boolean | null
          resolved_at?: string | null
          retry_count?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_id?: string
          event_type?: string | null
          id?: string
          payload?: Json | null
          processing_time_ms?: number | null
          resolved?: boolean | null
          resolved_at?: string | null
          retry_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      stripe_webhook_metrics: {
        Row: {
          event_type: string
          failure_count: number | null
          last_processed_at: string | null
          success_count: number | null
        }
        Insert: {
          event_type: string
          failure_count?: number | null
          last_processed_at?: string | null
          success_count?: number | null
        }
        Update: {
          event_type?: string
          failure_count?: number | null
          last_processed_at?: string | null
          success_count?: number | null
        }
        Relationships: []
      }
      visa_entries: {
        Row: {
          country: string | null
          created_at: string | null
          entry_date: string | null
          exit_date: string | null
          id: string
          notes: string | null
          port_of_entry: string | null
          user_id: string | null
          visa_type: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          entry_date?: string | null
          exit_date?: string | null
          id?: string
          notes?: string | null
          port_of_entry?: string | null
          user_id?: string | null
          visa_type?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          entry_date?: string | null
          exit_date?: string | null
          id?: string
          notes?: string | null
          port_of_entry?: string | null
          user_id?: string | null
          visa_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visa_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_visa_status: {
        Args: { p_user_id: string }
        Returns: {
          country: string
          days_spent: number
          tax_resident: boolean
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      process_stripe_payment: {
        Args: {
          p_amount_cents: number
          p_enrollment_id: string
          p_event_id: string
          p_event_type: string
          p_expected_amount_cents: number
          p_is_refund?: boolean
          p_payment_intent: string
          p_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      currency_code: "THB" | "TRY" | "USD" | "EUR"
      enrollment_status:
        | "lead"
        | "applicant"
        | "pending_deposit"
        | "deposit_paid"
        | "doc_verification"
        | "filing"
        | "active_resident"
        | "refund_pending"
        | "refunded"
        | "rejected"
        | "archived"
        | "compliance_alert"
        | "cancelled"
      ledger_tx_type: "payment" | "refund"
      payment_provider: "stripe" | "manual_transfer"
      user_role: "admin" | "agent" | "client"
      visa_program_type:
        | "dtv"
        | "wellness"
        | "mice"
        | "motor"
        | "elite"
        | "retirement"
        | "education"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      currency_code: ["THB", "TRY", "USD", "EUR"],
      enrollment_status: [
        "lead",
        "applicant",
        "pending_deposit",
        "deposit_paid",
        "doc_verification",
        "filing",
        "active_resident",
        "refund_pending",
        "refunded",
        "rejected",
        "archived",
        "compliance_alert",
        "cancelled",
      ],
      ledger_tx_type: ["payment", "refund"],
      payment_provider: ["stripe", "manual_transfer"],
      user_role: ["admin", "agent", "client"],
      visa_program_type: [
        "dtv",
        "wellness",
        "mice",
        "motor",
        "elite",
        "retirement",
        "education",
      ],
    },
  },
} as const
