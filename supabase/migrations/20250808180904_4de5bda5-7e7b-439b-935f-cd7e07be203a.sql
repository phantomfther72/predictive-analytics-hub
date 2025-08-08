-- 1) Add 'investor' tier to subscription_tier enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid 
    WHERE t.typname = 'subscription_tier' 
      AND e.enumlabel = 'investor'
  ) THEN
    ALTER TYPE public.subscription_tier ADD VALUE 'investor';
  END IF;
END
$$;

-- 2) Create private storage bucket for opportunity documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('opportunity-docs', 'opportunity-docs', false)
ON CONFLICT (id) DO NOTHING;

-- 3) Storage policies for opportunity docs
-- Drop existing policies if they already exist to avoid duplicates
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Investors and admins can view opportunity documents'
  ) THEN
    DROP POLICY "Investors and admins can view opportunity documents" ON storage.objects;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can upload opportunity documents'
  ) THEN
    DROP POLICY "Admins can upload opportunity documents" ON storage.objects;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can update opportunity documents'
  ) THEN
    DROP POLICY "Admins can update opportunity documents" ON storage.objects;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can delete opportunity documents'
  ) THEN
    DROP POLICY "Admins can delete opportunity documents" ON storage.objects;
  END IF;
END $$;

CREATE POLICY "Investors and admins can view opportunity documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'opportunity-docs'
  AND (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid()
        AND p.subscription_tier = 'investor'
    )
    OR public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Admins can upload opportunity documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'opportunity-docs'
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update opportunity documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'opportunity-docs'
  AND public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'opportunity-docs'
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete opportunity documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'opportunity-docs'
  AND public.has_role(auth.uid(), 'admin')
);

-- 4) Expand investment_opportunities schema with new fields
ALTER TABLE public.investment_opportunities
  ADD COLUMN IF NOT EXISTS stage text,
  ADD COLUMN IF NOT EXISTS capital_min numeric,
  ADD COLUMN IF NOT EXISTS capital_max numeric,
  ADD COLUMN IF NOT EXISTS organization text,
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS documents jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS contact_name text;

-- 5) Seed diverse cross-sector investment opportunities
INSERT INTO public.investment_opportunities (
  title, description, asset_type, industry_type, region, current_value, predicted_change, 
  prediction_confidence, risk_level, minimum_investment, annual_return_percentage, 
  time_horizon, featured, thumbnail_chart_data, full_details, contact_email, contact_phone,
  stage, capital_min, capital_max, organization, website_url, documents, contact_name
) VALUES
(
  'Namibia Tourism Eco-Lodge Network',
  'Development of eco-friendly lodges across key Namibian regions with sustainable operations and community partnerships.',
  'real_estate', 'tourism', 'Namibia', 1800000, 14.2, 0.78, 'medium', 40000, 13.0, '5-7 years', true,
  '{"data":[80,85,88,92,99,105,112], "labels":["Jan","Feb","Mar","Apr","May","Jun","Jul"]}',
  '{"focus":"eco-tourism","partnerships":["NTB","Local Councils"],"esg":true}'::jsonb,
  'invest@tourism-eco.na','+264-61-000-111',
  'Growth', 500000, 3000000, 'Namibia Tourism Board', 'https://ntb.na/eco-lodge', '[]'::jsonb, 'Project Coordination Team'
),
(
  'Rural Agricultural Cold Chain Hubs',
  'Build cold storage and logistics hubs to reduce post-harvest losses and improve smallholder margins.',
  'infrastructure', 'agriculture', 'Namibia', 2200000, 11.5, 0.74, 'medium', 60000, 12.2, '4-6 years', false,
  '{"data":[55,58,60,63,67,72,78], "labels":["Jan","Feb","Mar","Apr","May","Jun","Jul"]}',
  '{"impact":"reduce wastage","coverage":"5 regions"}'::jsonb,
  'invest@agri-cold.na','+264-61-000-222',
  'Seed', 300000, 2500000, 'Agri Logistics Namibia', 'https://agrilogistics.na', '[]'::jsonb, 'Program Lead'
),
(
  'Artisanal Copper Mining Cooperative Upgrade',
  'Capex to formalize and equip artisanal miners with safety, processing, and market access.',
  'project', 'mining', 'Namibia', 950000, 19.8, 0.66, 'high', 25000, 18.7, '3-5 years', true,
  '{"data":[20,25,28,35,40,48,55], "labels":["Jan","Feb","Mar","Apr","May","Jun","Jul"]}',
  '{"components":["safety","processing","offtake"],"partners":["Co-op Union"]}'::jsonb,
  'coop@copper.na','+264-61-000-333',
  'Expansion', 200000, 1200000, 'Copper Co-op Federation', 'https://coppercoop.na', '[]'::jsonb, 'Cooperative Secretary'
),
(
  'Wind-Powered Green Hydrogen Pilot (Phase II)',
  'Scale-up of a pilot GH2 facility with enhanced electrolysis efficiency and offtake LOIs.',
  'infrastructure', 'green_hydrogen', 'Namibia', 5200000, 21.4, 0.82, 'medium', 100000, 16.4, '6-8 years', true,
  '{"data":[100,110,125,140,160,185,210], "labels":["Jan","Feb","Mar","Apr","May","Jun","Jul"]}',
  '{"tech":"PEM electrolysis","efficiency":"+8%","offtake_lois":3}'::jsonb,
  'invest@gh2pilot.na','+264-61-000-444',
  'Series A', 1000000, 7000000, 'NamEco Hydrogen Ltd', 'https://namecohydrogen.na', '[]'::jsonb, 'Project Sponsor'
),
(
  'EdTech Assessment Platform (K-12)',
  'AI-enabled continuous assessment tools for schools with offline-first capabilities.',
  'venture_capital', 'education', 'Southern Africa', 750000, 26.0, 0.64, 'high', 20000, 24.0, '3-5 years', false,
  '{"data":[10,15,22,35,50,72,95], "labels":["Jan","Feb","Mar","Apr","May","Jun","Jul"]}',
  '{"features":["offline","AI feedback"],"pilot_schools":12}'::jsonb,
  'invest@edtech.sa','+27-11-000-555',
  'Seed', 150000, 1200000, 'EduTech SA', 'https://edutech.sa', '[]'::jsonb, 'Founder & CEO'
),
(
  'Smart Transport Corridors (Walvis Bay Gateway)',
  'IoT-enabled corridor optimization for freight, customs, and safety along the Trans-Kalahari and WBCG routes.',
  'infrastructure', 'infrastructure', 'Namibia', 6800000, 9.8, 0.7, 'medium', 125000, 13.5, '5-8 years', false,
  '{"data":[210,215,218,223,230,238,249], "labels":["Jan","Feb","Mar","Apr","May","Jun","Jul"]}',
  '{"components":["IoT","customs","analytics"],"corridors":["TKC","WBCG"]}'::jsonb,
  'invest@corridors.na','+264-61-000-666',
  'Series B', 2000000, 12000000, 'WBCG Tech JV', 'https://wbcg.na', '[]'::jsonb, 'JV Coordinator'
)
ON CONFLICT DO NOTHING;
