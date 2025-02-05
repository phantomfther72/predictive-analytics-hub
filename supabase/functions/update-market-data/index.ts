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

    // Simulate fetching data from various sources
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
    ]

    // Insert the mock data into the database
    const { error } = await supabaseClient
      .from('market_metrics')
      .insert(mockData)

    if (error) throw error

    console.log('Successfully updated market data')

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})