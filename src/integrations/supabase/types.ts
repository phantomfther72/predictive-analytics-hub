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
      agriculture_market_data: {
        Row: {
          created_at: string | null
          crop_type: string
          cultivated_acreage: number
          export_volume_tons: number
          fertilizer_usage_kg_ha: number
          id: string
          import_volume_tons: number
          irrigation_volume_m3: number
          market_price_usd: number
          predicted_change: number | null
          prediction_confidence: number | null
          prediction_explanation: string | null
          prediction_factors: Json | null
          prediction_timestamp: string | null
          rainfall_mm: number
          region: string
          timestamp: string
          yield_per_hectare: number
        }
        Insert: {
          created_at?: string | null
          crop_type: string
          cultivated_acreage: number
          export_volume_tons: number
          fertilizer_usage_kg_ha: number
          id?: string
          import_volume_tons: number
          irrigation_volume_m3: number
          market_price_usd: number
          predicted_change?: number | null
          prediction_confidence?: number | null
          prediction_explanation?: string | null
          prediction_factors?: Json | null
          prediction_timestamp?: string | null
          rainfall_mm: number
          region: string
          timestamp?: string
          yield_per_hectare: number
        }
        Update: {
          created_at?: string | null
          crop_type?: string
          cultivated_acreage?: number
          export_volume_tons?: number
          fertilizer_usage_kg_ha?: number
          id?: string
          import_volume_tons?: number
          irrigation_volume_m3?: number
          market_price_usd?: number
          predicted_change?: number | null
          prediction_confidence?: number | null
          prediction_explanation?: string | null
          prediction_factors?: Json | null
          prediction_timestamp?: string | null
          rainfall_mm?: number
          region?: string
          timestamp?: string
          yield_per_hectare?: number
        }
        Relationships: []
      }
      financial_market_metrics: {
        Row: {
          asset: string
          change_percentage_24h: number
          created_at: string | null
          current_price: number
          id: string
          predicted_change: number | null
          prediction_confidence: number | null
          prediction_explanation: string | null
          prediction_factors: Json | null
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
          prediction_confidence?: number | null
          prediction_explanation?: string | null
          prediction_factors?: Json | null
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
          prediction_confidence?: number | null
          prediction_explanation?: string | null
          prediction_factors?: Json | null
          prediction_timestamp?: string | null
          timestamp?: string
          volume?: number
        }
        Relationships: []
      }
      green_hydrogen_metrics: {
        Row: {
          created_at: string | null
          facility_uptime_pct: number
          funding_round: string | null
          id: string
          investment_amount_usd: number
          market_demand_tons: number
          operational_efficiency_pct: number
          predicted_change: number | null
          prediction_confidence: number | null
          prediction_explanation: string | null
          prediction_factors: Json | null
          prediction_timestamp: string | null
          production_capacity_mw: number
          timestamp: string
        }
        Insert: {
          created_at?: string | null
          facility_uptime_pct: number
          funding_round?: string | null
          id?: string
          investment_amount_usd: number
          market_demand_tons: number
          operational_efficiency_pct: number
          predicted_change?: number | null
          prediction_confidence?: number | null
          prediction_explanation?: string | null
          prediction_factors?: Json | null
          prediction_timestamp?: string | null
          production_capacity_mw: number
          timestamp?: string
        }
        Update: {
          created_at?: string | null
          facility_uptime_pct?: number
          funding_round?: string | null
          id?: string
          investment_amount_usd?: number
          market_demand_tons?: number
          operational_efficiency_pct?: number
          predicted_change?: number | null
          prediction_confidence?: number | null
          prediction_explanation?: string | null
          prediction_factors?: Json | null
          prediction_timestamp?: string | null
          production_capacity_mw?: number
          timestamp?: string
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
          prediction_confidence: number | null
          prediction_explanation: string | null
          prediction_factors: Json | null
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
          prediction_confidence?: number | null
          prediction_explanation?: string | null
          prediction_factors?: Json | null
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
          prediction_confidence?: number | null
          prediction_explanation?: string | null
          prediction_factors?: Json | null
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
          predicted_change: number | null
          prediction_confidence: number | null
          source: string
          timestamp: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          market_type: Database["public"]["Enums"]["market_type"]
          metric_name: string
          predicted_change?: number | null
          prediction_confidence?: number | null
          source: string
          timestamp?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          market_type?: Database["public"]["Enums"]["market_type"]
          metric_name?: string
          predicted_change?: number | null
          prediction_confidence?: number | null
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
          prediction_confidence: number | null
          prediction_explanation: string | null
          prediction_factors: Json | null
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
          prediction_confidence?: number | null
          prediction_explanation?: string | null
          prediction_factors?: Json | null
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
          prediction_confidence?: number | null
          prediction_explanation?: string | null
          prediction_factors?: Json | null
          prediction_timestamp?: string | null
          production_mt?: number
          timestamp?: string
        }
        Relationships: []
      }
      model_predictions: {
        Row: {
          confidence: number | null
          created_at: string | null
          dataset: string
          id: string
          metric_key: string
          model_id: string | null
          prediction_value: number
          timestamp: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          dataset: string
          id?: string
          metric_key: string
          model_id?: string | null
          prediction_value: number
          timestamp: string
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          dataset?: string
          id?: string
          metric_key?: string
          model_id?: string | null
          prediction_value?: number
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_predictions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      model_weights: {
        Row: {
          created_at: string | null
          enabled: boolean
          id: string
          model_id: string | null
          updated_at: string | null
          user_id: string | null
          weight: number
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          model_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          weight?: number
        }
        Update: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          model_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "model_weights_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          color: string
          configuration: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          color: string
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      news_feed: {
        Row: {
          created_at: string | null
          headline: string
          id: string
          image_url: string | null
          published_at: string | null
          region: string | null
          sector: string
          source: string
          summary: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          headline: string
          id?: string
          image_url?: string | null
          published_at?: string | null
          region?: string | null
          sector: string
          source: string
          summary?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          headline?: string
          id?: string
          image_url?: string | null
          published_at?: string | null
          region?: string | null
          sector?: string
          source?: string
          summary?: string | null
          url?: string
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
        Args: { current_value: number; historical_change: number }
        Returns: {
          predicted_change: number
          confidence: number
          explanation: string
          factors: Json
        }[]
      }
      calculate_weighted_prediction: {
        Args: {
          _dataset: string
          _metric_key: string
          _timestamp: string
          _user_id: string
        }
        Returns: {
          weighted_prediction: number
          model_details: Json
        }[]
      }
      update_predictions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      industry_type: "housing" | "agriculture" | "mining" | "cryptocurrency"
      market_type:
        | "housing"
        | "agriculture"
        | "mining"
        | "cryptocurrency"
        | "green_hydrogen"
      payment_status: "pending" | "success" | "failed"
      subscription_tier: "free" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      industry_type: ["housing", "agriculture", "mining", "cryptocurrency"],
      market_type: [
        "housing",
        "agriculture",
        "mining",
        "cryptocurrency",
        "green_hydrogen",
      ],
      payment_status: ["pending", "success", "failed"],
      subscription_tier: ["free", "premium"],
    },
  },
} as const
