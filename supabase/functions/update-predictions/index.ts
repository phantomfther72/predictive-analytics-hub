import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PredictionUpdate {
  predicted_change: number;
  prediction_confidence: number;
  prediction_explanation: string;
  prediction_factors: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting prediction update process...');

    // Log the start of the update process
    await supabase.from('pulse_logs').insert({
      action: 'automated_prediction_update',
      status: 'initiated',
      details: { 
        trigger: 'cron_job',
        timestamp: new Date().toISOString() 
      }
    });

    // Generate mock AI predictions (in real implementation, this would call actual ML models)
    const generatePrediction = (): PredictionUpdate => {
      const baseChange = (Math.random() - 0.5) * 20; // -10% to +10%
      const confidence = 0.5 + Math.random() * 0.4; // 50% to 90%
      
      const factors = {
        market_sentiment: Math.random(),
        economic_indicators: Math.random(),
        seasonal_trends: Math.random(),
        global_factors: Math.random(),
        regulatory_environment: Math.random()
      };

      const explanations = [
        'Based on current market trends and economic indicators',
        'Analysis shows strong correlation with global market patterns',
        'Seasonal factors and historical data suggest this trajectory',
        'Economic fundamentals and policy changes drive this forecast',
        'Technical analysis combined with sentiment data indicates this trend'
      ];

      return {
        predicted_change: Math.round(baseChange * 100) / 100,
        prediction_confidence: Math.round(confidence * 100) / 100,
        prediction_explanation: explanations[Math.floor(Math.random() * explanations.length)],
        prediction_factors: factors
      };
    };

    // Update financial market metrics
    const { data: financialMetrics } = await supabase
      .from('financial_market_metrics')
      .select('id')
      .limit(20);

    if (financialMetrics) {
      for (const metric of financialMetrics) {
        const prediction = generatePrediction();
        await supabase
          .from('financial_market_metrics')
          .update({
            ...prediction,
            prediction_timestamp: new Date().toISOString()
          })
          .eq('id', metric.id);
      }
    }

    // Update agriculture market data
    const { data: agricultureData } = await supabase
      .from('agriculture_market_data')
      .select('id')
      .limit(20);

    if (agricultureData) {
      for (const data of agricultureData) {
        const prediction = generatePrediction();
        await supabase
          .from('agriculture_market_data')
          .update({
            ...prediction,
            prediction_timestamp: new Date().toISOString()
          })
          .eq('id', data.id);
      }
    }

    // Update housing market data
    const { data: housingData } = await supabase
      .from('housing_market_data')
      .select('id')
      .limit(20);

    if (housingData) {
      for (const data of housingData) {
        const prediction = generatePrediction();
        await supabase
          .from('housing_market_data')
          .update({
            ...prediction,
            prediction_timestamp: new Date().toISOString()
          })
          .eq('id', data.id);
      }
    }

    // Update mining sector insights
    const { data: miningData } = await supabase
      .from('mining_sector_insights')
      .select('id')
      .limit(20);

    if (miningData) {
      for (const data of miningData) {
        const prediction = generatePrediction();
        await supabase
          .from('mining_sector_insights')
          .update({
            ...prediction,
            prediction_timestamp: new Date().toISOString()
          })
          .eq('id', data.id);
      }
    }

    // Update green hydrogen metrics
    const { data: hydrogenData } = await supabase
      .from('green_hydrogen_metrics')
      .select('id')
      .limit(20);

    if (hydrogenData) {
      for (const data of hydrogenData) {
        const prediction = generatePrediction();
        await supabase
          .from('green_hydrogen_metrics')
          .update({
            ...prediction,
            prediction_timestamp: new Date().toISOString()
          })
          .eq('id', data.id);
      }
    }

    // Insert new forecasts for the next period
    const industries = await supabase
      .from('predictive_industries')
      .select('id, type');

    if (industries.data) {
      const regions = ['Khomas', 'Erongo', 'Karas', 'Kavango East', 'Omusati', 'Oshana'];
      const metrics = {
        mining: ['Production Output', 'Market Value', 'Export Growth'],
        agriculture: ['Crop Yield', 'Livestock Population', 'Market Price'],
        housing: ['Property Price', 'Construction Volume', 'Sales Activity'],
        financial: ['Deposit Growth', 'Credit Expansion', 'Investment Flow'],
        green_hydrogen: ['Production Capacity', 'Investment Amount', 'Market Demand'],
        medical: ['Healthcare Spending', 'Infrastructure Development', 'Service Utilization']
      };

      const newForecasts = [];
      for (const industry of industries.data.slice(0, 3)) { // Limit to avoid too many inserts
        const industryMetrics = metrics[industry.type as keyof typeof metrics] || ['General Metric'];
        for (const region of regions.slice(0, 2)) { // Limit regions
          for (const metric of industryMetrics.slice(0, 1)) { // One metric per industry-region
            const prediction = generatePrediction();
            newForecasts.push({
              industry_id: industry.id,
              region,
              metric_name: metric,
              model_used: ['neural_network', 'arima', 'linear', 'ensemble'][Math.floor(Math.random() * 4)],
              prediction: prediction.predicted_change,
              confidence_interval: prediction.prediction_confidence,
              forecast_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Next 30 days
              prediction_range: {
                min: prediction.predicted_change - 5,
                max: prediction.predicted_change + 5
              },
              factors: prediction.prediction_factors
            });
          }
        }
      }

      if (newForecasts.length > 0) {
        await supabase.from('forecasts').insert(newForecasts);
      }
    }

    const executionTime = Date.now() - startTime;

    // Log successful completion
    await supabase.from('pulse_logs').insert({
      action: 'automated_prediction_update',
      status: 'completed',
      details: { 
        trigger: 'cron_job',
        execution_time_ms: executionTime,
        updates_processed: {
          financial: financialMetrics?.length || 0,
          agriculture: agricultureData?.length || 0,
          housing: housingData?.length || 0,
          mining: miningData?.length || 0,
          green_hydrogen: hydrogenData?.length || 0
        },
        timestamp: new Date().toISOString() 
      },
      execution_time_ms: executionTime
    });

    console.log(`Prediction update completed in ${executionTime}ms`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Predictions updated successfully',
        execution_time_ms: executionTime,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error updating predictions:', error);

    // Log the error
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      await supabase.from('pulse_logs').insert({
        action: 'automated_prediction_update',
        status: 'error',
        details: { 
          error: error.message,
          timestamp: new Date().toISOString() 
        }
      });
    } catch (logError) {
      console.error('Error logging to pulse_logs:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    );
  }
});