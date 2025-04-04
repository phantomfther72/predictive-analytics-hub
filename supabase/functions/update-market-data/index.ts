
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Mining commodities in Namibia
    const miningCommodities = [
      {
        commodity: 'Uranium',
        production_mt: 5620 + Math.floor(Math.random() * 200 - 100),
        market_value_usd: 720500000 + Math.floor(Math.random() * 20000000 - 10000000),
        export_growth_percentage: 12.4 + (Math.random() * 2 - 1),
        predicted_change: 14.2 + (Math.random() * 2 - 1),
        prediction_confidence: 0.82,
        prediction_explanation: 'Rising global nuclear energy demand and supply constraints',
        prediction_factors: {
          market_trend: 85,
          volatility: 35,
          sentiment: 78,
          market_demand: 92,
          production_costs: 65,
          technology_adoption: 72
        }
      },
      {
        commodity: 'Diamonds',
        production_mt: 2150 + Math.floor(Math.random() * 100 - 50),
        market_value_usd: 580000000 + Math.floor(Math.random() * 15000000 - 7500000),
        export_growth_percentage: 7.8 + (Math.random() * 2 - 1),
        predicted_change: 9.5 + (Math.random() * 2 - 1),
        prediction_confidence: 0.78,
        prediction_explanation: 'Stable luxury market demand and limited new mining operations',
        prediction_factors: {
          market_trend: 72,
          volatility: 28,
          sentiment: 85,
          market_demand: 81,
          production_costs: 62,
          technology_adoption: 58
        }
      },
      {
        commodity: 'Gold',
        production_mt: 1850 + Math.floor(Math.random() * 100 - 50),
        market_value_usd: 420000000 + Math.floor(Math.random() * 10000000 - 5000000),
        export_growth_percentage: 9.2 + (Math.random() * 2 - 1),
        predicted_change: 11.0 + (Math.random() * 2 - 1),
        prediction_confidence: 0.75,
        prediction_explanation: 'Economic uncertainty driving safe-haven asset demand',
        prediction_factors: {
          market_trend: 88,
          volatility: 45,
          sentiment: 82,
          market_demand: 79,
          production_costs: 61,
          technology_adoption: 54
        }
      },
      {
        commodity: 'Copper',
        production_mt: 16500 + Math.floor(Math.random() * 500 - 250),
        market_value_usd: 320000000 + Math.floor(Math.random() * 8000000 - 4000000),
        export_growth_percentage: 8.4 + (Math.random() * 2 - 1),
        predicted_change: 10.2 + (Math.random() * 2 - 1),
        prediction_confidence: 0.79,
        prediction_explanation: 'Growing demand from renewable energy and electric vehicle sectors',
        prediction_factors: {
          market_trend: 84,
          volatility: 32,
          sentiment: 76,
          market_demand: 89,
          production_costs: 58,
          technology_adoption: 82
        }
      },
      {
        commodity: 'Zinc',
        production_mt: 22800 + Math.floor(Math.random() * 700 - 350),
        market_value_usd: 185000000 + Math.floor(Math.random() * 5000000 - 2500000),
        export_growth_percentage: 5.6 + (Math.random() * 2 - 1),
        predicted_change: 7.8 + (Math.random() * 2 - 1),
        prediction_confidence: 0.72,
        prediction_explanation: 'Moderate industrial demand growth and stable supply',
        prediction_factors: {
          market_trend: 68,
          volatility: 35,
          sentiment: 62,
          market_demand: 72,
          production_costs: 59,
          technology_adoption: 65
        }
      },
      {
        commodity: 'Lead',
        production_mt: 12400 + Math.floor(Math.random() * 400 - 200),
        market_value_usd: 98000000 + Math.floor(Math.random() * 3000000 - 1500000),
        export_growth_percentage: 3.2 + (Math.random() * 2 - 1),
        predicted_change: 4.5 + (Math.random() * 2 - 1),
        prediction_confidence: 0.68,
        prediction_explanation: 'Steady but slow growth in battery and industrial applications',
        prediction_factors: {
          market_trend: 58,
          volatility: 30,
          sentiment: 52,
          market_demand: 62,
          production_costs: 55,
          technology_adoption: 48
        }
      },
      {
        commodity: 'Manganese',
        production_mt: 6800 + Math.floor(Math.random() * 200 - 100),
        market_value_usd: 76000000 + Math.floor(Math.random() * 2000000 - 1000000),
        export_growth_percentage: 6.8 + (Math.random() * 2 - 1),
        predicted_change: 8.4 + (Math.random() * 2 - 1),
        prediction_confidence: 0.74,
        prediction_explanation: 'Increasing demand from steel industry and battery technologies',
        prediction_factors: {
          market_trend: 74,
          volatility: 28,
          sentiment: 68,
          market_demand: 78,
          production_costs: 61,
          technology_adoption: 72
        }
      }
    ];

    // Insert or update mining data
    for (const item of miningCommodities) {
      const { error } = await supabaseClient
        .from('mining_sector_insights')
        .upsert({
          ...item,
          timestamp: new Date().toISOString(),
          prediction_timestamp: new Date().toISOString()
        }, { onConflict: 'commodity' });

      if (error) {
        console.error('Error updating mining data:', error);
        throw error;
      }
    }

    // Simulate updating other market data types as well
    const mockData = [
      {
        market_type: 'cryptocurrency',
        metric_name: 'Bitcoin Price',
        value: 50000 + Math.random() * 1000,
        source: 'CoinGecko API',
      },
      {
        market_type: 'housing',
        metric_name: 'Average House Price',
        value: 150000 + Math.random() * 5000,
        source: 'Housing Market API',
      },
      {
        market_type: 'mining',
        metric_name: 'Uranium Production',
        value: 3000 + Math.random() * 100,
        source: 'Mining Stats API',
      },
    ];

    // Insert the mock market metrics data
    const { error } = await supabaseClient
      .from('market_metrics')
      .insert(mockData);

    if (error) {
      console.error('Error updating market metrics:', error);
      throw error;
    }

    console.log('Successfully updated mining and market data');

    return new Response(
      JSON.stringify({ success: true, message: 'Mining data updated successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
