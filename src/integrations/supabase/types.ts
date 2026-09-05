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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_notes: {
        Row: {
          author_id: string
          body: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      application_documents: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          id: string
          owner_id: string
          quote_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          id?: string
          owner_id: string
          quote_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          owner_id?: string
          quote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_documents_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "rfq_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          note: string
          reviewer_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          note?: string
          reviewer_id?: string | null
          status: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          note?: string
          reviewer_id?: string | null
          status?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          meta: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          meta?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          meta?: Json
        }
        Relationships: []
      }
      commissions: {
        Row: {
          amount: number
          contract_id: string
          created_at: string
          due_date: string
          id: string
          percent: number
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          contract_id: string
          created_at?: string
          due_date?: string
          id?: string
          percent?: number
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          contract_id?: string
          created_at?: string
          due_date?: string
          id?: string
          percent?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_entities: {
        Row: {
          created_at: string
          entity_name: string
          entity_type: string
          field: string
          id: string
          is_verified: boolean
          job_title: string
          license_number: string
          official_email: string
          org_role: string
          phone: string
          region: string
          representative_name: string
          status: string
          updated_at: string
          user_id: string
          verification_note: string
        }
        Insert: {
          created_at?: string
          entity_name: string
          entity_type: string
          field?: string
          id?: string
          is_verified?: boolean
          job_title: string
          license_number: string
          official_email: string
          org_role?: string
          phone: string
          region?: string
          representative_name: string
          status?: string
          updated_at?: string
          user_id: string
          verification_note?: string
        }
        Update: {
          created_at?: string
          entity_name?: string
          entity_type?: string
          field?: string
          id?: string
          is_verified?: boolean
          job_title?: string
          license_number?: string
          official_email?: string
          org_role?: string
          phone?: string
          region?: string
          representative_name?: string
          status?: string
          updated_at?: string
          user_id?: string
          verification_note?: string
        }
        Relationships: []
      }
      contract_documents: {
        Row: {
          contract_id: string
          created_at: string
          file_name: string
          file_path: string
          id: string
          owner_id: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          file_name: string
          file_path: string
          id?: string
          owner_id: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_documents_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          amount: number
          buyer_id: string
          created_at: string
          currency: string
          end_date: string | null
          id: string
          provider_id: string
          quote_id: string | null
          rfq_id: string
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          amount?: number
          buyer_id: string
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          provider_id: string
          quote_id?: string | null
          rfq_id: string
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_id?: string
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          provider_id?: string
          quote_id?: string | null
          rfq_id?: string
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "rfq_quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          created_by: string
          id: string
          last_message_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          last_message_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          last_message_at?: string
        }
        Relationships: []
      }
      experts: {
        Row: {
          avatar_url: string | null
          bio: string
          created_at: string
          full_name: string
          id: string
          is_published: boolean
          is_verified: boolean
          specialty: string
          updated_at: string
          years_experience: number
        }
        Insert: {
          avatar_url?: string | null
          bio?: string
          created_at?: string
          full_name: string
          id?: string
          is_published?: boolean
          is_verified?: boolean
          specialty: string
          updated_at?: string
          years_experience?: number
        }
        Update: {
          avatar_url?: string | null
          bio?: string
          created_at?: string
          full_name?: string
          id?: string
          is_published?: boolean
          is_verified?: boolean
          specialty?: string
          updated_at?: string
          years_experience?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachment_name: string | null
          attachment_path: string | null
          body: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          attachment_name?: string | null
          attachment_path?: string | null
          body?: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          attachment_name?: string | null
          attachment_path?: string | null
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          link: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          link?: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          link?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunity_answers: {
        Row: {
          body: string
          created_at: string
          id: string
          question_id: string
          responder_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          question_id: string
          responder_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          question_id?: string
          responder_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "opportunity_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      opportunity_questions: {
        Row: {
          asker_id: string
          body: string
          created_at: string
          id: string
          is_public: boolean
          rfq_id: string
        }
        Insert: {
          asker_id: string
          body: string
          created_at?: string
          id?: string
          is_public?: boolean
          rfq_id: string
        }
        Update: {
          asker_id?: string
          body?: string
          created_at?: string
          id?: string
          is_public?: boolean
          rfq_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_questions_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_documents: {
        Row: {
          created_at: string
          doc_type: string
          entity_id: string
          file_name: string
          file_path: string
          id: string
          owner_id: string
          status: string
        }
        Insert: {
          created_at?: string
          doc_type?: string
          entity_id: string
          file_name: string
          file_path: string
          id?: string
          owner_id: string
          status?: string
        }
        Update: {
          created_at?: string
          doc_type?: string
          entity_id?: string
          file_name?: string
          file_path?: string
          id?: string
          owner_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_documents_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "community_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          commission_id: string
          created_at: string
          id: string
          method: string
          paid_at: string
          reference: string
        }
        Insert: {
          amount?: number
          commission_id: string
          created_at?: string
          id?: string
          method?: string
          paid_at?: string
          reference?: string
        }
        Update: {
          amount?: number
          commission_id?: string
          created_at?: string
          id?: string
          method?: string
          paid_at?: string
          reference?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_commission_id_fkey"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commissions"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          organization: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          organization?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          organization?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_applications: {
        Row: {
          created_at: string
          id: string
          note: string
          portfolio_url: string | null
          project_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string
          portfolio_url?: string | null
          project_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string
          portfolio_url?: string | null
          project_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_applications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          brief: string
          budget: string | null
          created_at: string
          deliverables: string
          duration: string | null
          field: string
          id: string
          image_url: string | null
          is_open: boolean
          requirements: string
          title: string
          updated_at: string
        }
        Insert: {
          brief: string
          budget?: string | null
          created_at?: string
          deliverables?: string
          duration?: string | null
          field?: string
          id?: string
          image_url?: string | null
          is_open?: boolean
          requirements?: string
          title: string
          updated_at?: string
        }
        Update: {
          brief?: string
          budget?: string | null
          created_at?: string
          deliverables?: string
          duration?: string | null
          field?: string
          id?: string
          image_url?: string | null
          is_open?: boolean
          requirements?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      requests: {
        Row: {
          created_at: string
          details: Json
          document_path: string | null
          id: string
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json
          document_path?: string | null
          id?: string
          status?: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json
          document_path?: string | null
          id?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rfq_quotes: {
        Row: {
          amount: string
          contact: string
          created_at: string
          duration: string
          id: string
          note: string
          rfq_id: string
          status: string
          supplier_id: string
          supplier_name: string
        }
        Insert: {
          amount: string
          contact?: string
          created_at?: string
          duration?: string
          id?: string
          note?: string
          rfq_id: string
          status?: string
          supplier_id: string
          supplier_name: string
        }
        Update: {
          amount?: string
          contact?: string
          created_at?: string
          duration?: string
          id?: string
          note?: string
          rfq_id?: string
          status?: string
          supplier_id?: string
          supplier_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "rfq_quotes_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
        ]
      }
      rfqs: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          awarded_quote_id: string | null
          budget: string | null
          category: string
          city: string
          created_at: string
          deadline: string
          description: string
          entity_kind: string
          entity_name: string
          id: string
          is_open: boolean
          owner_id: string
          region: string
          rejection_reason: string
          sector: string
          status: string
          terms_version: string
          title: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          awarded_quote_id?: string | null
          budget?: string | null
          category: string
          city?: string
          created_at?: string
          deadline: string
          description?: string
          entity_kind?: string
          entity_name: string
          id?: string
          is_open?: boolean
          owner_id: string
          region?: string
          rejection_reason?: string
          sector?: string
          status?: string
          terms_version?: string
          title: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          awarded_quote_id?: string | null
          budget?: string | null
          category?: string
          city?: string
          created_at?: string
          deadline?: string
          description?: string
          entity_kind?: string
          entity_name?: string
          id?: string
          is_open?: boolean
          owner_id?: string
          region?: string
          rejection_reason?: string
          sector?: string
          status?: string
          terms_version?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          about: string
          category: string
          company_name: string
          contact_name: string
          cr_number: string
          created_at: string
          email: string
          id: string
          phone: string
          region: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          about?: string
          category: string
          company_name: string
          contact_name: string
          cr_number: string
          created_at?: string
          email: string
          id?: string
          phone: string
          region?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          about?: string
          category?: string
          company_name?: string
          contact_name?: string
          cr_number?: string
          created_at?: string
          email?: string
          id?: string
          phone?: string
          region?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      terms_versions: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
          version: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_terms_acceptances: {
        Row: {
          acceptance_type: string
          accepted_at: string
          id: string
          related_action: string
          related_id: string | null
          terms_version: string
          user_id: string
        }
        Insert: {
          acceptance_type: string
          accepted_at?: string
          id?: string
          related_action?: string
          related_id?: string | null
          terms_version: string
          user_id: string
        }
        Update: {
          acceptance_type?: string
          accepted_at?: string
          id?: string
          related_action?: string
          related_id?: string | null
          terms_version?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_conversation_participant: {
        Args: { _conversation_id: string; _user_id: string }
        Returns: boolean
      }
      is_verified_member: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
