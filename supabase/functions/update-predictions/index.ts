import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ForecastModel = 'linear' | 'arima' | 'neural_network' | 'ensemble';

interface PredictionUpdate {
  predicted_change: number;
  prediction_confidence: number;
  prediction_explanation: string;
  prediction_factors: Record<string, unknown>;
}

interface IndustryConfig {
  key: string;
  table: string;
  label: string;
  momentumFields: string[];
}

interface ModelRegistryEntry {
  id: string;
  industry_key: string;
  model_name: ForecastModel;
  weight: number;
  active: boolean;
  min_confidence: number;
  max_change_pct: number;
}

const INDUSTRY_CONFIGS: IndustryConfig[] = [
  {
    key: 'financial',
    table: 'financial_market_metrics',
    label: 'Financial Markets',
    momentumFields: ['change_percentage_24h'],
  },
  {
    key: 'agriculture',
    table: 'agriculture_market_data',
    label: 'Agriculture',
    momentumFields: ['market_price_usd', 'yield_per_hectare'],
  },
  {
    key: 'housing',
    table: 'housing_market_data',
    label: 'Housing',
    momentumFields: ['yoy_change'],
  },
  {
    key: 'mining',
    table: 'mining_sector_insights',
    label: 'Mining',
    momentumFields: ['export_growth_percentage'],
  },
  {
    key: 'green_hydrogen',
    table: 'green_hydrogen_metrics',
    label: 'Green Hydrogen',
    momentumFields: ['production_capacity_mw', 'investment_amount_usd'],
  }
];

const DEFAULT_MODEL_REGISTRY = (timestamp: string) => INDUSTRY_CONFIGS.flatMap((industry) => ([
  {
    industry_key: industry.key,
    model_name: 'linear' as ForecastModel,
    weight: 0.35,
    active: true,
    min_confidence: 0.55,
    max_change_pct: 18,
    created_at: timestamp,
    updated_at: timestamp,
  },
  {
    industry_key: industry.key,
    model_name: 'arima' as ForecastModel,
    weight: 0.30,
    active: true,
    min_confidence: 0.55,
    max_change_pct: 16,
    created_at: timestamp,
    updated_at: timestamp,
  },
  {
    industry_key: industry.key,
    model_name: 'neural_network' as ForecastModel,
    weight: 0.35,
    active: true,
    min_confidence: 0.60,
    max_change_pct: 22,
    created_at: timestamp,
    updated_at: timestamp,
  }
]));

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const stdDev = (values: number[]) => {
  if (!values.length) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
};

const buildFeatureVector = (row: Record<string, unknown>, momentumFields: string[]) => {
  const ignoredFields = new Set([
    'predicted_change',
    'prediction_confidence',
    'prediction_explanation',
    'prediction_factors',
    'prediction_timestamp'
  ]);

  const numericValues = Object.entries(row)
    .filter(([key, value]) => !ignoredFields.has(key) && typeof value === 'number')
    .map(([, value]) => Number(value))
    .filter((value) => Number.isFinite(value));

  const momentumValues = momentumFields
    .map((field) => row[field])
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));

  const volatility = stdDev(numericValues);
  const avgMagnitude = numericValues.length
    ? numericValues.reduce((sum, value) => sum + Math.abs(value), 0) / numericValues.length
    : 1;

  const momentumSignal = momentumValues.length
    ? momentumValues.reduce((sum, value) => sum + value, 0) / momentumValues.length
    : 0;

  return {
    sampleSize: numericValues.length,
    momentumSignal,
    normalizedMomentum: clamp(momentumSignal / Math.max(avgMagnitude, 1), -1.2, 1.2),
    volatility: clamp(volatility / Math.max(avgMagnitude, 1), 0, 1.5),
    baselineStrength: clamp(Math.log10(Math.max(avgMagnitude, 1)) / 2, 0, 1),
  };
};

