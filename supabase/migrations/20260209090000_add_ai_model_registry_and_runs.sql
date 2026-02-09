CREATE TABLE IF NOT EXISTS public.ai_model_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_key TEXT NOT NULL,
  model_name forecast_model NOT NULL,
  weight NUMERIC NOT NULL DEFAULT 0.33 CHECK (weight >= 0),
  active BOOLEAN NOT NULL DEFAULT true,
  min_confidence NUMERIC NOT NULL DEFAULT 0.55 CHECK (min_confidence >= 0 AND min_confidence <= 1),
  max_change_pct NUMERIC NOT NULL DEFAULT 20 CHECK (max_change_pct > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (industry_key, model_name)
);

CREATE TABLE IF NOT EXISTS public.ai_prediction_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_type TEXT NOT NULL,
  status TEXT NOT NULL,
  engine_version TEXT NOT NULL,
  execution_time_ms INTEGER,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_model_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_prediction_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view model registry" ON public.ai_model_registry;
CREATE POLICY "Admins can view model registry"
ON public.ai_model_registry
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage model registry" ON public.ai_model_registry;
CREATE POLICY "Admins can manage model registry"
ON public.ai_model_registry
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view prediction runs" ON public.ai_prediction_runs;
CREATE POLICY "Admins can view prediction runs"
ON public.ai_prediction_runs
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Service role can insert prediction runs" ON public.ai_prediction_runs;
CREATE POLICY "Service role can insert prediction runs"
ON public.ai_prediction_runs
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_ai_model_registry_industry_active
ON public.ai_model_registry (industry_key, active);

CREATE INDEX IF NOT EXISTS idx_ai_prediction_runs_created_at
ON public.ai_prediction_runs (created_at DESC);

CREATE TRIGGER update_ai_model_registry_updated_at
BEFORE UPDATE ON public.ai_model_registry
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
