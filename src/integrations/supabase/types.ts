export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      financial_market_metrics: {
        Row: {
          asset: string
          change_percentage_24h: number
          created_at: string | null
          current_price: number
          id: string
          predicted_change: number | null
          prediction_timestamp: string | null
          timestamp: string
          volume: number
        }
        Insert: {
          asset: string
          change_percentage_24h: number
          created_at?: string | null
          current_price: number
          id?: string
          predicted_change?: number | null
          prediction_timestamp?: string | null
          timestamp?: string
          volume: number
        }
        Update: {
          asset?: string
          change_percentage_24h?: number
          created_at?: string | null
          current_price?: number
          id?: string
          predicted_change?: number | null
          prediction_timestamp?: string | null
          timestamp?: string
          volume?: number
        }
        Relationships: []
      }
      housing_market_data: {
        Row: {
          avg_price_usd: number
          created_at: string | null
          id: string
          listings_active: number
          predicted_change: number | null
          prediction_timestamp: string | null
          region: string
          timestamp: string
          yoy_change: number
        }
        Insert: {
          avg_price_usd: number
          created_at?: string | null
          id?: string
          listings_active: number
          predicted_change?: number | null
          prediction_timestamp?: string | null
          region: string
          timestamp?: string
          yoy_change: number
        }
        Update: {
          avg_price_usd?: number
          created_at?: string | null
          id?: string
          listings_active?: number
          predicted_change?: number | null
          prediction_timestamp?: string | null
          region?: string
          timestamp?: string
          yoy_change?: number
        }
        Relationships: []
      }
      industry_insights: {
        Row: {
          created_at: string
          id: string
          industry: Database["public"]["Enums"]["industry_type"]
          metric_name: string
          source: string | null
          trend_percentage: number | null
          unit: string
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          industry: Database["public"]["Enums"]["industry_type"]
          metric_name: string
          source?: string | null
          trend_percentage?: number | null
          unit: string
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          industry?: Database["public"]["Enums"]["industry_type"]
          metric_name?: string
          source?: string | null
          trend_percentage?: number | null
          unit?: string
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      market_metrics: {
        Row: {
          created_at: string | null
          id: string
          market_type: Database["public"]["Enums"]["market_type"]
          metric_name: string
          source: string
          timestamp: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          market_type: Database["public"]["Enums"]["market_type"]
          metric_name: string
          source: string
          timestamp?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          market_type?: Database["public"]["Enums"]["market_type"]
          metric_name?: string
          source?: string
          timestamp?: string | null
          value?: number
        }
        Relationships: []
      }
      market_trends: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          description: string
          end_date: string | null
          id: string
          market_type: Database["public"]["Enums"]["market_type"]
          start_date: string
          trend_name: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          description: string
          end_date?: string | null
          id?: string
          market_type: Database["public"]["Enums"]["market_type"]
          start_date: string
          trend_name: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          description?: string
          end_date?: string | null
          id?: string
          market_type?: Database["public"]["Enums"]["market_type"]
          start_date?: string
          trend_name?: string
        }
        Relationships: []
      }
      Mining: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      mining_sector_insights: {
        Row: {
          commodity: string
          created_at: string | null
          export_growth_percentage: number
          id: string
          market_value_usd: number
          predicted_change: number | null
          prediction_timestamp: string | null
          production_mt: number
          timestamp: string
        }
        Insert: {
          commodity: string
          created_at?: string | null
          export_growth_percentage: number
          id?: string
          market_value_usd: number
          predicted_change?: number | null
          prediction_timestamp?: string | null
          production_mt: number
          timestamp?: string
        }
        Update: {
          commodity?: string
          created_at?: string | null
          export_growth_percentage?: number
          id?: string
          market_value_usd?: number
          predicted_change?: number | null
          prediction_timestamp?: string | null
          production_mt?: number
          timestamp?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["payment_status"]
          stripe_client_secret: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_client_secret?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_client_secret?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          last_payment_status: string | null
          stripe_customer_id: string | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          last_payment_status?: string | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          last_payment_status?: string | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_predicted_change: {
        Args: {
          current_value: number
          historical_change: number
        }
        Returns: number
      }
      update_predictions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      industry_type: "housing" | "agriculture" | "mining" | "cryptocurrency"
      market_type: "housing" | "agriculture" | "mining" | "cryptocurrency"
      payment_status: "pending" | "success" | "failed"
      subscription_tier: "free" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
