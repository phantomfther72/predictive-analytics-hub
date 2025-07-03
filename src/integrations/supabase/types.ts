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
      ai_queries: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          id: string
          industry_context: string | null
          query_text: string
          region_context: string | null
          response_text: string
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          industry_context?: string | null
          query_text: string
          region_context?: string | null
          response_text: string
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          industry_context?: string | null
          query_text?: string
          region_context?: string | null
          response_text?: string
          user_id?: string | null
        }
        Relationships: []
      }
      alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          id: string
          industry_id: string | null
          is_read: boolean | null
          message: string
          metadata: Json | null
          severity: Database["public"]["Enums"]["risk_level"]
          title: string
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          id?: string
          industry_id?: string | null
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          severity: Database["public"]["Enums"]["risk_level"]
          title: string
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          id?: string
          industry_id?: string | null
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          severity?: Database["public"]["Enums"]["risk_level"]
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "predictive_industries"
            referencedColumns: ["id"]
          },
        ]
      }
      api_usage: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          method: string
          response_time_ms: number | null
          status_code: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          method: string
          response_time_ms?: number | null
          status_code?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          method?: string
          response_time_ms?: number | null
          status_code?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      data_points: {
        Row: {
          created_at: string | null
          id: string
          industry_id: string | null
          metadata: Json | null
          metric_name: string
          region: string
          source: string | null
          timestamp: string
          unit: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          industry_id?: string | null
          metadata?: Json | null
          metric_name: string
          region: string
          source?: string | null
          timestamp: string
          unit: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          industry_id?: string | null
          metadata?: Json | null
          metric_name?: string
          region?: string
          source?: string | null
          timestamp?: string
          unit?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "data_points_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "predictive_industries"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          message: string
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          message: string
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          message?: string
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
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
      forecasts: {
        Row: {
          confidence_interval: number | null
          created_at: string | null
          factors: Json | null
          forecast_date: string
          id: string
          industry_id: string | null
          metric_name: string
          model_used: Database["public"]["Enums"]["forecast_model"]
          prediction: number
          prediction_range: Json | null
          region: string
        }
        Insert: {
          confidence_interval?: number | null
          created_at?: string | null
          factors?: Json | null
          forecast_date: string
          id?: string
          industry_id?: string | null
          metric_name: string
          model_used: Database["public"]["Enums"]["forecast_model"]
          prediction: number
          prediction_range?: Json | null
          region: string
        }
        Update: {
          confidence_interval?: number | null
          created_at?: string | null
          factors?: Json | null
          forecast_date?: string
          id?: string
          industry_id?: string | null
          metric_name?: string
          model_used?: Database["public"]["Enums"]["forecast_model"]
          prediction?: number
          prediction_range?: Json | null
          region?: string
        }
        Relationships: [
          {
            foreignKeyName: "forecasts_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "predictive_industries"
            referencedColumns: ["id"]
          },
        ]
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
      heatmaps: {
        Row: {
          created_at: string | null
          geojson_data: Json
          id: string
          industry_id: string | null
          metrics: Json | null
          region: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          risk_score: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          geojson_data: Json
          id?: string
          industry_id?: string | null
          metrics?: Json | null
          region: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          risk_score?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          geojson_data?: Json
          id?: string
          industry_id?: string | null
          metrics?: Json | null
          region?: string
          risk_level?: Database["public"]["Enums"]["risk_level"]
          risk_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "heatmaps_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "predictive_industries"
            referencedColumns: ["id"]
          },
        ]
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
      investment_opportunities: {
        Row: {
          annual_return_percentage: number | null
          asset_type: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          current_value: number
          description: string
          featured: boolean | null
          full_details: Json | null
          id: string
          industry_type: string
          minimum_investment: number
          predicted_change: number | null
          prediction_confidence: number | null
          region: string
          risk_level: string
          thumbnail_chart_data: Json | null
          time_horizon: string
          title: string
          updated_at: string | null
        }
        Insert: {
          annual_return_percentage?: number | null
          asset_type: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          current_value: number
          description: string
          featured?: boolean | null
          full_details?: Json | null
          id?: string
          industry_type: string
          minimum_investment: number
          predicted_change?: number | null
          prediction_confidence?: number | null
          region: string
          risk_level: string
          thumbnail_chart_data?: Json | null
          time_horizon: string
          title: string
          updated_at?: string | null
        }
        Update: {
          annual_return_percentage?: number | null
          asset_type?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          current_value?: number
          description?: string
          featured?: boolean | null
          full_details?: Json | null
          id?: string
          industry_type?: string
          minimum_investment?: number
          predicted_change?: number | null
          prediction_confidence?: number | null
          region?: string
          risk_level?: string
          thumbnail_chart_data?: Json | null
          time_horizon?: string
          title?: string
          updated_at?: string | null
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
      opportunity_market_insights: {
        Row: {
          created_at: string | null
          id: string
          insight_id: string
          opportunity_id: string
          relevance_score: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          insight_id: string
          opportunity_id: string
          relevance_score?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          insight_id?: string
          opportunity_id?: string
          relevance_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_market_insights_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "investment_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_recommendations: {
        Row: {
          created_at: string | null
          id: string
          opportunity_id: string
          reason: string | null
          recommendation_score: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          opportunity_id: string
          reason?: string | null
          recommendation_score: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          opportunity_id?: string
          reason?: string | null
          recommendation_score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_recommendations_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "investment_opportunities"
            referencedColumns: ["id"]
          },
        ]
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
      predictive_industries: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
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
      pulse_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          execution_time_ms: number | null
          id: string
          status: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          execution_time_ms?: number | null
          id?: string
          status: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          execution_time_ms?: number | null
          id?: string
          status?: string
        }
        Relationships: []
      }
      user_opportunity_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_type: string
          notes: string | null
          opportunity_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_type: string
          notes?: string | null
          opportunity_id: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_type?: string
          notes?: string | null
          opportunity_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_opportunity_interactions_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "investment_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          favorite_industries: string[] | null
          id: string
          notification_settings: Json | null
          preferred_language: string | null
          preferred_regions: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          favorite_industries?: string[] | null
          id?: string
          notification_settings?: Json | null
          preferred_language?: string | null
          preferred_regions?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          favorite_industries?: string[] | null
          id?: string
          notification_settings?: Json | null
          preferred_language?: string | null
          preferred_regions?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
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
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      insert_sample_investment_opportunities: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_predictions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "analyst" | "guest"
      forecast_model: "linear" | "arima" | "neural_network" | "ensemble"
      industry_type: "housing" | "agriculture" | "mining" | "cryptocurrency"
      market_type:
        | "housing"
        | "agriculture"
        | "mining"
        | "cryptocurrency"
        | "green_hydrogen"
      payment_status: "pending" | "success" | "failed"
      risk_level: "low" | "medium" | "high" | "critical"
      subscription_tier: "free" | "premium"
      user_role: "public" | "analyst" | "partner" | "admin"
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
      app_role: ["admin", "analyst", "guest"],
      forecast_model: ["linear", "arima", "neural_network", "ensemble"],
      industry_type: ["housing", "agriculture", "mining", "cryptocurrency"],
      market_type: [
        "housing",
        "agriculture",
        "mining",
        "cryptocurrency",
        "green_hydrogen",
      ],
      payment_status: ["pending", "success", "failed"],
      risk_level: ["low", "medium", "high", "critical"],
      subscription_tier: ["free", "premium"],
      user_role: ["public", "analyst", "partner", "admin"],
    },
  },
} as const