const modelInference = (
  model: ForecastModel,
  features: ReturnType<typeof buildFeatureVector>,
  maxChangePct: number,
): { prediction: number; confidence: number; factors: Record<string, unknown>; explanation: string } => {
  const noisePenalty = features.volatility * 0.7;
  const baseConfidence = clamp(0.78 - noisePenalty + features.baselineStrength * 0.15, 0.35, 0.95);

  let rawSignal = 0;
  let explanation = '';

  switch (model) {
    case 'linear':
      rawSignal = (features.normalizedMomentum * 0.65) + (features.baselineStrength * 0.35) - 0.1;
      explanation = 'Linear trend blend of momentum and baseline strength.';
      break;
    case 'arima':
      rawSignal = (features.normalizedMomentum * 0.45) - (features.volatility * 0.25);
      explanation = 'ARIMA-style mean reversion adjusted by volatility.';
      break;
    case 'neural_network':
      rawSignal = Math.tanh((features.normalizedMomentum * 1.15) - (features.volatility * 0.4) + 0.05);
      explanation = 'Neural non-linear fusion of momentum and uncertainty.';
      break;
    default:
      rawSignal = features.normalizedMomentum;
      explanation = 'Ensemble output.';
  }

  const prediction = clamp(rawSignal * maxChangePct, -maxChangePct, maxChangePct);

  return {
    prediction: Math.round(prediction * 100) / 100,
    confidence: Math.round(baseConfidence * 100) / 100,
    explanation,
    factors: {
      normalized_momentum: Math.round(features.normalizedMomentum * 1000) / 1000,
      volatility: Math.round(features.volatility * 1000) / 1000,
      baseline_strength: Math.round(features.baselineStrength * 1000) / 1000,
      sample_size: features.sampleSize,
      model,
    },
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    const now = new Date().toISOString();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from('pulse_logs').insert({
      action: 'automated_prediction_update',
      status: 'initiated',
      details: {
        trigger: 'cron_job',
        timestamp: now,
        engine: 'multi_industry_ensemble_v2'
      }
    });

    let registryRows: ModelRegistryEntry[] = [];
    const registryResponse = await supabase
      .from('ai_model_registry')
      .select('id, industry_key, model_name, weight, active, min_confidence, max_change_pct')
      .eq('active', true);

    if (registryResponse.error) {
      throw registryResponse.error;
    }

    if (!registryResponse.data || registryResponse.data.length === 0) {
      await supabase.from('ai_model_registry').insert(DEFAULT_MODEL_REGISTRY(now));
      const seededRegistry = await supabase
        .from('ai_model_registry')
        .select('id, industry_key, model_name, weight, active, min_confidence, max_change_pct')
        .eq('active', true);
      if (seededRegistry.error) throw seededRegistry.error;
      registryRows = (seededRegistry.data ?? []) as ModelRegistryEntry[];
    } else {
      registryRows = registryResponse.data as ModelRegistryEntry[];
    }

    const industryRunSummaries: Record<string, unknown>[] = [];

    for (const industry of INDUSTRY_CONFIGS) {
      const industryRegistry = registryRows.filter((entry) => entry.industry_key === industry.key && entry.active);
      if (!industryRegistry.length) continue;

      const { data: rows, error: fetchError } = await supabase
        .from(industry.table)
        .select('*')
        .limit(20);

      if (fetchError) {
        industryRunSummaries.push({ industry: industry.key, status: 'error', message: fetchError.message });
        continue;
      }

      const updatesProcessed: string[] = [];
      const ensemblePredictions: number[] = [];
      const modelPredictionsBuffer: Record<string, unknown>[] = [];

      for (const row of rows ?? []) {
        const rowRecord = row as Record<string, unknown>;
        if (!rowRecord.id) {
          continue;
        }

        const rowId = String(rowRecord.id);
        const features = buildFeatureVector(rowRecord, industry.momentumFields);

        const basePredictions = industryRegistry.map((entry) => {
          const inference = modelInference(entry.model_name, features, entry.max_change_pct);
          return {
            registryId: entry.id,
            model: entry.model_name,
            weight: entry.weight,
            minConfidence: entry.min_confidence,
            ...inference,
          };
        });

        const eligiblePredictions = basePredictions.filter((prediction) => prediction.confidence >= prediction.minConfidence);
        const fallbackPredictions = eligiblePredictions.length ? eligiblePredictions : basePredictions;
        const totalWeight = fallbackPredictions.reduce((sum, item) => sum + item.weight, 0) || 1;

        const ensemblePrediction = fallbackPredictions.reduce((sum, item) => sum + (item.prediction * (item.weight / totalWeight)), 0);
        const ensembleConfidence = fallbackPredictions.reduce((sum, item) => sum + (item.confidence * (item.weight / totalWeight)), 0);

        const explanation = `Ensemble forecast using ${fallbackPredictions.map((p) => p.model).join(', ')} for ${industry.label}.`;
        const predictionFactors = {
          engine_version: 'multi_industry_ensemble_v2',
          model_contributions: fallbackPredictions.map((prediction) => ({
            model: prediction.model,
            prediction: prediction.prediction,
            confidence: prediction.confidence,
            weight: prediction.weight,
            explanation: prediction.explanation,
            factors: prediction.factors,
          })),
          normalized_weights: fallbackPredictions.map((prediction) => ({
            model: prediction.model,
            weight: Math.round((prediction.weight / totalWeight) * 1000) / 1000,
          })),
        };

        const updatePayload: PredictionUpdate = {
          predicted_change: Math.round(ensemblePrediction * 100) / 100,
          prediction_confidence: Math.round(ensembleConfidence * 100) / 100,
          prediction_explanation: explanation,
          prediction_factors: predictionFactors,
        };

        const { error: updateError } = await supabase
          .from(industry.table)
          .update({
            ...updatePayload,
            prediction_timestamp: now,
          })
          .eq('id', rowId);

        if (updateError) {
          industryRunSummaries.push({ industry: industry.key, status: 'update_error', row_id: rowId, message: updateError.message });
          continue;
        }

        updatesProcessed.push(rowId);
        ensemblePredictions.push(updatePayload.predicted_change);

        basePredictions.forEach((prediction) => {
          modelPredictionsBuffer.push({
            model_id: null,
            dataset: industry.key,
            metric_key: rowId,
            prediction_value: prediction.prediction,
            confidence: prediction.confidence,
            timestamp: now,
          });
        });
      }

      if (modelPredictionsBuffer.length > 0) {
        const { error: modelPredictionError } = await supabase.from('model_predictions').insert(modelPredictionsBuffer);
        if (modelPredictionError) {
          industryRunSummaries.push({
            industry: industry.key,
            status: 'model_prediction_insert_error',
            message: modelPredictionError.message,
          });
        }
      }

      const averagePrediction = ensemblePredictions.length
        ? ensemblePredictions.reduce((sum, prediction) => sum + prediction, 0) / ensemblePredictions.length
        : 0;

      industryRunSummaries.push({
        industry: industry.key,
        status: 'completed',
        models_used: industryRegistry.map((entry) => entry.model_name),
        updates_processed: updatesProcessed.length,
        average_prediction: Math.round(averagePrediction * 100) / 100,
      });
    }

    const { data: industries } = await supabase
      .from('predictive_industries')
      .select('id, type')
      .limit(5);

    const forecastsToInsert: Record<string, unknown>[] = [];
    for (const industry of industries ?? []) {
      const summary = industryRunSummaries.find((item) => item.industry === industry.type) as Record<string, unknown> | undefined;
      if (!summary || summary.status !== 'completed') continue;

      forecastsToInsert.push({
        industry_id: industry.id,
        region: 'Khomas',
        metric_name: `${industry.type} ${new Date().toISOString().slice(0, 10)} signal`,
        model_used: 'ensemble',
        prediction: Number(summary.average_prediction ?? 0),
        confidence_interval: 0.7,
        forecast_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        prediction_range: {
          min: Number(summary.average_prediction ?? 0) - 2,
          max: Number(summary.average_prediction ?? 0) + 2,
        },
        factors: {
          engine_version: 'multi_industry_ensemble_v2',
          run_summary: summary,
        },
      });
    }

    if (forecastsToInsert.length > 0) {
      const { error: forecastInsertError } = await supabase.from('forecasts').insert(forecastsToInsert);
      if (forecastInsertError) {
        industryRunSummaries.push({
          industry: 'forecast_generation',
          status: 'error',
          message: forecastInsertError.message,
        });
      }
    }

    const executionTime = Date.now() - startTime;

    await supabase.from('ai_prediction_runs').insert({
      run_type: 'scheduled',
      status: 'completed',
      engine_version: 'multi_industry_ensemble_v2',
      execution_time_ms: executionTime,
      details: {
        trigger: 'cron_job',
        industries: industryRunSummaries,
        timestamp: new Date().toISOString(),
      },
    });

    await supabase.from('pulse_logs').insert({
      action: 'automated_prediction_update',
      status: 'completed',
      details: {
        trigger: 'cron_job',
        engine_version: 'multi_industry_ensemble_v2',
        execution_time_ms: executionTime,
        industries: industryRunSummaries,
        timestamp: new Date().toISOString(),
      },
      execution_time_ms: executionTime
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Predictions updated successfully with multi-industry model registry',
        execution_time_ms: executionTime,
        industry_runs: industryRunSummaries,
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
    const err = error as Error;
    console.error('Error updating predictions:', err);

    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from('pulse_logs').insert({
        action: 'automated_prediction_update',
        status: 'error',
        details: {
          error: err.message,
          timestamp: new Date().toISOString(),
          engine_version: 'multi_industry_ensemble_v2',
        }
      });

      await supabase.from('ai_prediction_runs').insert({
        run_type: 'scheduled',
        status: 'error',
        engine_version: 'multi_industry_ensemble_v2',
        details: {
          error: err.message,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (logError) {
      console.error('Error logging failure details:', logError);
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
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
