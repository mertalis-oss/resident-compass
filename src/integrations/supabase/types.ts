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
          created_at: string | null
          created_from: string | null
          customer_whatsapp: string | null
          email: string
          id: string
          name: string | null
          quiz_answers: Json | null
          recommended_service_id: string | null
          score: number | null
          service_id: string | null
          source_domain: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
        }
        Insert: {
          created_at?: string | null
          created_from?: string | null
          customer_whatsapp?: string | null
          email: string
          id?: string
          name?: string | null
          quiz_answers?: Json | null
          recommended_service_id?: string | null
          score?: number | null
          service_id?: string | null
          source_domain?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
        }
        Update: {
          created_at?: string | null
          created_from?: string | null
          customer_whatsapp?: string | null
          email?: string
          id?: string
          name?: string | null
          quiz_answers?: Json | null
          recommended_service_id?: string | null
          score?: number | null
          service_id?: string | null
          source_domain?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_recommended_service_id_fkey"
            columns: ["recommended_service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
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
      orders: {
        Row: {
          amount: number | null
          assigned_to: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          customer_email: string
          customer_name: string | null
          customer_whatsapp: string | null
          id: string
          notes: string | null
          paid_at: string | null
          refund_status: Database["public"]["Enums"]["refund_status"] | null
          service_id: string | null
          service_title_snapshot: string | null
          source_domain: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          stripe_customer_id: string | null
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          updated_at: string | null
          utm_campaign: string | null
          utm_source: string | null
        }
        Insert: {
          amount?: number | null
          assigned_to?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          customer_email: string
          customer_name?: string | null
          customer_whatsapp?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          refund_status?: Database["public"]["Enums"]["refund_status"] | null
          service_id?: string | null
          service_title_snapshot?: string | null
          source_domain?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          stripe_customer_id?: string | null
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
        }
        Update: {
          amount?: number | null
          assigned_to?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string
          customer_name?: string | null
          customer_whatsapp?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          refund_status?: Database["public"]["Enums"]["refund_status"] | null
          service_id?: string | null
          service_title_snapshot?: string | null
          source_domain?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          stripe_customer_id?: string | null
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_service_id_fkey"
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
      service_bundles: {
        Row: {
          bundle_id: string | null
          id: string
          is_mandatory: boolean | null
          item_id: string | null
          order_index: number | null
        }
        Insert: {
          bundle_id?: string | null
          id?: string
          is_mandatory?: boolean | null
          item_id?: string | null
          order_index?: number | null
        }
        Update: {
          bundle_id?: string | null
          id?: string
          is_mandatory?: boolean | null
          item_id?: string | null
          order_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_bundles_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bundles_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          calendly_url: string | null
          capacity: number | null
          category: string | null
          created_at: string | null
          currency: string | null
          delivery_time_days: number | null
          description: string | null
          faq: Json | null
          features: Json | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_bundle: boolean | null
          is_featured: boolean | null
          location: string | null
          order_index: number | null
          price: number
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          stripe_description: string | null
          stripe_price_id: string
          title: string
          visible_on: Database["public"]["Enums"]["visibility_scope"] | null
        }
        Insert: {
          calendly_url?: string | null
          capacity?: number | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          delivery_time_days?: number | null
          description?: string | null
          faq?: Json | null
          features?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_bundle?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          order_index?: number | null
          price: number
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          stripe_description?: string | null
          stripe_price_id: string
          title: string
          visible_on?: Database["public"]["Enums"]["visibility_scope"] | null
        }
        Update: {
          calendly_url?: string | null
          capacity?: number | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          delivery_time_days?: number | null
          description?: string | null
          faq?: Json | null
          features?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_bundle?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          order_index?: number | null
          price?: number
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          stripe_description?: string | null
          stripe_price_id?: string
          title?: string
          visible_on?: Database["public"]["Enums"]["visibility_scope"] | null
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
      lead_status: "new" | "contacted" | "converted" | "lost"
      ledger_tx_type: "payment" | "refund"
      order_status:
        | "pending"
        | "paid"
        | "processing"
        | "fulfilled"
        | "cancelled"
      payment_provider: "stripe" | "manual_transfer"
      refund_status: "none" | "requested" | "refunded" | "disputed"
      user_role: "admin" | "agent" | "client"
      visa_program_type:
        | "dtv"
        | "wellness"
        | "mice"
        | "motor"
        | "elite"
        | "retirement"
        | "education"
      visibility_scope: "tr" | "global" | "both"
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
      lead_status: ["new", "contacted", "converted", "lost"],
      ledger_tx_type: ["payment", "refund"],
      order_status: ["pending", "paid", "processing", "fulfilled", "cancelled"],
      payment_provider: ["stripe", "manual_transfer"],
      refund_status: ["none", "requested", "refunded", "disputed"],
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
      visibility_scope: ["tr", "global", "both"],
    },
  },
} as const
