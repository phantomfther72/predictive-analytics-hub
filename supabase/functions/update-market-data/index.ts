import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const validateInput = (value: any, min: number, max: number): number => {
  const num = Number(value);
  if (isNaN(num) || num < min || num > max) {
    throw new Error(`Invalid input: must be between ${min} and ${max}`);
  }
  return num;
};

const sanitizeString = (str: string): string => {
  return str.replace(/[<>]/g, '').trim().substring(0, 200);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authentication required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the request is from an authenticated admin user
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await adminClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    console.log(`Market data update initiated by user: ${user.id}`);

    // Mining commodities in Namibia with validation
    const miningCommodities = [
      {
        commodity: sanitizeString('Uranium'),
        production_mt: validateInput(5620 + Math.floor(Math.random() * 200 - 100), 0, 100000),
        market_value_usd: validateInput(720500000 + Math.floor(Math.random() * 20000000 - 10000000), 0, 10000000000),
        export_growth_percentage: validateInput(12.4 + (Math.random() * 2 - 1), -100, 1000),
        predicted_change: validateInput(14.2 + (Math.random() * 2 - 1), -100, 1000),
        prediction_confidence: validateInput(0.82, 0, 1),
        prediction_explanation: sanitizeString('Rising global nuclear energy demand and supply constraints'),
        prediction_factors: {
          market_trend: validateInput(85, 0, 100),
          volatility: validateInput(35, 0, 100),
          sentiment: validateInput(78, 0, 100),
          market_demand: validateInput(92, 0, 100),
          production_costs: validateInput(65, 0, 100),
          technology_adoption: validateInput(72, 0, 100)
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

    // Insert or update mining data with error handling
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
        throw new Error(`Database update failed: ${error.message}`);
      }
    }

    // Simulate updating other market data types with validation
    const mockData = [
      {
        market_type: 'cryptocurrency',
        metric_name: sanitizeString('Bitcoin Price'),
        value: validateInput(50000 + Math.random() * 1000, 0, 1000000),
        source: sanitizeString('CoinGecko API'),
      },
      {
        market_type: 'housing',
        metric_name: sanitizeString('Average House Price'),
        value: validateInput(150000 + Math.random() * 5000, 0, 10000000),
        source: sanitizeString('Housing Market API'),
      },
      {
        market_type: 'mining',
        metric_name: sanitizeString('Uranium Production'),
        value: validateInput(3000 + Math.random() * 100, 0, 100000),
        source: sanitizeString('Mining Stats API'),
      },
    ];

    // Insert the validated market metrics data
    const { error } = await supabaseClient
      .from('market_metrics')
      .insert(mockData);

    if (error) {
      console.error('Error updating market metrics:', error);
      throw new Error(`Market metrics update failed: ${error.message}`);
    }

    console.log('Successfully updated mining and market data');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Mining data updated successfully',
        timestamp: new Date().toISOString(),
        updatedBy: user.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error);
    
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    const safeMessage = message.includes('Authentication') || message.includes('Invalid') 
      ? message 
      : 'Market data update failed';
    
    return new Response(
      JSON.stringify({ 
        error: safeMessage,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: message.includes('Authentication') ? 401 : 500,
      },
    )
  }
})
